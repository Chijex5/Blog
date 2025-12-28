# Database Migration: Soft Delete for Blog Posts

## Overview
This migration adds soft delete functionality to the blog posts system. Instead of permanently deleting posts, they are now marked as deleted and hidden from public view.

## What Changed

### Database Schema
- Added `is_deleted` column to `blog_posts` table (BOOLEAN, default: false)
- Added index on `is_deleted` column for better query performance

### Code Changes
- `deletePost()` now performs soft delete (sets `is_deleted = true`)
- `getAllPosts()` excludes deleted posts from public queries
- `getPost()` excludes deleted posts from public queries
- New functions for admin:
  - `getAllPostsIncludingDeleted()` - Admin can see all posts
  - `getPostIncludingDeleted()` - Admin can access deleted posts
- Admin dashboard now shows "Deleted" badge for soft-deleted posts

## How to Apply Migration

### For New Databases
The `initDatabase()` function has been updated to include the `is_deleted` column automatically. No manual migration needed.

### For Existing Databases
Run the migration script:

```bash
npm run db:migrate
```

This script:
1. Checks if `is_deleted` column exists
2. Adds the column if it doesn't exist (safe to run multiple times)
3. Creates an index for better query performance

## Testing

After applying the migration, verify:

1. **Public View**: Deleted posts should NOT appear on:
   - Homepage (`/`)
   - Individual post pages (`/blog/[id]`)

2. **Admin View**: Deleted posts SHOULD appear with:
   - "Deleted" badge in red
   - Strikethrough title styling
   - Still editable by the owner

3. **Deletion Flow**:
   - Delete a post in admin dashboard
   - Post shows as "Deleted" in admin
   - Post is hidden from public pages
   - Post data is preserved in database

## Rollback (if needed)

If you need to revert the changes:

```sql
-- Remove the column (will lose soft delete data)
ALTER TABLE blog_posts DROP COLUMN is_deleted;

-- Remove the index
DROP INDEX IF EXISTS idx_blog_posts_deleted;
```

Note: Rolling back will NOT restore hard-deleted posts. Only posts that were soft-deleted will remain.

## Future Improvements

Consider adding:
- "Restore" button in admin to un-delete posts
- Permanent delete option for admins
- Auto-purge of deleted posts after X days
- Bulk delete/restore operations
