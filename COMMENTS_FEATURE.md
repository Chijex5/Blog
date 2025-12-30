# Comments Feature Implementation

This document describes the implementation of the comments feature for blog posts.

## Overview

The comments feature allows readers to leave comments on blog posts. Comments are stored in a PostgreSQL database and displayed on individual blog post pages.

## Database Schema

### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

### Indexes

- `idx_comments_post_id` - Index on `post_id` for efficient comment retrieval
- `idx_comments_created_at` - Index on `created_at` for chronological ordering
- `idx_comments_deleted` - Index on `is_deleted` for filtering deleted comments

## Migration

To add the comments table to your database, run:

```bash
npm run db:migrate-comments
```

This will execute the migration script at `scripts/migrate-add-comments.js`.

## API Endpoints

### POST /api/comments

Creates a new comment.

**Request Body:**
```json
{
  "postId": "post-id-here",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "content": "This is a great post!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "post_id": "post-id-here",
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "content": "This is a great post!",
  "created_at": "2024-12-30T01:00:00.000Z",
  "updated_at": "2024-12-30T01:00:00.000Z",
  "is_deleted": false
}
```

**Validation:**
- All fields are required
- Email must be valid format
- Content must be 1-2000 characters

### GET /api/comments?postId={postId}

Retrieves all comments for a specific blog post.

**Response:**
```json
[
  {
    "id": "uuid",
    "post_id": "post-id-here",
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "content": "This is a great post!",
    "created_at": "2024-12-30T01:00:00.000Z",
    "updated_at": "2024-12-30T01:00:00.000Z",
    "is_deleted": false
  }
]
```

## Components

### Comments Component

Located at `src/components/Comments.tsx`

The Comments component handles:
- Displaying all comments for a post
- Rendering a comment submission form
- Handling comment submission
- Form validation and error handling
- Loading states

**Usage:**
```tsx
import Comments from '@/components/Comments';

<Comments postId={post.id} />
```

## Features

- **Real-time Submission**: Comments appear immediately after posting
- **Form Validation**: Client-side and server-side validation
- **Email Privacy**: Email addresses are stored but never displayed publicly
- **Soft Delete**: Comments can be marked as deleted without removing from database
- **Character Limit**: 2000 character maximum for comment content
- **Loading States**: Visual feedback during data fetching and submission
- **Error Handling**: User-friendly error messages

## Security Considerations

1. **Input Sanitization**: All user inputs are trimmed and validated
2. **Email Validation**: Email format is validated on both client and server
3. **Content Length**: Maximum 2000 characters to prevent abuse
4. **Soft Delete**: Comments are never permanently deleted, allowing moderation
5. **SQL Injection Protection**: Uses parameterized queries

## Future Enhancements

Potential improvements for the comments feature:

- [ ] Comment replies/threading
- [ ] Comment editing
- [ ] Admin moderation interface
- [ ] Spam detection
- [ ] Email notifications for new comments
- [ ] User authentication for commenting
- [ ] Rate limiting to prevent spam
- [ ] Markdown support in comments
- [ ] Comment sorting options (newest, oldest, etc.)
- [ ] Comment reactions (likes, etc.)

## Testing

To test the comments feature:

1. Start the development server: `npm run dev`
2. Navigate to any blog post
3. Scroll to the comments section at the bottom
4. Fill out the comment form with:
   - Your name
   - Your email
   - A comment message
5. Click "Post Comment"
6. Verify the comment appears in the list

## Troubleshooting

### Comments not appearing after submission

- Check browser console for errors
- Verify database connection settings in `.env`
- Ensure the comments table exists (run migration if not)
- Check API endpoint responses in Network tab

### Database errors

- Verify `post_id` exists in `blog_posts` table
- Check database credentials in environment variables
- Ensure comments table and indexes are created

## Database Functions

The following functions are available in `src/lib/database.ts`:

- `addComment(comment)` - Creates a new comment
- `getCommentsByPostId(postId)` - Retrieves all comments for a post
- `getCommentCountByPostId(postId)` - Gets the comment count for a post
- `deleteComment(id)` - Soft deletes a comment
