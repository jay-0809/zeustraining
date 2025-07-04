// resize.js
export class Resizer {
    constructor(grid) {
        this.grid = grid;
        this.resizing = false;
        this.target = null;
        this.index = null;
        this.startPos = 0;
        this.startSize = 0;
        this.type = null; // 'col' or 'row'
        this.canvasCache = new Map();
    }
 
    init() {
        this.grid.wrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {
        if (e.target.classList.contains('col-resizer')) {
            this.startResize(e, 'col');
        } else if (e.target.classList.contains('row-resizer')) {
            this.startResize(e, 'row');
        }
    }
 
    startResize(e, type) {
        this.resizing = true;
        this.type = type;
        this.target = e.target;
        this.index = parseInt(this.target.dataset.index);
        this.startPos = type === 'col' ? e.clientX : e.clientY;
        this.startSize = type === 'col' ? 
            this.grid.columns[this.index].width : 
            this.grid.rows[this.index].height;
        
        // Cache visible canvases
        this.canvasCache.clear();
        for (const key in this.grid.canvases) {
            this.canvasCache.set(key, this.grid.canvases[key]);
        }
    }
 
    handleMouseMove(e) {
        if (!this.resizing) return;
        
        e.preventDefault();
        const currentPos = this.type === 'col' ? e.clientX : e.clientY;
        const delta = currentPos - this.startPos;
        const newSize = Math.max(20, this.startSize + delta);
        
        if (this.type === 'col') {
            this.grid.resizeColumn(this.index, newSize);
        } else {
            this.grid.resizeRow(this.index, newSize);
        }
    }
 
    handleMouseUp() {
        this.resizing = false;
        this.target = null;
        this.index = null;
        this.canvasCache.clear();
    }
}
 