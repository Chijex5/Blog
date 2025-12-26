"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(scrolled);
      } else {
        setScrollProgress(0);
      }
    };

    let timeoutId: NodeJS.Timeout | null = null;
    const throttledUpdate = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          updateScrollProgress();
          timeoutId = null;
        }, 16); // ~60fps
      }
    };

    window.addEventListener("scroll", throttledUpdate, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="sticky top-0 left-0 w-full h-2 z-50 bg-gray-200">
      <div
        className="h-full bg-[#8c746b] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
