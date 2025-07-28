import { expect } from "@playwright/test";

class addColumn {
    constructor(page) {
        this.page = page;
    }

    async test() {
        this.nTimes = 2;
        for (let i = 0; i < this.nTimes; i++) {
            await this.page.locator(".addNewColumn").click();
        }

        this.verifyTest();
    }

    async verifyTest() {
        const actual = 500 + this.nTimes;
        const output = await this.page.evaluate(() => {
            return window.colWidths.length;
        });
        // console.log("Add Column Output:", output, "Expected:", actual);
        
        expect(output).toBe(actual);
    }
}

module.exports = addColumn;
