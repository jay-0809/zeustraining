function switchTab() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => tab.classList.remove('active'));
            tab.classList.add('active');
        });
    });  

    document
        .querySelectorAll(".image-div")
        .forEach((tab) => {
            tab.classList.remove("active");
            const img = tab.querySelector('img');
            img.src = img.src.replace('_white', '');
        }
        );
}

function switchiconTab(clickedTab, type) {
    document
        .querySelectorAll(".image-div")
        .forEach((tab) => {
            tab.classList.remove("active");
            const img = tab.querySelector('img');
            img.src = img.src.replace('_white', '');
        }
        );

    document
        .querySelectorAll(".nav-tab")
        .forEach((tab) => tab.classList.remove("active"));

    clickedTab.classList.add("active");
    const img = clickedTab.querySelector('img');
    img.src = img.src.replace('.svg', '_white.svg');
    console.log(img.src);
}

function switchsubnavTab(element) {
    document
        .querySelectorAll(".subnav-2")
        .forEach((tab) => {
            if (tab !== element) {
                tab.classList.remove("active");
            }
        });

    element.classList.toggle("active");
}

function onButtonClick() {
    const buttons = document.querySelectorAll('.titles-val');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(button => button.classList.remove('active'));
            button.classList.add('active');
        });
    });
}