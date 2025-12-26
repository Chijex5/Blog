import { getBlogPost, getBlogPosts } from '@/data/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import Footer from '@/components/Footer';
import TiptapRenderer from '@/components/TiptapRenderer';

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
    <>
      <ScrollProgressBar />
      
      <main className="max-w-3xl mx-auto bg-[var(--color-warm-bg)] px-4 py-12 md:py-20">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full bg-[var(--color-warm-accent)] px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <article className="bg-[var(--color-warm-bg)] rounded-2xl p-6 md:p-12">
          {/* Header Section */}
          <header className="mb-12 text-center">
            {/* Tags and Read Time */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warm-accent)] text-black font-medium px-3 py-1 text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 text-gray-700 font-medium px-3 py-1 text-xs">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Date */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-12 rounded-xl bg-white overflow-hidden p-3">
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-xl h-[436px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <TiptapRenderer content={post.content} />
        </article>

        {/* Related Posts or CTA could go here */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Read more articles
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
