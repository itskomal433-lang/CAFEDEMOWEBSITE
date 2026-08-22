import React from "react";
import { Clock, Coffee, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function LiveStatusBadge({ className = "" }: { className?: string }) {
  const { storeSettings } = useApp();
  const isOpen = storeSettings.isOpen;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[#E8DFD3] bg-[#FAF6EE] px-3.5 py-1 text-xs font-medium text-[#253328] shadow-xs ${className}`}
    >
      <span className="flex h-2 w-2 relative">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOpen ? "bg-emerald-400" : "bg-rose-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
      </span>
      <span>
        {isOpen ? (
          <>
            <strong className="text-[#2C3E2E]">Open Now</strong> • Closes at {storeSettings.closingTime}
          </>
        ) : (
          <>
            <strong className="text-[#D07A60]">Temporarily Closed</strong> • Pre-orders available
          </>
        )}
      </span>
      <span className="hidden sm:inline text-[#6D6964]">•</span>
      <span className="hidden sm:inline text-[#6D6964] text-[11px]">
        Wait Time: ~{storeSettings.waitTime}
      </span>
    </div>
  );
}
