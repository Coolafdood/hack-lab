// --- Game State ---
const STATE_KEY = 'haunted_escape_v1';
const initialState = {
  room: 'foyer',
  inventory: [],
  found: {
    painting: false,
    key: false,
    radio: false,
    book: false,
    chestOpened: false
  },
  hintsUsed: 0
};

// --- Audio Setup ---
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;
let soundOn = true;
let ambientOsc;

function sfx(type = 'blip') {
  if (!audioCtx || !soundOn) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);

  if (type === 'blip') {
    o.type = 'square';
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
  }
  if (type === 'open') {
    o.type = 'sine';
    o.frequency.value = 440;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
  }

  o.start();
  o.stop(audioCtx.currentTime + 0.3);
}

function startAmbient() {
  if (!audioCtx || !soundOn) return;
  ambientOsc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = 60;
  g.gain.value = 0.02;
  ambientOsc.connect(g);
  g.connect(audioCtx.destination);
  ambientOsc.start();
}

function stopAmbient() {
  if (ambientOsc) {
    ambientOsc.stop();
    ambientOsc = null;
  }
}

// --- DOM References ---
const rooms = {
  foyer: document.getElementById('room-foyer'),
  living: document.getElementById('room-living'),
  basement: document.getElementById('room-basement')
};
const invGrid = document.getElementById('inv-grid');
const logEl = document.getElementById('log');
const modalRoot = document.getElementById('modal-root');
const currentRoomLabel = document.getElementById('current-room');

// --- Save / Load ---
function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load state', e);
  }
  return structuredClone(initialState);
}

function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  log('Game saved.');
}

// --- Log Utility ---
function log(text) {
  const p = document.createElement('div');
  p.textContent = text;
  logEl.prepend(p);
}

let state = loadState();

// --- Render Inventory ---
function renderInventory() {
  invGrid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    const item = state.inventory[i];
    slot.dataset.index = i;
    if (item) {
      slot.textContent = item;
      slot.title = item;
      slot.addEventListener('click', () => useInventory(i));
    }
    invGrid.appendChild(slot);
  }
}

// --- Room Navigation ---
function showRoom(roomKey) {
  Object.keys(rooms).forEach(k => {
    if (k === roomKey) rooms[k].classList.remove('hidden');
    else rooms[k].classList.add('hidden');
  });
  state.room = roomKey;
  currentRoomLabel.textContent = roomKey.charAt(0).toUpperCase() + roomKey.slice(1);
  saveState();
}

// --- Inventory Logic ---
function addItem(name) {
  if (!state.inventory.includes(name)) {
    if (state.inventory.length < 6) state.inventory.push(name);
    else state.inventory[0] = name;
    saveState();
    renderInventory();
    log('Picked up: ' + name);
    sfx('blip');
  }
}

function removeItemByName(name) {
  const idx = state.inventory.indexOf(name);
  if (idx >= 0) {
    state.inventory.splice(idx, 1);
    saveState();
    renderInventory();
  }
}

function useInventory(index) {
  const item = state.inventory[index];
  if (!item) return;
  log('Used ' + item);

  if (state.room === 'foyer' && item === 'Rusty Key') {
    openDoorWithKey();
    removeItemByName('Rusty Key');
  } else if (state.room === 'basement' && item === 'Strange Code') {
    openChest();
    removeItemByName('Strange Code');
  } else {
    log('Nothing seems to happen.');
  }
}

// --- Room Actions ---
function handleAction(action) {
  switch (action) {
    case 'lookPainting':
      if (!state.found.painting) {
        state.found.painting = true;
        log('Behind the painting is a small scribble: "B4SE" — maybe it means BASE?');
        sfx('blip');
        showModal('Painting', 'You find a scribbled note behind the painting: <em>B4SE</em>. Could point to the basement.');
        saveState();
      } else showModal('Painting', 'Just the same scribble: B4SE.');
      break;

    case 'door':
      if (state.found.key) {
        showModal('Door', 'You try the key... it turns! The door opens and wind blows. You escape. 🎉', showEnding);
        sfx('open');
      } else {
        showModal('Door', 'The front door is locked. It needs a key or some way to unlock it.');
        log('The front door is locked.');
      }
      break;

    case 'key':
      if (!state.found.key) {
        state.found.key = true;
        addItem('Rusty Key');
        showModal('Shelf', 'You find a small rusty key on the shelf.');
        saveState();
      } else showModal('Shelf', 'The shelf is empty.');
      break;

    case 'radio':
      if (!state.found.radio) {
        state.found.radio = true;
        addItem('Old Radio');
        showModal('Old Radio', 'The radio crackles. If you tune it later it might reveal something.');
      } else showModal('Old Radio', 'The radio is silent.');
      break;

    case 'book':
      if (!state.found.book) {
        state.found.book = true;
        addItem('Strange Code');
        showModal('Book', 'An old book contains a folded slip with the code: <strong>BASE</strong> — maybe for the chest.');
      } else showModal('Book', 'An empty page where the slip once was.');
      break;

    case 'chest':
      if (!state.found.chestOpened) showPuzzleModal();
      else showModal('Chest', 'The chest is open and empty.');
      break;
  }
}

function openDoorWithKey() {
  showRoom('living');
  log('You escaped the foyer and entered the living room.');
}

function openChest() {
  if (state.found.chestOpened) return;
  state.found.chestOpened = true;
  addItem('Mysterious Note');
  showModal('Chest', 'The chest opens! Inside is a note: "Use the Rusty Key at the front."');
  log('You opened the chest and found a note.');
  saveState();
}

// --- Modal Helpers ---
function showModal(title, html, onshow) {
  modalRoot.style.display = 'flex';
  modalRoot.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>${title}</h3>
        <div style="margin:8px 0">${html}</div>
        <div style="text-align:right;margin-top:12px">
          <button class="btn" id="modal-close">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-close').onclick = () => {
    modalRoot.innerHTML = '';
    modalRoot.style.display = 'none';
  };
  if (onshow) onshow();
}

function showPuzzleModal() {
  modalRoot.style.display = 'flex';
  modalRoot.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>Locked Chest</h3>
        <p>Enter the 4-letter code:</p>
        <input id="puzzle-input" maxlength="4"
          style="width:100%;padding:8px;border-radius:6px;
          border:1px solid rgba(255,255,255,0.06);
          background:transparent;color:inherit" />
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
          <button class="btn" id="puzzle-submit">Try</button>
          <button class="btn" id="puzzle-close">Close</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('puzzle-close').onclick = () => {
    modalRoot.innerHTML = '';
    modalRoot.style.display = 'none';
  };
  document.getElementById('puzzle-submit').onclick = () => {
    const v = document.getElementById('puzzle-input').value.trim().toUpperCase();
    if (v === 'BASE') {
      modalRoot.innerHTML = '';
      modalRoot.style.display = 'none';
      openChest();
    } else {
      log('Wrong code.');
    }
  };
}

// --- Ending ---
function showEnding() {
  modalRoot.style.display = 'flex';
  modalRoot.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>Freedom!</h3>
        <p>You unlocked the door and escaped the haunted house. Well done, detective. 🎉</p>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
          <button class="btn" id="end-close">Close</button>
          <button class="btn" id="end-reset">Play Again</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('end-close').onclick = () => {
    modalRoot.innerHTML = '';
    modalRoot.style.display = 'none';
  };
  document.getElementById('end-reset').onclick = () => {
    resetGame();
    modalRoot.innerHTML = '';
    modalRoot.style.display = 'none';
  };
}

// --- Reset Game ---
function resetGame() {
  localStorage.removeItem(STATE_KEY);
  state = structuredClone(initialState);
  renderInventory();
  showRoom('foyer');
  log('Game reset.');
}

// --- Events ---
document.querySelectorAll('.hotspot').forEach(el => {
  el.addEventListener('click', () => handleAction(el.dataset.action));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') handleAction(el.dataset.action);
  });
});

document.getElementById('btn-save').addEventListener('click', saveState);
document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Reset progress?')) resetGame();
});
document.getElementById('btn-sound').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('btn-sound').textContent = soundOn ? '🔊' : '🔈';
  if (soundOn) startAmbient(); else stopAmbient();
});

// --- Hint System ---
function showHint() {
  state.hintsUsed++;
  saveState();
  if (!state.found.key)
    showModal('Hint', 'Check the shelf in the foyer — small things hide answers.');
  else if (!state.found.chestOpened)
    showModal('Hint', 'Maybe the book in the living room contains the chest code.');
  else
    showModal('Hint', 'Try the rusty key at the front door.');
}

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'h') showHint();
  if (e.key.toLowerCase() === 's') saveState();
  if (e.key === 'Escape') {
    modalRoot.innerHTML = '';
    modalRoot.style.display = 'none';
  }
});

// --- Initialization ---
renderInventory();
showRoom(state.room);
log('Welcome. You may explore the rooms.');
if (soundOn) startAmbient();

// Auto-save every 12s
setInterval(saveState, 12000);
