# Personal Blog

A modern personal blog built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 16** - Modern React framework with App Router
- 📝 **TypeScript** - Type-safe code
- 🎨 **Tailwind CSS** - Beautiful, responsive designs
- 📱 **Responsive** - Works on all devices
- 🔐 **Admin Dashboard** - Full-featured admin panel for managing posts and users
- 👥 **User Management** - Create and manage admin users
- ✏️ **Rich Text Editor** - TipTap-powered editor for creating beautiful posts
- 💬 **Comments System** - Allow readers to comment on blog posts
- 📧 **Email Service** - Integrated Resend for subscriptions and notifications
- 🔒 **Authentication** - Secure NextAuth.js integration
- 🗄️ **PostgreSQL Database** - Robust data management

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Chijex5/Blog.git
cd Blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory with the following:
```bash
# Database
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOST=your_database_host
DATABASE_PORT=5432
DATABASE_NAME=your_database_name

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db:seed-admin` - Create a new admin user (requires database setup)
- `npm run db:migrate-slug` - Add slug column and generate slugs for existing posts
- `npm run db:migrate-comments` - Add comments table for the comments feature
- `npm run db:migrate-letters` - Create letters table for Letters feature
- `npm run db:optimize` - Optimize database with performance indexes

## Admin Dashboard

The blog includes a full-featured admin dashboard for managing posts and users. See [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md) for detailed documentation.

### Quick Start

1. Set up your PostgreSQL database (see [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md))
2. Create your first admin user:
   ```bash
   npm run db:seed-admin
   ```
3. Log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
4. Access the dashboard at [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

### Features

- **View all posts** - See all blog posts in one place
- **Create/Edit posts** - Rich text editor for beautiful content
- **Delete posts** - Remove posts you created
- **Filter & Search** - Find posts quickly
- **Add admins** - Create new admin users
- **Secure** - Role-based access control

## Email Service

The blog includes a complete email service powered by Resend. See [EMAIL_SERVICE.md](EMAIL_SERVICE.md) for detailed documentation.

### Features

- **Subscription Management** - Users can subscribe to receive post notifications
- **New Post Alerts** - Automatic emails to subscribers when you publish
- **Admin Onboarding** - Welcome emails with credentials for new admins
- **Easy Unsubscribe** - One-click unsubscribe with confirmation

### Quick Setup

1. Sign up at [Resend](https://resend.com/) and get your API key
2. Add environment variables to `.env.local`:
   ```bash
   RESEND_API_KEY=your_api_key_here
   FROM_EMAIL=onboarding@resend.dev
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
3. The subscription form is already integrated in the footer!

## Comments System

The blog includes a complete comments system for reader engagement. See [COMMENTS_FEATURE.md](COMMENTS_FEATURE.md) for detailed documentation.

### Features

- **Reader Comments** - Allow readers to comment on blog posts
- **Form Validation** - Client and server-side validation
- **Email Privacy** - Email addresses are stored but never displayed
- **Moderation Ready** - Soft delete support for moderation
- **Responsive Design** - Works beautifully on all devices

### Quick Setup

1. Run the comments migration:
   ```bash
   npm run db:migrate-comments
   ```
2. Comments section appears automatically on all blog posts!

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # Public about page
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── post/              # Blog post routes (post/[slug])
│   │   ├── unsubscribe/       # Unsubscribe routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Page footer
│   │   └── ...                # Other components
│   └── lib/                   # Utility functions and configs
├── scripts/                   # Database and utility scripts
├── public/                    # Static assets
└── ...                        # Config files
```

## Blog Post URLs

Blog posts are accessible via SEO-friendly slug URLs:
- Format: `/post/[slug]` (e.g., `/post/getting-started-with-nextjs`)
- Slugs are automatically generated from post titles
- Each slug is unique and indexed in the database for fast lookups

## Adding New Blog Posts

Use the admin dashboard to create and manage blog posts:

1. Log in to the admin dashboard at `/admin/login`
2. Navigate to `/admin/dashboard`
3. Click "Create New Post"
4. Use the rich text editor to write your content
5. Add tags, categories, and other metadata
6. Publish your post

Posts are stored in the PostgreSQL database and can be managed entirely through the admin interface.

## Customization

- **Site Title**: Update in `src/app/layout.tsx` metadata
- **Header/Footer**: Modify `src/components/Header.tsx` and `src/components/Footer.tsx`
- **Colors**: Customize in `src/app/globals.css` and Tailwind classes
- **About Page**: Edit content through the admin dashboard or directly in the route files

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Chijex5/Blog)

### Other Platforms

You can also deploy to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any platform that supports Next.js

## Technologies Used

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [PostgreSQL](https://www.postgresql.org/) - Database
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Resend](https://resend.com/) - Email service
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Typography styles
- [Framer Motion](https://www.framer.com/motion/) - Animations

## License

This is a personal blog project. Feel free to use it as inspiration for your own blog!

## Author

Chijioke Uzodinma - [uzodinma.tech](https://uzodinma.tech)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
Design inspired by [Memoir](https://memoir.framer.website)
