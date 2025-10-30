// ===========================
// Haunted House Game Script
// ===========================

let currentRoom = 'room-foyer';
const inventory = new Set();
const modalRoot = document.getElementById('modal-root');
const invGrid = document.getElementById('inv-grid');
const logEl = document.getElementById('log');
let hintsVisible = false;

// ---------------------------
// Helper Functions
// ---------------------------

// Update Inventory UI
function updateInventoryUI() {
  invGrid.innerHTML = '';
  inventory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.textContent = item;
    invGrid.appendChild(div);
  });
}

// Add message to log
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

// Show modal clue
function showModal(text) {
  modalRoot.innerHTML = `<div class="modal"><p>${text}</p><button id="close-modal">Close</button></div>`;
  modalRoot.style.display = 'block';
  document.getElementById('close-modal').addEventListener('click', () => {
    modalRoot.style.display = 'none';
  });
}

// Go to another room
function goToRoom(roomId) {
  document.querySelectorAll('.room').forEach(r => r.classList.add('hidden'));
  document.getElementById(roomId).classList.remove('hidden');
  currentRoom = roomId;
  document.getElementById('current-room').textContent = roomId.replace('room-', '');
}

// Handle hotspot actions
function handleAction(action, hotspot) {
  switch(action) {
    case 'key':
      if (!inventory.has('key')) {
        inventory.add('key');
        updateInventoryUI();
        log('You picked up a key!');
        hotspot.style.display = 'none';
      } else {
        log('You already have the key.');
      }
      break;

    case 'door':
      if (currentRoom === 'room-foyer' && !inventory.has('key')) {
        log('The front door is locked. You need a key.');
      } else if (currentRoom === 'room-basement') {
        log('🎉 Congratulations! You escaped the haunted house!');
        alert('You escaped the haunted house!');
      } else {
        const nextRoom = currentRoom === 'room-foyer' ? 'room-living' : 'room-basement';
        goToRoom(nextRoom);
        log(`You entered the ${nextRoom.replace('room-', '')}.`);
      }
      break;

    case 'painting':
      showModal('You notice a strange mark behind the painting...');
      break;

    case 'radio':
      log('The old radio crackles eerily...');
      break;

    case 'book':
      if (!inventory.has('book')) {
        inventory.add('book');
        updateInventoryUI();
        log('You found an old book!');
        hotspot.style.display = 'none';
      } else {
        log('You already have the book.');
      }
      break;

    case 'chest':
      if (inventory.has('key')) {
        showModal('You unlocked the chest and found a mysterious clue!');
        hotspot.style.display = 'none';
      } else {
        log('The chest is locked. You need a key.');
      }
      break;

    default:
      log('Nothing happens...');
      break;
  }
}

// ---------------------------
// Event Listeners
// ---------------------------

// Hotspot click
document.querySelectorAll('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('click', () => handleAction(hotspot.dataset.action, hotspot));
});

// Toggle hints with "H"
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'h') {
    hintsVisible = !hintsVisible;
    document.querySelectorAll('.hint').forEach(h => {
      h.style.display = hintsVisible ? 'block' : 'none';
    });
    log(hintsVisible ? 'Hints enabled.' : 'Hints disabled.');
  }
});

// Save / Reset
document.getElementById('btn-save').addEventListener('click', () => {
  const state = { currentRoom, inventory: Array.from(inventory) };
  localStorage.setItem('hauntedHouseSave', JSON.stringify(state));
  log('Game saved!');
});

document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the game?')) {
    localStorage.removeItem('hauntedHouseSave');
    location.reload();
  }
});

// Load saved game if exists
window.addEventListener('load', () => {
  const saved = localStorage.getItem('hauntedHouseSave');
  if (saved) {
    const state = JSON.parse(saved);
    state.inventory.forEach(item => inventory.add(item));
    updateInventoryUI();
    goToRoom(state.currentRoom);
    log('Loaded saved game.');
  }
});

