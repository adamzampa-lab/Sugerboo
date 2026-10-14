
const startButton = document.getElementById("startButton");
const letterSection = document.getElementById("letter");
const envelope = document.getElementById("envelope");
const letterPaper = document.getElementById("letterPaper");
const secretButton = document.getElementById("secretButton");
const secretReveal = document.getElementById("secretReveal");
const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");

startButton.addEventListener("click", () => {
  letterSection.scrollIntoView({ behavior: "smooth" });
});


envelope.addEventListener("click", () => {
  const isOpening = letterPaper.hidden;

  letterPaper.hidden = !isOpening;
  envelope.setAttribute("aria-expanded", String(isOpening));

  envelope.querySelector(".envelope-label").textContent =
    isOpening
      ? "Your letter is open ♡"
      : "Tap to open your letter";

  if (isOpening) {
    // Restart the animation every time the letter opens
    letterPaper.classList.remove("letter-opening");
    void letterPaper.offsetWidth;
    letterPaper.classList.add("letter-opening");

    letterPaper.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  } else {
    letterPaper.classList.remove("letter-opening");
  }
});



const notesRevealButton = document.getElementById("notesRevealButton");
const notesContainer = document.getElementById("notesContainer");

notesRevealButton.addEventListener("click", () => {
  notesContainer.hidden = false;
  notesRevealButton.textContent = "Here Are Your Little Love Notes ♡";
  notesRevealButton.disabled = true;

  notesContainer.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

document.querySelectorAll(".note").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("noteMessage").textContent =
      button.dataset.message;
  });
});


secretButton.addEventListener("click", () => {
  secretReveal.hidden = false;
  secretButton.textContent = "Your surprise is open ♡";
  secretButton.disabled = true;
  secretReveal.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// A gentle original synthesized melody. Browsers require a user tap to start audio.
let audioContext;
let musicTimer;
let noteIndex = 0;
let isPlaying = false;

const melody = [
  [261.63, 329.63, 392.00],
  [293.66, 349.23, 440.00],
  [261.63, 329.63, 392.00],
  [220.00, 293.66, 349.23],
  [246.94, 329.63, 392.00],
  [220.00, 293.66, 349.23],
  [196.00, 261.63, 329.63],
  [220.00, 293.66, 349.23]
];

function playChord() {
  if (!isPlaying || !audioContext) return;

  const chord = melody[noteIndex % melody.length];
  const now = audioContext.currentTime;

  chord.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025 / (index + 1), now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.45);
  });

  noteIndex++;
}

async function toggleMusic() {
  if (isPlaying) {
    isPlaying = false;
    clearInterval(musicTimer);
    if (audioContext) await audioContext.suspend();
    musicButton.textContent = "♫ Play romantic music";
    musicButton.setAttribute("aria-pressed", "false");
    musicStatus.textContent = "Paused for a little moment";
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    musicStatus.textContent = "This browser does not support the music player.";
    return;
  }

  audioContext ||= new AudioContextClass();
  await audioContext.resume();

  isPlaying = true;
  playChord();
  musicTimer = setInterval(playChord, 1500);
  musicButton.textContent = "Ⅱ Pause music";
  musicButton.setAttribute("aria-pressed", "true");
  musicStatus.textContent = "A little melody for you ♡";
}

musicButton.addEventListener("click", toggleMusic);
