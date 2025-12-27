'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  Plus, 
  LogOut, 
  User,
  FileText,
  Calendar,
  Tag,
  Search,
  UserPlus,
  Eye
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwn, setFilterOwn] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  
  // Add admin form state
  const [adminForm, setAdminForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminFormError('');
    setAdminFormSuccess('');

    // Validate form
    if (!adminForm.email || !adminForm.name || !adminForm.password || !adminForm.confirmPassword) {
      setAdminFormError('All fields are required');
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      setAdminFormError('Passwords do not match');
      return;
    }

    if (adminForm.password.length < 12) {
      setAdminFormError('Password must be at least 12 characters long');
      return;
    }

    setIsSubmittingAdmin(true);

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminForm.email,
          name: adminForm.name,
          password: adminForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminFormSuccess(`Admin user ${data.user.email} created successfully!`);
        setAdminForm({ email: '', name: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          setShowAddAdmin(false);
          setAdminFormSuccess('');
        }, 2000);
      } else {
        setAdminFormError(data.error || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setAdminFormError('Failed to create admin user');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const isOwnPost = (post: BlogPost) => {
    return post.created_by === session?.user?.id;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm-bg)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: posts.length,
    own: posts.filter(post => post.created_by === session?.user?.id).length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-warm-bg)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              My Blog
            </Link>
            <span className="text-sm text-gray-500">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              <User className="w-4 h-4 inline mr-1" />
              {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                <User className="w-6 h-6 text-green-600" />
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
              
              <Link
                href="/admin/create/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>

              <button
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Admin
              </button>
            </div>
          </div>
        </div>

        {/* Add Admin Form */}
        {showAddAdmin && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Admin User</h3>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Admin Name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password (min 12 characters)
                  </label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="••••••••••••"
                    required
                    minLength={12}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="••••••••••••"
                    required
                    minLength={12}
                  />
                </div>
              </div>

              {adminFormError && (
                <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {adminFormError}
                </div>
              )}

              {adminFormSuccess && (
                <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {adminFormSuccess}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmittingAdmin ? 'Creating...' : 'Create Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdmin(false);
                    setAdminForm({ email: '', name: '', password: '', confirmPassword: '' });
                    setAdminFormError('');
                    setAdminFormSuccess('');
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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
                              className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {post.excerpt}
                            </p>
                            {isOwnPost(post) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                Your Post
                              </span>
                            )}
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
      </main>
    </div>
  );
}
