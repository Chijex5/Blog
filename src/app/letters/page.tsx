'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import LetterCard from "@/components/LetterCard";
import Footer from "@/components/Footer";
import { Letter } from "@/lib/database";
import { Search } from "lucide-react";

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLetters();
  }, []);

  const filterLetters = useCallback(() => {
    let filtered = letters;

    // Filter by series
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(letter => letter.series === selectedSeries);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(letter =>
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLetters(filtered);
  }, [letters, selectedSeries, searchTerm]);

  useEffect(() => {
    filterLetters();
  }, [filterLetters]);

  const fetchLetters = async () => {
    try {
      const response = await fetch('/api/letters');
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

  // Get unique series from letters - memoize to prevent recalculation
  const uniqueSeries = useMemo(() => 
    Array.from(new Set(letters.map(l => l.series).filter(Boolean))),
    [letters]
  );

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto bg-[var(--color-warm-bg)] md:max-w-[80vw] px-4 py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto bg-[var(--color-warm-bg)] md:max-w-[80vw] px-4 py-20">
      {/* HERO */}
      <section className="text-center mb-16">
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          From the desk of Chijoke
        </span>

        <h1 className="text-4xl md:text-6xl font-sans font-weight-500 tracking-tight mb-6">
          Letters
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
          Personal messages to students navigating tech. More intimate than blog posts — 
          like advice from a friend who understands the struggle.
        </p>

        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Each letter addresses a specific challenge you might be facing. Read them when 
          you need encouragement, perspective, or just a reminder that you're not alone.
        </p>
      </section>

      {/* FILTERS */}
      {letters.length > 0 && (
        <section className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search letters by title, recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Series Filter */}
          {uniqueSeries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSeries('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSeries === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white/70 text-gray-700 hover:bg-white'
                }`}
              >
                All Letters
              </button>
              {uniqueSeries.map((series) => (
                <button
                  key={series}
                  onClick={() => setSelectedSeries(series!)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSeries === series
                      ? 'bg-gray-900 text-white'
                      : 'bg-white/70 text-gray-700 hover:bg-white'
                  }`}
                >
                  {series}
                </button>
              ))}
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            Showing {filteredLetters.length} of {letters.length} letters
            {selectedSeries !== 'all' && ` in "${selectedSeries}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </section>
      )}

      {/* LETTERS GRID */}
      {filteredLetters.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredLetters.map((letter, index) => (
            <LetterCard key={letter.id} letter={letter} index={index} />
          ))}
        </section>
      ) : letters.length > 0 ? (
        <section className="text-center py-20">
          <div className="bg-white/70 rounded-xl p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No letters found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedSeries('all');
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </section>
      ) : (
        <section className="text-center py-20">
          <div className="bg-white/70 rounded-xl p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              First letters coming soon...
            </h2>
            <p className="text-gray-600 mb-6">
              I'm crafting the first letters to share with you. Each one will address 
              a specific struggle or question that students face when learning tech.
            </p>
            <p className="text-sm text-gray-500">
              Subscribe below to get notified when the first letter is published.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
