// Apply the explicit preference before styles load; first visits stay dark.
(() => {
  const root = document.documentElement;
  const key = 'mike-portfolio-theme';
  let theme = 'midnight';
  try { if (localStorage.getItem(key) === 'light') theme = 'light'; } catch {}
  root.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('themeToggle');
    function render() {
      const light = root.dataset.theme === 'light';
      button.querySelector('.theme-icon').textContent = light ? '☾' : '☀';
      button.querySelector('.theme-label').textContent = light ? 'Dark' : 'Light';
      button.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
      button.title = `${light ? 'Light' : 'Dark'} theme active`;
    }
    render();
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'midnight' : 'light';
      try { localStorage.setItem(key, root.dataset.theme); } catch {}
      render();
    });
  });
})();
