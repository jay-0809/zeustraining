import { test, expect } from "@playwright/test";

class RowsDrag {
    constructor(page) {
        this.page = page;
    }

    async test() {
        await this.page.mouse.move(10, 140);
        await this.page.mouse.down();
        await this.page.waitForTimeout(500);
        await this.page.mouse.move(10, 340);
        await this.page.mouse.up();

        await this.page.waitForTimeout(300);

        await this.verifyTest();
    }

    async verifyTest() {
        const actual = 45;
        const output = await this.page.locator("#values").inputValue();
        // console.log("Rows Drag Output:", output);

        // Validate arithmetic summary
        expect(output).toContain(`Count: ${actual}`);
        // expect(output).toMatch(/Sum: \d+/);
        // expect(output).toMatch(/Avg: \d+(\.\d+)?/);
    }
}

module.exports = RowsDrag;
