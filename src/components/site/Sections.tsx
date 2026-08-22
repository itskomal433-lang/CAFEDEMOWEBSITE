import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Coffee,
  Leaf,
  Armchair,
  Heart,
  Calendar,
  Sparkles,
  ShoppingBag,
  Gift,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cafe, specialties, fullAddress, images } from "@/data/cafe";
import { useBookTable } from "./BookTableModal";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { Reveal } from "./Reveal";
import { CoffeeQuiz } from "./CoffeeQuiz";

/* Botanical Leaf SVG Flourish */
export function BotanicalFlourish({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-start gap-2 text-[#2C3E2E]/60 ${className}`}>
      <div className="h-[1px] w-10 bg-[#2C3E2E]/20" />
      <svg
        viewBox="0 0 48 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-12 text-[#2C3E2E]/50"
      >
        <path d="M4 12c10 0 16-6 20-6s10 6 20 6" />
        <path d="M24 6c0 6-4 12-10 12s-8-6-8-12" />
        <path d="M24 6c0 6 4 12 10 12s8-6 8-12" />
        <circle cx="24" cy="6" r="1.5" fill="#D07A60" stroke="none" />
      </svg>
      <div className="h-[1px] w-10 bg-[#2C3E2E]/20" />
    </div>
  );
}

/* Botanical Leaf Corner Ornaments */
export function LeafCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="#D07A60"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`opacity-40 pointer-events-none ${className}`}
    >
      <path d="M10 50 C 15 35, 30 20, 50 10" />
      <path d="M25 35 C 32 30, 36 22, 38 18" />
      <path d="M20 45 C 18 36, 12 30, 6 28" />
      <circle cx="48" cy="12" r="2" fill="#D07A60" stroke="none" />
    </svg>
  );
}

/* 1. Hero Section */
export function Hero() {
  const { openModal } = useBookTable();

  return (
    <section className="relative overflow-hidden bg-[#FAF6EE] pt-8 pb-16 sm:py-16 lg:py-20">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#F3EDE2] blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#E4ECE6] blur-3xl opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Typography and Action */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <Reveal>
              <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#D07A60] font-normal tracking-wide block">
                Good coffee, good food,
              </span>
            </Reveal>

            <Reveal delayMs={100}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#2C3E2E] leading-[1.08]">
                Good Mood <br /> Everyday
              </h1>
            </Reveal>

            <Reveal delayMs={200}>
              <p className="max-w-md text-sm sm:text-base text-[#6D6964] leading-relaxed">
                A cozy place to pause, recharge and enjoy little moments.
              </p>
            </Reveal>

            <Reveal delayMs={300}>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/menu"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#2C3E2E] px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider text-[#FAF6EE] shadow-md transition-all duration-300 hover:bg-[#1E2B20] hover:shadow-lg active:scale-98"
                >
                  <span>EXPLORE OUR MENU</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={openModal}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2C3E2E]/30 bg-transparent px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider text-[#2C3E2E] transition-colors hover:bg-[#E4ECE6]/50 cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>BOOK A TABLE</span>
                </button>
              </div>
            </Reveal>

            <Reveal delayMs={400}>
              <BotanicalFlourish className="pt-3" />
            </Reveal>
          </div>

          {/* Right Column: Signature Arch Window Frame */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <Reveal delayMs={200} className="w-full max-w-md lg:max-w-lg">
              <div className="relative mx-auto">
                <div className="absolute -inset-2 rounded-t-[180px] sm:rounded-t-[220px] rounded-b-3xl bg-[#E4ECE6]/70 transform rotate-1 -z-10" />

                <div className="relative overflow-hidden rounded-t-[180px] sm:rounded-t-[220px] rounded-b-3xl border-4 border-white bg-[#FAF6EE] shadow-2xl aspect-[3/4] max-h-[580px] w-full">
                  <img
                    src={images.heroArch}
                    alt="Bloom Café Cozy Arched Interior with Neon Sign"
                    className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}

/* 2. Value Proposition Floating Bar */
export function ValuePropsBar() {
  const values = [
    {
      title: "PREMIUM COFFEE",
      desc: "Finest beans, expertly brewed for you.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      ),
    },
    {
      title: "FRESH INGREDIENTS",
      desc: "Locally sourced, always fresh & wholesome.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
    },
    {
      title: "COZY AMBIENCE",
      desc: "Warm space, soft music and good vibes.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <path d="M5 11h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" />
          <path d="M6 19v3" />
          <path d="M18 19v3" />
        </svg>
      ),
    },
    {
      title: "MADE WITH LOVE",
      desc: "Every dish & drink crafted with care.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative -mt-6 sm:-mt-8 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#E8DFD3] bg-[#F5EFE4] px-6 py-8 sm:px-10 sm:py-10 shadow-lg">
        
        <LeafCornerOrnament className="absolute -top-3 -left-3 h-16 w-16" />
        <LeafCornerOrnament className="absolute -bottom-3 -right-3 h-16 w-16 transform rotate-180" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#E8DFD3]">
          {values.map((item, idx) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center ${
                idx > 0 ? "pt-6 sm:pt-0 lg:pl-6" : ""
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4E0D7] text-[#2C3E2E] mb-3.5 shadow-xs transition-transform hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-sans text-xs font-bold tracking-[0.14em] text-[#2C3E2E] uppercase">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-[#6D6964] leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. Our Story Section */
export function OurStorySection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF6EE] py-20 sm:py-24">
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-[#EAD8CD]/40 blur-3xl pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-[#E4ECE6]/50 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Latte Art Cup */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal>
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                <div className="absolute -inset-3 rounded-[2.5rem] bg-[#E8DFD3] -rotate-2 -z-10" />

                <div className="overflow-hidden rounded-[2.2rem] border-4 border-white shadow-xl aspect-square">
                  <img
                    src={images.latteStory}
                    alt="Brewed with passion latte cup on wooden saucer"
                    className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 relative">
            <Reveal>
              <span className="text-xs font-bold tracking-[0.25em] text-[#A67C52] uppercase">
                OUR STORY
              </span>
            </Reveal>

            <Reveal delayMs={100}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E] leading-[1.12]">
                Brewed with passion, <br />
                served with{" "}
                <span className="font-script text-[#D07A60] font-normal inline-flex items-center gap-1">
                  love. <Heart className="h-6 w-6 text-[#D07A60] fill-[#D07A60]/20 inline" />
                </span>
              </h2>
            </Reveal>

            <Reveal delayMs={200}>
              <p className="max-w-xl text-sm sm:text-base text-[#6D6964] leading-relaxed">
                At Bloom Café, we believe in simple pleasures and meaningful moments. From our coffee to our food, everything we do comes from the heart.
              </p>
            </Reveal>

            <Reveal delayMs={300}>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#2C3E2E] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wider text-[#FAF6EE] shadow-md transition-all duration-300 hover:bg-[#1E2B20] active:scale-98"
                >
                  <span>LEARN MORE ABOUT US</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            {/* Coffee Cup Line Art */}
            <div className="hidden sm:block absolute right-0 bottom-0 pointer-events-none opacity-85">
              <svg
                viewBox="0 0 160 140"
                fill="none"
                stroke="#2C3E2E"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-32 w-36 text-[#2C3E2E]/60"
              >
                <path d="M70 20 Q 75 10, 72 0" />
                <path d="M85 24 Q 90 14, 87 4" />
                <path d="M100 22 Q 105 12, 102 2" />
                <path d="M45 45 H125 V85 C125 105, 105 115, 85 115 C65 115, 45 105, 45 85 Z" fill="#FAF6EE" />
                <path d="M125 55 C142 55, 142 85, 125 85" />
                <ellipse cx="85" cy="115" rx="65" ry="12" fill="#FAF6EE" />
                <ellipse cx="110" cy="100" rx="35" ry="25" fill="#8EA696" opacity="0.25" stroke="none" />
                <ellipse cx="60" cy="115" rx="40" ry="18" fill="#D07A60" opacity="0.2" stroke="none" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* 4. Our Specialties Section ("Made for You") */
export function SpecialtiesSection() {
  const { toggleFavorite, isFavorite } = useApp();
  const { setCustomizingItem, addToCart } = useCart();

  return (
    <section className="bg-[#FAF6EE] py-20 sm:py-24 border-t border-[#E8DFD3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-script text-2xl sm:text-3xl text-[#D07A60] font-normal tracking-wide block">
              Our Specialties
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#2C3E2E] flex items-center gap-2 mt-1">
              Made for You <Heart className="h-6 w-6 text-[#D07A60] fill-[#D07A60]/20 inline" />
            </h2>
          </div>

          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#2C3E2E] hover:text-[#D07A60] transition-colors uppercase pb-1"
          >
            <span>VIEW FULL MENU</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {specialties.map((item, idx) => {
            const isFav = isFavorite(item.id);

            return (
              <Reveal key={item.id} delayMs={idx * 100}>
                <div className="group flex flex-col justify-between rounded-3xl border border-[#E8DFD3] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  
                  {/* Photo with hover actions */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF6EE]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {item.popular && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#2C3E2E]/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Specialty
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id, item.name)}
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                        isFav
                          ? "bg-white text-[#D07A60] shadow-sm"
                          : "bg-white/80 text-[#6D6964] hover:text-[#D07A60] hover:bg-white"
                      }`}
                      aria-label="Favorite"
                    >
                      <Heart className={`h-4 w-4 ${isFav ? "fill-[#D07A60] text-[#D07A60]" : ""}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between pt-4">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-[#2C3E2E]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#6D6964] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Ordering actions */}
                    <div className="mt-4 border-t border-[#F0EAE0] pt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-bold text-[#2C3E2E]">
                          {item.price}
                        </span>
                        <button
                          onClick={() => setCustomizingItem(item)}
                          className="text-[11px] font-bold text-[#D07A60] hover:underline"
                        >
                          Customize
                        </button>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-2 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Quick Add</span>
                      </button>
                    </div>

                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* 5. Bloom Loyalty Rewards Club Banner */
export function LoyaltyBanner() {
  const { loyaltyPoints, redeemPoints } = useApp();
  const { setIsCartOpen } = useCart();

  const rewards = [
    { points: 50, label: "Free Batch Brew or Espresso", desc: "Enjoy your morning coffee on us" },
    { points: 100, label: "Free Specialty Latte or Matcha", desc: "Any milk, syrup & extra shot included" },
    { points: 150, label: "Free Berry Pancakes Stack", desc: "Our signature all-day brunch treat" },
  ];

  return (
    <section className="bg-[#F5EFE4] py-16 sm:py-20 border-t border-[#E8DFD3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#2C3E2E] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                <Sparkles className="h-3.5 w-3.5" /> Bloom Rewards Club
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Earn 1 Point for Every $1 Spent
              </h2>
              <p className="text-xs sm:text-sm text-[#E4ECE6]/85 max-w-md leading-relaxed">
                Enjoy complimentary coffee drinks, seasonal desserts, and exclusive invitations to coffee tasting workshops.
              </p>
              
              {/* User Balance Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl p-3 border border-white/15">
                <Coffee className="h-6 w-6 text-[#D07A60]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#E4ECE6]/80 block">Your Balance</span>
                  <span className="font-display text-lg font-bold text-white">{loyaltyPoints} Bloom Points</span>
                </div>
              </div>
            </div>

            {/* Rewards Cards */}
            <div className="lg:col-span-6 space-y-2.5">
              {rewards.map((r) => {
                const canRedeem = loyaltyPoints >= r.points;
                return (
                  <div
                    key={r.points}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-white">{r.label}</span>
                        <span className="rounded-full bg-[#D07A60] px-2 py-0.5 text-[10px] font-bold text-white">
                          {r.points} pts
                        </span>
                      </div>
                      <span className="text-[11px] text-[#E4ECE6]/70 mt-0.5 block">{r.desc}</span>
                    </div>

                    <button
                      onClick={() => redeemPoints(r.points, r.label)}
                      disabled={!canRedeem}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase transition-all shrink-0 ${
                        canRedeem
                          ? "bg-[#FAF6EE] text-[#2C3E2E] hover:bg-white cursor-pointer"
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* 6. Atmosphere Quote Banner */
export function AtmosphereQuote() {
  const { openModal } = useBookTable();

  return (
    <section className="bg-[#FAF6EE] py-16 sm:py-20 border-t border-[#E8DFD3] relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
        <span className="font-script text-3xl sm:text-4xl text-[#D07A60]">
          Experience Bloom Café
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C3E2E]">
          "Good food. Good mood. Great memories."
        </h2>
        <p className="text-sm text-[#6D6964] max-w-lg mx-auto">
          Whether you're starting your morning with a silky flat white, joining us for weekend brunch, or working in our sunlit corners — you're always welcome.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={openModal}
            className="rounded-full bg-[#2C3E2E] px-8 py-3 text-xs font-semibold tracking-wider text-[#FAF6EE] shadow-md hover:bg-[#1E2B20] transition-colors cursor-pointer"
          >
            RESERVE A TABLE
          </button>
        </div>
      </div>
    </section>
  );
}
