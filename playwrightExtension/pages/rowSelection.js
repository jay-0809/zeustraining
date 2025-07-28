import { test, expect } from "@playwright/test";

class RowSelection {
    constructor(page) {
        this.page = page;
    }

    async test() {
        await this.page.locator('canvas').nth(1).click({ position: { x: Math.random() * 80, y: 157 } });
        await this.page.waitForTimeout(500);

        await this.page.locator('canvas').nth(1).click({ position: { x: Math.random() * 80, y: 407 } });
        await this.page.waitForTimeout(500);

        await this.page.locator('canvas').nth(1).click({ position: { x: Math.random() * 80, y: 257 } });
        await this.page.waitForTimeout(300);

        await this.verifyTest();
    }

    async verifyTest() {
        const actual = 5;
        const output = await this.page.locator("#values").inputValue();
        // console.log("Row Selection Output:", output);

        // Validate computed stats
        expect(output).toContain(`Count: ${actual}`);
        // expect(output).toMatch(/Sum: \d+/);
        // expect(output).toMatch(/Avg: \d+(\.\d+)?/);
    }
}

module.exports = RowSelection;
