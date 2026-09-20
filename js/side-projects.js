/* MM1-115 content registry. Add only Mike-approved public links and local or stable public preview assets. Do not scrape Google Photos or auto-import a YouTube channel. */
const mikeSideProjects = {
  videos: [
    {
      title: 'MIKE SCHNALL PLAYS MOUNTAINS OF ILLINOIS',
      url: 'https://www.youtube.com/watch?v=M6zBsjKTkSY',
      preview: 'https://i.ytimg.com/vi/M6zBsjKTkSY/hqdefault.jpg',
    },
  ],
  albums: [
    {
      title: "Mike's Sunset Pictures Over The Years",
      url: 'https://photos.app.goo.gl/8vozT9n3zgD2aD1Q9',
      // Public Open Graph cover as observed from the supplied album page.
      // It is not a permanence or automatic-refresh guarantee.
      previews: ['https://lh3.googleusercontent.com/pw/AP1GczN_xic52MjHCLDpErdpVk_4qgdBOMWjMffdT4qELWvhgIiewMZ-pQwQOPEOQCYmbMt62USIYagJFQ77c0IcpAKsphaDU2YmQMR9mlaV6A4SvlfORIeX=w600-h315-p-k'],
    },
    {
      title: 'Random Afternoon in Central Park 9/19/2026',
      url: 'https://photos.app.goo.gl/gWarHbQbCrKxVxrCA',
      // Public Open Graph cover as observed from the supplied album page.
      // It is not a permanence or automatic-refresh guarantee.
      // The OG thumbnail is a landscape crop. This bounded public variant retains the
      // full 3:4 photo so the existing 16:9 contain frame can show it without cropping.
      previews: ['https://lh3.googleusercontent.com/pw/AP1GczMWt3QZY_iRJCahSYxEmJX6DRYfSyoQxxhEcPd8T2K9OroFdyNWf2HJak_DgXe87LstLHSnSMPi3kP2dRWiSQeTkZ081fVBjEphlpC8kb3CDuknPph4=w600'],
    },
  ],
};

(() => {
  const labels = { videos: 'video', albums: 'album' };
  const externalLink = (item, label) => { const link = document.createElement('a'); link.className = 'media-card-link'; link.href = item.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = `${label === 'video' ? 'Watch video' : 'Open album'} ↗`; return link; };
  const previewFallback = (preview, type) => { preview.replaceChildren(); preview.classList.add('media-preview-unavailable'); preview.textContent = type === 'videos' ? 'Video preview unavailable' : 'Album cover unavailable'; };
  function card(item, type) {
    const article = document.createElement('article'); article.className = `media-card media-card-${type}`;
    const preview = document.createElement('div'); preview.className = 'media-preview';
    if (type === 'videos' && item.preview) { const image = document.createElement('img'); image.src = item.preview; image.alt = `Preview for ${item.title}`; image.loading = 'lazy'; image.addEventListener('error', () => previewFallback(preview, type)); preview.append(image); }
    else if (type === 'albums' && Array.isArray(item.previews) && item.previews.length) { const previews = item.previews.slice(0, 2); preview.classList.toggle('media-preview-single', previews.length === 1); previews.forEach((src, index) => { const image = document.createElement('img'); image.src = src; image.alt = `${item.title} preview ${index + 1}`; image.loading = 'lazy'; image.addEventListener('error', () => previewFallback(preview, type)); preview.append(image); }); }
    else { preview.classList.add('media-preview-unavailable'); preview.textContent = type === 'videos' ? 'Video preview to be added' : 'Album previews to be added'; }
    const content = document.createElement('div'); content.className = 'media-card-content'; const heading = document.createElement('h4'); heading.textContent = item.title; content.append(heading, externalLink(item, labels[type])); article.append(preview, content); return article;
  }
  function initialize(carousel) {
    const type = carousel.dataset.projectCarousel, items = mikeSideProjects[type] || [], track = carousel.querySelector('.media-track'), previous = carousel.querySelector('.media-previous'), next = carousel.querySelector('.media-next'), position = carousel.querySelector('.media-position');
    if (!items.length) { const empty = document.createElement('p'); empty.className = 'media-empty'; empty.textContent = `Selected ${labels[type]}s will appear here once Mike provides approved public links and preview assets.`; track.append(empty); return; }
    items.forEach(item => track.append(card(item, type))); let current = 0; const cards = () => [...track.querySelectorAll('.media-card')]; const update = () => { position.textContent = `${current + 1} / ${items.length}`; previous.disabled = next.disabled = items.length < 2; };
    const show = index => { current = (index + items.length) % items.length; cards()[current].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'start', block: 'nearest' }); update(); };
    previous.addEventListener('click', () => show(current - 1)); next.addEventListener('click', () => show(current + 1));
    carousel.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); } if (event.key === 'Home') { event.preventDefault(); show(0); } if (event.key === 'End') { event.preventDefault(); show(items.length - 1); } });
    track.addEventListener('scroll', () => { const left = track.getBoundingClientRect().left; current = cards().reduce((nearest, item, index) => Math.abs(item.getBoundingClientRect().left - left) < Math.abs(cards()[nearest].getBoundingClientRect().left - left) ? index : nearest, current); update(); }, { passive: true }); update();
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-project-carousel]').forEach(initialize));
})();
