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

document.querySelectorAll(".folder-cover").forEach((button) => {
  button.addEventListener("click", () => {
    const folder = button.closest(".folder");
    const isOpen = folder.classList.contains("is-open");

    document.querySelectorAll(".folder.is-open").forEach((openFolder) => {
      if (openFolder !== folder) {
        openFolder.classList.remove("is-open");
        openFolder.querySelector(".folder-cover").setAttribute("aria-expanded", "false");
      }
    });

    folder.classList.toggle("is-open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));

    if (!isOpen) {
      folder.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll(".folder-inside").forEach((inside) => {
  inside.addEventListener("click", () => {
    const folder = inside.closest(".folder");
    if (!folder.classList.contains("is-open")) return;
    folder.classList.remove("is-open");
    folder.querySelector(".folder-cover").setAttribute("aria-expanded", "false");
  });
});
