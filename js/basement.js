// Navigation arrows
const rightArrow = document.getElementById("rightArrow");
const leftArrow = document.getElementById("leftArrow");
const bottomArrow = document.getElementById("bottomArrow");

// Dialog and clickable area
const dialogBox = document.getElementById("dialogBox");
const clueZone = document.getElementById("clueZone");

// Navigation
rightArrow.onclick = () => (window.location.href = "foyer.html");
leftArrow.onclick = () => (window.location.href = "livingroom.html");
bottomArrow.onclick = () => (window.location.href = "frontdoor.html");

// Show dialog when clicking the center area
clueZone.onclick = () => {
  dialogBox.classList.remove("hidden");
};

// Close dialog when clicked
dialogBox.onclick = () => {
  dialogBox.classList.add("hidden");
};

