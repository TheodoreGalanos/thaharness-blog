// ABOUTME: Defines the blog content collection schema used by Astro content pages.
// ABOUTME: Adds editorial metadata so templates can render categories, featured posts, and article context.

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      category: z.string(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      featuredRank: z.number().int().positive().optional(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { blog };
