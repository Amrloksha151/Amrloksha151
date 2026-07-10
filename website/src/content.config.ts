import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const about = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    avatar: z.string().optional(),
    publishedAt: z.coerce.date(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
    tags: z.array(z.string()),
    year: z.number(),
    order: z.number(),
  }),
});

export const collections = { about, services, projects };
