// Navigation arrows
document.querySelectorAll('.arrow').forEach(arrow => {
  arrow.addEventListener('click', () => {
    const target = arrow.dataset.target;
    window.location.href = `${target}.html`;
  });
});

// Elements
const dialog = document.getElementById('dialog');
const dialogImg = document.getElementById('dialog-img');
const shelf = document.getElementById('shelf');
const painting = document.getElementById('painting');

// Open dialog
function openDialog(imagePath) {
  dialogImg.src = imagePath;
  dialog.classList.remove('hidden');
  setTimeout(() => dialog.classList.add('show'), 10);
}

// Close dialog
function closeDialog() {
  dialog.classList.remove('show');
  setTimeout(() => {
    dialog.classList.add('hidden');
    dialogImg.src = '';
  }, 600);
}

// Close dialog when clicking background
dialog.addEventListener('click', closeDialog);

// Click hotspots
shelf.addEventListener('click', e => {
  e.stopPropagation();
  openDialog('assets/images/shelf.png');
});

painting.addEventListener('click', e => {
  e.stopPropagation();
  openDialog('assets/images/painting.png');
});


