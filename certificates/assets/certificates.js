(() => {
  const entries = [...document.querySelectorAll('[data-certificate-entry]')];
  const filters = [...document.querySelectorAll('[data-certificate-filter]')];
  const boardNote = document.querySelector('[data-board-note]');
  const dialog = document.querySelector('[data-certificate-dialog]');
  const dialogImage = document.querySelector('[data-dialog-image]');
  const dialogCaption = document.querySelector('[data-dialog-caption]');
  const closeButton = document.querySelector('[data-dialog-close]');
  const previousButton = document.querySelector('[data-dialog-previous]');
  const nextButton = document.querySelector('[data-dialog-next]');
  let currentButton = null;

  const visibleImageButtons = () => [...document.querySelectorAll('[data-certificate-image]')]
    .filter((button) => !button.closest('[data-certificate-entry]').hidden);

  const showImage = (button) => {
    if (!button || !dialog || !dialogImage || !dialogCaption) return;
    currentButton = button;
    dialogImage.src = button.dataset.certificateImage;
    dialogImage.alt = button.dataset.certificateAlt || '';
    dialogCaption.textContent = button.dataset.certificateCaption || button.dataset.certificateAlt || '';
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
  };

  const move = (offset) => {
    const buttons = visibleImageButtons();
    const currentIndex = Math.max(0, buttons.indexOf(currentButton));
    const nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
    showImage(buttons[nextIndex]);
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.certificateFilter;
      filters.forEach((item) => item.classList.toggle('is-active', item === button));
      let visibleCount = 0;
      entries.forEach((entry) => {
        const categories = entry.dataset.category.split(/\s+/u);
        const visible = filter === 'all' || categories.includes(filter);
        entry.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (boardNote) boardNote.textContent = `当前显示 ${visibleCount} 个阶段记录。`;
    });
  });

  document.addEventListener('click', (event) => {
    const imageButton = event.target.closest('[data-certificate-image]');
    if (imageButton) showImage(imageButton);
  });

  closeButton?.addEventListener('click', () => dialog?.close());
  previousButton?.addEventListener('click', () => move(-1));
  nextButton?.addEventListener('click', () => move(1));

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    currentButton?.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (!dialog?.open) return;
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });
})();
