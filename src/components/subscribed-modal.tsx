"use client";

export default function SubscribedModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50"
    >
      <div className="flex items-center justify-center h-full">
        <div className="bg-[var(--color-warm-accent)] rounded-xl p-8 shadow-lg max-w-md text-center">
          <span className="inline-block mb-4 rounded-full bg-white text-black font-bold px-4 py-1 text-xs">
            Welcome aboard
          </span>

          <h2 className="text-2xl md:text-4xl font-sans font-medium tracking-tight mb-4">
            Your developer journey <br />
            <span className="font-normal">
              has just <em className="source-serif-italic">leveled</em> up
            </span>
          </h2>

          <p className="text-sm font-semibold text-black/48 mb-4">
            Keep an eye on your inbox
          </p>

          <button
            onClick={onClose}
            className="rounded-md bg-black py-2 px-4 text-white text-sm
            hover:bg-gray-800 transition-colors
            focus:outline-none focus:ring-2 focus:ring-black/40"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
