import { test, expect } from '@playwright/test';

test.describe('Adversarial & Security E2E Tests', () => {
  test('defends against Open Redirect attacks in login redirect parameter', async ({
    page,
  }) => {
    // Malicious attacker link attempting to phish user off-domain
    const phishingUrl = 'https://evil-phishing-attacker.com/steal';
    await page.goto(`/login?redirect=${encodeURIComponent(phishingUrl)}`);

    // Verify current origin strictly remains on the trusted domain
    const currentUrl = new URL(page.url());
    expect(currentUrl.hostname).toBe('localhost');
    expect(currentUrl.pathname).toBe('/login');

    // Attempt login form submission to verify client-side redirect defense
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    const submitBtn = page.locator('button[type="submit"]').first();

    if ((await emailInput.isVisible()) && (await submitBtn.isVisible())) {
      await emailInput.fill('candidate@example.com');
      await passwordInput.fill('SecurePassword123!');
      await submitBtn.click();

      await page.waitForTimeout(500);
      const postSubmitOrigin = new URL(page.url()).origin;
      expect(postSubmitOrigin).not.toContain('evil-phishing-attacker.com');
    }
  });

  test('prevents XSS script execution when injecting payloads into search inputs', async ({
    page,
  }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/jobs');

    const searchInput = page
      .locator('input[type="text"], input[placeholder*="search" i]')
      .first();
    if (await searchInput.isVisible()) {
      const xssPayload = `<img src=x onerror="alert('xss-exploit')"><script>window.__xss = true</script>`;
      await searchInput.fill(xssPayload);
      await searchInput.press('Enter');

      // Allow microtasks to settle
      await page.waitForTimeout(500);

      // Verify no JavaScript alert was triggered
      expect(dialogTriggered).toBe(false);

      // Verify global window was not polluted
      const isCompromised = await page.evaluate(() => window.__xss);
      expect(isCompromised).toBeUndefined();
    }
  });

  test('blocks unauthenticated access to protected candidate routes', async ({
    page,
  }) => {
    // Attempt direct navigation to candidate portal without session
    await page.goto('/candidate/applications');

    // ProtectedRoute should intercept and bounce to /login with encoded return redirect
    await expect(page).toHaveURL(/.*login.*/);
    expect(page.url()).toContain('redirect');
  });
});
