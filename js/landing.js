// Buttons and dialog
const enterBtn = document.getElementById("enterBtn");
const hamburger = document.getElementById("hamburger");
const dialogBox = document.getElementById("dialogBox");
const soundToggle = document.getElementById("soundToggle");
const bgMusic = document.getElementById("bgMusic");

// Navigate to foyer
enterBtn.onclick = () => {
  window.location.href = "foyer.html";
};

// Show dialog
hamburger.onclick = () => {
  dialogBox.classList.remove("hidden");
};

// Hide dialog when clicked
dialogBox.onclick = () => {
  dialogBox.classList.add("hidden");
};

// Music control
soundToggle.addEventListener("change", () => {
  if (soundToggle.checked) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
});
