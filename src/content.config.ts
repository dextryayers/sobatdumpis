import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const STORY_CATEGORIES = [
  'personal',
  'technology',
  'creativity',
  'experiences',
  'random-thoughts',
  'knowledge-sharing',
] as const;

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(STORY_CATEGORIES),
    author: z.string(),
    publishedDate: z.coerce.date(),
    readingTime: z.number().int().min(1).optional(),
    featured: z.boolean().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { stories };
