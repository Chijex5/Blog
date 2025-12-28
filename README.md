# Personal Blog

A modern personal blog built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 16** - Latest version with App Router
- 📝 **TypeScript** - Type-safe code
- 🎨 **Tailwind CSS** - Beautiful, responsive designs
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Responsive** - Works on all devices
- ⚡ **Static Site Generation** - Fast loading times
- 📖 **Markdown Support** - Write blog posts in markdown
- 🔐 **Admin Dashboard** - Full-featured admin panel for managing posts and users
- 👥 **User Management** - Create and manage admin users
- ✏️ **Rich Text Editor** - TipTap-powered editor for creating beautiful posts
- 📧 **Email Service** - Integrated Resend for subscriptions and notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db:seed-admin` - Create a new admin user (requires database setup)

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

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── blog/[id]/         # Dynamic blog post pages
│   ├── about/             # About page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Page footer
│   └── BlogCard.tsx       # Blog post card
├── data/                  # Blog data
│   └── posts.ts           # Blog posts content
├── types/                 # TypeScript types
│   └── blog.ts            # Blog post types
└── public/                # Static assets
```

## Adding New Blog Posts

To add a new blog post, edit the `data/posts.ts` file and add a new post object:

```typescript
{
  id: '4',
  title: 'Your Post Title',
  excerpt: 'A brief description of your post',
  content: `
# Your Post Title

Your markdown content here...
  `,
  date: '2024-12-25',
  author: 'Your Name',
  tags: ['Tag1', 'Tag2'],
  readTime: '5 min read'
}
```

## Customization

- **Site Title**: Update in `app/layout.tsx` metadata
- **Header/Footer**: Modify `components/Header.tsx` and `components/Footer.tsx`
- **Colors**: Customize in `app/globals.css` and Tailwind classes
- **About Page**: Edit `app/about/page.tsx`

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

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Typography styles

## License

This is a personal blog project. Feel free to use it as inspiration for your own blog!

## Author

Chijioke - Personal Blog

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
