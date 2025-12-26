'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/TipTapEditor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { generatePostId, savePost, getPostById } from '@/lib/postStorage';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface PostEditorProps {
  postId?: string;
  isNew?: boolean;
}

export default function PostEditor({ postId, isNew = false }: PostEditorProps) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>(postId || '');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  useEffect(() => {
    // If editing an existing post, load it
    if (postId && postId !== 'new') {
      const post = getPostById(postId);
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setAuthor(post.author);
        setTags(post.tags.join(', '));
        setImage(post.image || '');
        setReadTime(post.readTime);
        setCurrentId(post.id);
      }
    }
    setIsLoading(false);
  }, [postId]);

  // Auto-generate ID and redirect when user starts typing
  useEffect(() => {
    if (isNew && !hasStartedTyping && (title || content || excerpt)) {
      setHasStartedTyping(true);
      const newId = generatePostId();
      setCurrentId(newId);
      // Redirect to the new URL with the ID
      router.push(`/admin/create/${newId}`);
    }
  }, [title, content, excerpt, isNew, hasStartedTyping, router]);

  const handleSave = () => {
    setIsSaving(true);
    
    const post: BlogPost = {
      id: currentId,
      title: title || 'Untitled Post',
      excerpt: excerpt || 'No excerpt provided',
      content: content || '',
      date: new Date().toISOString().split('T')[0],
      author: author || 'Anonymous',
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : ['Uncategorized'],
      readTime: readTime || '5 min read',
      image: image || undefined,
    };

    savePost(post);
    setIsSaving(false);
    
    // Show success message or redirect
    alert('Post saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Post'}
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        {isNew ? 'Create New Post' : 'Edit Post'}
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <Input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief description of your post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Author</label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, Next.js, TypeScript"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Read Time</label>
          <Input
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="5 min read"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your post..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      {currentId && (
        <div className="mt-4 text-sm text-gray-500">
          Post ID: {currentId}
        </div>
      )}
    </div>
  );
}
