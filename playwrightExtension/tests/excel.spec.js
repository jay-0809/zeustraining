import {test, expect} from "@playwright/test";
const UpdateCellValue = require("../pages/updatecell");
const ColumnSelection = require("../pages/columnSelection");
const ColumnsDrag = require("../pages/columnsDrag");
const ColumnResize = require("../pages/columnResize");
const RowSelection = require("../pages/rowSelection");
const RowsDrag = require("../pages/rowsDrag");
const RowResize = require("../pages/rowResize");
const MultiCellSelect = require("../pages/multiCellSelection");
const addColumn = require("../pages/addColumn");
const addRow = require("../pages/addRow");

test.only("Change cell value using POM", async({page})=>{
    await page.goto("http://127.0.0.1:5500/");

    const strategies = [
            new UpdateCellValue(page),
            new ColumnSelection(page), 
            new addColumn(page),
            new ColumnsDrag(page), 
            new ColumnResize(page),
            // new MultiCellSelect(page),
            new RowSelection(page), 
            new addRow(page),
            new RowsDrag(page), 
            new RowResize(page)
        ];
    
    for (const strategy of strategies) {
        await page.waitForTimeout(1000);
        await strategy.test();
    }
})