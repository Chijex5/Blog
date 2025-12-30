'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import LetterEditor from '@/components/LetterEditor';
import { Letter } from '@/lib/database';

export default function EditLetterPage() {
  const params = useParams();
  const letterId = params.id as string;
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLetter = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/letters/${letterId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch letter');
      }
      
      const data = await response.json();
      setLetter(data);
    } catch (err) {
      console.error('Error fetching letter:', err);
      setError('Failed to load letter');
    } finally {
      setIsLoading(false);
    }
  }, [letterId]);

  useEffect(() => {
    if (letterId) {
      fetchLetter();
    }
  }, [letterId, fetchLetter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !letter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Letter Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The letter you are looking for does not exist.'}</p>
          <a
            href="/admin/letters"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Letters
          </a>
        </div>
      </div>
    );
  }

  return <LetterEditor letterId={letterId} letterData={letter} />;
}
