'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import RichEditor from '@/components/RichEditor';
import TiptapRenderer from '@/components/TiptapRenderer';
import { Button } from './ui/button';

// Calculate read time based on word count
function calculateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export default function AdminEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const readTime = calculateReadTime(content);
  const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);

  // Load existing post if editing
  useEffect(() => {
    if (postId) {
      // TODO: Load from database
      const stored = localStorage.getItem(`post-${postId}`);
      if (stored) {
        const post = JSON.parse(stored);
        setTitle(post.title || '');
        setExcerpt(post.excerpt || '');
        setAuthor(post.author || '');
        setTags(post.tags?.join(', ') || '');
        setImage(post.image || '');
        setContent(post.content || '');
      }
    }
  }, [postId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setSaveMessage('Please fill in title and content');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const id = postId || generateId();
      const post = {
        id,
        title,
        excerpt,
        content,
        author: author || 'Anonymous',
        tags: tagsArray,
        image,
        readTime,
        date: new Date().toISOString(),
      };

      // Save to API endpoint
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      const savedPost = await response.json();
      
      setSaveMessage('Post saved successfully!');
      setTimeout(() => {
        router.push(`/blog/${savedPost.id}`);
      }, 1000);
    } catch (error) {
      console.error('Error saving post:', error);
      
      // Fallback to localStorage
      const id = postId || generateId();
      const post = {
        id,
        title,
        excerpt,
        content,
        author: author || 'Anonymous',
        tags: tagsArray,
        image,
        readTime,
        date: new Date().toISOString(),
      };
      
      localStorage.setItem(`post-${id}`, JSON.stringify(post));
      
      setSaveMessage('Post saved locally (database unavailable)');
      setTimeout(() => {
        router.push(`/blog/${id}`);
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto bg-[var(--color-warm-bg)] px-4 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full bg-[var(--color-warm-accent)] px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Publish Post'}
            </button>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-4 p-4 rounded-xl ${
            saveMessage.includes('successfully') ? 'bg-green-50 text-green-800' : 
            saveMessage.includes('unavailable') ? 'bg-yellow-50 text-yellow-800' :
            'bg-red-50 text-red-800'
          }`}>
            {saveMessage}
          </div>
        )}

        <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-gray-900 mb-4">
              {postId ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600">
              Write your thoughts and share them with the world
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief description of your post"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans resize-none"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Next.js, TypeScript"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Image URL (optional)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 font-sans"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content
              </label>
              <RichEditor
                content={content}
                onChange={setContent}
              />
              <p className="mt-2 text-sm text-gray-500">
                Read time: {readTime}
              </p>
            </div>
          </div>
        </article>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">PREVIEW MODE</div>
              <Button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <article className="p-8 md:p-12">
              {/* Header */}
              <header className="mb-12 text-center">
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  {tagsArray.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warm-accent)] text-black font-medium px-3 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 text-gray-700 font-medium px-3 py-1 text-xs">
                    {readTime}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-gray-900 mb-6">
                  {title || 'Untitled Post'}
                </h1>

                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {excerpt || 'No excerpt provided'}
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>By {author || 'Anonymous'}</span>
                  <span>•</span>
                  <time>{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</time>
                </div>
              </header>

              {/* Featured Image */}
              {image && (
                <div className="mb-12 rounded-xl overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <TiptapRenderer content={content || '<p>No content yet. Start writing!</p>'} />
            </article>
          </div>
        </div>
      )}
    </>
  );
}
