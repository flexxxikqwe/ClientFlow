import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully via demo mode', async ({ page }) => {
    // 1. Reach the login page
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/\/auth\/login/);

    // 2. Click "Try Demo Mode"
    const demoButton = page.getByTestId('demo-mode-button');
    await expect(demoButton).toBeVisible();
    await demoButton.click();

    // 3. Reaches the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/Welcome back/i).or(page.getByText(/Demo Mode/i))).toBeVisible();
  });
});
