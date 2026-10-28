import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { renderWithProviders, screen } from '../test-utils';
import Navbar from '../../components/common/Navbar';

describe('Navbar Component & Mobile Top Bar Refactor (Issue #119)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders top bar on default desktop layout with contact info and desktop theme toggle', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText(/India & USA \/ Canada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Talent is not bound by Borders/i)
    ).toBeInTheDocument();
    expect(screen.getByText('info@thinkwires.com')).toBeInTheDocument();

    const desktopToggle = screen.getByTestId('desktop-theme-toggle');
    expect(desktopToggle).toBeInTheDocument();
    expect(desktopToggle).toHaveAttribute('aria-label', 'Toggle Theme');
  });

  it('renders mobile theme toggle inside mobile navigation drawer with initial state', () => {
    renderWithProviders(<Navbar />);

    const mobileToggle = screen.getByTestId('mobile-theme-toggle');
    expect(mobileToggle).toBeInTheDocument();
    expect(mobileToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(mobileToggle).toHaveTextContent('Dark Mode');
  });

  it('toggles theme when mobile theme toggle is clicked', async () => {
    const { user } = renderWithProviders(<Navbar />);

    const mobileToggle = screen.getByTestId('mobile-theme-toggle');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(mobileToggle).toHaveTextContent('Dark Mode');

    await user.click(mobileToggle);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('thinkwire-theme')).toBe('dark');
    expect(mobileToggle).toHaveTextContent('Light Mode');
    expect(mobileToggle).toHaveAttribute('aria-label', 'Switch to light mode');

    await user.click(mobileToggle);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('thinkwire-theme')).toBe('light');
    expect(mobileToggle).toHaveTextContent('Dark Mode');
    expect(mobileToggle).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('toggles mobile menu open and close on hamburger button click', async () => {
    const { user, container } = renderWithProviders(<Navbar />);

    const hamburgerBtn = screen.getByRole('button', {
      name: /open navigation menu/i,
    });
    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');

    const navContent = container.querySelector('#Navbar-navigationContent');
    expect(navContent).not.toHaveClass('Navbar-mobileMenuOpen');

    await user.click(hamburgerBtn);

    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'true');
    expect(navContent).toHaveClass('Navbar-mobileMenuOpen');

    await user.click(hamburgerBtn);

    expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');
    expect(navContent).not.toHaveClass('Navbar-mobileMenuOpen');
  });

  it('verifies index.css hides .Navbar-topBar on screens <= 768px and configures mobile toggle', () => {
    const cssPath = path.resolve(__dirname, '../../index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Verify .Navbar-mobileThemeToggle is hidden by default on desktop
    expect(cssContent).toMatch(
      /\.Navbar-mobileThemeToggle\s*\{\s*display:\s*none;/
    );

    // Verify media query (max-width: 768px) hides .Navbar-topBar
    const media768Regex =
      /@media\s*\(\s*max-width:\s*768px\s*\)[^{]*\{[\s\S]*?\.Navbar-topBar\s*\{[\s\S]*?display:\s*none;[\s\S]*?\}/;
    expect(cssContent).toMatch(media768Regex);

    // Verify .Navbar-mobileThemeToggle is styled for mobile drawer
    expect(cssContent).toMatch(
      /\.Navbar-mobileThemeToggle\s*\{[\s\S]*?display:\s*flex;/
    );
  });
});
