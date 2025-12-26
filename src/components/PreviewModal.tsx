'use client';

import { BlogPost } from '@/types/blog';
import { X, Clock, Tag } from 'lucide-react';
import TiptapRenderer from './TiptapRenderer';
import { useEffect } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost;
}

export default function PreviewModal({ isOpen, onClose, post }: PreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Parse HTML content to JSON for TiptapRenderer
  const parseHTMLToJSON = (html: string) => {
    // Simple parser - in production you might want something more robust
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: html ? undefined : [{ type: 'text', text: 'Start writing your post...' }],
        },
      ],
    };
  };

  const contentJSON = post.content ? parseHTMLToJSON(post.content) : parseHTMLToJSON('');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-[var(--color-warm-bg)] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="sticky top-4 float-right mr-4 mt-4 p-2 rounded-full bg-[var(--color-warm-accent)] hover:bg-gray-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Preview Content */}
          <div className="p-6 md:p-12 clear-right">
            <div className="text-center mb-4 text-sm text-gray-500 font-medium">
              PREVIEW MODE
            </div>

            <article className="bg-[var(--color-warm-bg)] rounded-2xl">
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
              <div 
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
