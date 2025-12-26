import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js and TypeScript',
    excerpt: 'Learn how to build modern web applications with Next.js 16 and TypeScript. This guide covers the basics and best practices.',
    content: `
# Getting Started with Next.js and TypeScript

Next.js has become one of the most popular React frameworks for building modern web applications. Combined with TypeScript, it provides a powerful, type-safe development experience.

## Why Next.js?

Next.js offers several advantages:

- **Server-Side Rendering (SSR)**: Improve performance and SEO
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **API Routes**: Build your backend alongside your frontend
- **File-based Routing**: Intuitive routing based on the file system
- **Image Optimization**: Automatic image optimization out of the box

## Setting Up Your Project

Getting started is easy with create-next-app:

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

## TypeScript Benefits

TypeScript adds static typing to JavaScript, which helps catch errors early and improves code quality:

- Type safety
- Better IDE support with autocomplete
- Easier refactoring
- Self-documenting code

## Conclusion

Next.js with TypeScript is a powerful combination for building modern web applications. The framework's features combined with TypeScript's type safety create an excellent developer experience.
    `,
    date: '2024-12-20',
    author: 'Your Name',
    image: 'https://framerusercontent.com/images/Wm2sQ1KRmjtWG0T2kgrNCoRpGNw.png',
    tags: ['Next.js', 'TypeScript', 'Web Development'],
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS',
    image: 'https://framerusercontent.com/images/PutCbUrDHloKzYlnrmDgTEqX2pU.png',
    excerpt: 'Discover the power of utility-first CSS with Tailwind. Learn how to build beautiful, responsive designs quickly and efficiently.',
    content: `
# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that has revolutionized how we write styles in modern web applications.

## What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML.

## Key Benefits

### Rapid Development
Build interfaces faster by composing utility classes directly in your markup.

### Consistency
Tailwind's design system ensures consistent spacing, colors, and typography across your application.

### Responsive Design
Built-in responsive modifiers make it easy to create responsive layouts:

\`\`\`html
<div class="w-full md:w-1/2 lg:w-1/3">
  Responsive div
</div>
\`\`\`

### Customization
Tailwind is highly customizable through the tailwind.config.js file.

## Best Practices

1. **Use @apply for repeated patterns**: Extract common utility patterns into custom CSS classes
2. **Follow a mobile-first approach**: Start with mobile styles and add responsive modifiers
3. **Leverage PurgeCSS**: Remove unused styles in production for optimal bundle size

## Conclusion

Tailwind CSS streamlines the styling process and helps you build beautiful, maintainable UIs quickly.
    `,
    date: '2024-12-18',
    author: 'Your Name',
    tags: ['Tailwind CSS', 'CSS', 'Design'],
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Building a Personal Blog: My Journey',
    image: 'https://framerusercontent.com/images/Ct1xSTSiaJsPf3n2aDyia8cZ390.png?scale-down-to=1024',
    excerpt: 'A reflection on creating this blog using modern web technologies. Learn about the decisions and challenges faced along the way.',
    content: `
# Building a Personal Blog: My Journey

Creating a personal blog has been on my to-do list for a while. This post documents my journey of building this very blog.

## Why Start a Blog?

There are several reasons why I decided to start blogging:

- **Share Knowledge**: Help others learn from my experiences
- **Document Learning**: Keep track of what I learn
- **Build Online Presence**: Establish myself in the developer community
- **Improve Writing**: Practice technical writing skills

## Technology Choices

### Next.js
I chose Next.js for its excellent developer experience and performance optimizations.

### TypeScript
Type safety was important to me, so TypeScript was a natural choice.

### Tailwind CSS
For rapid UI development and consistent styling.

## Features Implemented

- **Blog Post Listing**: Homepage displays all blog posts
- **Individual Post Pages**: Each post has its own dedicated page
- **Responsive Design**: Works great on all devices
- **Dark Mode Support**: Easy on the eyes
- **SEO Optimized**: Proper meta tags and semantic HTML

## Challenges Faced

### Styling Consistency
Maintaining consistent styling across different components required discipline. Tailwind's utility classes helped immensely.

### Content Management
Deciding between MDX, a CMS, or simple JSON for content storage. I went with a simple data structure for now.

## Future Improvements

- Add search functionality
- Implement tags filtering
- Add comments section
- Create RSS feed

## Conclusion

Building this blog was a great learning experience. It's a continuous work in progress, and I'm excited to keep improving it.
    `,
    date: '2024-12-15',
    author: 'Your Name',
    tags: ['Personal', 'Web Development', 'Blog'],
    readTime: '6 min read'
  }
];

export function getBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}
