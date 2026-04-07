import { test, expect } from '@playwright/test';

test.describe('Leads Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as demo user before each test
    await page.goto('/auth/login');
    await page.getByTestId('demo-mode-button').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should create a new lead successfully', async ({ page }) => {
    // 1. Go to leads
    await page.goto('/dashboard/leads');
    await expect(page.getByTestId('leads-page')).toBeVisible();

    // 2. Open the New Lead flow
    const newLeadButton = page.getByTestId('new-lead-button');
    await newLeadButton.click();
    await expect(page.getByText(/Create New Lead/i)).toBeVisible();

    // 3. Submit a valid new lead
    const firstName = `Test-${Math.random().toString(36).substring(7)}`;
    const lastName = 'User';
    await page.getByTestId('first-name-input').fill(firstName);
    await page.getByTestId('last-name-input').fill(lastName);
    await page.getByTestId('email-input').fill(`test-${Date.now()}@example.com`);
    await page.getByTestId('company-input').fill('Test Corp');
    await page.getByTestId('value-input').fill('1000');
    
    await page.getByTestId('submit-lead-button').click();

    // 4. User sees the new lead in the UI or gets clear success confirmation
    await expect(page.getByText(/Lead created successfully/i)).toBeVisible();
    await expect(page.getByTestId('lead-name').filter({ hasText: `${firstName} ${lastName}` })).toBeVisible();
  });

  test('should add a note to an existing lead', async ({ page }) => {
    // 1. Go to leads
    await page.goto('/dashboard/leads');
    
    // 2. Open an existing lead (first row)
    const firstLeadRow = page.getByTestId(/^lead-row-/).first();
    await firstLeadRow.click();
    await expect(page.getByText(/Activity Timeline/i)).toBeVisible();

    // 3. Add a note/activity entry
    const noteText = `E2E Test Note - ${Date.now()}`;
    await page.getByTestId('note-input').fill(noteText);
    await page.getByTestId('add-note-button').click();

    // 4. The note appears in the UI or success is clearly visible
    await expect(page.getByText(/Note added/i)).toBeVisible();
    await expect(page.getByText(noteText)).toBeVisible();
  });

  test('should trigger export data', async ({ page }) => {
    // 1. Go to leads
    await page.goto('/dashboard/leads');

    // 2. Trigger Export Data
    const exportButton = page.getByTestId('export-data-button');
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // 3. Verify success confirmation (toast)
    await expect(page.getByText(/Leads exported successfully/i).or(page.getByText(/No leads to export/i))).toBeVisible();
  });
});
