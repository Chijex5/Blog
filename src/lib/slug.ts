/**
 * Utility for generating unique slugs
 */

import { slugExists } from './database';

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Generate a unique slug for a product
 * If the slug already exists, append a unique suffix
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  
  // Check if base slug exists in database
  const exists = await slugExists(baseSlug);
  
  if (!exists) {
    return baseSlug;
  }
  
  // Add a unique suffix
  const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const uniqueSlug = `${baseSlug}-${uniqueSuffix}`;
  
  return uniqueSlug;
}

/**
 * Parse key features from string (bullet points or newline separated)
 */
export function parseKeyFeatures(keyFeaturesString: string): string[] {
  if (!keyFeaturesString || !keyFeaturesString.trim()) {
    return [];
  }

  // Split by newlines and filter out empty lines
  const lines = keyFeaturesString.split('\n').filter(line => line.trim());
  
  // Remove bullet point markers (•, -, *, etc.) and clean up
  return lines.map(line => {
    return line
      .replace(/^[\s]*[•\-\*\u2022\u2023\u2043]+[\s]*/, '') // Remove bullet markers
      .trim();
  }).filter(feature => feature.length > 0);
}

/**
 * Format key features array back to bullet point string
 */
export function formatKeyFeatures(features: string[]): string {
  return features.map(feature => `• ${feature}`).join('\n');
}