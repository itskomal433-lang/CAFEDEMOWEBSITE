import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles, Coffee, Leaf, Sun, Calendar } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cafe, images } from "@/data/cafe";
import { useBookTable } from "@/components/site/BookTableModal";
import { BotanicalFlourish } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us & Our Story — Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Discover the heart behind Bloom Café in Melbourne. Ethical specialty beans, wholesome seasonal food, and a warm community sanctuary.",
      },
      { property: "og:title", content: "Our Story — Bloom Café" },
      {
        property: "og:description",
        content: "Brewed with passion, served with love. Good coffee, good food, Good Mood Everyday.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { openModal } = useBookTable();

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF6EE] pt-12 pb-16 sm:py-20 border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <Reveal>
                <span className="font-script text-3xl sm:text-4xl text-[#D07A60] block">
                  Our Journey & Heart
                </span>
              </Reveal>
              <Reveal delayMs={100}>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E] leading-tight">
                  Brewed with passion, <br />
                  served with{" "}
                  <span className="font-script text-[#D07A60] font-normal inline-flex items-center gap-1">
                    love. <Heart className="h-6 w-6 text-[#D07A60] fill-[#D07A60]/20 inline" />
                  </span>
                </h1>
              </Reveal>
              <Reveal delayMs={200}>
                <p className="text-sm sm:text-base text-[#6D6964] leading-relaxed">
                  Bloom Café began as a dream to create more than just a place to buy coffee. We envisioned a sunlit sanctuary in Melbourne where neighbors gather, ideas take flight, and every single sip brings a moment of peaceful pause.
                </p>
                <p className="text-sm sm:text-base text-[#6D6964] leading-relaxed mt-3">
                  Every cup is pulled with precision from sustainably harvested single-origin beans, paired with all-day brunch made from local Victorian farm produce.
                </p>
              </Reveal>

              <Reveal delayMs={300}>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] px-7 py-3 text-xs font-bold tracking-wider text-[#FAF6EE] hover:bg-[#1E2B20] transition-colors"
                  >
                    <span>EXPLORE MENU</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2C3E2E]/30 px-6 py-3 text-xs font-bold tracking-wider text-[#2C3E2E] hover:bg-[#E4ECE6]/50 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>RESERVE A TABLE</span>
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <Reveal delayMs={200}>
                <div className="relative max-w-md">
                  <div className="overflow-hidden rounded-t-[180px] rounded-b-3xl border-4 border-white shadow-xl aspect-[3/4]">
                    <img
                      src={images.heroArch}
                      alt="Bloom Café interior sanctuary"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars of Bloom Café */}
      <section className="py-20 bg-[#F5EFE4] border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="font-script text-3xl text-[#D07A60]">What drives us</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2C3E2E]">
              Our Guiding Philosophy
            </h2>
            <BotanicalFlourish className="justify-center" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-3xl bg-white p-7 border border-[#E8DFD3] text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4E0D7] text-[#2C3E2E] mb-4">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                Ethical Roasting
              </h3>
              <p className="mt-2 text-xs text-[#6D6964] leading-relaxed">
                Direct trade partnerships with sustainable coffee growers worldwide, ensuring fair compensation.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 border border-[#E8DFD3] text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4E0D7] text-[#2C3E2E] mb-4">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                Locally Sourced
              </h3>
              <p className="mt-2 text-xs text-[#6D6964] leading-relaxed">
                Seasonal fruits, artisan sourdough, organic eggs, and farm-fresh dairy from local producers.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 border border-[#E8DFD3] text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4E0D7] text-[#2C3E2E] mb-4">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                Warm Ambience
              </h3>
              <p className="mt-2 text-xs text-[#6D6964] leading-relaxed">
                An inviting environment filled with soft acoustics, natural botanical textures, and friendly smiles.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 border border-[#E8DFD3] text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4E0D7] text-[#2C3E2E] mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                Crafted With Care
              </h3>
              <p className="mt-2 text-xs text-[#6D6964] leading-relaxed">
                Every recipe is tested and perfected by our passionate culinary and barista team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ambiance Quote Banner */}
      <section className="py-20 bg-[#FAF6EE] text-center">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <span className="font-script text-3xl sm:text-4xl text-[#D07A60]">
            A space to feel at home
          </span>
          <p className="font-display text-2xl sm:text-3xl text-[#2C3E2E] italic leading-relaxed">
            "We believe that the best conversations and happiest memories happen over a warm cup of coffee and a shared plate of good food."
          </p>
          <p className="text-xs tracking-widest uppercase font-semibold text-[#A67C52]">
            — The Bloom Café Family
          </p>
        </div>
      </section>
    </div>
  );
}
