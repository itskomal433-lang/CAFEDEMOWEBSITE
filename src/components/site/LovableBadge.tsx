import React from "react";

export function LovableIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="url(#lovable-symbol-grad)"
      />
      <path
        d="M12 5.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35V5.09z"
        fill="white"
        fillOpacity="0.22"
      />
      <defs>
        <linearGradient
          id="lovable-symbol-grad"
          x1="2"
          y1="3"
          x2="22"
          y2="21.35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4B72" />
          <stop offset="0.45" stopColor="#E935C1" />
          <stop offset="0.85" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LovableBadge() {
  return (
    <aside
      aria-label="Lovable platform badge"
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden sm:flex items-center"
    >
      <a
        href="https://lovable.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#253328] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl hover:border-black/20"
      >
        <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <LovableIcon className="h-4 w-4" />
        </span>
        <span className="font-medium text-[#6D6964] group-hover:text-[#253328] transition-colors">
          Built with <strong className="font-bold text-[#1E2B20]">Lovable</strong>
        </span>
      </a>
    </aside>
  );
}
