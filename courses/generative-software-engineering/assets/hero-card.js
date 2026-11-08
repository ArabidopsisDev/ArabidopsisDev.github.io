(() => {
  const region = document.querySelector(".sheet-interaction");
  const card = region?.querySelector(".engineering-sheet");
  if (!card) return;

  const motion = window.matchMedia(
    "(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );
  let frame = 0;
  let angle = 0;

  function followPointer(event) {
    if (!motion.matches || event.pointerType === "touch") return;
    const bounds = region.getBoundingClientRect();
    if (bounds.width === 0) return;
    const position = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    angle = position * 3.5;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      card.style.setProperty("--sheet-angle", `${angle.toFixed(2)}deg`);
      frame = 0;
    });
  }

  function reset() {
    window.cancelAnimationFrame(frame);
    frame = 0;
    card.style.removeProperty("--sheet-angle");
  }

  region.addEventListener("pointerenter", followPointer);
  region.addEventListener("pointermove", followPointer);
  region.addEventListener("pointerleave", reset);
  region.addEventListener("pointercancel", reset);
  motion.addEventListener("change", reset);
  window.addEventListener("blur", reset);
})();
