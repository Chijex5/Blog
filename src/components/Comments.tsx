'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Comment } from '@/lib/database';

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Failed to load comments. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!content.trim()) {
      setError('Comment is required');
      return;
    }

    // Validate name and email only if not anonymous
    if (!isAnonymous && (!authorName.trim() || !authorEmail.trim())) {
      setError('Name and email are required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          authorName: isAnonymous ? 'Anonymous' : authorName.trim(),
          authorEmail: isAnonymous ? 'anonymous@placeholder.com' : authorEmail.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setAuthorName('');
        setAuthorEmail('');
        setContent('');
        setSuccessMessage('Comment posted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('An error occurred while posting your comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-16 bg-white rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {/* Anonymous Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
          />
          <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
            Comment anonymously
          </label>
        </div>

        {/* Name and Email Fields - Hidden when anonymous */}
        {!isAnonymous && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Your name"
                required={!isAnonymous}
                maxLength={255}
              />
            </div>
            <div>
              <label htmlFor="author-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="author-email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="your@email.com"
                required={!isAnonymous}
                maxLength={255}
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Share your thoughts..."
            rows={4}
            required
            maxLength={2000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {content.length}/2000 characters
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-medium">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author_name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
