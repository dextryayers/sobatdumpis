export const STORY_CATEGORY_LABELS = {
  personal: 'Personal Stories',
  technology: 'Technology',
  creativity: 'Creativity',
  experiences: 'Experiences',
  'random-thoughts': 'Random Thoughts',
  'knowledge-sharing': 'Knowledge Sharing',
} as const;

export type StoryCategory = keyof typeof STORY_CATEGORY_LABELS;

export const STORY_CATEGORY_CODES: Record<StoryCategory, string> = {
  personal: 'PS',
  technology: 'TX',
  creativity: 'CR',
  experiences: 'EX',
  'random-thoughts': 'RT',
  'knowledge-sharing': 'KS',
};

export const STORY_CATEGORY_TONES: Record<
  StoryCategory,
  'signal' | 'ink' | 'olive' | 'stone'
> = {
  personal: 'signal',
  technology: 'ink',
  creativity: 'olive',
  experiences: 'stone',
  'random-thoughts': 'signal',
  'knowledge-sharing': 'olive',
};

export const storyCategoryOptions = (
  Object.keys(STORY_CATEGORY_LABELS) as StoryCategory[]
).map((value) => ({
  value,
  label: STORY_CATEGORY_LABELS[value],
}));
