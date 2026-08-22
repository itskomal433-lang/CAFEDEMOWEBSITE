import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Heart, MessageSquarePlus, Sparkles, Coffee } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cafe } from "@/data/cafe";
import { useBookTable } from "@/components/site/BookTableModal";
import { useApp } from "@/context/AppContext";
import { ReviewModal } from "@/components/site/ReviewModal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — 4.9 ★ Community Feedback | Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Read real guest stories and community reviews for Bloom Café in Melbourne. Share your coffee experience with us!",
      },
      { property: "og:title", content: "Guest Reviews — Bloom Café" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { reviewsList } = useApp();
  const { openModal } = useBookTable();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const averageRating =
    reviewsList.length > 0
      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
      : "4.9";

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Header */}
        <Reveal className="text-center space-y-4">
          <span className="font-script text-3xl sm:text-4xl text-[#D07A60]">
            Words from our community
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E]">
            Loved by Melbourne Coffee Lovers
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-[#D07A60] pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#D07A60]" />
            ))}
            <span className="ml-2 font-display text-lg font-bold text-[#2C3E2E]">
              {averageRating} / 5.0 ({reviewsList.length} Verified Stories)
            </span>
          </div>

          <div className="pt-3">
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] px-7 py-3 text-xs font-bold tracking-wider shadow-md cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4 text-[#D07A60]" />
              <span>LEAVE A REVIEW</span>
            </Button>
          </div>
        </Reveal>

        {/* Reviews Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviewsList.map((rev, idx) => (
            <Reveal key={rev.id} delayMs={(idx % 6) * 60}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-[#D07A60]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D07A60]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#9E9B95]">{rev.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A4642] italic leading-relaxed">
                    "{rev.text}"
                  </p>

                  {rev.favoriteDish && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-full bg-[#F5EFE4] px-3 py-1 text-[10px] font-semibold text-[#A67C52] w-fit">
                      <Coffee className="h-3 w-3 text-[#D07A60]" />
                      <span>Favorite: {rev.favoriteDish}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-[#F0EAE0] pt-4">
                  <span className="font-display text-sm font-bold text-[#2C3E2E] block">
                    {rev.author}
                  </span>
                  <span className="text-[11px] text-[#6D6964] block">
                    {rev.role}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={openModal}
            className="rounded-full bg-[#2C3E2E] px-8 py-3 text-xs font-bold tracking-wider text-[#FAF6EE] hover:bg-[#1E2B20] transition-colors cursor-pointer"
          >
            EXPERIENCE BLOOM CAFÉ
          </button>
        </div>

      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}
