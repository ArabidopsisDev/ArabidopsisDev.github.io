(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let activeTheme = 'light';
  try { if (localStorage.getItem('theme') === 'dark') activeTheme = 'dark'; } catch {}
  root.dataset.theme = activeTheme;
  let menuOpen = false;
  const visibleReveals = new WeakSet();
  let revealObserver;

  function restoreRuntimeUI() {
    // Eleventy morphs server HTML and removes runtime root attributes. Restore
    // them before paint so mobile navigation never falls into its no-JS layout.
    if (!root.classList.contains('js')) root.classList.add('js');
    if (root.dataset.theme !== activeTheme) root.dataset.theme = activeTheme;
    const nav = document.querySelector('[data-nav]');
    const navButton = document.querySelector('[data-nav-toggle]');
    if (nav && nav.classList.contains('is-open') !== menuOpen) nav.classList.toggle('is-open', menuOpen);
    if (navButton && navButton.getAttribute('aria-expanded') !== String(menuOpen)) navButton.setAttribute('aria-expanded', String(menuOpen));
    const themeButton = document.querySelector('[data-theme-toggle]');
    const themeLabel = activeTheme === 'dark' ? '切换浅色模式' : '切换深色模式';
    if (themeButton && themeButton.getAttribute('aria-label') !== themeLabel) themeButton.setAttribute('aria-label', themeLabel);
    syncHeader();
    for (const node of document.querySelectorAll('.reveal')) {
      if (visibleReveals.has(node) || !revealObserver) {
        if (!node.classList.contains('is-visible')) node.classList.add('is-visible');
      } else revealObserver.observe(node);
    }
  }

  // Delegation also works when a live update replaces a button or navigation link.
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('[data-theme-toggle]')) {
      activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', activeTheme); } catch {}
    } else if (event.target.closest('[data-nav-toggle]')) menuOpen = !menuOpen;
    else if (event.target.closest('[data-nav] a')) menuOpen = false;
    else return;
    restoreRuntimeUI();
  });

  function syncHeader() {
    const header = document.querySelector('[data-header]');
    const scrolled = window.scrollY > 12;
    if (header && header.classList.contains('is-scrolled') !== scrolled) header.classList.toggle('is-scrolled', scrolled);
  }
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleReveals.add(entry.target);
          if (!entry.target.classList.contains('is-visible')) entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(node => revealObserver.observe(node));
  } else {
    reveals.forEach(node => node.classList.add('is-visible'));
  }
  new MutationObserver(records => {
    if (records.some(record => record.target === root
      || (record.type === 'childList' && [...record.addedNodes].some(node => node.nodeType === 1))
      || record.target.matches?.('[data-nav], [data-nav-toggle], [data-theme-toggle], .reveal'))) restoreRuntimeUI();
  }).observe(root, { attributes: true, attributeFilter: ['class', 'data-theme', 'aria-expanded', 'aria-label'], childList: true, subtree: true });

  const search = document.querySelector('[data-blog-search]');
  const chips = [...document.querySelectorAll('[data-blog-filter]')];
  const cards = [...document.querySelectorAll('[data-blog-card]')];
  const empty = document.querySelector('[data-blog-empty]');
  let activeTag = 'all';
  let searchIndex = new Map();

  const normalize = value => (value || '').toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();

  const filterPosts = () => {
    const query = normalize(search?.value);
    let visible = 0;
    cards.forEach(card => {
      const matchesTag = activeTag === 'all' || card.dataset.tags?.split(',').includes(activeTag);
      const indexedText = searchIndex.get(card.dataset.url || '');
      const matchesQuery = !query || normalize(indexedText || card.textContent).includes(query);
      card.hidden = !(matchesTag && matchesQuery);
      if (!card.hidden) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  };
  search?.addEventListener('input', filterPosts);
  chips.forEach(chip => chip.addEventListener('click', () => {
    activeTag = chip.dataset.blogFilter || 'all';
    chips.forEach(item => item.classList.toggle('is-active', item === chip));
    filterPosts();
  }));

  if (search?.dataset.searchIndex) {
    fetch(search.dataset.searchIndex)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Search index unavailable')))
      .then(posts => {
        searchIndex = new Map(posts.map(post => [post.url, [post.title, post.description, post.tags.join(' '), post.content].join(' ')]));
        filterPosts();
      })
      .catch(() => { searchIndex = new Map(); });
  }

  const articleBody = document.querySelector('[data-article-body]');
  const toc = document.querySelector('[data-toc]');
  const tocList = document.querySelector('[data-toc-list]');
  if (articleBody && toc && tocList) {
    const headings = [...articleBody.querySelectorAll('h2[id], h3[id], h4[id]')];
    if (headings.length) {
      const fragment = document.createDocumentFragment();
      headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        if (heading.tagName === 'H3') link.className = 'toc-level-3';
        if (heading.tagName === 'H4') link.className = 'toc-level-4';
        fragment.appendChild(link);
      });
      tocList.appendChild(fragment);
    } else {
      toc.hidden = true;
    }
  }

  document.querySelectorAll('.prose pre').forEach(pre => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = '复制';
    button.setAttribute('aria-label', '复制代码');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        button.textContent = '已复制';
        window.setTimeout(() => { button.textContent = '复制'; }, 1600);
      } catch {
        button.textContent = '复制失败';
      }
    });
    pre.appendChild(button);
  });

  const progress = document.querySelector('[data-reading-progress]');
  if (progress && articleBody) {
    const updateProgress = () => {
      const start = articleBody.getBoundingClientRect().top + window.scrollY;
      const end = start + articleBody.offsetHeight - window.innerHeight;
      const ratio = end <= start ? 1 : Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      progress.style.transform = `scaleX(${ratio})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }
})();
