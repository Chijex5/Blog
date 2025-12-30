"use client";

import { motion } from "framer-motion";
import { Lightbulb, BookOpen, User, Code, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-[var(--color-warm-bg)]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          About This Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-sans font-weight-500 tracking-tight mb-6">
          What This Blog Is About
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          This blog is about the real experience of learning tech as a student — not the polished, 
          highlight-reel version you see online.
        </p>
      </motion.div>

      {/* Target Audience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-sans font-weight-500 tracking-tight mb-6">
          Who This Blog Is For
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          It's for beginners who started learning programming with excitement, hit confusion shortly after, 
          and began to wonder if they're failing or simply not "built for tech." The truth is: that feeling 
          is normal, and it doesn't go away just because you become more experienced.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Here, we talk honestly about the mental side of learning to code, the uncertainty that comes with 
          growth, and how to keep moving forward even when progress feels invisible.
        </p>
        <div className="bg-white/70 rounded-xl p-6 mb-6">
          <p className="text-base text-gray-700 mb-4">
            <strong>This blog is for:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Students learning programming or tech-related skills</li>
            <li>Beginners who feel lost after the initial learning phase</li>
            <li>People stuck in tutorial hell</li>
            <li>Anyone dealing with impostor syndrome or self-doubt in tech</li>
          </ul>
        </div>
        <div className="bg-white/70 rounded-xl p-6">
          <p className="text-base text-gray-700 mb-4">
            <strong>If you've ever thought:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>"Everyone else seems to get this but me"</li>
            <li>"I was excited at first, now I'm just confused"</li>
            <li>"Maybe I'm not smart enough for this"</li>
          </ul>
          <p className="text-base text-gray-700 mt-4">
            Then this blog is written for you.
          </p>
        </div>
      </motion.section>

      {/* Content Pillars */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-sans font-weight-500 tracking-tight mb-6">
          What You'll Find Here
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Everything published here falls into one of these pillars — no random posts, no filler.
        </p>
        
        <div className="space-y-6">
          <div className="bg-white/70 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Reality Checks & Hard Truths</h3>
                <p className="text-gray-700">
                  Honest, sometimes uncomfortable truths about learning tech — the kind most people don't talk about. 
                  These posts normalize confusion, frustration, and slow progress instead of pretending they disappear.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Survival Guides for Beginners</h3>
                <p className="text-gray-700">
                  Practical guidance for getting through the hardest phases of learning: when tutorials stop working, 
                  when motivation drops, and when quitting feels tempting.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Personal Stories & Build-in-Public</h3>
                <p className="text-gray-700">
                  Real experiences, lessons, and reflections from learning, building, failing, and improving. 
                  These posts aren't about perfection — they're about process.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Minimal Technical Confidence Builders</h3>
                <p className="text-gray-700">
                  Light technical insights designed to build confidence, not overwhelm. The goal isn't to teach everything, 
                  but to help beginners stop panicking and start thinking clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Direction & Career Clarity</h3>
                <p className="text-gray-700">
                  Posts focused on reducing confusion around learning paths, tech stacks, and expectations — helping 
                  students choose direction without freezing or burning out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What This Blog Is NOT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-sans font-weight-500 tracking-tight mb-6">
          What This Blog Is NOT
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          To be clear, this blog is not:
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700 text-lg mb-6">
          <li>A collection of generic programming tutorials</li>
          <li>A list of trending tech stacks</li>
          <li>Motivational quotes with no substance</li>
          <li>"Learn to code fast" or "overnight success" content</li>
        </ul>
        <p className="text-lg text-gray-700 leading-relaxed">
          If you're looking for hype, shortcuts, or constant reassurance without honesty, this probably isn't for you.
        </p>
      </motion.section>

      {/* Philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-sans font-weight-500 tracking-tight mb-6">
          The Philosophy Behind the Blog
        </h2>
        <div className="bg-[var(--color-warm-accent)] rounded-xl p-8">
          <p className="text-lg text-black leading-relaxed mb-4">
            Learning tech isn't a straight line.
          </p>
          <p className="text-lg text-black leading-relaxed mb-4">
            Feeling lost doesn't mean you're failing — it often means you're growing.
          </p>
          <p className="text-lg text-black leading-relaxed">
            Even experienced developers feel uncertain. The difference is not intelligence or talent, 
            but the ability to sit with confusion and keep going anyway.
          </p>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mt-6 text-center font-medium">
          This blog exists to remind you of that — consistently.
        </p>
      </motion.section>

      {/* Not About Perfection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="text-center"
      >
        <p className="text-2xl font-sans font-weight-500 text-gray-800">
          This is not a blog about shortcuts, hype, or becoming a "10x developer."
        </p>
        <p className="text-2xl font-sans font-weight-500 text-gray-800 mt-4">
          It's about staying in the game long enough to actually grow.
        </p>
      </motion.section>
    </div>
  );
}
