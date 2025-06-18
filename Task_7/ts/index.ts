// const parentDiv: HTMLDivElement = document.createElement("div");
// parentDiv.style.cssText = `height:100vh; width: 100vw; color: #ffffff; background-color:rgb(201, 135, 135); position: relative`;
// parentDiv.className = "parent";

// const childDiv: HTMLDivElement = document.createElement("div");
// childDiv.style.cssText = `height: 50px; width: 50px; color: #ffffff; background-color: #1F7A54; display: flex; justify-content: center; 
//                     align-items: center; padding: 1rem; margin: 1rem; border-radius: 5px; touch-action: none; position: absolute`;
// childDiv.className = "child";
// childDiv.innerHTML = `This is Child Div`;

// document.body.appendChild(parentDiv);
// parentDiv.append(childDiv);

// let isDrag: boolean = false;

// const mouseDown = (e: PointerEvent): void => {
//     isDrag = true;
//     childDiv.setPointerCapture(e.pointerId);
//     console.log("Set...");
// }

// const mouseUp = (e: PointerEvent): void => {
//     isDrag = false;
//     childDiv.releasePointerCapture(e.pointerId);
//     console.log("Released...");
// }

// const mouseMove = (e: PointerEvent): void => {
//     if (!isDrag) {
//         return;
//     }
//     let x:number = e.pageX - 50; 
//     let y:number = e.pageY - 50;
//     childDiv.style.left = `${x}px`;
//     childDiv.style.top = `${y}px`;
// }

// childDiv.addEventListener("pointerdown", mouseDown);
// childDiv.addEventListener("pointerup", mouseUp);
// childDiv.addEventListener("pointermove", mouseMove);

class ParentDiv {
    public element: HTMLDivElement;

    constructor(className: string, cssStyle: string) {
        this.element = document.createElement("div");
        this.element.className = className;
        this.element.style.cssText = cssStyle;
        document.body.appendChild(this.element);
    }
}

class ChildDiv {
    public element: HTMLDivElement;
    private isDragging: boolean = false;

    constructor(parentEl: HTMLDivElement, className: string, cssStyle: string, content: string = "This is Child Div") {
        this.element = document.createElement("div");
        this.element.className = className;
        this.element.innerHTML = content;
        this.element.style.cssText = cssStyle;

        parentEl.appendChild(this.element);
        this.addEvents(parentEl);
        this.addResizeListener(parentEl);
    }

    private addEvents(parentEl: HTMLDivElement): void {
        this.addEventListener("pointerdown", this.mouseDown);
        this.addEventListener("pointerup", this.mouseUp);
        this.addEventListener("pointermove", this.mouseMove.bind(this, parentEl));
    }
    private addEventListener(event: string, handler: EventListener): void {
        this.element.addEventListener(event, handler);
    }

    private mouseDown = (e: PointerEvent): void => {
        this.isDragging = true;
        this.element.setPointerCapture(e.pointerId);
        // console.log("Set.");
    }

    private mouseUp = (e: PointerEvent): void => {
        this.isDragging = false;
        this.element.releasePointerCapture(e.pointerId);
        // console.log("Released...");
    }

    private mouseMove = (parentEl: HTMLDivElement, e: PointerEvent): void => {
        if (!this.isDragging) return;

        const parentRect = parentEl.getBoundingClientRect();
        let x = e.pageX - parentRect.left - this.element.offsetWidth / 2;
        let y = e.pageY - parentRect.top - this.element.offsetHeight / 2;

        x = Math.max(0, Math.min(x, parentRect.width - this.element.offsetWidth));
        y = Math.max(0, Math.min(y, parentRect.height - this.element.offsetHeight));

        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    private addResizeListener(parentEl: HTMLDivElement): void {
        window.addEventListener("resize", () => {
            const parentRect = parentEl.getBoundingClientRect();
            let x = parseFloat(this.element.style.left) || 0;
            let y = parseFloat(this.element.style.top) || 0;

            x = Math.max(0, Math.min(x, parentRect.width - this.element.offsetWidth));
            y = Math.max(0, Math.min(y, parentRect.height - this.element.offsetHeight));

            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
            // console.log("Child div adjusted on resize.");
        });
    }
}

const parent1 = new ParentDiv("parent", "background-color: rgb(201, 135, 135);");
const child1 = new ChildDiv(parent1.element, "child", "background-color: #1F7A54;", "This is Child1");
const child5 = new ChildDiv(parent1.element, "child", "background-color:rgb(60, 162, 236);", "");
const child6 = new ChildDiv(parent1.element, "child", "background-color:rgb(60, 162, 236);", "");
const child7 = new ChildDiv(parent1.element, "child", "background-color:rgb(52, 66, 116); border-radius: 50%", "");

const parent2 = new ParentDiv("parent", "background-color: rgb(201, 135, 198);");
const child2 = new ChildDiv(parent2.element, "child", "background-color: #331f7a;", "This is Child2");

const parent3 = new ParentDiv("parent", "background-color: rgb(135, 201, 198);");
const child3 = new ChildDiv(parent3.element, "child", "background-color:rgb(122, 31, 73);", "This is Child3");

const parent4 = new ParentDiv("parent", "background-color: rgb(139, 135, 201);");
const child4 = new ChildDiv(parent4.element, "child", "background-color:rgb(60, 122, 31);", "This is Child4");

document.addEventListener("DOMContentLoaded", () => {
    const parentRect = parent3.element.getBoundingClientRect();
    let x = parseFloat(child3.element.style.left) || 0;
    let y = parseFloat(child3.element.style.top) || 0;
    let flagW:boolean, flagH: boolean = true;

    setInterval(() => {
        if (x >= parentRect.width-82) {
            flagW = false;
        } else {
            if(x == 0){
                flagW = true;
            }
        }
        if (y >= parentRect.height-82) {
            flagH = false;
        } else {
            if(y == 0){
                flagH = true;
            }
        }
        if (flagW) {
            x += 2;
        } else {           
            x -= 2;
        }
        if (flagH) {
            y += 2;
        } else {           
            y -= 2;
        }
        
        x = Math.max(0, Math.min(x, parentRect.width - child3.element.offsetWidth));
        y = Math.max(0, Math.min(y, parentRect.height - child3.element.offsetHeight));
        
        // console.log(x, flagW, parentRect.width, y, flagH, parentRect.height);
        child3.element.style.left = `${x}px`;
        child3.element.style.top = `${y}px`;
    }, 25);
})

// document.addEventListener("DOMContentLoaded", function () {
//     var parentRect = parent4.element.getBoundingClientRect();
//     var x = parseFloat(child4.element.style.left) || 0;
//     var y = parseFloat(child4.element.style.top) || 0;
//     var flagW, flagH = true;
//     // console.log(maxH, maxW, parentRect.width, parentRect.height);

//     setInterval(() => {
//         // console.log(x, flagW, parentRect.width, y, flagH, parentRect.height);
//         if (x >= parentRect.width-82) {
//             flagW = false;
//         } else {
//             if(x == 0){
//                 flagW = true;
//             }
//         }
//         if (y >= parentRect.height-82) {
//             flagH = false;
//         } else {
//             if(y == 0){
//                 flagH = true;
//             }
//         }
//         if (flagW) {
//             x += 2;
//         } else {           
//             x -= 2;
//         }
//         if (flagH) {
//             y += 2;
//         } else {           
//             y -= 2;
//         }
        
//         x = Math.max(0, Math.min(x, parentRect.width - child4.element.offsetWidth));
//         y = Math.max(0, Math.min(y, parentRect.height - child4.element.offsetHeight));
        
//         console.log(x, flagW, parentRect.width, y, flagH, parentRect.height);

//         child4.element.style.left = `${x}px`;
//         child4.element.style.top = `${y}px`;
//     }, 25);

// });