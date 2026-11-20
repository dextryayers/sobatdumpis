const toggle = document.querySelector<HTMLButtonElement>('#mobile-menu-toggle');
const menu = document.querySelector<HTMLElement>('#mobile-menu');

function setMenuOpen(open: boolean, returnFocus = false): void {
  if (!toggle || !menu) return;

  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.setAttribute('aria-hidden', String(!open));

  const root = document.documentElement;
  root.classList.toggle('nav-open', open);

  if (open) {
    window.setTimeout(() => {
      const firstLink = menu.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus({ preventScroll: true });
    }, 250);
  } else if (returnFocus) {
    toggle.focus({ preventScroll: true });
  }
}

if (toggle && menu) {
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Close when clicking outside the menu or the toggle
  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    const target = event.target as Node;
    if (!menu.contains(target) && !toggle.contains(target)) {
      setMenuOpen(false);
    }
  });

  // Escape closes and returns focus
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });

  // Focus trap: keep Tab cycling between the toggle and menu links
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
    const focusables: HTMLElement[] = [
      toggle,
      ...Array.from(menu.querySelectorAll<HTMLElement>('a[href]')),
    ];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Reset state when crossing into desktop layout
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });
}

// Shrink the sticky header once the page is scrolled
const header = document.querySelector<HTMLElement>('#site-header');
if (header) {
  const onScroll = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Back-to-top button
if (!document.querySelector('.back-to-top')) {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>';
  document.body.appendChild(backToTop);

  const toggleVisibility = (): void => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Reading progress bar (only on article pages)
if (document.querySelector('.ed-prose') && !document.querySelector('.reading-progress')) {
  const readingProgress = document.createElement('div');
  readingProgress.className = 'reading-progress';
  readingProgress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(readingProgress);

  const article = document.querySelector<HTMLElement>('.ed-prose');
  if (article) {
    const update = (): void => {
      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewport = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (window.scrollY + viewport - articleTop) / (articleHeight + viewport * 0.5))
      );
      readingProgress.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
}
