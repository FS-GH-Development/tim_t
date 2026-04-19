const toggle = document.querySelector('.nav-toggle');
const header = document.querySelector('.site-header');

if (toggle && header) {
  const closeMenu = () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  document.querySelectorAll('.nav-panel a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}