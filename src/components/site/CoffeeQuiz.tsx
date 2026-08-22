import React, { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw, Heart, Coffee, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { fullMenu, MenuItem } from "@/data/cafe";
import { Reveal } from "./Reveal";

export function CoffeeQuiz() {
  const [step, setStep] = useState(1);
  const [taste, setTaste] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [matchedItem, setMatchedItem] = useState<MenuItem | null>(null);

  const { addToCart, setCustomizingItem } = useCart();

  const tastes = [
    { id: "creamy", title: "Velvety & Milky", desc: "Silky microfoam & smooth espresso" },
    { id: "bold", title: "Rich & Strong", desc: "Dark chocolate & nutty intensity" },
    { id: "sweet", title: "Sweet & Decadent", desc: "Vanilla, caramel or chocolate notes" },
    { id: "refreshing", title: "Chilled & Refreshing", desc: "Iced cold brew, matcha or spritz" },
  ];

  const vibes = [
    { id: "morning", title: "Morning Energy Kick", desc: "Focus and productivity" },
    { id: "cozy", title: "Cozy Relaxation", desc: "A mindful afternoon pause" },
    { id: "treat", title: "Sweet Dessert Treat", desc: "Indulgent mood booster" },
  ];

  const diets = [
    { id: "classic", title: "Classic Whole Milk" },
    { id: "oat", title: "Oat / Almond Plant Milk" },
    { id: "black", title: "Black / No Sugar" },
  ];

  const calculateResult = () => {
    let result: MenuItem = fullMenu[0]; // fallback Classic Latte

    if (taste === "refreshing") {
      result = fullMenu.find((m) => m.id === "iced-matcha") || fullMenu[3];
    } else if (taste === "bold") {
      result = fullMenu.find((m) => m.id === "flat-white") || fullMenu[1];
    } else if (taste === "sweet") {
      result = fullMenu.find((m) => m.id === "vanilla-cold-brew") || fullMenu[4];
    } else {
      result = fullMenu.find((m) => m.id === "latte") || fullMenu[0];
    }

    setMatchedItem(result);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setTaste(null);
    setVibe(null);
    setDiet(null);
    setMatchedItem(null);
  };

  return (
    <section className="bg-[#FAF6EE] py-20 border-t border-[#E8DFD3]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E4ECE6] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#2C3E2E]">
              <Sparkles className="h-3.5 w-3.5 text-[#D07A60]" />
              Interactive Taste Finder
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C3E2E]">
              Find Your Perfect Brew
            </h2>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="text-xs sm:text-sm text-[#6D6964] max-w-md mx-auto">
              Answer 3 quick questions and let our master barista recommend the ideal coffee or brunch pairing for you today.
            </p>
          </Reveal>
        </div>

        {/* Quiz Container Card */}
        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-10 shadow-sm transition-all">
          
          {/* Step 1: Taste Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                  Question 1 of 3
                </span>
                <span className="text-xs text-[#6D6964]">Step 1</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E]">
                How do you like your coffee or drink to taste?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tastes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTaste(item.id);
                      setStep(2);
                    }}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      taste === item.id
                        ? "border-[#2C3E2E] bg-[#E4ECE6]"
                        : "border-[#E8DFD3] bg-[#FAF6EE] hover:border-[#2C3E2E] hover:bg-white"
                    }`}
                  >
                    <div className="font-display text-base font-bold text-[#2C3E2E]">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6D6964] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Vibe */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                  Question 2 of 3
                </span>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#6D6964] hover:underline"
                >
                  ← Back
                </button>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E]">
                What vibe are you looking for today?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {vibes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVibe(item.id);
                      setStep(3);
                    }}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      vibe === item.id
                        ? "border-[#2C3E2E] bg-[#E4ECE6]"
                        : "border-[#E8DFD3] bg-[#FAF6EE] hover:border-[#2C3E2E] hover:bg-white"
                    }`}
                  >
                    <div className="font-display text-base font-bold text-[#2C3E2E]">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#6D6964] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Diet / Milk */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                  Question 3 of 3
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#6D6964] hover:underline"
                >
                  ← Back
                </button>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E]">
                Do you have a dairy or milk preference?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {diets.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDiet(item.id);
                      calculateResult();
                    }}
                    className="rounded-2xl border border-[#E8DFD3] bg-[#FAF6EE] p-4 text-left hover:border-[#2C3E2E] hover:bg-white transition-all"
                  >
                    <div className="font-display text-base font-bold text-[#2C3E2E]">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Matched Result */}
          {step === 4 && matchedItem && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                  <Sparkles className="h-4 w-4" /> 98% Match For You
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-[#6D6964] hover:text-[#2C3E2E]"
                >
                  <RotateCcw className="h-3 w-3" /> Retake Quiz
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {matchedItem.image && (
                  <div className="sm:col-span-5 aspect-square rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={matchedItem.image}
                      alt={matchedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={`${matchedItem.image ? "sm:col-span-7" : "sm:col-span-12"} space-y-3`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52]">
                    Barista Recommendation
                  </span>
                  <h3 className="font-display text-3xl font-bold text-[#2C3E2E]">
                    {matchedItem.name}
                  </h3>
                  <p className="text-xs text-[#6D6964] leading-relaxed">
                    {matchedItem.description}
                  </p>
                  <div className="font-display text-2xl font-bold text-[#2C3E2E] pt-1">
                    {matchedItem.price}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <Button
                      onClick={() =>
                        addToCart(matchedItem, {
                          milk: diet === "oat" ? "Oat Milk" : "Full Cream",
                        })
                      }
                      className="rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] text-xs px-6 py-2.5"
                    >
                      Quick Add to Order
                    </Button>
                    <Button
                      onClick={() => setCustomizingItem(matchedItem)}
                      variant="outline"
                      className="rounded-full border-[#E8DFD3] text-xs px-5 py-2.5"
                    >
                      Customize Drink
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
