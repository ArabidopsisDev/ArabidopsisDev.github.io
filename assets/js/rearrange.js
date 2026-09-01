(() => {
  const storageKey = 'arabidopsis-rearrange-progress-v1';
  const totalNodes = 30;

  const readState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        visited: Array.isArray(parsed.visited) ? [...new Set(parsed.visited)] : [],
        trail: Array.isArray(parsed.trail) ? parsed.trail.slice(-80) : [],
      };
    } catch {
      return { visited: [], trail: [] };
    }
  };

  const state = readState();
  const currentSlug = document.body.dataset.storySlug;
  if (currentSlug) {
    if (!state.visited.includes(currentSlug)) state.visited.push(currentSlug);
    if (state.trail.at(-1) !== currentSlug) state.trail.push(currentSlug);
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  const updateProgress = () => {
    document.querySelectorAll('[data-story-progress]').forEach((element) => {
      element.textContent = state.visited.length
        ? `已经过 ${state.visited.length} / ${totalNodes} 个节点。访问记录仅保存在当前浏览器。`
        : '尚未进入任何节点。访问记录仅保存在当前浏览器。';
    });

    document.querySelectorAll('[data-map-node]').forEach((element) => {
      element.classList.toggle('is-visited', state.visited.includes(element.dataset.mapNode));
    });

    document.querySelectorAll('[data-map-track]').forEach((section) => {
      const track = section.dataset.mapTrack;
      const slugs = [...section.querySelectorAll('[data-map-node]')].map((item) => item.dataset.mapNode);
      const count = slugs.filter((slug) => state.visited.includes(slug)).length;
      const label = document.querySelector(`[data-track-visited="${track}"]`);
      if (label) label.textContent = `${count} / ${slugs.length}`;
      document.querySelector(`[data-track-card="${track}"]`)?.classList.toggle('has-progress', count > 0);
    });
  };

  updateProgress();

  document.querySelectorAll('[data-story-back]').forEach((button) => {
    button.addEventListener('click', () => {
      if (history.length > 1) history.back();
      else location.href = document.body.dataset.storyEntry;
    });
  });

  document.querySelectorAll('[data-story-reset]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem(storageKey);
      location.href = document.body.dataset.storyEntry;
    });
  });
})();
