// Navigation arrows
document.querySelectorAll('.arrow').forEach(arrow => {
  arrow.addEventListener('click', () => {
    const target = arrow.dataset.target;
    window.location.href = `${target}.html`;
  });
});

// Elements
const dialog = document.getElementById('dialog');
const door = document.getElementById('door');

// Show dialog
function openDialog() {
  dialog.classList.remove('hidden');
  setTimeout(() => dialog.classList.add('show'), 10);
}

// Close dialog
function closeDialog() {
  dialog.classList.remove('show');
  setTimeout(() => {
    dialog.classList.add('hidden');
  }, 600);
}

// Interactions
door.addEventListener('click', e => {
  e.stopPropagation();
  openDialog();
});

// Close dialog when clicking outside
dialog.addEventListener('click', closeDialog);
