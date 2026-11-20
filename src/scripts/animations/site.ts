import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitWords(element: HTMLElement): HTMLElement[] {
  if (element.dataset.split === 'done') return [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.nodeValue && node.nodeValue.trim().length > 0) textNodes.push(node);
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


// Light 3D tilt for cards/visuals
function initTilt(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((element) => {
    const strength = Number(element.dataset.tilt ?? 8);

    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(element, {
        rotateY: x * strength,
        rotateX: -y * strength,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
    });
  });
}

// Gentle floating 3D decorative shapes + mouse parallax
function initShapes(): void {
  const shapes = gsap.utils.toArray<HTMLElement>('.shape-3d');

  shapes.forEach((shape, index) => {
    const depth = Number(shape.dataset.depth ?? 20);

    gsap.to(shape, {
      y: index % 2 === 0 ? -14 : 14,
      rotation: index % 2 === 0 ? 6 : -6,
      duration: 4 + index,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    window.addEventListener('mousemove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * depth;
      const y = (event.clientY / window.innerHeight - 0.5) * depth;
      gsap.to(shape, { x, y, duration: 0.8, ease: 'power2.out' });
    });
  });
}

function init(): void {
  if (prefersReducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  initTilt();
  initShapes();

  // Inject a global scroll-progress indicator
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      start: 0,
      end: 'max',
      scrub: 0.3,
    },
  });

  // Nav entrance
  const nav = document.querySelector<HTMLElement>('[data-animate="nav"]');
  if (nav) {
    gsap.from(nav, { y: -24, opacity: 0, duration: 0.7, ease: 'power3.out' });
  }

  // On-load headline reveals
  const splitElements = gsap.utils.toArray<HTMLElement>('[data-split]');
  splitElements.forEach((element, index) => {
    const words = splitWords(element);
    if (!words.length) return;
    gsap.from(words, {
      yPercent: 120,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.04,
      delay: 0.12 + index * 0.06,
    });
  });

  // Hero support blocks
  const heroReveals = gsap.utils.toArray<HTMLElement>('[data-hero] [data-reveal]');
  if (heroReveals.length) {
    gsap.from(heroReveals, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.4,
    });
  }

  // Progressive section entrances
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.closest('[data-hero]')) return;
    gsap.from(element, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
    });
  });

  // Staggered groups
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (!children.length) return;
    gsap.from(children, {
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });

  // Editorial image reveals via clip-path
  gsap.utils.toArray<HTMLElement>('[data-reveal-image]').forEach((element) => {
    gsap.fromTo(
      element,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 },
      {
        clipPath: 'inset(0 0% 0 0)',
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 85%', once: true },
      }
    );
  });

  // Restrained parallax
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
    const strength = Number(element.dataset.parallax ?? 0.06);
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

  // Magnetic hover for CTAs (subtle)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((element) => {
      const xTo = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3.out' });

      element.addEventListener('mousemove', (event) => {
        const rect = element.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.18);
        yTo(relY * 0.18);
      });

      element.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // Internal page transition (MPA): quick exit fade, then navigate
  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const anchor = (event.target as HTMLElement).closest?.('a[href]') as
      | HTMLAnchorElement
      | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || /^(#|mailto:|tel:)/.test(href) || /^https?:\/\//.test(href) || href.startsWith('//')) {
      return;
    }
    if (anchor.target && anchor.target !== '_self') return;

    event.preventDefault();
    gsap.to(document.body, {
      opacity: 0,
      y: -10,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        window.location.href = href;
      },
    });
  });

  // Smooth anchor scrolling
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(anchor.getAttribute('href') ?? '');
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
