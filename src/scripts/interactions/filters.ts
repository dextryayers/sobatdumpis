/**
 * Generic client-side search + category filtering.
 * Markup contract:
 *   [data-filter-root]
 *     [data-filter-search]            input
 *     [data-filter-category="all"]    toggle buttons (aria-pressed)
 *     [data-filter-item]              filterable items (data-search, data-category="a|b")
 *     [data-filter-empty]             empty state
 *     [data-filter-count]             result count
 */
function initFilter(root: HTMLElement): void {
  const search = root.querySelector<HTMLInputElement>('[data-filter-search]');
  const chips = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-filter-category]')
  );
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-filter-item]'));
  const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
  const count = root.querySelector<HTMLElement>('[data-filter-count]');

  let activeCategory = 'all';

  const apply = (): void => {
    const query = (search?.value ?? '').trim().toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const haystack = (item.dataset.search ?? '').toLowerCase();
      const categories = (item.dataset.category ?? '').split('|');
      const matchesText = query.length === 0 || haystack.includes(query);
      const matchesCategory =
        activeCategory === 'all' || categories.includes(activeCategory);

      const show = matchesText && matchesCategory;
      item.hidden = !show;
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = String(visible);
  };

  search?.addEventListener('input', apply);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.filterCategory ?? 'all';

      chips.forEach((other) => {
        const isActive = other === chip;
        other.classList.toggle('is-active', isActive);
        other.setAttribute('aria-pressed', String(isActive));
      });

      apply();
    });
  });

  apply();
}

document
  .querySelectorAll<HTMLElement>('[data-filter-root]')
  .forEach((root) => initFilter(root));
