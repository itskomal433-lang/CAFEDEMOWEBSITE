import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, ZoomIn, Heart, Sparkles, Instagram } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { gallery, cafe } from "@/data/cafe";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Coffee, Food & Ambiance | Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Take a visual tour of Bloom Café in Melbourne: latte art, artisan pancakes, cozy arch dining, and botanical interior.",
      },
      { property: "og:title", content: "Bloom Café Gallery — Melbourne" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[0] | null>(null);

  const categories = ["All", "Coffee", "Food", "Ambiance", "Bakery"];

  const filteredItems =
    activeCategory === "All"
      ? gallery
      : gallery.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="bg-[#FAF6EE] min-h-screen pb-20">
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Reveal>
            <span className="font-script text-3xl sm:text-4xl text-[#D07A60] block">
              Moments & Atmosphere
            </span>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E]">
              The Bloom Gallery
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-xl mx-auto text-sm text-[#6D6964]">
              A glimpse into our cozy sunlit sanctuary, handcrafted espresso drinks, and freshly made wholesome brunch plates.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#2C3E2E] text-white shadow-sm"
                  : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <Reveal key={item.id} delayMs={idx * 80}>
              <div
                onClick={() => setSelectedImage(item)}
                className="group relative overflow-hidden rounded-3xl border border-[#E8DFD3] bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF6EE]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52]">
                      {item.category}
                    </span>
                    <ZoomIn className="h-4 w-4 text-[#8EA696] group-hover:text-[#2C3E2E] transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#2C3E2E] mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6D6964] mt-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Instagram Follow Callout */}
        <div className="mt-16 rounded-3xl border border-[#E8DFD3] bg-white p-8 text-center space-y-4 shadow-xs max-w-2xl mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF6EE] text-[#D07A60] mx-auto border border-[#E8DFD3]">
            <Instagram className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-[#2C3E2E]">
              Share Your Bloom Moments
            </h3>
            <p className="text-xs text-[#6D6964] mt-1">
              Tag <span className="font-bold text-[#D07A60]">{cafe.social.instagramHandle}</span> or use <span className="font-bold text-[#2C3E2E]">#BloomCafeMelbourne</span> on Instagram to be featured on our community wall!
            </p>
          </div>
          <a
            href={cafe.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white px-6 py-2.5 text-xs font-bold transition-all shadow-sm"
          >
            <Instagram className="h-4 w-4 text-[#D07A60]" />
            <span>Follow {cafe.social.instagramHandle} on Instagram</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full overflow-hidden rounded-3xl bg-[#FAF6EE] shadow-2xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                {selectedImage.category}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E] mt-1">
                {selectedImage.title}
              </h3>
              <p className="text-sm text-[#6D6964] mt-2">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
