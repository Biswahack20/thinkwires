import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../ThemeProvider';
import { createTestStore } from '../test-utils';

import HomePage from '../../pages/HomePage';
import AboutPage from '../../pages/AboutPage';
import JobPage from '../../pages/JobPage';
import ContactPage from '../../pages/ContactPage';
import ServicesPage from '../../pages/ServicesPage';

function renderPage(ui, { store = createTestStore(), initialEntries = ['/'] } = {}) {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  );
}

describe('Per-page SEO and Open Graph Meta Tags (Issue #129)', () => {
  it('renders dynamic title, description, and Open Graph tags for HomePage', async () => {
    renderPage(<HomePage />);

    await waitFor(() => {
      expect(document.title).toBe('Thinkwires | Global Talent Cloud & Workforce Solutions');
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toContain('Thinkwires connects high-growth engineering teams');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Thinkwires | Global Talent Cloud & Workforce Solutions');
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toBe('https://thinkwires.com/og-image.jpg');
    });
  });

  it('renders dynamic title, description, and Open Graph tags for AboutPage', async () => {
    renderPage(<AboutPage />);

    await waitFor(() => {
      expect(document.title).toBe('About Us | Thinkwires — Borderless Tech Talent & Workforce Advisory');
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toContain('Learn about Thinkwires');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('About Thinkwires — Global Workforce Advisory');
    });
  });

  it('renders dynamic title, description, and Open Graph tags for JobPage', async () => {
    renderPage(<JobPage />);

    await waitFor(() => {
      expect(document.title).toBe('Jobs | Thinkwires — Global Talent Cloud');
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toContain('Browse 500+ active engineering and tech roles');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Hot Jobs | Thinkwires');
    });
  });

  it('renders dynamic title, description, and Open Graph tags for ContactPage', async () => {
    renderPage(<ContactPage />);

    await waitFor(() => {
      expect(document.title).toBe('Contact Us | Thinkwires — Connect with Enterprise Staffing Directors');
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toContain('Connect with Thinkwires staffing directors');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Contact Us | Thinkwires');
    });
  });

  it('renders dynamic title, description, and Open Graph tags for ServicesPage', async () => {
    renderPage(<ServicesPage />);

    await waitFor(() => {
      expect(document.title).toBe('Workforce Services & Solutions | Thinkwires');
      const metaDesc = document.querySelector('meta[name="description"]');
      expect(metaDesc?.getAttribute('content')).toContain('Comprehensive talent solutions');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Workforce Solutions & Services | Thinkwires');
    });
  });
});
