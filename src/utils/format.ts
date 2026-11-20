const longDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatDateLong(date: Date): string {
  return longDate.format(date);
}

export function formatDateShort(date: Date): string {
  return shortDate.format(date);
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Rough reading time when frontmatter omits it (~200 words/minute). */
export function estimateReadingTime(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}
