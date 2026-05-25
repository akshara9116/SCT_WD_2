// Grab references to DOM elements
const display  = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn   = document.getElementById('lapBtn');
const lapsEl   = document.getElementById('laps');

// State variables
let intervalId = null; // active timer reference (null = not running)
let startTime  = 0;    // timestamp when current run started
let elapsed    = 0;    // accumulated ms across pauses
let lapCount   = 0;    // running lap counter

// Convert milliseconds into HH:MM:SS string
function format(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Update the display with current elapsed time
function render() {
  const current = elapsed + (intervalId ? Date.now() - startTime : 0);
  display.textContent = format(current);
}

// Start the stopwatch
function start() {
  if (intervalId) return; // prevent multiple intervals from running
  startTime = Date.now();
  intervalId = setInterval(render, 200);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled   = false;
}

// Pause the stopwatch
function pause() {
  if (!intervalId) return;
  elapsed += Date.now() - startTime;
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled   = true;
  render();
}

// Reset everything back to zero
function reset() {
  clearInterval(intervalId);
  intervalId = null;
  elapsed = 0;
  lapCount = 0;
  lapsEl.innerHTML = '';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled   = true;
  render();
}

// Record a lap time
function lap() {
  const current = elapsed + (intervalId ? Date.now() - startTime : 0);
  lapCount++;
  const li = document.createElement('li');
  li.className = 'lap-item';
  li.innerHTML = `<span class="label">Lap ${lapCount}</span><span>${format(current)}</span>`;
  lapsEl.prepend(li); // newest lap on top
}

// Wire up button events
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

// Initial render
render();
