import { BlogPost } from "@/types/blog";
import { getAllPosts, getPost } from '@/lib/database';

// Fallback static posts (used if database is unavailable)
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js and TypeScript',
    excerpt: 'Learn how to build modern web applications with Next.js 16 and TypeScript. This guide covers the basics and best practices.',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Getting Started with Next.js and TypeScript' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Next.js has become one of the most popular React frameworks for building modern web applications. Combined with TypeScript, it provides a powerful, type-safe development experience.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Why Next.js?' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Next.js offers several advantages:' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Server-Side Rendering (SSR)', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Improve performance and SEO' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Static Site Generation (SSG)', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Pre-render pages at build time' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'API Routes', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Build your backend alongside your frontend' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'File-based Routing', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Intuitive routing based on the file system' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Image Optimization', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Automatic image optimization out of the box' }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Setting Up Your Project' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Getting started is easy with create-next-app:' }]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'bash' },
          content: [{ type: 'text', text: 'npx create-next-app@latest my-app --typescript' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'TypeScript Benefits' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'TypeScript adds static typing to JavaScript, which helps catch errors early and improves code quality:' }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Type safety' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Better IDE support with autocomplete' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Easier refactoring' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Self-documenting code' }] }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Next.js with TypeScript is a powerful combination for building modern web applications. The framework's features combined with TypeScript's type safety create an excellent developer experience." }
          ]
        }
      ]
    },
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
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Mastering Tailwind CSS' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Tailwind CSS is a utility-first CSS framework that has revolutionized how we write styles in modern web applications.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'What is Tailwind CSS?' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Key Benefits' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Rapid Development' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Build interfaces faster by composing utility classes directly in your markup.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Consistency' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Tailwind's design system ensures consistent spacing, colors, and typography across your application." }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Responsive Design' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Built-in responsive modifiers make it easy to create responsive layouts:' }
          ]
        },
        {
          type: 'codeBlock',
          attrs: { language: 'html' },
          content: [{ type: 'text', text: '<div class="w-full md:w-1/2 lg:w-1/3">\n  Responsive div\n</div>' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Customization' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Tailwind is highly customizable through the tailwind.config.js file.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Best Practices' }]
        },
        {
          type: 'orderedList',
          attrs: { start: 1 },
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Use @apply for repeated patterns', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Extract common utility patterns into custom CSS classes' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Follow a mobile-first approach', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Start with mobile styles and add responsive modifiers' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Leverage PurgeCSS', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Remove unused styles in production for optimal bundle size' }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Tailwind CSS streamlines the styling process and helps you build beautiful, maintainable UIs quickly.' }
          ]
        }
      ]
    },
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
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Building a Personal Blog: My Journey' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Creating a personal blog has been on my to-do list for a while. This post documents my journey of building this very blog.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Why Start a Blog?' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'There are several reasons why I decided to start blogging:' }
          ]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Share Knowledge', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Help others learn from my experiences' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Document Learning', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Keep track of what I learn' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Build Online Presence', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Establish myself in the developer community' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Improve Writing', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Practice technical writing skills' }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Technology Choices' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Next.js' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'I chose Next.js for its excellent developer experience and performance optimizations.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'TypeScript' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Type safety was important to me, so TypeScript was a natural choice.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Tailwind CSS' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'For rapid UI development and consistent styling.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Features Implemented' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Blog Post Listing', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Homepage displays all blog posts' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Individual Post Pages', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Each post has its own dedicated page' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Responsive Design', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Works great on all devices' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Dark Mode Support', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Easy on the eyes' }
                  ]
                }
              ]
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'SEO Optimized', marks: [{ type: 'bold' }] },
                    { type: 'text', text: ': Proper meta tags and semantic HTML' }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Challenges Faced' }]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Styling Consistency' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Maintaining consistent styling across different components required discipline. Tailwind's utility classes helped immensely." }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Content Management' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Deciding between MDX, a CMS, or simple JSON for content storage. I went with a simple data structure for now.' }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Future Improvements' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Add search functionality' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Implement tags filtering' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Add comments section' }] }]
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Create RSS feed' }] }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Building this blog was a great learning experience. It's a continuous work in progress, and I'm excited to keep improving it." }
          ]
        }
      ]
    },
    date: '2024-12-15',
    author: 'Your Name',
    tags: ['Personal', 'Web Development', 'Blog'],
    readTime: '6 min read'
  }
];

/**
 * Parse content - handles both HTML strings and TipTap JSON
 */
function parseContent(content: any): any {
  if (!content) {
    return { type: 'doc', content: [] };
  }
  
  // If it's already an object, return it
  if (typeof content === 'object' && content.type) {
    return content;
  }
  
  // If it's a string, try to parse as JSON
  if (typeof content === 'string') {
    // Check if it's HTML (starts with < tag)
    if (content.trim().startsWith('<')) {
      // Convert HTML to simple TipTap format
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content.replace(/<[^>]*>/g, '') // Strip HTML tags for now
              }
            ]
          }
        ]
      };
    }
    
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // If parsing fails, treat as plain text
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content
              }
            ]
          }
        ]
      };
    }
  }
  
  return content;
}

/**
 * Get all blog posts from database, with fallback to static posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await getAllPosts();
    
    if (dbPosts && dbPosts.length > 0) {
      // Convert database posts to BlogPost format
      return dbPosts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: parseContent(post.content),
        date: typeof post.date === 'string' ? post.date : post.date.toISOString(),
        author: post.author,
        image: post.image,
        tags: post.tags,
        readTime: post.read_time,
      }));
    }
  } catch (error) {
    console.error('Error fetching posts from database, using fallback:', error);
  }
  
  // Fallback to static posts
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by ID from database, with fallback to static posts
 */
export async function getBlogPost(id: string): Promise<BlogPost | undefined> {
  try {
    const dbPost = await getPost(id);
    
    if (dbPost) {
      // Convert database post to BlogPost format
      return {
        id: dbPost.id,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: parseContent(dbPost.content),
        date: typeof dbPost.date === 'string' ? dbPost.date : dbPost.date.toISOString(),
        author: dbPost.author,
        image: dbPost.image,
        tags: dbPost.tags,
        readTime: dbPost.read_time,
      };
    }
  } catch (error) {
    console.error(`Error fetching post ${id} from database, using fallback:`, error);
  }
  
  // Fallback to static post
  return blogPosts.find(post => post.id === id);
}
