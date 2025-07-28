import { test, expect } from "@playwright/test";

class ColumnsDrag {
    constructor(page) {
        this.page = page;
    }

    async test() {
        await this.page.mouse.move(230, 95);
        await this.page.mouse.down();
        await this.page.waitForTimeout(500);
        await this.page.mouse.move(440, 95);
        await this.page.mouse.up();

        await this.page.waitForTimeout(300);

        await this.verifyTest();
    }

    async verifyTest() {
        const actual = 300000;
        const output = await this.page.locator("#values").inputValue();
        // console.log("Columns Drag Output:", output);

        // Validate arithmetic summary
        expect(output).toContain(`Count: ${actual}`);
        // expect(output).toMatch(/Sum: \d+/);
        // expect(output).toMatch(/Avg: \d+(\.\d+)?/);
    }
}

module.exports = ColumnsDrag;
