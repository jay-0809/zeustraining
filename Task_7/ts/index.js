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
var ParentDiv = /** @class */ (function () {
    function ParentDiv(className, cssStyle) {
        this.element = document.createElement("div");
        this.element.className = className;
        this.element.style.cssText = cssStyle;
        document.body.appendChild(this.element);
    }
    return ParentDiv;
}());
var ChildDiv = /** @class */ (function () {
    function ChildDiv(parentEl, className, cssStyle, content) {
        if (content === void 0) { content = "This is Child Div"; }
        var _this = this;
        this.isDragging = false;
        this.mouseDown = function (e) {
            _this.isDragging = true;
            _this.element.setPointerCapture(e.pointerId);
            // console.log("Set.");
        };
        this.mouseUp = function (e) {
            _this.isDragging = false;
            _this.element.releasePointerCapture(e.pointerId);
            // console.log("Released...");
        };
        this.mouseMove = function (parentEl, e) {
            if (!_this.isDragging)
                return;
            var parentRect = parentEl.getBoundingClientRect();
            var x = e.pageX - parentRect.left - _this.element.offsetWidth / 2;
            var y = e.pageY - parentRect.top - _this.element.offsetHeight / 2;
            x = Math.max(0, Math.min(x, parentRect.width - _this.element.offsetWidth));
            y = Math.max(0, Math.min(y, parentRect.height - _this.element.offsetHeight));
            _this.element.style.left = "".concat(x, "px");
            _this.element.style.top = "".concat(y, "px");
        };
        this.element = document.createElement("div");
        this.element.className = className;
        this.element.innerHTML = content;
        this.element.style.cssText = cssStyle;
        parentEl.appendChild(this.element);
        this.addEvents(parentEl);
        this.addResizeListener(parentEl);
    }
    ChildDiv.prototype.addEvents = function (parentEl) {
        this.addEventListener("pointerdown", this.mouseDown);
        this.addEventListener("pointerup", this.mouseUp);
        this.addEventListener("pointermove", this.mouseMove.bind(this, parentEl));
    };
    ChildDiv.prototype.addEventListener = function (event, handler) {
        this.element.addEventListener(event, handler);
    };
    ChildDiv.prototype.addResizeListener = function (parentEl) {
        var _this = this;
        window.addEventListener("resize", function () {
            var parentRect = parentEl.getBoundingClientRect();
            var x = parseFloat(_this.element.style.left) || 0;
            var y = parseFloat(_this.element.style.top) || 0;
            x = Math.max(0, Math.min(x, parentRect.width - _this.element.offsetWidth));
            y = Math.max(0, Math.min(y, parentRect.height - _this.element.offsetHeight));
            _this.element.style.left = "".concat(x, "px");
            _this.element.style.top = "".concat(y, "px");
            // console.log("Child div adjusted on resize.");
        });
    };
    return ChildDiv;
}());
var parent1 = new ParentDiv("parent", "background-color: rgb(201, 135, 135);");
var child1 = new ChildDiv(parent1.element, "child", "background-color: #1F7A54;", "This is Child1");
var child5 = new ChildDiv(parent1.element, "child", "background-color:rgb(60, 162, 236);", "");
var child6 = new ChildDiv(parent1.element, "child", "background-color:rgb(60, 162, 236);", "");
var child7 = new ChildDiv(parent1.element, "child", "background-color:rgb(52, 66, 116); border-radius: 50%", "");
var parent2 = new ParentDiv("parent", "background-color: rgb(201, 135, 198);");
var child2 = new ChildDiv(parent2.element, "child", "background-color: #331f7a;", "This is Child2");
var parent3 = new ParentDiv("parent", "background-color: rgb(135, 201, 198);");
var child3 = new ChildDiv(parent3.element, "child", "background-color:rgb(122, 31, 73);", "This is Child3");
var parent4 = new ParentDiv("parent", "background-color: rgb(139, 135, 201);");
var child4 = new ChildDiv(parent4.element, "child", "background-color:rgb(60, 122, 31);", "This is Child4");
document.addEventListener("DOMContentLoaded", function () {
    var parentRect = parent3.element.getBoundingClientRect();
    var x = parseFloat(child3.element.style.left) || 0;
    var y = parseFloat(child3.element.style.top) || 0;
    var flagW, flagH = true;
    setInterval(function () {
        if (x >= parentRect.width - 82) {
            flagW = false;
        }
        else {
            if (x == 0) {
                flagW = true;
            }
        }
        if (y >= parentRect.height - 82) {
            flagH = false;
        }
        else {
            if (y == 0) {
                flagH = true;
            }
        }
        if (flagW) {
            x += 2;
        }
        else {
            x -= 2;
        }
        if (flagH) {
            y += 2;
        }
        else {
            y -= 2;
        }
        x = Math.max(0, Math.min(x, parentRect.width - child3.element.offsetWidth));
        y = Math.max(0, Math.min(y, parentRect.height - child3.element.offsetHeight));
        // console.log(x, flagW, parentRect.width, y, flagH, parentRect.height);
        child3.element.style.left = "".concat(x, "px");
        child3.element.style.top = "".concat(y, "px");
    }, 25);
});
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
