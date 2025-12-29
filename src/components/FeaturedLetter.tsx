"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowUpRightIcon } from "lucide-react";
import { Letter } from "@/lib/database";

export default function FeaturedLetter({ isCollapsed }: { isCollapsed: boolean }) {
  const [featuredLetter, setFeaturedLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedLetter();
  }, []);

  const fetchFeaturedLetter = async () => {
    try {
      const response = await fetch('/api/letters/featured');
      if (response.ok) {
        const data = await response.json();
        setFeaturedLetter(data);
      }
    } catch (error) {
      console.error('Error fetching featured letter:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show anything while loading
  if (loading) return null;

  // Show nothing if no featured letter
  if (!featuredLetter) return null;

  if (isCollapsed) {
    return (
      <button
        onClick={() => router.push(`/letters/${featuredLetter.slug}`)}
        className="w-full group flex items-center mb-2 gap-4 px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-white/50"
        title="Featured Letter"
      >
        <Mail className="w-4 h-4 shrink-0" />
      </button>
    );
  }

  return (
    <div className="mb-4">
      <button 
        onClick={() => router.push(`/letters/${featuredLetter.slug}`)}
        className="group bg-white/50 rounded-md flex flex-col p-3 backdrop-blur-sm cursor-pointer hover:bg-white/70 transition-colors w-full"
      >
        <p className="text-[10px] font-medium text-gray-500 uppercase px-2 py-1 mb-1">
          Featured Letter
        </p>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-warm-accent)] rounded-full flex items-center justify-center text-xs font-bold">
            #{featuredLetter.letter_number}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">
              To: {featuredLetter.recipient}
            </p>
            <p className="text-[10px] font-medium text-gray-800 leading-snug line-clamp-2 text-left">
              {featuredLetter.title}
            </p>
          </div>

          <div className="bg-white rounded-sm p-1 w-6 h-6 flex items-center justify-center shrink-0">
            <ArrowUpRightIcon
              className="w-3.5 h-3.5 text-black transition-transform duration-200 ease-out group-hover:rotate-45"
            />
          </div>
        </div>
      </button>
    </div>
  );
}
