"use client";

import React from 'react';
import Footer from '@/components/Footer';

export default function NotFound() { 
    return (
        <div className="bg-[var(--color-warm-bg)] px-4">
            <section className="flex flex-col items-center justify-center min-h-screen  text-center"> 
                <span className="inline-block mb-6 rounded-full bg-[var(--color-warm-accent)] text-black font-bold px-4 py-1 text-xs">
                Page not found
                </span>
                <h1 className="text-4xl md:text-6xl font-source-serif-text font-semibold tracking-tight mb-10">
                    Not all journeys  <br />
                    go as planned.
                </h1>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white hover:bg-gray-800 transition-colors h-11 rounded-xl bg-black px-4 py-2"
                >
                    Go Home
                </a>
            </section>
            <Footer />
        </div>
    );
}