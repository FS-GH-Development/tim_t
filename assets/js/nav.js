document.addEventListener("DOMContentLoaded", () => {
  const shell = document.querySelector(".nav-shell");
  const toggle = document.querySelector(".nav-toggle");
  if (!shell || !toggle) return;

  const closeMenu = () => {
    shell.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = shell.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!shell.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
});
