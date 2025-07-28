import { test, expect } from "@playwright/test";

test("iFrames", async ({page})=>{
    await page.goto("https://docs.oracle.com/javase/8/docs/api/")

    const iframe = await page.frameLocator("//frame[@name='packageListFrame']")
    console.log(iframe);
    
    await iframe.locator("//a[text()='java.applet']").click()
    await page.pause()
})