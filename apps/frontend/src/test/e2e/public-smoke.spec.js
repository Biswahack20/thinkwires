import { test, expect } from '@playwright/test';

test.describe('Public Website Smoke Tests', () => {
  test('loads landing page successfully with title and navigation', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify page title contains Thinkwires
    await expect(page).toHaveTitle(/Thinkwires/i);

    // Verify main brand heading or navigation is visible
    const navbar = page.locator('nav, .tw-navbar, .tw-brand-header').first();
    await expect(navbar).toBeVisible();

    // Verify critical CTA or navigation links exist
    const jobsLink = page.getByRole('link', { name: /jobs|explore/i }).first();
    await expect(jobsLink).toBeVisible();
  });

  test('toggles light/dark theme when user clicks theme button', async ({
    page,
  }) => {
    await page.goto('/');

    // Locate the theme toggle button (by aria-label or id or text)
    const themeBtn = page
      .locator(
        'button[aria-label*="theme" i], button[id*="theme" i], .theme-toggle'
      )
      .first();

    if (await themeBtn.isVisible()) {
      const initialTheme = await page.evaluate(
        () => document.documentElement.getAttribute('data-theme') || 'light'
      );
      await themeBtn.click();
      const updatedTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(updatedTheme).not.toBe(initialTheme);
    }
  });

  test('navigates to Jobs board and renders requisitions', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page).toHaveURL(/.*jobs.*/);

    // Verify jobs heading or search bar is present
    const content = page
      .locator('h1, h2, input[placeholder*="search" i]')
      .first();
    await expect(content).toBeVisible();
  });

  test('navigates to Contact page and renders inquiry form', async ({
    page,
  }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/.*contact.*/);

    // Verify form elements exist
    const submitButton = page
      .locator(
        'button[type="submit"], button:has-text("Send"), button:has-text("Submit")'
      )
      .first();
    await expect(submitButton).toBeVisible();
  });
});
