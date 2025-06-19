// Create Main Grid for rows-columns
class Grid {
    constructor(rows = 1, columns = 1) {
        this.rows = rows;
        this.columns = columns;
    }

    generateGrid(){

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

const mainGrid = new Grid(1, 500);
// const row = new Rows(100000);
// const column = new Columns(500);

console.log(mainGrid);
