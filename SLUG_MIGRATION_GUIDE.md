# Slug-Based URL Migration Guide

## Overview

This guide documents the migration from ID-based URLs (`/blog/[id]`) to SEO-friendly slug-based URLs (`/post/[slug]`).

## What Changed

### URL Structure
- **Before**: `/blog/123` (numeric ID)
- **After**: `/post/getting-started-with-nextjs` (readable slug)

### Benefits
1. **Better SEO**: Search engines prefer descriptive URLs
2. **User-Friendly**: URLs are human-readable and memorable
3. **Shareability**: Slugs are easier to share and remember
4. **Consistency**: Industry-standard approach for blog posts

## Technical Changes

### Database Schema
- Added `slug` column to `blog_posts` table (VARCHAR(500), NOT NULL)
- Added unique index on `slug` column for performance
- Slugs are automatically generated from post titles

### New Functions
- `getPostBySlug()` - Fetch posts by slug (public view)
- `getPostBySlugIncludingDeleted()` - Fetch posts by slug (admin view)
- `getBlogPostBySlug()` - Data layer function for slug-based queries

### Routes
- **New**: `/src/app/post/[slug]/page.tsx` (slug-based routing)
- **Removed**: `/src/app/blog/[id]/page.tsx` (old ID-based routing)

### SEO Improvements
- Added canonical URLs to post metadata
- Enhanced JSON-LD structured data with `mainEntityOfPage`
- Updated sitemap to use slug-based URLs
- Improved Open Graph and Twitter Card metadata

## Migration Steps

### For New Installations
No action needed. The database schema includes the slug column by default.

### For Existing Installations

1. **Run the migration script**:
   ```bash
   npm run db:migrate-slug
   ```
   
   This script will:
   - Add the `slug` column to the `blog_posts` table
   - Generate slugs for all existing posts based on their titles
   - Create a unique index on the slug column
   - Handle duplicate slugs automatically

2. **Verify the migration**:
   - Check your database to ensure all posts have slugs
   - Test accessing posts via the new `/post/[slug]` URLs
   - Verify that admin functions (edit, delete, pin) work correctly

3. **Update any custom integrations**:
   - If you have external links to posts, update them to use slugs
   - Update any bookmarks or saved links
   - Old `/blog/[id]` URLs will return 404 errors

## How Slugs are Generated

Slugs are automatically created from post titles using the following rules:
1. Convert to lowercase
2. Replace spaces with hyphens (-)
3. Remove special characters
4. Remove multiple consecutive hyphens
5. Trim hyphens from start and end

**Example**:
- Title: "Getting Started with Next.js and TypeScript!"
- Slug: "getting-started-with-nextjs-and-typescript"

## Handling Duplicates

If a slug already exists, the system appends a unique suffix:
- Original: "my-post"
- Duplicate: "my-post-abc123"

## Backward Compatibility

**Important**: Old `/blog/[id]` URLs are **NOT** supported after migration. If you need to maintain backward compatibility, you would need to:
1. Keep the old route
2. Add redirect logic from ID-based URLs to slug-based URLs
3. Create a mapping table between IDs and slugs

This was intentionally not implemented to keep the codebase clean and encourage the use of SEO-friendly URLs from the start.

## Testing Checklist

After running the migration, verify the following:

- [ ] All posts have generated slugs in the database
- [ ] Posts are accessible via `/post/[slug]` URLs
- [ ] Homepage links navigate to correct post pages
- [ ] Admin dashboard "View" links work correctly
- [ ] Pinned post navigation works
- [ ] Email notifications include correct post URLs
- [ ] Sitemap includes slug-based URLs
- [ ] Edit and delete functionality works in admin panel
- [ ] New posts automatically generate slugs

## Rollback (Not Recommended)

If you need to rollback:
1. The old code is in git history
2. You would need to restore the `/src/app/blog/[id]` route
3. Update all components to use ID-based URLs
4. You can keep the slug column in the database for future use

However, **rollback is not recommended** as the new slug-based approach is a significant improvement for SEO and user experience.

## Support

If you encounter issues during migration:
1. Check that your database connection is configured correctly
2. Verify that all environment variables are set
3. Look for any posts with empty or duplicate titles
4. Check the migration script output for errors

## Future Enhancements

Potential improvements to consider:
- Custom slug editing in the admin dashboard
- Slug history to handle URL changes
- Automatic redirects from old URLs (if tracking needed)
- Slug validation to prevent reserved words
