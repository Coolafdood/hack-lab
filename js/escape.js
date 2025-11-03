// Optional gentle fade-in and reset logic

window.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("dialog");

  // Smooth appearance delay
  setTimeout(() => {
    dialog.classList.add("show");
  }, 500);

  // Clear any saved progress (like the key)
  localStorage.removeItem("hasKey");

  // Optional: Click anywhere to restart the game
  dialog.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
