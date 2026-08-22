import { useState } from "react";
import { MessageCircle, X, Send, CheckCheck, Sparkles, Coffee, Calendar, HelpCircle } from "lucide-react";
import { cafe } from "@/data/cafe";

export function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const quickPrompts = [
    {
      icon: "☕",
      label: "Today's Specials",
      text: "Hi Bloom Café! ☕ What are your barista specials and fresh pastries today?",
    },
    {
      icon: "📅",
      label: "Table Booking",
      text: "Hi! 📅 I'd like to ask about reserving a table for brunch this week.",
    },
    {
      icon: "🥐",
      label: "Dietary & Menu",
      text: "Hello! 🥐 I have a question about gluten-free/vegan options on your menu.",
    },
    {
      icon: "🎁",
      label: "Gift Card Query",
      text: "Hi team! 🎁 I need assistance with a Bloom Café digital gift card.",
    },
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message || "Hi Bloom Café! ☕ I'd like to ask about your menu & orders.";
    const encoded = encodeURIComponent(finalMsg);
    const url = `https://wa.me/61412345678?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start font-sans">
      {/* WhatsApp Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-[330px] sm:w-[360px] overflow-hidden rounded-3xl border border-[#E8DFD3] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2C3E2E] font-bold text-xs shadow-inner">
                  ☕
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#25D366] bg-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-sm leading-tight text-white">Bloom Café Barista</h4>
                  <span className="text-[10px] bg-white/20 rounded-full px-1.5 py-0.2">Official</span>
                </div>
                <p className="text-[11px] text-white/90">Typically replies within 2 mins</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#FAF6EE] space-y-3 max-h-[360px] overflow-y-auto">
            {/* Greeting speech bubble */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="rounded-2xl rounded-tl-xs bg-white p-3 shadow-xs border border-[#E8DFD3] text-xs text-[#2C3E2E] space-y-1.5">
                <p className="font-semibold">Hey there! 👋 Welcome to Bloom Café Melbourne.</p>
                <p className="text-[#6D6964] leading-relaxed">
                  How can our barista team help you today? Tap a quick option below or send us a message directly on WhatsApp!
                </p>
                <span className="block text-[9px] text-[#9E9B95] text-right flex items-center justify-end gap-1">
                  Just now <CheckCheck className="h-3 w-3 text-[#25D366]" />
                </span>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">
                Quick Questions:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#E8DFD3] bg-white p-2 text-left text-[11px] font-medium text-[#2C3E2E] shadow-2xs hover:border-[#25D366] hover:bg-[#E8F8EE] transition-all cursor-pointer"
                  >
                    <span>{q.icon}</span>
                    <span className="line-clamp-1">{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#E8DFD3] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full bg-[#FAF6EE] border border-[#E8DFD3] px-3.5 py-2 text-xs text-[#2C3E2E] focus:outline-none focus:border-[#25D366]"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label="Send WhatsApp message"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#20BA56] active:scale-95 cursor-pointer"
        aria-label="Chat on WhatsApp with Bloom Café"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border border-white" />
        </span>

        <WhatsAppIcon className="h-7 w-7 fill-white" />

        {/* Hover Tooltip if closed */}
        {!isOpen && (
          <span className="pointer-events-none absolute left-15 hidden whitespace-nowrap rounded-xl bg-[#2C3E2E] px-3 py-1.5 text-xs font-semibold text-[#FAF6EE] shadow-lg sm:group-hover:inline-block animate-in fade-in slide-in-from-left-2">
            💬 Chat on WhatsApp
          </span>
        )}
      </button>
    </div>
  );
}
