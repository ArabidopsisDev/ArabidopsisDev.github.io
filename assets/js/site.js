(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) root.dataset.theme = 'dark';

  const themeButton = document.querySelector('[data-theme-toggle]');
  themeButton?.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('theme', dark ? 'light' : 'dark');
    themeButton.setAttribute('aria-label', dark ? '切换深色模式' : '切换浅色模式');
  });

  const navButton = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  navButton?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    navButton.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navButton?.setAttribute('aria-expanded', 'false');
  }));

  const header = document.querySelector('[data-header]');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(node => observer.observe(node));
  } else {
    reveals.forEach(node => node.classList.add('is-visible'));
  }

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
    const headings = [...articleBody.querySelectorAll('h2[id], h3[id]')];
    if (headings.length) {
      const fragment = document.createDocumentFragment();
      headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        if (heading.tagName === 'H3') link.className = 'toc-level-3';
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
