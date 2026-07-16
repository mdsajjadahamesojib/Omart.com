//---------- LOGIN POPUP SECTION ----------//

let popup = document.getElementById("popup");
let backdrop = document.getElementById("backdrop");

function openPopup() {
    popup.classList.add("open-popup");
    backdrop.classList.add("open-backdrop");
}

function closePopup() {
    popup.classList.remove("open-popup");
    backdrop.classList.remove("open-backdrop");
}


//---------- NAVLIST ELEMENT COLOR CHENGER ----------//

const currentPath = window.location.pathname.split("/").pop();

const navLinks = document.querySelectorAll('.nav-list-element li a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    } else if (currentPath === "" && link.getAttribute('href') === "index.html") {
        link.classList.add('active');
    }
});




//---------- NAVLIST POPUP SECTION ----------//

let navlistPopup = document.getElementById("navlist-popup");

function openNavlistPopup() {
    navlistPopup.classList.add("open-navlist-popup");
}

function closeNavlistPopup() {
    navlistPopup.classList.remove("open-navlist-popup");
}



//---------- DARK MODE TOGGLE ----------//

let darkModeBtn = document.getElementById("dark-mode");
let sunIcon = document.getElementById("sunicon");
let moonIcon = document.getElementById("moonicon");

if (localStorage.getItem("theme") === "dark") {
    enableDarkMode();
} else {
    disableDarkMode();
}

darkModeBtn.onclick = function() {
    if (document.body.classList.contains("dark-theme")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add("dark-theme");
    moonIcon.style.display = "none";
    sunIcon.style.display = "inline-block";
    localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
    document.body.classList.remove("dark-theme");
    moonIcon.style.display = "inline-block";
    sunIcon.style.display = "none";
    localStorage.setItem("theme", "light");
}

