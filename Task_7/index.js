
const parentDiv = document.createElement("div");
parentDiv.style = `height:100vh; width: 100vw; color: #ffffff; background-color:rgb(201, 135, 135); position: relative`;
parentDiv.className = "parent";

const childDiv = document.createElement("div");
childDiv.style = `height: 50px; width: 50px; color: #ffffff; background-color: #1F7A54; display: flex; justify-content: center; 
                    align-items: center; padding: 1rem; margin: 1rem; border-radius: 5px; touch-action: none; position: absolute`;
childDiv.className = "child";
childDiv.innerHTML = `This is Child Div`;


document.body.appendChild(parentDiv);
parentDiv.append(childDiv);

let isDrag;

childDiv.addEventListener("pointerdown", (e) => {
    isDrag = true;
    childDiv.setPointerCapture(e.pointerId);
    console.log("Pointer Set.");
});

childDiv.addEventListener("pointerup", (e) => {
    isDrag = false;
    childDiv.releasePointerCapture(e.pointerId)
    console.log("Pointer Released...");
});

childDiv.addEventListener("pointermove", (event) => {
    if(!isDrag) return;
    const x = event.pageX-50;
    const y = event.pageY-50;

    childDiv.style.left = `${x}px`;
    childDiv.style.top = `${y}px`;
    // console.log(`Pointer coordinates: x=${x}, y=${y}`);
});
