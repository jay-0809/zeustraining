import { test, expect } from "@playwright/test";
import { promises } from "dns";

test("multi tab", async ({browser})=>{
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto("https://freelance-learn-automation.vercel.app/login")

    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.locator("(//a[contains(@href, 'facebook')])[1]").click()
    ])

    await newPage.waitForTimeout(3000)
    await newPage.locator("(//input[@name='email'])[2]").fill("j@gmail.com")
    await newPage.waitForTimeout(3000)
    await newPage.close()
    
    await page.locator("#email1").fill("jb@gmail.com")
    await page.waitForTimeout(3000)
})