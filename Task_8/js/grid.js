// Create Main Grid for rows-columns
export class Grid {
    constructor(rows = 1, columns = 1) {
        this.rows = rows;
        this.columns = columns;
    }
    
    print() {
        return `Rows: ${this.rows}, Columns: ${this.columns}`;
    }
}

export class Rows extends Grid {
    constructor(rows) {
        super(rows, 0);
    }
}

export class Columns extends Grid {
    constructor(columns) {
        super(0, columns);
    }
}
