# Testing Guide: Soft Delete Implementation

This guide will help you verify that the soft delete implementation works correctly.

## Prerequisites

1. Database connection configured in `.env`
2. Admin account created (use `npm run db:seed-admin` if needed)
3. At least one blog post created

## Step 1: Apply Database Migration

If you have an existing database, run the migration:

```bash
npm run db:migrate
```

Expected output:
```
Starting migration: Adding is_deleted column...
✓ Added is_deleted column to blog_posts table
✓ Created index on is_deleted column
Migration completed successfully!
Done!
```

## Step 2: Test Soft Delete Functionality

### A. Delete a Post from Admin Dashboard

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin dashboard: `http://localhost:3000/admin/posts`

3. Log in with your admin credentials

4. Find a post you want to test with and click the delete button (trash icon)

5. Confirm the deletion

**Expected Result:**
- The post should now show a red "Deleted" badge
- The title should appear with a strikethrough
- The post should still be visible in the admin dashboard

### B. Verify Post is Hidden from Public View

1. **Homepage Test:**
   - Navigate to: `http://localhost:3000`
   - The deleted post should NOT appear in the blog list
   - Only non-deleted posts should be visible

2. **Individual Post Page Test:**
   - Try to navigate directly to the deleted post: `http://localhost:3000/blog/[POST_ID]`
   - Replace `[POST_ID]` with the actual ID of the deleted post
   - You should see a "404 Not Found" page or be redirected
   - The post content should NOT be displayed

### C. Verify Admin Can Still Access Deleted Post

1. In the admin dashboard (`/admin/posts`):
   - The deleted post should be visible
   - It should have a red "Deleted" badge
   - The title should have a strikethrough style
   
2. Click on the deleted post to view it:
   - Admins should still be able to view the post content
   - This allows for reference or potential restoration

## Step 3: Database Verification

You can verify the database directly:

```sql
-- Check the structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name = 'is_deleted';

-- View all posts with deleted status
SELECT id, title, is_deleted 
FROM blog_posts 
ORDER BY date DESC;

-- Count deleted vs active posts
SELECT 
  COUNT(*) FILTER (WHERE is_deleted = false) as active_posts,
  COUNT(*) FILTER (WHERE is_deleted = true) as deleted_posts
FROM blog_posts;
```

Expected results:
- `is_deleted` column exists with type `boolean` and default `false`
- Deleted posts have `is_deleted = true`
- Non-deleted posts have `is_deleted = false` or `NULL` (which is treated as false)

## Step 4: API Endpoint Testing

You can test the API endpoints directly:

### Public API (should exclude deleted posts):

```bash
# Get all posts (should NOT include deleted posts)
curl http://localhost:3000/api/posts

# Get specific post (should return 404 if deleted)
curl http://localhost:3000/api/posts?id=[DELETED_POST_ID]
```

### Admin API (should include deleted posts):

```bash
# Login first to get session cookie, then:
# Get all posts (should include deleted posts with is_deleted flag)
curl -H "Cookie: [SESSION_COOKIE]" http://localhost:3000/api/posts
```

## Expected Behavior Summary

| Action | Public User | Admin User |
|--------|------------|------------|
| View homepage | Deleted posts hidden | N/A (admins use dashboard) |
| View individual post | 404 for deleted posts | Can view deleted posts |
| View posts list | Only active posts | All posts with "Deleted" badge |
| Delete post | N/A | Soft delete (marks as deleted) |
| Edit post | N/A | Can edit own posts (even deleted) |

## Troubleshooting

### Issue: Deleted posts still showing on homepage

**Possible causes:**
1. Migration not applied - Run `npm run db:migrate`
2. Code not updated - Pull latest changes and restart server
3. Cache issue - Clear browser cache or try incognito mode

### Issue: Admin can't see deleted posts

**Check:**
1. Admin is properly authenticated
2. API route is using `getAllPostsIncludingDeleted()`
3. Session is active

### Issue: Migration fails

**Solutions:**
1. Check database connection in `.env`
2. Ensure database user has ALTER TABLE permissions
3. If column already exists, the script should skip safely

## Next Steps

After verifying the implementation works:

1. Consider adding a "Restore" feature to undelete posts
2. Consider adding permanent delete for admins
3. Consider auto-purging old deleted posts
4. Update documentation for content managers

## Rollback (if needed)

If you encounter issues and need to rollback:

```sql
-- Remove the column (WARNING: This will lose soft delete data)
ALTER TABLE blog_posts DROP COLUMN is_deleted;

-- Remove the index
DROP INDEX IF EXISTS idx_blog_posts_deleted;
```

Then revert the code changes using git:
```bash
git revert [commit-hash]
```
