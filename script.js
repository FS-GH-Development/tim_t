const currentPath = (() => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === '' ? 'index.html' : path;
})();

document.querySelectorAll('[data-nav]').forEach((link) => {
  const href = link.getAttribute('href');
  const isServiceDetail = currentPath === 'leistung.html' && href === 'leistungen.html';
  if (href === currentPath || isServiceDetail || (currentPath === 'index.html' && href === './')) {
    link.classList.add('active');
  }
});

const menu = document.querySelector('[data-mobile-menu]');
const backdrop = document.querySelector('[data-backdrop]');
const openBtn = document.querySelector('[data-menu-open]');
const closeBtn = document.querySelector('[data-menu-close]');

function setMenu(open) {
  if (!menu || !backdrop) return;
  menu.classList.toggle('open', open);
  backdrop.classList.toggle('show', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

openBtn?.addEventListener('click', () => setMenu(true));
closeBtn?.addEventListener('click', () => setMenu(false));
backdrop?.addEventListener('click', () => setMenu(false));
document.querySelectorAll('[data-mobile-menu] a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

let revealObserver = null;

function watchReveals(root = document) {
  const reveals = [...root.querySelectorAll('.reveal:not(.in-view)')];
  if (revealObserver) {
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in-view'));
  }
}

if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
}
watchReveals();

const services = window.CONCEPT34_SERVICES || [];

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function serviceUrl(slug) {
  return `leistung.html?service=${encodeURIComponent(slug)}`;
}

function renderServiceCard(service, compact = false) {
  const includes = service.includes?.slice(0, compact ? 2 : 3) || [];
  return `
    <a class="service-index-card ${compact ? 'compact' : ''}" data-category="${escapeHTML(service.category)}" href="${serviceUrl(service.slug)}">
      <img src="${escapeHTML(service.image)}" alt="${escapeHTML(service.title)}" loading="lazy">
      <div>
        <span>${escapeHTML(service.categoryLabel)}</span>
        <h3>${escapeHTML(service.title)}</h3>
        <p>${escapeHTML(service.summary)}</p>
        <ul>${includes.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        <strong>Details öffnen</strong>
      </div>
    </a>
  `;
}

document.querySelectorAll('[data-service-grid]').forEach((grid) => {
  grid.innerHTML = services.map((service) => renderServiceCard(service)).join('');
});

document.querySelectorAll('[data-service-strip]').forEach((grid) => {
  const limit = Number(grid.dataset.limit || services.length);
  grid.innerHTML = services.slice(0, limit).map((service) => renderServiceCard(service, true)).join('');
});

function relatedServicesFor(service) {
  const explicit = service.related?.length
    ? service.related.map((slug) => services.find((item) => item.slug === slug)).filter(Boolean)
    : [];
  if (explicit.length) return explicit.slice(0, 3);
  return services
    .filter((item) => item.slug !== service.slug && item.category === service.category)
    .slice(0, 3);
}

function renderServiceDetail() {
  const detail = document.querySelector('[data-service-detail]');
  if (!detail || !services.length) return;

  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get('service') || services[0].slug;
  const service = services.find((item) => item.slug === requestedSlug) || services[0];
  const related = relatedServicesFor(service);
  const processDescriptions = [
    "Objekt, Zugang, Maße und Schutzbedarf werden sauber eingeordnet.",
    "Maschinen, Material, Entsorgung und Terminfenster werden vorbereitet.",
    "Die Arbeiten laufen geordnet und mit Blick auf die nächsten Gewerke.",
    "Am Ende steht ein klarer Zustand, der direkt weiterverarbeitet werden kann."
  ];

  document.title = `${service.title} - Concept 34`;
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription?.setAttribute('content', service.summary);

  detail.innerHTML = `
    <section class="service-detail-hero">
      <div class="container service-detail-grid">
        <div class="service-detail-copy reveal in-view">
          <a class="back-link" href="leistungen.html">Alle Leistungen</a>
          <p class="eyebrow">${escapeHTML(service.categoryLabel)}</p>
          <h1>${escapeHTML(service.title)}</h1>
          <p>${escapeHTML(service.intro)}</p>
          <div class="service-metrics">
            ${(service.metrics || []).map((metric) => `<span>${escapeHTML(metric)}</span>`).join('')}
          </div>
          <div class="hero-actions left-actions">
            <a class="btn btn-accent" href="kontakt.html">Projekt anfragen</a>
            <a class="btn" href="referenzen.html">Referenzen ansehen</a>
          </div>
        </div>
        <img src="${escapeHTML(service.image)}" alt="${escapeHTML(service.title)}" class="service-detail-image reveal in-view">
      </div>
    </section>

    <section class="section modern-section">
      <div class="container detail-two-column">
        <article class="detail-panel reveal">
          <p class="eyebrow">Leistungsumfang</p>
          <h2>Was dazugehört.</h2>
          <p>${escapeHTML(service.summary)}</p>
          <ul class="check-list">${(service.includes || []).map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        </article>
        <article class="detail-panel muted-panel reveal reveal-delay-1">
          <p class="eyebrow">Typisch geeignet für</p>
          <h2>Wo diese Leistung hilft.</h2>
          <div class="pill-list">${(service.perfectFor || []).map((item) => `<span>${escapeHTML(item)}</span>`).join('')}</div>
        </article>
      </div>
    </section>

    <section class="section process-band">
      <div class="container">
        <div class="section-head split-head reveal">
          <div><p class="eyebrow">Ablauf</p><h2>So wird daraus ein sauberes Projekt.</h2></div>
          <p>Der genaue Umfang hängt vom Objekt ab. Die Struktur bleibt gleich: ansehen, vorbereiten, ausführen, übergeben.</p>
        </div>
        <div class="workflow-grid">
          ${(service.process || []).map((step, index) => `
            <article class="workflow-step reveal reveal-delay-${Math.min(index, 3)}">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHTML(step)}</h3>
              <p>${escapeHTML(processDescriptions[index] || processDescriptions[processDescriptions.length - 1])}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section service-gallery-band">
      <div class="container">
        <div class="section-head split-head reveal">
          <div><p class="eyebrow">Beispielbilder</p><h2>So kann diese Leistung im Projekt wirken.</h2></div>
          <p>Die Bilder sind hochwertige Platzhalter und können später durch echte Kundenprojekte ersetzt werden.</p>
        </div>
        <div class="detail-gallery">
          ${(service.gallery || [service.image]).map((image, index) => `
            <figure class="detail-gallery-item reveal reveal-delay-${Math.min(index, 3)}">
              <img src="${escapeHTML(image)}" alt="${escapeHTML(service.title)} Beispiel ${index + 1}" loading="lazy">
            </figure>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section modern-section">
      <div class="container">
        <div class="section-head split-head reveal">
          <div><p class="eyebrow">Verwandte Leistungen</p><h2>Passt oft zusammen.</h2></div>
          <p>Viele Baustellen bestehen aus mehreren kleinen Arbeitsschritten. Diese Leistungen ergänzen sich häufig.</p>
        </div>
        <div class="service-strip-grid">${related.map((item) => renderServiceCard(item, true)).join('')}</div>
      </div>
    </section>
  `;
  watchReveals(detail);
}

renderServiceDetail();

const projectSliders = [];

function getTabScope(tabs) {
  return tabs.closest('section') || tabs.parentElement || document;
}

function updateSliderButtons(slider) {
  const { rail, prev, next } = slider;
  if (!rail) return;
  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth - 2);
  const atStart = rail.scrollLeft <= 2;
  const atEnd = rail.scrollLeft >= maxScroll;
  prev?.toggleAttribute('disabled', maxScroll === 0 || atStart);
  next?.toggleAttribute('disabled', maxScroll === 0 || atEnd);
}

document.querySelectorAll('[data-tabs]').forEach((tabs) => {
  const buttons = [...tabs.querySelectorAll('[data-tab]')];
  const scope = getTabScope(tabs);
  const panels = [...scope.querySelectorAll('[data-panel]')];
  const cards = [...scope.querySelectorAll('[data-category]')];
  const rail = scope.querySelector('[data-project-rail]');

  function activateTab(button) {
    const key = button.dataset.tab;
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });

    cards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      const active = key === 'all' || categories.includes(key);
      card.hidden = !active;
    });

    if (rail) {
      rail.scrollTo({ left: 0, behavior: 'smooth' });
      requestAnimationFrame(() => projectSliders.forEach(updateSliderButtons));
    }
  }

  buttons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(button.classList.contains('active')));
    button.tabIndex = button.classList.contains('active') ? 0 : -1;

    button.addEventListener('click', () => activateTab(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const last = buttons.length - 1;
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? last
          : event.key === 'ArrowRight'
            ? (index + 1) % buttons.length
            : (index - 1 + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      activateTab(buttons[nextIndex]);
    });
  });
});

document.querySelectorAll('[data-project-rail]').forEach((rail) => {
  const section = rail.closest('section') || document;
  const prev = section.querySelector('[data-slider-prev]');
  const next = section.querySelector('[data-slider-next]');
  const slider = { rail, prev, next };
  projectSliders.push(slider);

  function scrollProjects(direction) {
    const visibleCard = [...rail.querySelectorAll('.project-tile:not([hidden])')][0];
    const cardWidth = visibleCard ? visibleCard.getBoundingClientRect().width : 360;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 18;
    rail.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
    window.setTimeout(() => updateSliderButtons(slider), 360);
  }

  prev?.addEventListener('click', () => scrollProjects(-1));
  next?.addEventListener('click', () => scrollProjects(1));
  rail.addEventListener('scroll', () => updateSliderButtons(slider), { passive: true });
  window.addEventListener('resize', () => updateSliderButtons(slider));
  updateSliderButtons(slider);
});

document.querySelectorAll('[data-compare-range]').forEach((range) => {
  const compare = range.closest('.compare');
  if (!compare) return;
  const update = (value = range.value) => {
    const split = Math.min(95, Math.max(5, Number(value)));
    range.value = split;
    compare.style.setProperty('--split', `${split}%`);
  };
  const updateFromPointer = (event) => {
    const rect = compare.getBoundingClientRect();
    const x = event.clientX ?? event.touches?.[0]?.clientX;
    if (typeof x !== 'number') return;
    update(((x - rect.left) / rect.width) * 100);
  };

  range.addEventListener('input', () => update());
  compare.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    compare.setPointerCapture?.(event.pointerId);
    updateFromPointer(event);
  });
  compare.addEventListener('pointermove', (event) => {
    if (event.buttons !== 1) return;
    updateFromPointer(event);
  });
  compare.addEventListener('pointerup', (event) => {
    compare.releasePointerCapture?.(event.pointerId);
  });
  update();
});

function showToast(message, type = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`.trim();
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.nachricht) {
      showToast('Bitte füllen Sie alle Pflichtfelder aus', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast('Bitte geben Sie eine gültige E-Mail-Adresse ein', 'error');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Senden...</span>';
    setTimeout(() => {
      const submissions = JSON.parse(localStorage.getItem('concept34_submissions') || '[]');
      submissions.push({ ...data, timestamp: new Date().toISOString(), id: Date.now() });
      localStorage.setItem('concept34_submissions', JSON.stringify(submissions));
      form.reset();
      btn.disabled = false;
      btn.innerHTML = old;
      showToast('Ihre Anfrage wurde erfolgreich gespeichert');
    }, 700);
  });
}
