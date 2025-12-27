'use client';

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full py-6 text-center text-sm mt-6 text-black">
      <section className="bg-white/50 flex flex-col items-center justif-y-center px-4 py-12">
        <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
          My mission is to
        </span>
        <h1 className="text-4xl md:text-6xl font-sans font-weight-500 tracking-tight mb-10">
          Help you create and <br />
          <span className="text-4xl md:text-6xl font-normal"> earn on <em className="source-serif-italic">your</em> terms.</span>
        </h1>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="h-11 bg-[var(--color-warm-accent)] shadow-none w-72 border-none rounded-xl"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="h-11 px-6 rounded-xl"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        {message && (
          <p className={`text-sm mt-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        {!message && (
          <p className="text-xs text-muted-foreground mt-3">
            No spam, unsubscribe anytime.
          </p>
        )}
      </section>
      <div className="max-w-4xl mt-12 mx-auto px-6">
        {/* Memoir Title */}
        <h2 className="source-serif-italic text-2xl md:text-3xl text-black font-medium mb-8">
          Memoir
        </h2>
        
        {/* First Row of Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-6 text-[#6b6b6b]">
          <a href="/" className="hover:text-black transition-colors">Home</a>
          <a href="/about" className="hover:text-black transition-colors">About</a>
          <a href="/letters" className="hover:text-black transition-colors">Letters</a>
          <a href="/404" className="hover:text-black transition-colors">404</a>
        </nav>
        
        {/* Second Row of Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8 text-[#6b6b6b]">
          <a href="#" className="hover:text-black transition-colors">Made in Framer</a>
          <a href="#" className="hover:text-black transition-colors">Buy Template</a>
          <a href="#" className="hover:text-black transition-colors">More Templates</a>
        </nav>
        
        {/* Copyright */}
        <p className="text-[#999] text-sm">
          © 2025 Memoir. Created by Hamza Ehsan.
        </p>
      </div>
    </footer>
  );
}
