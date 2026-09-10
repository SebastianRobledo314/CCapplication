const catPhotos = ["assets/Oatmeal.jpeg", "assets/Raven.jpeg", "assets/Zena.jpeg"];
const shuffledPhotos = [...catPhotos].sort(() => Math.random() - 0.5);
document.querySelectorAll(".cat-photo--random").forEach((img, index) => {
  img.src = shuffledPhotos[index];
});

const mysteryLabels = ["Open?", "Click me?", "Peek?"];
const shuffledLabels = [...mysteryLabels].sort(() => Math.random() - 0.5);
document.querySelectorAll(".mystery-label").forEach((label, index) => {
  label.textContent = shuffledLabels[index];
});

const leonFolder = document.getElementById("content-cat4")?.closest(".folder");
const leonSound = new Audio("leon_audio.mp3");

const catSoundFolders = ["content-cat1", "content-cat2", "content-cat3"]
  .map((id) => document.getElementById(id)?.closest(".folder"))
  .filter(Boolean);
const catSound = new Audio("Cat%20meow%20sound%20effect.mp3");
catSound.preservesPitch = false;
catSound.mozPreservesPitch = false;
catSound.webkitPreservesPitch = false;

const responseFolders = [
  "content-ans1", "content-ans2", "content-ans3", "content-ans4",
  "content-ans5", "content-ans6", "content-ans7", "content-ans8",
]
  .map((id) => document.getElementById(id)?.closest(".folder"))
  .filter(Boolean);
const shuffleSounds = [
  new Audio("card%20shuffle%201.mp3"),
  new Audio("Card%20shuffle%202.mp3"),
  new Audio("Card%20shuffle%203.mp3"),
];

function playShuffleSound() {
  const sound = shuffleSounds[Math.floor(Math.random() * shuffleSounds.length)];
  sound.currentTime = 0;
  sound.play();
}

function openFolder(folder) {
  folder.classList.add("is-open");
  folder.querySelector(".folder-cover").setAttribute("aria-expanded", "true");
  const inside = folder.querySelector(".folder-inside");
  inside.style.maxHeight = inside.scrollHeight + "px";
  if (folder === leonFolder) {
    leonSound.currentTime = 0;
    leonSound.play();
  }
  if (catSoundFolders.includes(folder)) {
    const pitches = [0.5, 1, 1.8];
    catSound.currentTime = 0;
    catSound.playbackRate = pitches[Math.floor(Math.random() * pitches.length)];
    catSound.play();
  }
  if (responseFolders.includes(folder)) {
    playShuffleSound();
  }
}

function closeFolder(folder) {
  folder.classList.remove("is-open");
  folder.querySelector(".folder-cover").setAttribute("aria-expanded", "false");
  folder.querySelector(".folder-inside").style.maxHeight = "0px";
  if (folder === leonFolder) {
    leonSound.pause();
    leonSound.currentTime = 0;
  }
  if (catSoundFolders.includes(folder)) {
    catSound.pause();
    catSound.currentTime = 0;
  }
  if (responseFolders.includes(folder)) {
    playShuffleSound();
  }
}

document.querySelectorAll(".folder-cover").forEach((button) => {
  button.addEventListener("click", () => {
    const folder = button.closest(".folder");
    const isOpen = folder.classList.contains("is-open");

    document.querySelectorAll(".folder.is-open").forEach((openFolder) => {
      if (openFolder !== folder) {
        closeFolder(openFolder);
      }
    });

    if (isOpen) {
      closeFolder(folder);
    } else {
      openFolder(folder);
      folder.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll(".folder-inside").forEach((inside) => {
  inside.addEventListener("click", () => {
    const folder = inside.closest(".folder");
    if (!folder.classList.contains("is-open")) return;
    closeFolder(folder);
  });
});

/* ---------- record player ---------- */

const recordPlayer = document.getElementById("record-player");
const recordDisc = document.getElementById("record-disc");
const songPicker = document.getElementById("song-picker");

// Add a sample clip path once you have one; the bubble still works (silently) without it.
const tracks = [
  { cover: "KIDs.jpeg", src: "the_spins.mp3", label: "The Spins" },
  { cover: "AFD.jpeg", src: "my_mitchelle.mp3", label: "My Michelle" },
  { cover: "aintno.jpeg", src: "aintno.mp3", label: "Ain't No Mountain High Enough" },
];

tracks.forEach((track, index) => {
  const bubble = document.createElement("button");
  bubble.className = "song-bubble";
  bubble.style.backgroundImage = `url('${track.cover}')`;
  bubble.setAttribute("aria-label", `Play ${track.label} sample`);
  bubble.addEventListener("click", (e) => {
    e.stopPropagation();
    selectTrack(index);
  });
  songPicker.appendChild(bubble);
});

let currentAudio = null;
let isPlaying = false;
let isDragging = false;
let didDrag = false;
let rotation = 0;
let lastAngle = 0;
let spinFrameId = null;

function setRotation(deg) {
  rotation = deg;
  recordDisc.style.transform = `rotate(${deg}deg)`;
}

function spinStep() {
  if (isPlaying && !isDragging) {
    setRotation(rotation + 2.4);
    spinFrameId = requestAnimationFrame(spinStep);
  } else {
    spinFrameId = null;
  }
}

function startSpin() {
  if (spinFrameId === null) {
    spinFrameId = requestAnimationFrame(spinStep);
  }
}

function openPicker() {
  songPicker.classList.add("is-open");
  songPicker.setAttribute("aria-hidden", "false");
}

function closePicker() {
  songPicker.classList.remove("is-open");
  songPicker.setAttribute("aria-hidden", "true");
}

function selectTrack(index) {
  const track = tracks[index];
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (track.src) {
    currentAudio = new Audio(track.src);
    currentAudio.addEventListener("ended", () => {
      stopSong();
    });
    currentAudio.play().catch(() => {});
  }
  isPlaying = true;
  recordPlayer.setAttribute("aria-pressed", "true");
  startSpin();
  closePicker();
}

function stopSong() {
  if (currentAudio) {
    currentAudio.pause();
  }
  isPlaying = false;
  recordPlayer.setAttribute("aria-pressed", "false");
}

function angleFromCenter(clientX, clientY) {
  const rect = recordPlayer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
}

function normalizeAngleDelta(delta) {
  let normalized = delta;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  return normalized;
}

recordPlayer.addEventListener("pointerdown", (e) => {
  isDragging = true;
  didDrag = false;
  lastAngle = angleFromCenter(e.clientX, e.clientY);
  recordPlayer.setPointerCapture(e.pointerId);
  if (currentAudio) currentAudio.pause();
  e.preventDefault();
});

recordPlayer.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const angle = angleFromCenter(e.clientX, e.clientY);
  const delta = normalizeAngleDelta(angle - lastAngle);
  if (Math.abs(delta) > 0.5) didDrag = true;
  lastAngle = angle;
  setRotation(rotation + delta);

  if (currentAudio && !isNaN(currentAudio.duration)) {
    const scrubSeconds = delta / 90;
    const next = currentAudio.currentTime + scrubSeconds;
    currentAudio.currentTime = Math.min(Math.max(next, 0), currentAudio.duration);
    currentAudio.play().catch(() => {});
  }
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  if (isPlaying) {
    if (currentAudio) currentAudio.play().catch(() => {});
    startSpin();
  }
}

recordPlayer.addEventListener("pointerup", endDrag);
recordPlayer.addEventListener("pointercancel", endDrag);

recordPlayer.addEventListener("click", () => {
  if (didDrag) {
    didDrag = false;
    return;
  }
  if (isPlaying) {
    stopSong();
    closePicker();
  } else if (songPicker.classList.contains("is-open")) {
    closePicker();
  } else {
    openPicker();
  }
});

document.addEventListener("click", (e) => {
  if (!songPicker.contains(e.target) && !recordPlayer.contains(e.target)) {
    closePicker();
  }
});

recordPlayer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    recordPlayer.click();
  }
});
