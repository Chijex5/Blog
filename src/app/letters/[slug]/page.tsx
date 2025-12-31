import { notFound } from "next/navigation";
import { getLetter, getLetters } from "@/data/letters";
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import type { Metadata } from 'next';
import Footer from "@/components/Footer";

export const revalidate = 60;

// Generate static params for all letters
export async function generateStaticParams() {
  const letters = await getLetters();
  return letters.map((letter) => ({
    slug: letter.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const letter = await getLetter(slug);

  if (!letter) {
    return {
      title: 'Letter Not Found',
    };
  }

  return {
    title: `Letter #${letter.letter_number}: ${letter.title}`,
    description: letter.excerpt,
    keywords: letter.tags,
    openGraph: {
      title: `Letter #${letter.letter_number}: ${letter.title}`,
      description: letter.excerpt,
      type: 'article',
      publishedTime: letter.published_date,
      siteName: "Chijioke's Blog - Letters",
      authors: [letter.author],
      images: letter.image ? [letter.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Letter #${letter.letter_number}: ${letter.title}`,
      description: letter.excerpt,
      images: letter.image ? [letter.image] : [],
    },
  };
}

export default async function LetterPage({ params }: PageProps) {
  const { slug } = await params;
  const letter = await getLetter(slug);

  if (!letter) {
    notFound();
  }

  // Convert TipTap JSON to HTML
  let contentHTML: string;
  try {
    // If content is a string, try to parse it as JSON first
    const contentObj = typeof letter.content === 'string' 
      ? JSON.parse(letter.content)
      : letter.content;
    
    // Generate HTML from TipTap JSON
    contentHTML = generateHTML(contentObj, [StarterKit, Highlight]);
  } catch (error) {
    // Fallback: if it's already HTML or parsing fails, use as-is for strings,
    // and show a user-facing message for non-string content
    contentHTML = typeof letter.content === 'string'
      ? letter.content
      : '<p class="text-red-600">Unable to display this letter\'s content due to a formatting error. Please contact support if this issue persists.</p>';
    console.error('Error parsing letter content:', error);
  }

  const shareUrl = `https://chijioke.app/letters/${letter.slug}`;
  const tweetText = `Letter #${letter.letter_number}: ${letter.title}`;

  return (
    <main className="min-h-screen bg-[var(--color-warm-bg)]">
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Letter Header */}
        <header className="mb-12">
          {/* Letter Number Badge */}
          <div className="mb-6">
            <span className="inline-block rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1.5 text-sm">
              Letter #{letter.letter_number}
            </span>
          </div>

          {/* Recipient */}
          <p className="text-lg font-medium text-gray-600 mb-4">
            To: {letter.recipient}
          </p>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-sans font-weight-500 tracking-tight text-gray-900 mb-6">
            {letter.title}
          </h1>

          {/* Subtitle (if exists) */}
          {letter.subtitle && (
            <p className="text-xl text-gray-700 mb-6">
              {letter.subtitle}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200">
            <time dateTime={letter.published_date}>
              {new Date(letter.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{letter.read_time}</span>
            {letter.series && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-[var(--color-warm-accent)]/30 rounded-md">
                  {letter.series}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Letter Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          style={{
            fontFamily: 'var(--font-geist-sans)',
          }}
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        />

        {/* Letter Signature */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-700 mb-2">
            Stay in the game,
          </p>
          <p className="text-gray-900 font-medium text-lg">
            {letter.author}
          </p>
        </div>

        {/* Tags */}
        {letter.tags && letter.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {letter.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/70 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 p-6 bg-white/70 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Did this letter resonate with you?
          </h3>
          <p className="text-gray-700 mb-4">
            Share it with someone who might need to read it today.
          </p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweetText
              )}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Share on Twitter
            </a>
          </div>
        </div>

        {/* Navigation - Back to Letters */}
        <div className="mt-12">
          <a
            href="/letters"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all letters
          </a>
        </div>
      </article>

      <Footer />
    </main>
  );
}
