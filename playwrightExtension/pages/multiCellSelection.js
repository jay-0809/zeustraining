class MultiCellSelect {
    constructor(page) {
        this.page = page;
    }

    async test() {
        await this.page.locator('canvas').nth(2).click({position: { x: 160, y: 50 }});
        await this.page.waitForTimeout(1000);
        let actual = 2;
        
        for (let i = 0; i < 3; i++) {           
            await this.page.locator('canvas').nth(2).press("Shift+ArrowDown")
            await this.page.waitForTimeout(500);
            await this.page.locator('canvas').nth(2).press("Shift+ArrowRight")
            actual *= 2;
        }  
        console.log("actual",actual);
        
        // const countValue = await this.page.keyboard.press("Control+b");
        // console.log("Value", countValue);
        
    }
}

module.exports = MultiCellSelect;