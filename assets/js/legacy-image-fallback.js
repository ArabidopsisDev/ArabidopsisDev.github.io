(() => {
  const replaceBrokenImage = (image) => {
    if (image.dataset.fallbackApplied === 'true') return;
    image.dataset.fallbackApplied = 'true';
    const notice = document.createElement('span');
    notice.className = 'legacy-missing-media';
    notice.textContent = '原始插图未随历史页面保存';
    image.replaceWith(notice);
  };

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => replaceBrokenImage(image), { once: true });
    if (image.complete && image.naturalWidth === 0) replaceBrokenImage(image);
  });
})();
