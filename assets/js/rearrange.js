(() => {
  const key = "arabidopsis-rearrange-edition-v2";
  const allStops = [...document.querySelectorAll("[data-map-node]")];
  const slug = document.body.dataset.storySlug;
  const knownIds = new Set((document.body.dataset.storyIds || "").split(",").filter(Boolean));
  let visited = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(saved)) visited = [...new Set(saved.filter((item) => typeof item === "string"))];
  } catch { /* A damaged local record should not block reading. */ }
  if (slug && !visited.includes(slug)) {
    visited.push(slug);
    try { localStorage.setItem(key, JSON.stringify(visited)); } catch { /* Private mode can disable storage. */ }
  }
  for (const stop of allStops) stop.classList.toggle("is-visited", visited.includes(stop.dataset.mapNode));
  document.querySelectorAll("[data-story-progress]").forEach((element) => {
    const count = visited.filter((id) => knownIds.has(id)).length;
    element.textContent = count ? `在这里回看过 ${count} 段生活。足迹留在当前浏览器。` : "还没有留下足迹。从任何一处进入都可以。";
  });
  document.querySelectorAll("[data-story-reset]").forEach((button) => button.addEventListener("click", () => {
    visited = [];
    try { localStorage.removeItem(key); } catch { /* Continue without persistence. */ }
    for (const stop of allStops) stop.classList.remove("is-visited");
    document.querySelectorAll("[data-story-progress]").forEach((element) => { element.textContent = "还没有留下足迹。从任何一处进入都可以。"; });
  }));

  const atlas = document.querySelector("[data-atlas-map]");
  if (atlas) {
    const points = [...atlas.querySelectorAll("[data-map-node]")];
    const edges = [...atlas.querySelectorAll("[data-atlas-edge]")];
    const controls = [...document.querySelectorAll("[data-atlas-lens]")];
    const status = document.querySelector("[data-lens-status]");
    const captionTitle = document.querySelector("[data-atlas-caption-title]");
    const captionNote = document.querySelector("[data-atlas-caption-note]");
    const highlight = (point) => {
      const id = point?.dataset.mapNode;
      const related = new Set();
      edges.forEach((edge) => {
        const active = !!id && (edge.dataset.from === id || edge.dataset.to === id);
        edge.classList.toggle("is-active", active);
        if (active) { related.add(edge.dataset.from); related.add(edge.dataset.to); }
      });
      points.forEach((star) => star.classList.toggle("is-connected", related.has(star.dataset.mapNode)));
      if (captionTitle) captionTitle.textContent = point?.dataset.atlasTitle || "从一个让你在意的问题出发";
      if (captionNote) captionNote.textContent = point
        ? point.dataset.atlasNote + (point.dataset.atlasReading ? " 当前回看：" + point.dataset.atlasReading : "")
        : "拖动图面探索；也可以从上方目录找到一段经历。";
    };
    points.forEach((point) => {
      point.addEventListener("pointerenter", () => highlight(point));
      point.addEventListener("focus", () => highlight(point));
      point.addEventListener("pointerleave", () => highlight(points.find((star) => star === document.activeElement)));
      point.addEventListener("blur", () => highlight(null));
    });
    controls.forEach((button) => button.addEventListener("click", () => {
      const lens = button.dataset.atlasLens;
      controls.forEach((control) => {
        const selected = control === button;
        control.classList.toggle("is-selected", selected);
        control.setAttribute("aria-pressed", String(selected));
      });
      points.forEach((point) => point.classList.toggle("is-dim", lens !== "all" && !point.dataset.lenses.split(",").includes(lens)));
      if (status) status.textContent = lens === "all"
        ? "这里显示当前回看时的归属；新的经历到来后，它也可以改变。"
        : "亮起的故事回应这个视角。其余的经历仍在原处，也可以随时走过去。";
    }));
  }

  const fragments = [...document.querySelectorAll("[data-fragment]")];
  if (fragments.length && "IntersectionObserver" in window) {
    const rail = [...document.querySelectorAll(".scene-rail a")];
    const progress = document.querySelector("[data-scene-progress]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = fragments.indexOf(entry.target);
        rail.forEach((link, linkIndex) => link.classList.toggle("is-current", linkIndex === index));
        if (progress) progress.textContent = `${String(index + 1).padStart(2, "0")} / ${String(fragments.length).padStart(2, "0")}`;
      }
    }, { rootMargin: "-12% 0px -60% 0px" });
    fragments.forEach((fragment) => observer.observe(fragment));
  }

  // A tiny optional soundscape, synthesized locally. It needs a click and
  // never downloads audio or starts on its own.
  const ambientButton = document.querySelector("[data-ambient-toggle]");
  if (!ambientButton) return;
  let audioContext;
  let master;
  let voices = [];
  let active = false;
  const setLabel = () => {
    ambientButton.setAttribute("aria-pressed", String(active));
    ambientButton.setAttribute("aria-label", active ? "暂停空灵背景音乐" : "播放空灵背景音乐");
    ambientButton.textContent = active ? "♫ 氛围音：开" : "♫ 氛围音：关";
  };
  const stop = () => {
    if (!audioContext || !master) return;
    master.gain.cancelScheduledValues(audioContext.currentTime);
    master.gain.setTargetAtTime(0, audioContext.currentTime, .35);
    const closing = voices;
    voices = [];
    window.setTimeout(() => {
      closing.forEach((voice) => { try { voice.stop(); } catch { /* Already stopped. */ } });
      if (!active) audioContext.suspend().catch(() => {});
    }, 1800);
    active = false;
    setLabel();
  };
  ambientButton.addEventListener("click", async () => {
    if (active) { stop(); return; }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { ambientButton.textContent = "此浏览器不支持氛围音"; ambientButton.disabled = true; return; }
    try {
      audioContext ||= new AudioContextClass();
      await audioContext.resume();
      master = audioContext.createGain();
      master.gain.setValueAtTime(0, audioContext.currentTime);
      master.gain.linearRampToValueAtTime(.055, audioContext.currentTime + 2.5);
      const filter = audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 580;
      master.connect(filter).connect(audioContext.destination);
      for (const [frequency, gain, type] of [[130.81,.36,"sine"],[196,.19,"sine"],[261.63,.16,"triangle"],[392,.07,"sine"]]) {
        const oscillator = audioContext.createOscillator();
        const voiceGain = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.detune.value = Math.random() * 8 - 4;
        voiceGain.gain.value = gain;
        oscillator.connect(voiceGain).connect(master);
        oscillator.start();
        voices.push(oscillator);
      }
      active = true;
      setLabel();
    } catch {
      ambientButton.textContent = "无法播放氛围音";
      ambientButton.disabled = true;
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && active) stop();
  });
  setLabel();
})();
