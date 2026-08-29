(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('course-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) root.dataset.theme = 'dark';

  themeButton?.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('course-theme', dark ? 'light' : 'dark');
  });

  const header = document.querySelector('[data-header]');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const data = globalThis.COURSE_DATA;
  const outline = document.querySelector('[data-course-outline]');
  const status = document.querySelector('[data-course-status]');
  const search = document.querySelector('[data-course-search]');

  if (!data || !outline) {
    if (status) status.textContent = '课程清单读取失败，请重新生成 assets/course-data.js。';
    return;
  }

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const statusClass = (value) => {
    if (value.includes('已发布')) return 'published';
    if (value.includes('已制作')) return 'produced';
    if (value.includes('预览')) return 'preview';
    return 'planned';
  };

  const chapterHtml = data.chapters.map((chapter, chapterIndex) => {
    const published = chapter.lessons.filter((lesson) => lesson.status.includes('已发布')).length;
    const produced = chapter.lessons.filter((lesson) => lesson.status.includes('已制作')).length;
    const lessons = chapter.lessons.map((lesson) => `
      <li class="lesson-item" data-lesson data-search="${escapeHtml(`${lesson.number} ${lesson.title} ${lesson.description} ${lesson.status}`.toLowerCase())}">
        <span class="lesson-number">${String(lesson.number).padStart(3, '0')}</span>
        <div class="lesson-copy"><strong>${escapeHtml(lesson.title)}</strong><p>${escapeHtml(lesson.description)}</p></div>
        <div class="lesson-meta"><span>${escapeHtml(lesson.duration)}</span><span class="status-pill ${statusClass(lesson.status)}">${escapeHtml(lesson.status)}</span></div>
      </li>`).join('');
    return `
      <details class="chapter-card" ${chapterIndex === 0 ? 'open' : ''} data-chapter data-search="${escapeHtml(`${chapter.title} ${chapter.lessons.map((lesson) => lesson.title).join(' ')}`.toLowerCase())}">
        <summary>
          <span class="chapter-number">CH ${String(chapter.number).padStart(2, '0')}</span>
          <div class="chapter-title"><h3>${escapeHtml(chapter.title)}</h3><p>第 ${String(chapter.start).padStart(3, '0')}–${String(chapter.end).padStart(3, '0')} 节 · ${chapter.lessons.length} 节</p></div>
          <span class="chapter-meta">${published ? `${published} 已发布` : ''}${published && produced ? ' · ' : ''}${produced ? `${produced} 已制作` : ''}</span>
        </summary>
        <ol class="lesson-list">${lessons}</ol>
      </details>`;
  }).join('');
  outline.innerHTML = chapterHtml;

  const chapters = [...outline.querySelectorAll('[data-chapter]')];
  const setStatus = (visibleLessons = data.stats.lessons) => {
    if (!status) return;
    status.textContent = `${data.stats.chapters} 章 · ${visibleLessons} / ${data.stats.lessons} 节 · ${data.stats.published} 节已发布 · ${data.stats.produced} 节已制作`;
  };
  setStatus();

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    let visibleLessons = 0;
    chapters.forEach((chapter) => {
      const lessons = [...chapter.querySelectorAll('[data-lesson]')];
      let matches = 0;
      lessons.forEach((lesson) => {
        const visible = !query || lesson.dataset.search.includes(query);
        lesson.hidden = !visible;
        if (visible) matches += 1;
      });
      const chapterMatch = !query || chapter.dataset.search.includes(query);
      const visible = chapterMatch || matches > 0;
      chapter.hidden = !visible;
      if (query && visible) chapter.open = true;
      if (chapterMatch && query && matches === 0) {
        lessons.forEach((lesson) => { lesson.hidden = false; });
        matches = lessons.length;
      }
      if (visible) visibleLessons += matches;
    });
    setStatus(visibleLessons);
  });

  document.querySelector('[data-expand-all]')?.addEventListener('click', () => {
    chapters.filter((chapter) => !chapter.hidden).forEach((chapter) => { chapter.open = true; });
  });
  document.querySelector('[data-collapse-all]')?.addEventListener('click', () => {
    chapters.forEach((chapter) => { chapter.open = false; });
  });
})();
