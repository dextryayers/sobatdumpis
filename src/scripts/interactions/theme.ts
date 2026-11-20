// Theme toggle + loading screen dismissal
const root = document.documentElement;

// Apply saved/system theme before paint (fallback handled by CSS media query)
const stored = localStorage.getItem('theme');
if (stored === 'dark' || stored === 'light') {
  root.classList.remove('dark', 'light');
  root.classList.add(stored);
}

// Enable smooth transitions after initial paint
requestAnimationFrame(() => {
  root.classList.add('theme-ready');
});

const toggleTheme = (): void => {
  const isDark = root.classList.contains('dark');
  root.classList.remove('dark', 'light');
  root.classList.add(isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  syncToggle();
};

function syncToggle(): void {
  const btn = document.querySelector<HTMLButtonElement>('.theme-toggle');
  if (!btn) return;
  const isDark = root.classList.contains('dark');
  btn.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  btn.setAttribute('aria-pressed', String(isDark));
  btn.innerHTML = isDark
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
}

// Dismiss loading screen
const dismissLoader = (): void => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  window.setTimeout(() => {
    loader.classList.add('is-done');
    window.setTimeout(() => loader.remove(), 700);
  }, 650);
};

if (document.readyState === 'complete') {
  dismissLoader();
} else {
  window.addEventListener('load', dismissLoader, { once: true });
}

// Wire toggle buttons (may be added by header)
const wireToggle = (): void => {
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((btn) => {
    if (btn.dataset.wired === '1') return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', toggleTheme);
  });
  syncToggle();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireToggle, { once: true });
} else {
  wireToggle();
}
