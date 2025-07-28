// grid/selectionStats.js

export class SelectionStats {
    constructor(grid) {
        this.grid = grid;
        this.countTimer = null;
    }

    computeStats() {
        const dataMap = this.grid.dataset;
        const pointer = this.grid.pointer;
        const headerSel = this.grid.multiHeaderSelection;
        
        let values = [];
        let count = 0;

        // CASE 1: Cell range selection (via pointer)
        if (pointer?.activeMode?.cellRange?.isValid()) {
            const range = pointer.activeMode.cellRange;
            const [startRow, endRow] = [range.startRow, range.endRow].sort((a, b) => a - b);
            const [startCol, endCol] = [range.startCol, range.endCol].sort((a, b) => a - b);
            // console.log(startRow, endRow, startCol, endCol);
            
            for (let r = startRow - 1; r <= endRow - 1; r++) {
                const rowMap = dataMap.get(r);
                if (!rowMap) continue;
                // console.log(range, rowMap);

                for (let c = startCol - 1; c <= endCol - 1; c++) {
                    const val = rowMap.get(c);
                    if (val) count = count + 1;

                    const num = parseFloat(val);
                    if (!isNaN(num)) values.push(num);
                }
            }
        }
        // CASE 2: Full row/column header selection
        else if (headerSel) {
            if (headerSel.colstart != null && headerSel.colend != null) {
                const [cStart, cEnd] = [headerSel.colstart, headerSel.colend].sort((a, b) => a - b);
                for (let r = 0; r < this.grid.maxRows; r++) {
                    const rowMap = dataMap.get(r);
                    if (!rowMap) continue;

                    for (let c = cStart - 1; c <= cEnd - 1; c++) {
                        const val = rowMap.get(c);
                        if (val) count = count + 1;
                        const num = parseFloat(val);
                        if (!isNaN(num)) values.push(num);
                    }
                }
            } else if (headerSel.rowStart != null && headerSel.rowEnd != null) {
                const [rStart, rEnd] = [headerSel.rowStart, headerSel.rowEnd].sort((a, b) => a - b);
                for (let r = rStart - 1; r <= rEnd - 1; r++) {
                    const rowMap = dataMap.get(r);
                    if (!rowMap) continue;

                    for (let c = 0; c < this.grid.maxCols; c++) {
                        const val = rowMap.get(c);
                        if (val) count = count + 1;
                        const num = parseFloat(val);
                        if (!isNaN(num)) values.push(num);
                    }
                }
            }
        }

        if (!values.length) {
            
            return this.grid.result = { count };
        }
        
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;

        for (let i = 0; i < values.length; i++) {
            const num = values[i];
            sum += num;
            if (num < min) min = num;
            if (num > max) max = num;
        }

        const avg = sum / values.length;
        // this.countTimer = null;
        this.grid.result = { count, sum, min, max, avg };
        // console.log(this.grid.result);
    }

    deBounceCount() {
        // if (this.countTimer) {
        //     clearTimeout(this.countTimer);
        // }
        this.computeStats();
        // this.countTimer = setTimeout(() => {
        //     this.computeStats();
        //     this.countTimer = null;
        // }, 200);
    }
}
