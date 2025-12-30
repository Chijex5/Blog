"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Letter } from "@/lib/database";

interface LetterCardProps {
  letter: Letter;
  index?: number;
}

export default function LetterCard({ letter, index = 0 }: LetterCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/letters/${letter.slug}`}>
        <div className="bg-white/70 hover:bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-[var(--color-warm-accent)]">
          {/* Letter Number Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-3 py-1 text-xs">
              Letter #{letter.letter_number}
            </span>
            <span className="text-xs text-gray-500">{letter.read_time}</span>
          </div>

          {/* Recipient */}
          <p className="text-sm font-medium text-gray-600 mb-2">
            To: {letter.recipient}
          </p>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-black transition-colors line-clamp-2">
            {letter.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {letter.excerpt}
          </p>

          {/* Footer - Date and Series */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {new Date(letter.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            {letter.series && (
              <span className="px-2 py-1 bg-gray-100 rounded-md">
                {letter.series}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
