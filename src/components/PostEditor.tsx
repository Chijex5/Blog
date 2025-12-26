'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/TipTapEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { generatePostId, savePost, getPostById } from '@/lib/postStorage';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import PreviewModal from './PreviewModal';

interface PostEditorProps {
  postId?: string;
}

const DEFAULT_TAG = 'Uncategorized';

// Calculate read time based on word count (average reading speed: 200 words per minute)
function calculateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // If editing an existing post, load it
    if (postId) {
      const post = getPostById(postId);
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setAuthor(post.author);
        setTags(post.tags.join(', '));
        setImage(post.image || '');
      }
    }
    setIsLoading(false);
  }, [postId]);

  const handleSave = () => {
    setIsSaving(true);
    
    const newId = postId || generatePostId();
    const readTime = calculateReadTime(content);
    
    const post: BlogPost = {
      id: newId,
      title: title || 'Untitled Post',
      excerpt: excerpt || 'No excerpt provided',
      content: content || '',
      date: new Date().toISOString().split('T')[0],
      author: author || 'Anonymous',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [DEFAULT_TAG],
      readTime,
      image: image || undefined,
    };

    savePost(post);
    setIsSaving(false);
    
    // Navigate to the post to see it
    router.push(`/blog/${newId}`);
  };

  const previewPost: BlogPost = {
    id: 'preview',
    title: title || 'Untitled Post',
    excerpt: excerpt || 'No excerpt provided',
    content: content || '<p>Start writing your post...</p>',
    date: new Date().toISOString().split('T')[0],
    author: author || 'Anonymous',
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [DEFAULT_TAG],
    readTime: calculateReadTime(content),
    image: image || undefined,
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
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
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {postId ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Write your thoughts and share them with the world
            </p>
          </header>

          {/* Form */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="h-12 text-lg bg-white rounded-xl border-none shadow-sm"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Excerpt
              </label>
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief description of your post"
                className="h-12 bg-white rounded-xl border-none shadow-sm"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Author
              </label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="h-12 bg-white rounded-xl border-none shadow-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags (comma-separated)
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Next.js, TypeScript"
                className="h-12 bg-white rounded-xl border-none shadow-sm"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Image URL (optional)
              </label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-12 bg-white rounded-xl border-none shadow-sm"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Content
              </label>
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your post..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Read time: {calculateReadTime(content)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6">
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="h-11 px-6 rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 px-8 rounded-xl"
              >
                {isSaving ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </article>
      </main>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        post={previewPost}
      />
    </>
  );
}
