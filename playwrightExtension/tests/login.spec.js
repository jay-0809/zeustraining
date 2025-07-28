import { test, expect } from "@playwright/test";
import { log } from "console";
// import {loginData} from "../loginData.json";
const loginData = require("../loginData.json")

test.describe("data driven logintest", () => {
    for (const data of loginData) {
        test.describe(`Login with user ${data.id}`, () => {
            test("login", async ({ page }) => {
                await page.goto("https://freelance-learn-automation.vercel.app/login")
                // console.log(loginData[0]);
                await page.locator("#email1").fill(data.email)
                // await page.waitForTimeout(5000)
                await page.locator("#password1").fill(data.password)
                // await page.waitForTimeout(5000)
            })
        })
    }
})

