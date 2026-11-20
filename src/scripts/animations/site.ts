import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Wrap every word in a clipping line so headlines can rise into view.
 * Text nodes are split; nested elements (e.g. the red accent span) keep their styles.
 */
function splitWords(element: HTMLElement): HTMLElement[] {
  if (element.dataset.split === 'done') return [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.nodeValue && node.nodeValue.trim().length > 0) {
      textNodes.push(node);
    }
  }

  const words: HTMLElement[] = [];

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const parts = (node.nodeValue ?? '').split(/(\s+)/);

    parts.forEach((part) => {
      if (part.length === 0) return;

      if (!part.trim()) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }

      const line = document.createElement('span');
      line.className = 'split-line';

      const word = document.createElement('span');
      word.className = 'split-word';
      word.textContent = part;

      line.appendChild(word);
      fragment.appendChild(line);
      words.push(word);
    });

    node.replaceWith(fragment);
  });

  element.dataset.split = 'done';
  return words;
}

function init(): void {
  if (prefersReducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const nav = document.querySelector<HTMLElement>('[data-animate="nav"]');
  if (nav) {
    gsap.from(nav, { y: -18, opacity: 0, duration: 0.6, ease: 'power2.out' });
  }

  // On-load headline reveals (hero + page heroes)
  const splitElements = gsap.utils.toArray<HTMLElement>('[data-split]');
  splitElements.forEach((element, index) => {
    const words = splitWords(element);
    if (!words.length) return;

    gsap.from(words, {
      yPercent: 115,
      opacity: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.035,
      delay: 0.1 + index * 0.08,
    });
  });

  // Hero support blocks animate with the headline, not on scroll
  const heroReveals = gsap.utils.toArray<HTMLElement>('[data-hero] [data-reveal]');
  if (heroReveals.length) {
    gsap.from(heroReveals, {
      y: 26,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.35,
    });
  }

  // Progressive section entrances
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.closest('[data-hero]')) return;

    gsap.from(element, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // Staggered groups (values, cards, galleries)
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (!children.length) return;

    gsap.from(children, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Restrained parallax for selected editorial visuals
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
    const strength = Number(element.dataset.parallax ?? 0.08);

    gsap.to(element, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement ?? element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
