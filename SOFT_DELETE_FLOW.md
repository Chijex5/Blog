# Soft Delete Flow Diagram

## Before Implementation (Hard Delete)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DELETES POST                     │
│                      (Admin Dashboard)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  DELETE query  │
                  │  executed      │
                  └────────┬───────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Post permanently      │
              │  removed from DB       │
              └────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐          ┌─────────────────┐
│  Public View  │          │   Admin View    │
│               │          │                 │
│  ❌ Post gone │          │  ❌ Post gone   │
│               │          │                 │
└───────────────┘          └─────────────────┘

PROBLEM: Post still visible to public (race condition)
```

## After Implementation (Soft Delete)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DELETES POST                     │
│                      (Admin Dashboard)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  UPDATE query  │
                  │  is_deleted=true│
                  └────────┬───────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Post marked as        │
              │  deleted in DB         │
              │  (data preserved)      │
              └────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌───────────────┐          ┌─────────────────────┐
│  Public View  │          │   Admin View        │
│               │          │                     │
│  ✅ Hidden    │          │  ✅ Visible with    │
│  (404 error)  │          │  "Deleted" badge    │
│               │          │  & strikethrough    │
└───────────────┘          └─────────────────────┘

SOLUTION: Post hidden from public, visible to admin
```

## Database Query Flow

### Public User Requests Post

```
┌──────────────────┐
│  User visits     │
│  /blog/post-123  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  getPost(id)                            │
│  SELECT * FROM blog_posts               │
│  WHERE id = $1                          │
│  AND is_deleted = false  ← NEW FILTER  │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐   ┌─────────┐
│Found│   │Not Found│
│Post │   │(deleted)│
└──┬──┘   └────┬────┘
   │           │
   ▼           ▼
┌─────┐    ┌─────┐
│Show │    │ 404 │
│Post │    │Error│
└─────┘    └─────┘
```

### Admin User Views Posts

```
┌──────────────────┐
│  Admin visits    │
│  /admin/posts    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  getAllPostsIncludingDeleted()          │
│  SELECT * FROM blog_posts               │
│  ORDER BY date DESC                     │
│  (NO is_deleted filter)  ← KEY DIFF    │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Returns ALL posts:      │
│  - Active posts          │
│  - Deleted posts         │
│    (with is_deleted=true)│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  UI shows:               │
│  ✓ Active posts (normal) │
│  ✓ Deleted posts with:   │
│    - Red "Deleted" badge │
│    - Strikethrough title │
└──────────────────────────┘
```

## Database Schema

### Before
```sql
blog_posts
├── id (VARCHAR PRIMARY KEY)
├── title (VARCHAR)
├── content (TEXT)
├── author (VARCHAR)
├── date (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### After
```sql
blog_posts
├── id (VARCHAR PRIMARY KEY)
├── title (VARCHAR)
├── content (TEXT)
├── author (VARCHAR)
├── date (TIMESTAMP)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── is_deleted (BOOLEAN DEFAULT false)  ← NEW

Indexes:
├── idx_blog_posts_date (date DESC)
├── idx_blog_posts_tags (tags GIN)
├── idx_blog_posts_deleted (is_deleted)         ← NEW
└── idx_blog_posts_id_deleted (id, is_deleted)  ← NEW
```

## API Endpoints Behavior

### GET /api/posts

```
Request without authentication (Public):
┌─────────────────┐
│ GET /api/posts  │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ getAllPosts()        │
│ WHERE is_deleted=false│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Returns only         │
│ active posts         │
└──────────────────────┘


Request with authentication (Admin):
┌─────────────────┐
│ GET /api/posts  │
│ (authenticated) │
└────────┬────────┘
         │
         ▼
┌───────────────────────────┐
│ getAllPostsIncludingDeleted()│
│ (no filter)               │
└────────┬──────────────────┘
         │
         ▼
┌──────────────────────┐
│ Returns all posts    │
│ including deleted    │
└──────────────────────┘
```

### DELETE /api/posts/[id]

```
Before (Hard Delete):
┌─────────────────────┐
│ DELETE /api/posts/1 │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ DELETE FROM         │
│ blog_posts          │
│ WHERE id = $1       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Post permanently    │
│ removed             │
└─────────────────────┘


After (Soft Delete):
┌─────────────────────┐
│ DELETE /api/posts/1 │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ UPDATE blog_posts   │
│ SET is_deleted=true │
│ WHERE id = $1       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Post marked deleted │
│ (data preserved)    │
└─────────────────────┘
```

## Key Benefits

1. **Data Safety**: Never lose content permanently
2. **User Privacy**: Deleted content hidden from public
3. **Admin Control**: Full visibility of deleted items
4. **Reversibility**: Can restore posts (future feature)
5. **Audit Trail**: Complete history maintained
6. **Performance**: Optimized with composite indexes
