import { test, expect } from "@playwright/test";

class ColumnSelection {
    constructor(page) {
        this.page = page;
    }

    async test() {        
        await this.page.locator('canvas').first().click({ position: { x: 550, y: Math.random() * 25 } });
        await this.page.waitForTimeout(300);
        
        await this.page.locator('canvas').first().click({ position: { x: 150, y: Math.random() * 25 } });
        await this.page.waitForTimeout(500);
        
        await this.page.locator('canvas').first().click({ position: { x: 250, y: Math.random() * 25 } });
        await this.page.waitForTimeout(500);
        await this.verifyTest();
    }

    async verifyTest() {
        const actual = 1;
        const output = await this.page.locator("#values").inputValue();
        // console.log("Column Selection Output:", output);

        // Validate computed stats
        expect(output).toContain(`Count: ${actual}`);
        // expect(output).toMatch(/Sum: \d+/);
        // expect(output).toMatch(/Avg: \d+(\.\d+)?/);
    }
}

module.exports = ColumnSelection;
