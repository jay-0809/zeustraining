import {test, expect} from "@playwright/test";

test("keyboard key events", async({page})=>{
    await page.goto("https://www.google.com")
    await page.locator('textarea[name="q"]').type("jay talaviya!")
    await page.waitForTimeout(2000);
    
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(2000);
    await page.keyboard.down("Shift"); 
    for (let i=0; i<"talaviya".length; i++){
        await page.keyboard.press("ArrowLeft");
    }
    await page.keyboard.up("Shift");
    await page.waitForTimeout(2000);

    const text = await page.getByRole('combobox').inputValue();
    console.log(":::",text);
})