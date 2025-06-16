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
    // document
    //     .querySelectorAll(".image-div")
    //     .forEach((tab) => {
    //         tab.classList.remove("active");
    //         const img = tab.querySelector('img');
    //         img.src = img.src.replace('_white', '');
    //     }
    //     );
    document
        .querySelectorAll(".nav-tab")
        .forEach((tab) => tab.classList.remove("active"));
    // clickedTab.classList.add("active");
    // const img = clickedTab.querySelector('img');
    // img.src = img.src.replace('.svg', '_white.svg');
    // console.log(img.src);
}

// ******** Aleart
let alertButton = document.querySelector(".alert-container");
let alertBox = document.querySelector(".alert-box");
let alertCount = document.querySelector(".alert-counter");
let announceCount = document.querySelector(".announce-counter");
let alertImage = document.querySelector(".alert-image");
let announceImage = document.querySelector(".announce-image");
let hamburgerImage = document.querySelector(".hamburger-image");

alertButton.addEventListener('click', () => {
    alertBox.style.display = "block";
})

function showAleartMenu() {
    // clearTimeout(hideTimeout);
    announceBox.style.display = "none";
    subnavContent.style.display = "none";
    alertBox.style.display = "block";
    alertCount.style.display = "none";
    alertImage.className = "white-icon";
}

function hideAleartMenu() {
    hideTimeout = setTimeout(function () {
        alertBox.style.display = "none";
    }, 100);
    alertCount.style.display = "block";
    alertImage.className = "refcr";
}

alertButton.addEventListener("mouseover", showAleartMenu);
alertButton.addEventListener("mouseout", hideAleartMenu);
alertButton.addEventListener("click", () => {
    if (alertBox.style.display === "block") {
        alertBox.style.display = "none";
        alertCount.style.display = "block";
        alertImage.classList.remove("white-icon");
    } else {
        alertBox.style.display = "block";
        alertCount.style.display = "none";
        alertImage.classList.add("white-icon");
    }
})

// ********* Announce
let announceButton = document.querySelector(".announce-container");
let announceBox = document.querySelector(".announce-box");

announceButton.addEventListener('click', () => {
    announceBox.style.display = "block";
})

function showAnnounceMenu() {
    // clearTimeout(hideTimeout);
    alertBox.style.display = "none";
    subnavContent.style.display = "none";
    announceBox.style.display = "block";
    announceCount.style.display = "none";
    announceImage.className = "white-icon";
}

function hideAnnounceMenu() {
    hideTimeout = setTimeout(function () {
        announceBox.style.display = "none";
    }, 100);
    announceCount.style.display = "block";
    announceImage.className = "EFCER";
}

announceButton.addEventListener("mouseover", showAnnounceMenu);
announceButton.addEventListener("mouseout", hideAnnounceMenu);

//  *********** Hamburger
let subnavButton = document.querySelector(".subnav");
let subnavContent = document.querySelector(".subnav-content");

subnavButton.addEventListener('click', () => {
    alertBox.style.display = "none";
    announceBox.style.display = "none";
    subnavContent.style.display = "block";
})

function showHamburgerMenu() {
    clearTimeout(hideTimeout);
    alertBox.style.display = "none";
    announceBox.style.display = "none";
    subnavContent.style.display = "block";
    hamburgerImage.className = "white-icon";
}

function hideHamburgerMenu() {
    hideTimeout = setTimeout(function () {
        subnavContent.style.display = "none";
    }, 100);
    hamburgerImage.className = "EFCER";
}

subnavButton.addEventListener("mouseover", showHamburgerMenu);
subnavButton.addEventListener("mouseout", hideHamburgerMenu);


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

