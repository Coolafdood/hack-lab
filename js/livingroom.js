// Navigation arrows
const upArrow = document.getElementById("upArrow");
const downArrow = document.getElementById("downArrow");

// Elements
const codeZone = document.getElementById("codeZone");
const imageDialog = document.getElementById("imageDialog");

// Navigation
upArrow.onclick = () => (window.location.href = "foyer.html");
downArrow.onclick = () => (window.location.href = "basement.html");

// Click chest area → show clue image
codeZone.onclick = () => {
  imageDialog.classList.remove("hidden");
};

// Click anywhere on dialog to close it
imageDialog.onclick = () => {
  imageDialog.classList.add("hidden");
};

