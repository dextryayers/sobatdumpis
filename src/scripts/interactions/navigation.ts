const toggle = document.querySelector<HTMLButtonElement>('#mobile-menu-toggle');
const menu = document.querySelector<HTMLElement>('#mobile-menu');

if (toggle && menu) {
  const desktopQuery = window.matchMedia('(min-width: 768px)');

  const setOpen = (open: boolean, returnFocus = false): void => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close site menu' : 'Open site menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('is-open', open);

    if (open) {
      menu.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    } else if (returnFocus) {
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
