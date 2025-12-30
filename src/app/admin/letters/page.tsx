'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  Search,
  Mail,
  Hash,
  Star
} from 'lucide-react';
import { Letter } from '@/lib/database';

export default function LettersAdminPage() {
  const { status } = useSession();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  const [featuringLetter, setFeaturingLetter] = useState<string | null>(null);

  // Fetch letters
  useEffect(() => {
    if (status === 'authenticated') {
      fetchLetters();
    }
  }, [status]);

  // Filter letters based on search
  useEffect(() => {
    let filtered = letters;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(letter => 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (letter.series && letter.series.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLetters(filtered);
  }, [letters, searchTerm]);

  const fetchLetters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/letters?includeDeleted=true');
      if (response.ok) {
        const data = await response.json();
        setLetters(data);
      }
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (letterId: string) => {
    try {
      setDeleteError('');
      const response = await fetch(`/api/letters/${letterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLetters(letters.map(letter => 
          letter.id === letterId ? { ...letter, is_deleted: true } : letter
        ));
        setDeleteConfirm(null);
      } else {
        const error = await response.json();
        setDeleteError(error.error || 'Failed to delete letter');
        setTimeout(() => setDeleteError(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting letter:', error);
      setDeleteError('Failed to delete letter. Please try again.');
      setTimeout(() => setDeleteError(''), 5000);
    }
  };

  const handleToggleFeature = async (letterId: string, currentlyFeatured: boolean) => {
    try {
      setFeaturingLetter(letterId);
      
      const endpoint = currentlyFeatured ? '/api/letters/unfeature' : '/api/letters/feature';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: letterId }),
      });

      if (response.ok) {
        // Update local state
        setLetters(letters.map(letter => ({
          ...letter,
          is_featured: letter.id === letterId ? !currentlyFeatured : false
        })));
      } else {
        const error = await response.json();
        setDeleteError(error.error || 'Failed to update featured status');
        setTimeout(() => setDeleteError(''), 5000);
      }
    } catch (error) {
      console.error('Error toggling feature:', error);
      setDeleteError('Failed to update featured status. Please try again.');
      setTimeout(() => setDeleteError(''), 5000);
    } finally {
      setFeaturingLetter(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You must be logged in to view this page.</p>
          <Link
            href="/admin/login"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Letters</h1>
              <p className="text-gray-600 mt-2">
                Create and manage personal letters to students
              </p>
            </div>
            <Link
              href="/admin/letters/create"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">New Letter</span>
              <span className="xs:hidden">New</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Letters</p>
                  <p className="text-2xl font-bold text-gray-900">{letters.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {letters.filter(l => !l.is_deleted).length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Latest Number</p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{Math.max(...letters.map(l => l.letter_number), 0)}
                  </p>
                </div>
                <Hash className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search letters by title, recipient, or series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error message */}
        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{deleteError}</p>
          </div>
        )}

        {/* Letters List */}
        {filteredLetters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No letters found' : 'No letters yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first letter to get started'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/letters/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Create First Letter
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredLetters.map((letter) => (
                <div 
                  key={letter.id} 
                  className={`bg-white rounded-lg shadow-sm p-4 ${letter.is_deleted ? 'opacity-60' : ''}`}
                >
                  {/* Letter Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-warm-accent)] rounded-full flex items-center justify-center text-xs font-bold">
                      #{letter.letter_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {letter.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {letter.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Letter Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Recipient:</span>
                      <span className="text-gray-900 font-medium">{letter.recipient}</span>
                    </div>
                    
                    {letter.series && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Series:</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {letter.series}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Date:</span>
                      <div className="flex items-center gap-1 text-gray-900">
                        <Calendar className="w-3 h-3" />
                        {new Date(letter.published_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Status:</span>
                      {letter.is_deleted ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Deleted
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Published
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!letter.is_deleted && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleFeature(letter.id, letter.is_featured || false)}
                        disabled={featuringLetter === letter.id}
                        className={`p-2 rounded-lg transition-colors ${
                          letter.is_featured
                            ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={letter.is_featured ? 'Unfeature letter' : 'Feature letter'}
                      >
                        <Star className={`w-4 h-4 ${letter.is_featured ? 'fill-current' : ''}`} />
                      </button>
                      <Link
                        href={`/admin/letters/edit/${letter.id}`}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit letter"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(letter.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete letter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Series
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLetters.map((letter) => (
                      <tr key={letter.id} className={letter.is_deleted ? 'bg-gray-50 opacity-60' : ''}>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-warm-accent)] rounded-full flex items-center justify-center text-xs font-bold">
                              #{letter.letter_number}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {letter.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {letter.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {letter.recipient}
                        </td>
                        <td className="px-6 py-4">
                          {letter.series ? (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {letter.series}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(letter.published_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {letter.is_deleted ? (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Deleted
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Published
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {!letter.is_deleted && (
                              <>
                                <button
                                  onClick={() => handleToggleFeature(letter.id, letter.is_featured || false)}
                                  disabled={featuringLetter === letter.id}
                                  className={`p-2 rounded-lg transition-colors ${
                                    letter.is_featured
                                      ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                                      : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                                  }`}
                                  title={letter.is_featured ? 'Unfeature letter' : 'Feature letter'}
                                >
                                  <Star className={`w-4 h-4 ${letter.is_featured ? 'fill-current' : ''}`} />
                                </button>
                                <Link
                                  href={`/admin/letters/edit/${letter.id}`}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit letter"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => setDeleteConfirm(letter.id)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete letter"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this letter? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
