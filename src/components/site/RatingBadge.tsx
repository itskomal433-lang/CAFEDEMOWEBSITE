import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cafe } from "@/data/cafe";

export function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} fill-caramel text-caramel`} />
      ))}
    </span>
  );
}

/** Counts the rating up when it scrolls into view. */
export function AnimatedRating() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setValue(cafe.rating);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Number((cafe.rating * (1 - Math.pow(1 - p, 3))).toFixed(1)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-6xl font-semibold leading-none">
        {value.toFixed(1)}
        <span className="text-caramel"> ★</span>
      </p>
      <div className="mt-3 flex justify-center">
        <Stars className="size-5" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Based on {cafe.reviewCount} reviews
      </p>
    </div>
  );
}
