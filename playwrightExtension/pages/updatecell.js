import { test, expect } from "@playwright/test";

class UpdateCellValue {
    constructor(page) {
        this.page = page;
    }

    async test() {
        const position = { x: 280, y: 257 };
        await this.page.locator("//input[@placeholder='Search for tools, help and more']").fill("jay");
        await this.page.locator('canvas').nth(2).click({ position });

        await this.page.waitForTimeout(300); 

        await this.page.keyboard.press("j");
        await this.page.keyboard.press("Enter");
        await this.page.waitForTimeout(300);

        await this.verifyTest();
    }

    async verifyTest() {
        const actual = 1;
        const output = await this.page.locator("//input[@id='values']").inputValue();
        // console.log("Output value:", output);

        expect(output).toContain(`Count: ${actual}`);
    }
}

module.exports = UpdateCellValue;
