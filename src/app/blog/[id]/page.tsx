import { getBlogPost, getBlogPosts } from '@/data/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const { id } = await params;
  const post = getBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className='w-full flex items-center justify-between'>
        <Link
          href="/"
          className="inline-block mb-6 rounded-full text-black/48 bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          Back
        </Link>

        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black/48 font-bold px-4 py-1 text-xs">
          {post.tags[0]} . {post.readTime}
        </span>

        <span className="flex items-center cursor:pointer justify-between mb-6 rounded-full bg-[var(--color-warm-accent)] text-black/48 font-bold px-1 py-1 text-xs">
          <ChevronRight className="inline-block w-4 h-4" />
        </span>
      </div>      
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="text-center text-base text-black/48 dark:text-gray-400">
            {post.excerpt}
          </div>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
