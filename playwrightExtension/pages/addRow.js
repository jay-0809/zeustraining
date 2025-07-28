import { expect } from "@playwright/test";

class addRow {
    constructor(page) {
        this.page = page;
    }

    async test() {
        this.nTimes = 2;
        for (let i = 0; i < this.nTimes; i++) {
            await this.page.locator(".addNewRow").click();
        }
        this.verifyTest();
    }

    async verifyTest() {
        const actual = 100000 + this.nTimes; // Assuming we expect 2 new columns to be added
        const output = await this.page.evaluate(() => {
            return window.rowHeights.length;
        })
        // console.log("Add Row Output:", output, "Expected:", actual);
        expect(output).toBe(actual);
    }
}

module.exports = addRow;
