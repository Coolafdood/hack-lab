// Navigation arrows
const upArrow = document.getElementById("upArrow");
const downArrow = document.getElementById("downArrow");

// Dialog
const dialogBox = document.getElementById("dialogBox");
const codeZone = document.getElementById("codeZone");

// Navigate between rooms
upArrow.onclick = () => (window.location.href = "foyer.html");
downArrow.onclick = () => (window.location.href = "basement.html");

// Click zone shows dialog
codeZone.onclick = () => {
  dialogBox.classList.remove("hidden");
};

// Clicking the dialog closes it
dialogBox.onclick = () => {
  dialogBox.classList.add("hidden");
};
