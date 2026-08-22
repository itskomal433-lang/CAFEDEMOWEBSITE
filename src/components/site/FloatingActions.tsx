import { ArrowUp, Calendar, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { cafe } from "@/data/cafe";
import { useBookTable } from "./BookTableModal";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const { openModal } = useBookTable();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end px-4 pb-5 sm:px-6">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={openModal}
          aria-label="Book a table"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] px-4 py-3 text-xs font-bold text-[#FAF6EE] shadow-xl transition-transform hover:scale-105 sm:hidden"
        >
          <Calendar className="h-4 w-4 text-[#D07A60]" />
          <span>Book Table</span>
        </button>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD3] bg-white text-[#2C3E2E] shadow-md transition-all ${
            showTop ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-75"
          }`}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
