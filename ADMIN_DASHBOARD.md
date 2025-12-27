# Admin Dashboard Documentation

## Overview

The admin dashboard provides a centralized interface for managing blog posts and admin users. It allows administrators to:

- View all blog posts
- Create, edit, and delete their own posts
- Filter posts by ownership
- Search posts by title, content, tags, or author
- Add new admin users

## Accessing the Dashboard

### Login

1. Navigate to `/admin/login`
2. Enter your admin credentials (email and password)
3. You will be redirected to `/admin/dashboard` upon successful login

### Dashboard Link

When authenticated, a "Dashboard" button will appear in the main site header, allowing quick access to the admin panel.

## Features

### Post Management

#### Viewing Posts

The dashboard displays all blog posts in a table format with the following information:
- **Post thumbnail** (if available)
- **Title and excerpt**
- **Author name**
- **Publication date**
- **Tags**
- **Ownership badge** (for your own posts)

#### Creating Posts

1. Click the "New Post" button in the action bar
2. You will be redirected to the post creation page
3. Fill in the post details and click "Publish Post"

#### Editing Posts

1. Find your post in the dashboard (posts you created will have a "Your Post" badge)
2. Click the edit icon (pencil) in the Actions column
3. Make your changes and save

**Note:** You can only edit posts that you created.

#### Deleting Posts

1. Find your post in the dashboard
2. Click the delete icon (trash) in the Actions column
3. Click "Confirm" to permanently delete the post
4. Click "Cancel" if you change your mind

**Note:** You can only delete posts that you created. Deletion is permanent and cannot be undone.

### Filtering and Search

#### Search Posts

Use the search bar to find posts by:
- Title
- Excerpt
- Author name
- Tags

The search is case-insensitive and updates results in real-time.

#### Filter by Ownership

Click the "Show My Posts" button to display only the posts you created. Click "Show All Posts" to return to the full list.

### Admin User Management

#### Adding New Admin Users

1. Click the "Add Admin" button in the action bar
2. Fill in the admin user details:
   - **Email**: Valid email address (must be unique)
   - **Name**: Full name of the admin
   - **Password**: Minimum 12 characters
   - **Confirm Password**: Must match the password
3. Click "Create Admin"
4. The new admin will be able to log in immediately with their credentials

**Requirements:**
- Only existing admins can create new admin users
- Email must be unique (not already registered)
- Password must be at least 12 characters long
- Passwords must match

### Statistics

The dashboard displays two key statistics:
- **Total Posts**: All posts in the system
- **Your Posts**: Number of posts you created

## Security

### Authentication

- All admin routes require authentication
- Unauthenticated users are redirected to the login page
- Sessions last for 7 days
- Use the "Sign Out" button to log out

### Authorization

- Users can only edit and delete their own posts
- Only admins can create new admin users
- All API endpoints verify user permissions before performing actions

### Password Requirements

- Minimum 12 characters
- Must be confirmed during admin user creation
- Passwords are hashed using bcrypt before storage

## API Endpoints

### Posts Management

#### GET /api/posts
Retrieve all blog posts

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Post Title",
    "excerpt": "Post excerpt",
    "content": "...",
    "author": "Author Name",
    "tags": ["tag1", "tag2"],
    "image": "https://...",
    "read_time": "5 min read",
    "date": "2024-01-01T00:00:00Z",
    "created_by": "user-uuid",
    "updated_by": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/posts
Create or update a blog post

**Authorization:** Required

**Request:**
```json
{
  "id": "uuid (optional, for updates)",
  "title": "Post Title",
  "excerpt": "Post excerpt",
  "content": "Post content",
  "author": "Author Name",
  "tags": ["tag1", "tag2"],
  "image": "https://...",
  "readTime": "5 min read",
  "date": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/posts/[id]
Delete a blog post

**Authorization:** Required (must be post owner)

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

### Admin Management

#### POST /api/admin
Create a new admin user

**Authorization:** Required (admin only)

**Request:**
```json
{
  "email": "admin@example.com",
  "name": "Admin Name",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Cannot Access Dashboard

- Ensure you are logged in
- Clear browser cookies and try logging in again
- Verify your admin account is active in the database

### Cannot Delete Post

- You can only delete posts you created
- Verify you are the post owner (check for "Your Post" badge)

### Cannot Create Admin User

- Ensure you are logged in as an admin
- Check that the email is not already registered
- Verify password meets minimum requirements (12 characters)

### Session Expired

- Sessions last 7 days
- Simply log in again to create a new session

## Tips

1. **Regular Backups**: Regularly backup your database, especially before bulk deletions
2. **Search First**: Use the search feature to quickly find specific posts
3. **Review Before Deleting**: Double-check before confirming post deletion (it's permanent)
4. **Strong Passwords**: Use strong, unique passwords for admin accounts
5. **Monitor Activity**: Regularly review posts and admin users for security

## Support

For issues or questions about the admin dashboard:
1. Check the AUTHENTICATION_SETUP.md for setup instructions
2. Verify database connectivity
3. Check browser console for errors
4. Review server logs for API errors
