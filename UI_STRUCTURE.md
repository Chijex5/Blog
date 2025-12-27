# Admin Dashboard UI Structure

## Dashboard Layout

```
╔═══════════════════════════════════════════════════════════════════════╗
║  My Blog | Admin Dashboard          User Name [Sign Out]              ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  ┌───────────────────────────┐  ┌───────────────────────────┐        ║
║  │ 📄 Total Posts            │  │ 👤 Your Posts             │        ║
║  │ 42                        │  │ 15                        │        ║
║  └───────────────────────────┘  └───────────────────────────┘        ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────┐     ║
║  │ 🔍 Search posts...     [Show My Posts] [New Post] [Add Admin] │    ║
║  └─────────────────────────────────────────────────────────────┘     ║
║                                                                         ║
║  ┌─────────────────────────────────────────────────────────────┐     ║
║  │ Add New Admin User                                          │     ║
║  │ ┌─────────────────┐  ┌─────────────────┐                  │     ║
║  │ │ Email          │  │ Name            │                  │     ║
║  │ └─────────────────┘  └─────────────────┘                  │     ║
║  │ ┌─────────────────┐  ┌─────────────────┐                  │     ║
║  │ │ Password       │  │ Confirm Pwd     │                  │     ║
║  │ └─────────────────┘  └─────────────────┘                  │     ║
║  │ [Create Admin] [Cancel]                                    │     ║
║  └─────────────────────────────────────────────────────────────┘     ║
║                                                                         ║
║  ╔════════════════════════════════════════════════════════════════╗  ║
║  ║ Post              | Author  | Date       | Tags    | Actions  ║  ║
║  ╠════════════════════════════════════════════════════════════════╣  ║
║  ║ [IMG] Title 1     | John    | 2024-01-01 | [Tech]  | 👁 ✏ 🗑  ║  ║
║  ║ Brief excerpt...  |         |            | [Code]  |          ║  ║
║  ║ [Your Post]       |         |            |         |          ║  ║
║  ╟────────────────────────────────────────────────────────────────╢  ║
║  ║ [IMG] Title 2     | Jane    | 2024-01-02 | [News]  | 👁       ║  ║
║  ║ Brief excerpt...  |         |            |         |          ║  ║
║  ╟────────────────────────────────────────────────────────────────╢  ║
║  ║ [IMG] Title 3     | John    | 2024-01-03 | [AI]    | 👁 ✏ 🗑  ║  ║
║  ║ Brief excerpt...  |         |            | [ML]    |          ║  ║
║  ║ [Your Post]       |         |            |         |          ║  ║
║  ╚════════════════════════════════════════════════════════════════╝  ║
║                                                                         ║
║  💡 Tip: You can only edit and delete your own posts                  ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Key UI Components

### Header Section
- **Logo/Title**: "My Blog | Admin Dashboard"
- **User Info**: Displays logged-in user name/email
- **Sign Out Button**: Logs out and redirects to login page

### Statistics Cards
Two side-by-side cards showing:
1. **Total Posts**: Count of all posts in system
2. **Your Posts**: Count of posts created by current user

### Action Bar
- **Search Input**: Real-time search with magnifying glass icon
- **Filter Toggle**: "Show My Posts" / "Show All Posts" button
- **New Post Button**: Blue button with plus icon
- **Add Admin Button**: Green button with user-plus icon

### Admin Creation Form (Collapsible)
Shows when "Add Admin" is clicked:
- Two-column layout on desktop
- Email and Name fields in first row
- Password and Confirm Password in second row
- Create Admin (black) and Cancel (gray) buttons
- Inline error/success messages

### Posts Table
Responsive table with columns:
1. **Post**: 
   - Thumbnail image (if available)
   - Title (linked to post)
   - Excerpt (truncated)
   - "Your Post" badge (if owned by current user)
2. **Author**: Author name
3. **Date**: Publication date with calendar icon
4. **Tags**: Tag badges (shows first 2, then "+X more")
5. **Actions**:
   - View icon (eye) - for all posts
   - Edit icon (pencil) - only for own posts
   - Delete icon (trash) - only for own posts

### Delete Confirmation
When delete is clicked:
- Replaces action icons with:
  - Red "Confirm" button
  - Gray "Cancel" button

### Error Display
- Red banner at top of posts list
- Auto-dismisses after 5 seconds
- Shows specific error message

### Empty States
- "No posts yet. Create your first post!" (if no posts exist)
- "No posts found matching your criteria" (if search/filter returns nothing)

## Responsive Behavior

### Mobile (< 768px)
- Stack statistics cards vertically
- Search and action buttons stack vertically
- Admin form fields stack vertically
- Table becomes horizontally scrollable
- Action icons remain accessible

### Tablet (768px - 1024px)
- Two-column statistics
- Action bar wraps naturally
- Table shows all columns
- Admin form shows two columns

### Desktop (> 1024px)
- Full layout as shown above
- Maximum width container (7xl)
- Optimal spacing and padding

## Color Scheme

### Primary Colors
- **Background**: Warm beige (`var(--color-warm-bg)`)
- **Cards**: White with gray borders
- **Text**: Gray-900 (dark) / Gray-600 (medium) / Gray-500 (light)

### Interactive Elements
- **Primary Button**: Black (gray-900) with white text
- **Secondary Button**: Gray-100 with gray-700 text
- **Blue Button**: Blue-600 for "New Post"
- **Green Button**: Green-600 for "Add Admin"
- **Red Button**: Red-600 for delete confirm

### Status Colors
- **Success**: Green-50 background, green-800 text
- **Error**: Red-50 background, red-800 text
- **Info**: Blue-50 background, blue-800 text

### Hover States
- Buttons: Slightly darker shade
- Table rows: Gray-50 background
- Icons: Color change (gray-400 to blue/red)

## Icons Used (Lucide React)

- 👁 **Eye**: View post
- ✏️ **Edit**: Edit post
- 🗑️ **Trash2**: Delete post
- ➕ **Plus**: New post
- 👥 **UserPlus**: Add admin
- 🚪 **LogOut**: Sign out
- 👤 **User**: User profile
- 📄 **FileText**: Total posts stat
- 🔍 **Search**: Search input
- 📅 **Calendar**: Date display
- 🏷️ **Tag**: Tag display
- 🎯 **LayoutDashboard**: Dashboard nav link

## User Flow

### Creating a New Post
1. Click "New Post" button
2. Redirected to `/admin/create/new`
3. Fill in post details
4. Click "Publish Post"
5. Redirected to published post

### Editing a Post
1. Find post in dashboard (must be your post)
2. Click edit icon (pencil)
3. Redirected to `/admin/edit/[id]`
4. Make changes
5. Click save
6. Redirected to updated post

### Deleting a Post
1. Find post in dashboard (must be your post)
2. Click delete icon (trash)
3. Confirmation buttons appear
4. Click "Confirm" to delete
5. Post removed from list immediately
6. Or click "Cancel" to abort

### Adding an Admin
1. Click "Add Admin" button
2. Form slides open
3. Fill in email, name, password, confirm password
4. Click "Create Admin"
5. Success message shows
6. Form clears and closes
7. New admin can log in immediately

### Searching Posts
1. Type in search box
2. Results filter in real-time
3. Searches title, excerpt, author, tags
4. Clear search to show all posts

### Filtering Posts
1. Click "Show My Posts"
2. List filters to only your posts
3. Statistics update to show filtered count
4. Click "Show All Posts" to reset

## Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy
- Focus states on all interactive elements
- Keyboard navigation support
- ARIA labels where needed
- Sufficient color contrast
- Loading states with spinners
- Error messages clearly announced

## Performance Considerations

- Client-side rendering with React
- Real-time search without debounce (may need optimization for large datasets)
- Images lazy-loaded where supported
- Optimistic UI updates on deletion
- Minimal re-renders with proper React hooks

## Security Visual Indicators

- 🔒 "Your Post" badge - ownership indicator
- 👁 View icon on all posts - anyone can view
- ✏️ Edit icon only on own posts - restricted access
- 🗑️ Delete icon only on own posts - restricted access
- 🔐 Protected routes redirect to login
- 🔑 Session info in header

This visual structure provides a clear, intuitive interface for managing blog posts and admin users while maintaining security and usability.
