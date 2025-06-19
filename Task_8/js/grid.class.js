// Create Main Grid for rows-columns
class Grid {
    constructor(rows = 0, columns = 0) {
        this.rows = rows;
        this.columns = columns;
    }
    
    print() {
        return `Rows: ${this.rows}, Columns: ${this.columns}`;
    }
}

class Rows extends Grid {
    constructor(rows) {
        super(rows, 0);
    }
}

class Columns extends Grid {
    constructor(columns) {
        super(0, columns);
    }
}

export { Grid, Rows, Columns };
