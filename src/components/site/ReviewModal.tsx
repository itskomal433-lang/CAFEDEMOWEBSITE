import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Heart, Sparkles, MessageSquareHeart } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ReviewModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("Local Coffee Lover");
  const [favoriteDish, setFavoriteDish] = useState("Classic Latte");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text) return;

    addReview({
      author,
      role: role || "Coffee Enthusiast",
      rating,
      text,
      favoriteDish,
    });

    onClose();
    setAuthor("");
    setText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-w-md rounded-[2rem] bg-[#FAF6EE] border-border p-6 sm:p-8">
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D07A60] mb-1">
            <MessageSquareHeart className="h-4 w-4" /> Guest Feedback
          </div>
          <DialogTitle className="font-display text-2xl font-bold text-[#2C3E2E]">
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-xs text-[#6D6964]">
            Tell our baristas and kitchen crew about your visit to Bloom Café.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Star rating selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#6D6964]">Your Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      (hoverRating ?? rating) >= star
                        ? "fill-[#D07A60] text-[#D07A60]"
                        : "text-[#C8BFB3]"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#2C3E2E] ml-2">
                {rating === 5 ? "Loved it!" : `${rating} Stars`}
              </span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#6D6964]">Your Name *</Label>
            <Input
              placeholder="e.g. Sarah Jenkins"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="rounded-xl border-[#E8DFD3] bg-white mt-1"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#6D6964]">Favorite Order / Dish</Label>
            <Input
              placeholder="e.g. Berry Pancakes & Oat Flat White"
              value={favoriteDish}
              onChange={(e) => setFavoriteDish(e.target.value)}
              className="rounded-xl border-[#E8DFD3] bg-white mt-1"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#6D6964]">Your Review *</Label>
            <textarea
              rows={4}
              placeholder="How was the coffee, service, and atmosphere?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E8DFD3] bg-white p-3 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none mt-1 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-6 text-sm font-semibold tracking-wider shadow-md"
          >
            Post Review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
