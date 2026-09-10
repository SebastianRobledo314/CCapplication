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
