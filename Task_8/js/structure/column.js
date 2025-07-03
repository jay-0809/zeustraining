export class Column {
    constructor(index, width = 80) {
        this.index = this.index;
        this.width = this.width;
    }

    resize(newWidth) {
        this.width = newWidth;
    }

    getWidth() {
        return this.width;
    }
}