'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import RichEditor from '@/components/RichEditor';
import TiptapRenderer from '@/components/TiptapRenderer';
import { Button } from './ui/button';
import { Letter } from '@/lib/database';

// Calculate read time based on word count
function calculateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

export default function LetterEditor({ letterId, letterData }: { letterId?: string; letterData?: Letter }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [letterNumber, setLetterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState(session?.user?.name || '');
  const [tags, setTags] = useState('');
  const [series, setSeries] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const readTime = calculateReadTime(content);
  const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);

  // Load existing letter if editing
  useEffect(() => {
    if (letterData) {
      setLetterNumber(letterData.letter_number.toString());
      setTitle(letterData.title || '');
      setSubtitle(letterData.subtitle || '');
      setRecipient(letterData.recipient || '');
      setExcerpt(letterData.excerpt || '');
      setAuthor(letterData.author || '');
      setTags(letterData.tags?.join(', ') || '');
      setSeries(letterData.series || '');
      setImage(letterData.image || '');
      setContent(typeof letterData.content === 'string' ? letterData.content : JSON.stringify(letterData.content || {}));
    } else {
      // Auto-suggest next letter number for new letters
      fetchNextLetterNumber();
    }
  }, [letterData]);

  const fetchNextLetterNumber = async () => {
    try {
      const response = await fetch('/api/letters?includeDeleted=true');
      if (response.ok) {
        const letters = await response.json();
        if (letters.length > 0) {
          const maxNumber = Math.max(...letters.map((l: Letter) => l.letter_number));
          setLetterNumber((maxNumber + 1).toString());
        } else {
          setLetterNumber('1');
        }
      } else {
        setLetterNumber('1');
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
      setLetterNumber('1');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !recipient.trim() || !letterNumber.trim()) {
      setSaveMessage('Please fill in letter number, title, recipient, and content');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const letterNum = parseInt(letterNumber);
    if (isNaN(letterNum) || letterNum < 1) {
      setSaveMessage('Letter number must be a positive integer');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    // Validate image URL if provided
    if (image && !image.match(/^https?:\/\/.+/)) {
      setSaveMessage('Please enter a valid image URL starting with http:// or https://');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const letter = {
        id: letterId, // Only include if editing existing letter
        letter_number: letterNum,
        title: title.trim().slice(0, 500),
        subtitle: subtitle.trim().slice(0, 500),
        recipient: recipient.trim().slice(0, 255),
        excerpt: excerpt.trim().slice(0, 1000),
        content,
        author: (author || 'Anonymous').trim().slice(0, 255),
        tags: tagsArray,
        series: series.trim() || undefined,
        image: image.trim(),
        readTime,
        published_date: new Date().toISOString(),
      };

      // Save to API endpoint
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save letter');
      }

      const savedLetter = await response.json();
      
      setSaveMessage('Letter saved successfully!');
      setTimeout(() => {
        router.push(`/letters/${savedLetter.slug}`);
      }, 1000);
    } catch (error) {
      console.error('Error saving letter:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to save letter. Please try again.');
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/letters"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Letters</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">
                {letterId ? 'Edit Letter' : 'New Letter'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Publish Letter'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div className={`p-4 rounded-lg ${saveMessage.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {saveMessage}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showPreview ? (
          /* Editor Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Letter Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter Number *
                </label>
                <input
                  type="number"
                  value={letterNumber}
                  onChange={(e) => setLetterNumber(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Sequential number for this letter (e.g., 1, 2, 3...)</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Dear Student Who Feels Behind Everyone Else"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Optional subtitle"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient *
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Students who feel behind everyone else"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Who is this letter written to?</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short preview of what this letter covers..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Letter Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichEditor content={content} onChange={setContent} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Series */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Series</h3>
                <select
                  value={series}
                  title={'Series'}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">No series</option>
                  <option value="Dear Student Who...">Dear Student Who...</option>
                  <option value="From the Trenches">From the Trenches</option>
                  <option value="Ask Me Anything">Ask Me Anything</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Group related letters together</p>
              </div>

              {/* Author */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Author</h3>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="motivation, learning, growth"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Separate with commas</p>
              </div>

              {/* Image */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Featured Image</h3>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">Optional image URL</p>
              </div>

              {/* Read Time */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Read Time</h3>
                <div className="text-2xl font-bold text-gray-900">{readTime}</div>
                <p className="text-xs text-gray-500 mt-2">Auto-calculated from content</p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg border border-gray-200">
            {/* Preview Header */}
            <div className="mb-8">
              <span className="inline-block rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1.5 text-sm mb-4">
                Letter #{letterNumber}
              </span>
              <p className="text-lg font-medium text-gray-600 mb-4">
                To: {recipient || 'Recipient'}
              </p>
              <h1 className="text-4xl md:text-5xl font-sans font-weight-500 tracking-tight text-gray-900 mb-4">
                {title || 'Letter Title'}
              </h1>
              {subtitle && (
                <p className="text-xl text-gray-700 mb-6">{subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
                <time>{new Date().toLocaleDateString()}</time>
                <span>•</span>
                <span>{readTime}</span>
                {series && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-[var(--color-warm-accent)]/30 rounded-md">
                      {series}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Preview Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {content ? <TiptapRenderer content={content} /> : <p className="text-gray-400">Letter content will appear here...</p>}
            </div>

            {/* Preview Signature */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-700 mb-2">Stay in the game,</p>
              <p className="text-gray-900 font-medium text-lg">{author || 'Author'}</p>
            </div>

            {/* Preview Tags */}
            {tagsArray.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {tagsArray.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/70 text-gray-700 text-sm rounded-full border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
