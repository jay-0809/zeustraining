import { test, expect } from '@playwright/test';

test('verify file upload', async ({ page })=>{
    await page.goto('https://the-internet.herokuapp.com/upload');

    await page.locator('#file-upload').setInputFiles("./upload/image1.png");
    await page.waitForTimeout(2000);

    await page.locator("#file-upload").click();
    expect(await page.locator("//h3").toHaveText("File Uploaded!"));
});