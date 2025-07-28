import { test, expect } from "@playwright/test";

test("alert",  async ({page})=>{
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async (d)=>{
        expect(d.type()).toContain("alert")
        expect(d.message()).toContain("I am a JS Alert")
        await d.accept()
    })
    await page.locator("//button[text()='Click for JS Alert']").click()
    await page.waitForTimeout(2000);
})
test("confirm",  async ({page})=>{
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async (d)=>{
        expect(d.type()).toContain("confirm")
        expect(d.message()).toContain("I am a JS Confirm")
        await d.dismiss();
    })
    await page.locator("//button[text()='Click for JS Confirm']").click()
    await page.waitForTimeout(3000);
})
test("prompt",  async ({page})=>{
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async (d)=>{
        expect(d.type()).toContain("prompt")
        expect(d.message()).toContain("I am a JS prompt")
        await d.accept("JayT")
    })
    await page.locator("//button[text()='Click for JS Prompt']").click()
    await page.waitForTimeout(5000);
})