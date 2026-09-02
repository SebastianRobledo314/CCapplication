document.querySelectorAll(".folder-cover").forEach((button) => {
  button.addEventListener("click", () => {
    const folder = button.closest(".folder");
    const isOpen = folder.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});
