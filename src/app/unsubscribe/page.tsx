'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(true);
  const [subscriberInfo, setSubscriberInfo] = useState<{ email: string; is_active: boolean } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid unsubscribe link. No token provided.' });
      setFetchingInfo(false);
      return;
    }

    // Fetch subscriber information
    fetch(`/api/subscribers/unsubscribe?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setSubscriberInfo(data);
        } else {
          setMessage({ type: 'error', text: data.error || 'Invalid unsubscribe link.' });
        }
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load subscription information.' });
      })
      .finally(() => {
        setFetchingInfo(false);
      });
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribers/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        if (subscriberInfo) {
          setSubscriberInfo({ ...subscriberInfo, is_active: false });
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to unsubscribe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {subscriberInfo?.is_active === false ? 'Already Unsubscribed' : 'Unsubscribe'}
          </h1>
          <p className="text-gray-600">
            {subscriberInfo?.is_active === false 
              ? 'You have already been unsubscribed from our mailing list.'
              : 'We\'re sorry to see you go'}
          </p>
        </div>

        {subscriberInfo && subscriberInfo.is_active && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {subscriberInfo.email}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              You will no longer receive email notifications about new blog posts.
            </p>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="space-y-3">
          {subscriberInfo?.is_active && !message && (
            <Button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Unsubscribing...' : 'Confirm Unsubscribe'}
            </Button>
          )}
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Return to Blog
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Changed your mind? You can always resubscribe by visiting our blog and entering your email in the subscription form.
          </p>
        </div>
      </div>
    </div>
  );
}
