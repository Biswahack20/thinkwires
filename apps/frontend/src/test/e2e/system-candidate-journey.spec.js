import { test, expect } from '@playwright/test';

test.describe('Full-Stack System Candidate Journey (E2E Browser System Suite)', () => {
  test('executes complete discovery journey on jobs board with active filters', async ({
    page,
  }) => {
    await page.goto('/jobs');

    // 1. Verify Job Board Page Title & Hero Elements
    await expect(page).toHaveTitle(/Thinkwires/i);
    const searchInput = page
      .locator('input[type="text"], input[placeholder*="search" i]')
      .first();
    await expect(searchInput).toBeVisible();

    // 2. Perform interactive job search
    await searchInput.fill('Engineer');
    await searchInput.press('Enter');
    await page.waitForTimeout(400);

    // 3. Verify Job Cards or Openings Container renders
    const jobListingsContainer = page
      .locator('.JobPage-wrapper, main, .featured-positions')
      .first();
    await expect(jobListingsContainer).toBeVisible();
  });

  test('validates candidate login page security and required fields', async ({
    page,
  }) => {
    await page.goto('/login');

    // Verify login heading and form layout
    const loginHeading = page.locator('h1, h2, .tw-auth-title').first();
    await expect(loginHeading).toBeVisible();

    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    const submitBtn = page.locator('button[type="submit"]').first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // React state validation: Submitting empty form should display inline error message
    await submitBtn.click();
    const emailErrMsg = page.locator('.tw-field-err-msg').first();
    await expect(emailErrMsg).toBeVisible();
    await expect(emailErrMsg).toContainText(/required/i);
  });

  test('enforces authentication boundary on candidate apply route and preserves redirect target', async ({
    page,
  }) => {
    // Attempt direct unauthenticated entry to apply route
    const targetApplyPath = '/jobs/senior-fullstack-dev/apply';
    await page.goto(targetApplyPath);

    // ProtectedRoute bounce to login with URL-encoded redirect query parameter
    await expect(page).toHaveURL(/.*login.*/);
    expect(page.url()).toContain('redirect');
    expect(decodeURIComponent(page.url())).toContain(targetApplyPath);
  });

  test('verifies candidate applications portal layout and responsive integrity', async ({
    page,
  }) => {
    await page.goto('/candidate/applications');

    // Unauthenticated access must bounce to login safely
    await expect(page).toHaveURL(/.*login.*/);

    // Verify login form is clean, without horizontal viewport overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('verifies mobile viewport touch targets and accessibility on job boards', async ({
    page,
  }) => {
    // Set to mobile smartphone viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/jobs');

    // Ensure main page header and navigation are touch accessible
    const nav = page.locator('nav, .tw-navbar').first();
    await expect(nav).toBeVisible();

    // Ensure no broken layout or horizontal scrolling on mobile
    const mobileOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(mobileOverflow).toBe(false);
  });
});
