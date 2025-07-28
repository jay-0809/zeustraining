import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://freelance-learn-automation.vercel.app/signup');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Automation/);
  
  await page.waitForTimeout(3000);
});

test('state selection', async ({ page })=>{
    await page.goto('https://freelance-learn-automation.vercel.app/signup');

    await page.locator('#state').selectOption({label: "Goa"});
    await page.waitForTimeout(2000);

    await page.locator("#state").selectOption({value: "Himachal Pradesh"});
    await page.waitForTimeout(2000);

    await page.locator("#state").selectOption({index: 3});
    await page.waitForTimeout(3000);
    
    const value = await page.locator("#state").textContent();
    console.log("val:", value);
    // await expect(value.includes("jay")).toBeTruthy();
    
    await page.locator("#hobbies").selectOption(['Playing', 'Swimming']);
    await page.waitForTimeout(3000);
});