'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  Tag,
  Search,
  Eye,
  Pin
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

export default function AllPostsPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwn, setFilterOwn] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  const [pinningPost, setPinningPost] = useState<string | null>(null);

  // Fetch posts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status]);

  // Filter posts based on search and ownership
  useEffect(() => {
    let filtered = posts;

    // Filter by ownership
    if (filterOwn && session?.user?.id) {
      filtered = filtered.filter(post => post.created_by === session.user.id);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterOwn, session]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      setDeleteError('');
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        setDeleteConfirm(null);
      } else {
        const error = await response.json();
        setDeleteError(error.error || 'Failed to delete post');
        setTimeout(() => setDeleteError(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleteError('Failed to delete post. Please try again.');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  const handleTogglePin = async (postId: string, currentlyPinned: boolean) => {
    try {
      setPinningPost(postId);
      
      if (currentlyPinned) {
        // Unpin the post
        const response = await fetch(`/api/posts/${postId}/pin`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.map(post => 
            post.id === postId ? { ...post, is_pinned: false } : post
          ));
        } else {
          const error = await response.json();
          setDeleteError(error.error || 'Failed to unpin post');
          setTimeout(() => setDeleteError(''), 5000);
        }
      } else {
        // Pin the post (this will unpin others)
        const response = await fetch(`/api/posts/${postId}/pin`, {
          method: 'POST',
        });

        if (response.ok) {
          setPosts(posts.map(post => ({
            ...post,
            is_pinned: post.id === postId
          })));
        } else {
          const error = await response.json();
          setDeleteError(error.error || 'Failed to pin post');
          setTimeout(() => setDeleteError(''), 5000);
        }
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      setDeleteError('Failed to toggle pin. Please try again.');
      setTimeout(() => setDeleteError(''), 5000);
    } finally {
      setPinningPost(null);
    }
  };

  const isOwnPost = (post: BlogPost) => {
    return post.created_by === session?.user?.id;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: posts.length,
    own: posts.filter(post => post.created_by === session?.user?.id).length,
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h1>
        <p className="text-gray-600">View and manage all blog posts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.own}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterOwn(!filterOwn)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterOwn 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOwn ? 'Show All Posts' : 'Show My Posts'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Error Message */}
      {deleteError && (
        <div className="bg-red-50 text-red-800 px-4 py-3 rounded-xl text-sm mb-6 border border-red-200">
          {deleteError}
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterOwn ? 'No posts found matching your criteria' : 'No posts yet. Create your first post!'}
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={`/blog/${post.id}`}
                            className={`font-medium hover:text-blue-600 line-clamp-1 ${post.is_deleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {post.excerpt}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {isOwnPost(post) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Your Post
                              </span>
                            )}
                            {post.is_deleted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Deleted
                              </span>
                            )}
                            {post.is_pinned && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Pin className="w-3 h-3 mr-1" />
                                Pinned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                          title="View post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {/* Pin button - only for non-deleted posts */}
                        {!post.is_deleted && (
                          <button
                            onClick={() => handleTogglePin(post.id, post.is_pinned || false)}
                            disabled={pinningPost === post.id}
                            className={`transition-colors p-2 rounded-lg hover:bg-gray-100 ${
                              post.is_pinned 
                                ? 'text-yellow-600 hover:text-yellow-700' 
                                : 'text-gray-400 hover:text-yellow-600'
                            } ${pinningPost === post.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={post.is_pinned ? 'Unpin post' : 'Pin post'}
                          >
                            <Pin className={`w-4 h-4 ${post.is_pinned ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        
                        {isOwnPost(post) && (
                          <>
                            <Link
                              href={`/admin/edit/${post.id}`}
                              className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                              title="Edit post"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            
                            {deleteConfirm === post.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(post.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>💡 Tip: You can only edit and delete your own posts</p>
      </div>
    </div>
  );
}
