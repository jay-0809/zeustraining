import { expect } from "@playwright/test";

class RowResize {
    constructor(page) {
        this.page = page;
    }

    async test() {
        const rowIndex = 5;

        this.initialHeight = await this.page.evaluate((rowIndex) => {
            return window.rowHeights[rowIndex];
        }, rowIndex);

        await this.page.mouse.move(50, 225);
        await this.page.mouse.down();
        await this.page.waitForTimeout(500);
        await this.page.mouse.move(50, 245);
        await this.page.mouse.up();

        await this.verifyTest(rowIndex);
    }

    async verifyTest(rowIndex) {
        const newHeight = await this.page.evaluate((rowIndex) => {
            return window.rowHeights[rowIndex];
        }, rowIndex);
        // console.log("New Column Width:", newHeight, "Initial Width:", this.initialHeight + 20);
        expect(newHeight).toBeCloseTo(this.initialHeight + 20);
    }
}

module.exports = RowResize;
