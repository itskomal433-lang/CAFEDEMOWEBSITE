import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gift, Sparkles, CreditCard, Check, Copy, Heart, Coffee } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BotanicalLogo } from "@/components/site/Header";

export const Route = createFileRoute("/giftcards")({
  head: () => ({
    meta: [
      { title: "Digital Gift Cards — Give the Gift of Coffee | Bloom Café" },
      {
        name: "description",
        content:
          "Send instant digital gift cards for Bloom Café in Melbourne. Perfect for coffee lovers, birthdays, anniversaries, and holidays.",
      },
      { property: "og:title", content: "Bloom Café Gift Cards" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GiftCardsPage,
});

function GiftCardsPage() {
  const [amount, setAmount] = useState(50);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("Enjoy a cozy coffee & brunch treat on me!");
  const [cardTheme, setCardTheme] = useState<"forest" | "terracotta" | "sage">("forest");
  const [purchasedCode, setPurchasedCode] = useState<string | null>(null);

  const presetAmounts = [25, 50, 75, 100, 150];

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !senderName) {
      toast.error("Please fill in recipient and sender names.");
      return;
    }

    const code = `BLM-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${amount}`;
    setPurchasedCode(code);
    toast.success("Digital Gift Card generated successfully!", {
      description: `Voucher code ${code} is ready for use.`,
    });
  };

  const copyCode = () => {
    if (purchasedCode) {
      navigator.clipboard.writeText(purchasedCode);
      toast.success("Gift Card Code copied to clipboard!");
    }
  };

  const themeStyles = {
    forest: "bg-[#2C3E2E] text-white border-white/20",
    terracotta: "bg-[#D07A60] text-white border-white/20",
    sage: "bg-[#7D9987] text-white border-white/20",
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen pb-20">
      {/* Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 text-center border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Reveal>
            <span className="font-script text-3xl sm:text-4xl text-[#D07A60] block">
              Share the love of coffee
            </span>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E]">
              Bloom Café Gift Cards
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-xl mx-auto text-sm text-[#6D6964]">
              Treat someone special to an artisanal coffee break, fluffy pancake stacks, and warm cozy moments.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Studio */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Live Card Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <h3 className="font-display text-lg font-bold text-[#2C3E2E]">
              Live Card Preview
            </h3>

            {/* Virtual Card */}
            <div
              className={`relative aspect-[16/10] w-full rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden border ${themeStyles[cardTheme]} transition-colors duration-500`}
            >
              {/* Background watermark */}
              <div className="absolute -right-8 -bottom-8 h-44 w-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="font-display text-xl font-bold tracking-widest block">
                    BLOOM CAFÉ
                  </span>
                  <span className="text-[9px] tracking-[0.2em] opacity-80 uppercase block">
                    Specialty Coffee Voucher
                  </span>
                </div>
                <Gift className="h-7 w-7 text-white/80" />
              </div>

              <div className="relative z-10 space-y-1">
                <span className="text-[11px] opacity-75 uppercase tracking-wider block">
                  For: {recipientName || "Recipient Name"}
                </span>
                <p className="text-xs italic opacity-90 line-clamp-2">
                  "{message}"
                </p>
              </div>

              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/20">
                <span className="text-[10px] opacity-80">
                  From: {senderName || "Your Name"}
                </span>
                <span className="font-display text-3xl font-bold">
                  ${amount}
                </span>
              </div>
            </div>

            {/* If Purchased */}
            {purchasedCode && (
              <div className="rounded-2xl bg-white border border-[#E8DFD3] p-5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2C3E2E]">Active Gift Voucher</span>
                  <span className="rounded-full bg-[#E4ECE6] px-2.5 py-0.5 text-[10px] font-bold text-[#2C3E2E]">
                    Valid for 3 Years
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#FAF6EE] p-3 border border-[#E8DFD3]">
                  <span className="font-mono text-sm font-bold text-[#2C3E2E] tracking-wider">
                    {purchasedCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 text-xs font-semibold text-[#D07A60] hover:underline"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
                <p className="text-[11px] text-[#6D6964]">
                  Show this code at the Bloom Café checkout counter or enter during online ordering.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Customizer Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-10 shadow-xs">
              <form onSubmit={handlePurchase} className="space-y-6">
                
                {/* 1. Select Amount */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                    1. Select Voucher Value
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {presetAmounts.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`rounded-2xl py-3 text-center text-sm font-bold transition-all ${
                          amount === val
                            ? "border-2 border-[#2C3E2E] bg-[#2C3E2E] text-white shadow-xs"
                            : "border border-[#E8DFD3] bg-[#FAF6EE] text-[#2C3E2E] hover:bg-white"
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Choose Theme */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                    2. Card Artwork Style
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCardTheme("forest")}
                      className={`rounded-xl p-3 text-xs font-bold transition-all flex items-center justify-between ${
                        cardTheme === "forest"
                          ? "bg-[#2C3E2E] text-white ring-2 ring-[#2C3E2E]"
                          : "border border-[#E8DFD3] bg-[#FAF6EE] text-[#2C3E2E]"
                      }`}
                    >
                      <span>Forest Olive</span>
                      {cardTheme === "forest" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTheme("terracotta")}
                      className={`rounded-xl p-3 text-xs font-bold transition-all flex items-center justify-between ${
                        cardTheme === "terracotta"
                          ? "bg-[#D07A60] text-white ring-2 ring-[#D07A60]"
                          : "border border-[#E8DFD3] bg-[#FAF6EE] text-[#2C3E2E]"
                      }`}
                    >
                      <span>Terracotta</span>
                      {cardTheme === "terracotta" && <Check className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardTheme("sage")}
                      className={`rounded-xl p-3 text-xs font-bold transition-all flex items-center justify-between ${
                        cardTheme === "sage"
                          ? "bg-[#7D9987] text-white ring-2 ring-[#7D9987]"
                          : "border border-[#E8DFD3] bg-[#FAF6EE] text-[#2C3E2E]"
                      }`}
                    >
                      <span>Sage Blossom</span>
                      {cardTheme === "sage" && <Check className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Recipient & Sender Details */}
                <div className="space-y-4 pt-2 border-t border-[#F0EAE0]">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                    3. Personalization Details
                  </Label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-[#6D6964]">Recipient Name *</Label>
                      <Input
                        placeholder="e.g. Maya Lin"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        required
                        className="rounded-xl border-[#E8DFD3] bg-[#FAF6EE] mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-[#6D6964]">Recipient Email (Optional)</Label>
                      <Input
                        placeholder="maya@example.com"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="rounded-xl border-[#E8DFD3] bg-[#FAF6EE] mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-[#6D6964]">Your Name (Sender) *</Label>
                    <Input
                      placeholder="e.g. Chris Hemsworth"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="rounded-xl border-[#E8DFD3] bg-[#FAF6EE] mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-[#6D6964]">Personal Message</Label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] p-3 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none mt-1 resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-6 text-sm font-semibold tracking-wider shadow-md"
                >
                  Generate Digital Gift Card • ${amount}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
