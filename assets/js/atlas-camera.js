(() => {
  const viewport = document.querySelector("[data-atlas-map]");
  const world = viewport?.querySelector("[data-atlas-world]");
  if (!viewport || !world) return;
  const points = [...world.querySelectorAll("[data-map-node]")];
  const byId = new Map(points.map((point) => [point.dataset.mapNode, point]));
  const zoomLabel = document.querySelector("[data-atlas-zoom]");
  const worldWidth = Number(viewport.dataset.worldWidth);
  const worldHeight = Number(viewport.dataset.worldHeight);
  let width = viewport.clientWidth, height = viewport.clientHeight;
  let camera = { x: 0, y: 0, scale: .75 };
  let frame = 0;
  let suppressClickUntil = 0;
  const pointers = new Map();
  let pinch;
  let last;
  let dragged = false;

  const fitScale = () => Math.min(width / worldWidth, height / worldHeight) * .91;
  const clamp = (scale) => Math.max(Math.min(.18, fitScale()), Math.min(2.2, scale));
  function render() {
    world.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`;
    viewport.dataset.scale = String(camera.scale);
    viewport.classList.toggle("is-overview", camera.scale < .48);
    if (zoomLabel) zoomLabel.textContent = Math.round(camera.scale * 100) + "%";
    frame = 0;
  }
  const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
  function centerOn(point, scale = camera.scale) {
    if (!point) return;
    camera.scale = clamp(scale);
    camera.x = width / 2 - Number(point.dataset.nodeX) * camera.scale;
    camera.y = height / 2 - Number(point.dataset.nodeY) * camera.scale - 18;
    requestRender();
  }
  function zoomAt(scale, x = width / 2, y = height / 2) {
    const worldX = (x - camera.x) / camera.scale;
    const worldY = (y - camera.y) / camera.scale;
    camera.scale = clamp(scale);
    camera.x = x - worldX * camera.scale;
    camera.y = y - worldY * camera.scale;
    requestRender();
  }
  function fit() {
    camera.scale = clamp(fitScale());
    camera.x = (width - worldWidth * camera.scale) / 2;
    camera.y = (height - worldHeight * camera.scale) / 2;
    requestRender();
  }
  function home() {
    if (width < 640) { centerOn(byId.get(viewport.dataset.homeFocus) || points[0], .85); return; }
    camera.scale = .75;
    camera.x = width / 2 - Number(viewport.dataset.homeX) * camera.scale;
    camera.y = height / 2 - Number(viewport.dataset.homeY) * camera.scale;
    requestRender();
  }
  home();
  render();

  function beginPinch() {
    const [a, b] = [...pointers.values()];
    if (!a || !b) return;
    const rect = viewport.getBoundingClientRect();
    const x = (a.x + b.x) / 2 - rect.left, y = (a.y + b.y) / 2 - rect.top;
    pinch = { distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)), scale: camera.scale, worldX: (x - camera.x) / camera.scale, worldY: (y - camera.y) / camera.scale };
  }
  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    last = { x: event.clientX, y: event.clientY };
    if (pointers.size === 1) dragged = false;
    if (pointers.size === 2) beginPinch();
    event.target.setPointerCapture?.(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    const previous = pointers.get(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const rect = viewport.getBoundingClientRect();
      camera.scale = clamp(pinch.scale * Math.hypot(b.x - a.x, b.y - a.y) / pinch.distance);
      camera.x = (a.x + b.x) / 2 - rect.left - pinch.worldX * camera.scale;
      camera.y = (a.y + b.y) / 2 - rect.top - pinch.worldY * camera.scale;
      dragged = true;
    } else {
      const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
      if (!dragged && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 5) return;
      if (!dragged) {
        camera.x += event.clientX - last.x;
        camera.y += event.clientY - last.y;
      } else { camera.x += dx; camera.y += dy; }
      dragged = true;
    }
    viewport.classList.toggle("is-panning", dragged);
    if (dragged) event.preventDefault();
    requestRender();
  });
  function finish(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (dragged) suppressClickUntil = Date.now() + 350;
    if (pointers.size < 2) pinch = undefined;
    if (pointers.size === 1) last = [...pointers.values()][0];
    if (!pointers.size) viewport.classList.remove("is-panning");
  }
  viewport.addEventListener("pointerup", finish);
  viewport.addEventListener("pointercancel", finish);
  viewport.addEventListener("lostpointercapture", finish);
  viewport.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  viewport.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoomAt(camera.scale * Math.exp(-event.deltaY * .003), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  viewport.addEventListener("keydown", (event) => {
    if (event.target !== viewport) return;
    const step = event.shiftKey ? 190 : 90;
    if (event.key === "ArrowLeft") camera.x += step;
    else if (event.key === "ArrowRight") camera.x -= step;
    else if (event.key === "ArrowUp") camera.y += step;
    else if (event.key === "ArrowDown") camera.y -= step;
    else if (event.key === "+" || event.key === "=") zoomAt(camera.scale * 1.25);
    else if (event.key === "-") zoomAt(camera.scale / 1.25);
    else if (event.key === "0") fit();
    else if (event.key === "Home") home();
    else return;
    event.preventDefault();
    requestRender();
  });
  viewport.addEventListener("focusin", (event) => {
    const point = event.target.closest("[data-map-node]");
    if (!point || pointers.size) return;
    const x = camera.x + Number(point.dataset.nodeX) * camera.scale;
    const y = camera.y + Number(point.dataset.nodeY) * camera.scale;
    if (camera.scale < .48 || x < 130 || x > width - 130 || y < 60 || y > height - 110) centerOn(point, Math.max(.85, camera.scale));
  });
  document.querySelector("[data-atlas-zoom-in]")?.addEventListener("click", () => zoomAt(camera.scale * 1.25));
  document.querySelector("[data-atlas-zoom-out]")?.addEventListener("click", () => zoomAt(camera.scale / 1.25));
  document.querySelector("[data-atlas-fit]")?.addEventListener("click", fit);
  document.querySelector("[data-atlas-home]")?.addEventListener("click", home);
  document.querySelectorAll("[data-atlas-lens]").forEach((control) => control.addEventListener("click", () => {
    const lens = control.dataset.atlasLens;
    if (lens === "all") { home(); return; }
    const matching = points.filter((point) => point.dataset.lenses.split(",")[0] === lens);
    if (!matching.length) return;
    const centerX = matching.reduce((sum, point) => sum + Number(point.dataset.nodeX), 0) / matching.length;
    const centerY = matching.reduce((sum, point) => sum + Number(point.dataset.nodeY), 0) / matching.length;
    if (width < 640) {
      const nearest = [...matching].sort((a, b) => Math.hypot(Number(a.dataset.nodeX)-centerX, Number(a.dataset.nodeY)-centerY)-Math.hypot(Number(b.dataset.nodeX)-centerX, Number(b.dataset.nodeY)-centerY))[0];
      centerOn(nearest, .85);
      return;
    }
    camera.scale = .75;
    camera.x = width / 2 - centerX * camera.scale;
    camera.y = height / 2 - centerY * camera.scale;
    requestRender();
  }));
  document.querySelector("[data-atlas-jump]")?.addEventListener("change", (event) => {
    const point = byId.get(event.target.value);
    if (!point) return;
    centerOn(point, Math.max(.85, camera.scale));
    point.focus({ preventScroll: true });
  });
  new ResizeObserver(() => {
    const centerX = (width / 2 - camera.x) / camera.scale;
    const centerY = (height / 2 - camera.y) / camera.scale;
    width = viewport.clientWidth; height = viewport.clientHeight;
    camera.x = width / 2 - centerX * camera.scale;
    camera.y = height / 2 - centerY * camera.scale;
    requestRender();
  }).observe(viewport);
})();
