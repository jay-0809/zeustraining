import { expect } from "@playwright/test";

class ColumnResize {
  constructor(page) {
    this.page = page;
  }

  async test() {
    const colIndex = 2;

    this.initialWidth = await this.page.evaluate((colIndex) => {
      return window.colWidths[colIndex];
    }, colIndex);

    await this.page.mouse.move(240, 95);
    await this.page.mouse.down();
    await this.page.waitForTimeout(500);
    await this.page.mouse.move(290, 95);
    await this.page.mouse.up();

    await this.verifyTest(colIndex);
  }

  async verifyTest(colIndex) {
    const newWidth = await this.page.evaluate((colIndex) => {
      return window.colWidths[colIndex];
    }, colIndex);
    // console.log("New Column Width:", newWidth, "Initial Width:", this.initialWidth+50);
    
    expect(newWidth).toBeCloseTo(this.initialWidth + 50);
  }
}

module.exports = ColumnResize;
