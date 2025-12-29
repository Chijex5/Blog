import { getLetters } from "@/data/letters";
import LetterCard from "@/components/LetterCard";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const revalidate = 60;

// SEO metadata for letters page
export const metadata: Metadata = {
  title: "Letters | Personal Messages to Students Learning Tech",
  description: "Intimate, encouraging letters to students navigating the journey of learning programming. Real talk about confusion, struggles, and staying in the game.",
  keywords: ["learning programming", "student letters", "coding motivation", "tech student advice", "programming encouragement"],
  openGraph: {
    title: "Letters | Personal Messages to Students Learning Tech",
    description: "Intimate, encouraging letters to students navigating the journey of learning programming.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Letters | Personal Messages to Students Learning Tech",
    description: "Intimate, encouraging letters to students navigating the journey of learning programming.",
  },
};

export default async function LettersPage() {
  const letters = await getLetters();

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

      {/* LETTERS GRID */}
      {letters.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {letters.map((letter, index) => (
            <LetterCard key={letter.id} letter={letter} index={index} />
          ))}
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
