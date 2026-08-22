import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Heart, Sparkles, Filter, Calendar, ShoppingBag, Plus, SlidersHorizontal, Ban } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { fullMenu, menuCategories, cafe, MenuItem } from "@/data/cafe";
import { useBookTable } from "@/components/site/BookTableModal";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Specialty Coffee, Brunch & Bakery | Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Explore the complete Bloom Café menu: handcrafted Melbourne flat whites, fluffy berry pancakes, avocado sourdough toast, and artisan chocolate cakes.",
      },
      { property: "og:title", content: "Bloom Café Menu — Melbourne" },
      {
        property: "og:description",
        content:
          "Good food, good coffee, good mood. Fresh wholesome ingredients and handcrafted specialty drinks.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [dietaryFilter, setDietaryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart, setCustomizingItem, itemCount, total, setIsCartOpen } = useCart();
  const { toggleFavorite, isFavorite, soldOutItemIds } = useApp();
  const { openModal } = useBookTable();

  const dietaryOptions = ["all", "Vegetarian", "Vegan", "Gluten-Free"];

  const filteredItems = fullMenu.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesDietary =
      dietaryFilter === "all" || (item.dietary && item.dietary.includes(dietaryFilter as any));
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  return (
    <div className="bg-[#FAF6EE] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#FAF6EE] pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Reveal>
            <span className="font-script text-3xl sm:text-4xl text-[#D07A60] font-normal block">
              Good food, crafted with love
            </span>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E]">
              Our Complete Menu
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-xl mx-auto text-sm text-[#6D6964]">
              From morning espresso rituals to nourishing brunch and artisan desserts, everything is freshly prepared daily with locally sourced ingredients.
            </p>
          </Reveal>

          {/* Search bar */}
          <Reveal delayMs={300}>
            <div className="mx-auto max-w-md pt-4">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-[#8EA696]" />
                <input
                  type="text"
                  placeholder="Search for coffee, pancakes, bowls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-[#E8DFD3] bg-white py-3 pl-11 pr-4 text-xs sm:text-sm text-[#253328] placeholder-[#9E9B95] shadow-xs focus:border-[#2C3E2E] focus:outline-none"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sticky Categories & Dietary Filter Bar */}
      <section className="sticky top-[69px] z-30 bg-[#FAF6EE]/95 backdrop-blur-md py-3.5 border-b border-[#E8DFD3] shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          {/* Main category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:justify-center">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#2C3E2E] text-[#FAF6EE] shadow-sm"
                    : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2] hover:text-[#2C3E2E]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dietary filters */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider hidden sm:inline">
              Dietary:
            </span>
            {dietaryOptions.map((d) => (
              <button
                key={d}
                onClick={() => setDietaryFilter(d)}
                className={`rounded-full px-3 py-0.5 text-[11px] font-medium transition-all ${
                  dietaryFilter === d
                    ? "bg-[#D07A60] text-white"
                    : "bg-[#F3EDE2] text-[#6D6964] hover:bg-[#E8DFD3]"
                }`}
              >
                {d === "all" ? "All Diets" : d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-[#2C3E2E]">No items found matching your search</p>
            <p className="text-sm text-[#6D6964] mt-2">Try clearing your search query or selecting another category.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setDietaryFilter("all");
              }}
              className="mt-4 rounded-full bg-[#2C3E2E] px-6 py-2 text-xs text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const isFav = isFavorite(item.id);
              const isSoldOut = soldOutItemIds.includes(item.id);

              return (
                <Reveal key={item.id} delayMs={(idx % 6) * 50}>
                  <div
                    className={`group flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition-all duration-300 ${
                      isSoldOut
                        ? "border-rose-200 bg-white/75 opacity-80"
                        : "border-[#E8DFD3] bg-white hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    
                    {item.image && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FAF6EE] mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`h-full w-full object-cover object-center transition-transform duration-500 ${
                            isSoldOut ? "grayscale-50" : "group-hover:scale-105"
                          }`}
                          loading="lazy"
                        />
                        
                        {isSoldOut ? (
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                            Sold Out (86'd)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleFavorite(item.id, item.name)}
                            className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
                              isFav ? "bg-white text-[#D07A60]" : "bg-white/80 text-[#6D6964] hover:text-[#D07A60]"
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-[#D07A60]" : ""}`} />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-[#2C3E2E]">
                          {item.name}
                        </h3>
                        <span className="font-display text-base font-bold text-[#2C3E2E] shrink-0">
                          {item.price}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-[#6D6964] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Dietary Badges */}
                      {item.dietary && item.dietary.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.dietary.map((d) => (
                            <span
                              key={d}
                              className="rounded-full bg-[#E4ECE6] px-2.5 py-0.5 text-[10px] font-semibold text-[#2C3E2E]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action buttons: Customize & Quick Add */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#F0EAE0] pt-3">
                      {isSoldOut ? (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                          <Ban className="h-3.5 w-3.5" /> Unavailable today
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => setCustomizingItem(item)}
                            className="text-xs font-semibold text-[#D07A60] hover:underline"
                          >
                            Customize & Options
                          </button>

                          <button
                            onClick={() => addToCart(item)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] px-4 py-1.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Bottom Reservation Callout */}
        <div className="mt-16 rounded-3xl bg-[#2C3E2E] p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="font-script text-3xl sm:text-4xl text-[#D07A60]">
              Join us for brunch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF6EE]">
              Reserve a Table at Bloom Café
            </h2>
            <p className="text-xs sm:text-sm text-[#E4ECE6]/80 leading-relaxed">
              Skip the queue on busy mornings. Book your favorite table online in seconds.
            </p>
            <div className="pt-2">
              <button
                onClick={openModal}
                className="inline-flex items-center gap-2 rounded-full bg-[#FAF6EE] px-8 py-3 text-xs font-bold tracking-wider text-[#2C3E2E] hover:bg-white transition-colors shadow-md cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-[#D07A60]" />
                <span>BOOK A TABLE NOW</span>
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Floating Bottom Cart Bar if items exist */}
      {itemCount > 0 && (
        <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-between gap-6 rounded-full bg-[#2C3E2E] text-white px-6 py-3.5 shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D07A60] text-xs font-bold text-white">
                {itemCount}
              </div>
              <span className="text-xs font-semibold">Your Bloom Order</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-sm font-bold text-[#E4ECE6]">
                ${total.toFixed(2)}
              </span>
              <button
                onClick={() => setIsCartOpen(true)}
                className="rounded-full bg-[#FAF6EE] text-[#2C3E2E] px-4 py-1.5 text-xs font-bold hover:bg-white transition-colors cursor-pointer"
              >
                View Cart →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
