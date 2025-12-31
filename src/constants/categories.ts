/**
 * Blog post categories
 * These categories are used across the application for filtering and organizing posts
 */
export const BLOG_CATEGORIES = [
  'Reality Checks',
  'Survival Guides',
  'Stories & Reflections',
  'Direction & Growth',
  'Confidence Builders'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
