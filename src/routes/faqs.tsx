import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HelpCircle, ChevronDown, Wifi, PawPrint, Car, Coffee, Sparkles, Calendar } from "lucide-react";
import { useBookTable } from "@/components/site/BookTableModal";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Find answers about Bloom Café: Wi-Fi policy, pet-friendly outdoor seating, parking access, dietary options, table bookings, and private event catering in Melbourne.",
      },
    ],
  }),
  component: FaqsPage,
});

interface FaqItem {
  question: string;
  answer: string;
  category: "Visiting" | "Menu & Coffee" | "Reservations" | "Catering";
}

const faqData: FaqItem[] = [
  {
    category: "Visiting",
    question: "Do you have free high-speed Wi-Fi and power outlets for remote work?",
    answer:
      "Yes! We offer complimentary 100 Mbps fiber Wi-Fi throughout the café. Power outlets are conveniently located along our banquette seating and arch booths. We welcome laptop workers on weekdays and ask that during busy weekend peak brunch hours (10 AM – 1:30 PM), table turnover is kindly respected.",
  },
  {
    category: "Visiting",
    question: "Are you pet and dog friendly?",
    answer:
      "Absolutely! Well-behaved dogs on leashes are warmly welcomed in our outdoor garden terrace and street-side patio tables. We even provide complimentary fresh water bowls and organic puppy treats upon request at the counter.",
  },
  {
    category: "Visiting",
    question: "What are your opening hours and parking options?",
    answer:
      "We are open 7 days a week from 7:00 AM to 9:00 PM (kitchen closes at 8:15 PM). Street parking is available along Café Street and adjacent laneways, with 2-hour free parking spots nearby and easy tram access via the central city line.",
  },
  {
    category: "Menu & Coffee",
    question: "What specialty coffee beans and milk alternatives do you serve?",
    answer:
      "Our house espresso blend is locally roasted in Melbourne using ethically sourced single-origin Arabica beans from Colombia and Ethiopia. We offer Bonsoy soy milk, Oatly barista oat milk, Milklab almond milk, and lactose-free dairy milk without any surcharge on our specialty items.",
  },
  {
    category: "Menu & Coffee",
    question: "Do you cater for Coeliac, Vegan, and Halal diets?",
    answer:
      "Yes. Our kitchen offers certified gluten-free bread, separate toaster facilities, vegan grain bowls, and dairy-free pastry options. All chicken used is 100% certified Halal. Please see our interactive Allergen Matrix page or notify our staff when ordering.",
  },
  {
    category: "Reservations",
    question: "Can I walk in without a reservation?",
    answer:
      "Walk-ins are always welcome! We reserve roughly 40% of our seating for spontaneous walk-in guests. On busy Saturday and Sunday mornings, we recommend using our quick online booking tool or checking the live queue wait badge in the header.",
  },
  {
    category: "Reservations",
    question: "How do digital gift cards work and do they expire?",
    answer:
      "Bloom Digital Gift Cards are generated immediately with a unique voucher code. They can be redeemed online during checkout or presented on your phone to our barista at the register. In accordance with Australian law, gift cards are valid for 3 years from purchase.",
  },
  {
    category: "Catering",
    question: "Do you host private events, birthdays, or office catering?",
    answer:
      "Yes! We host evening private events after 6:00 PM, floral brunch birthday parties, and corporate morning tea pastry boxes. Contact our events team directly through our contact page or email hello@bloomcafe.com for tailored packages.",
  },
];

function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { openModal } = useBookTable();

  const categories = ["All", "Visiting", "Menu & Coffee", "Reservations", "Catering"];

  const filteredFaqs = faqData.filter(
    (item) => activeCategory === "All" || item.category === activeCategory,
  );

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4ECE6] px-4 py-1 text-xs font-semibold text-[#2C3E2E]">
            <HelpCircle className="h-3.5 w-3.5 text-[#D07A60]" />
            Help & Guidance
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2C3E2E]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6964] max-w-lg mx-auto">
            Everything you need to know about dining, remote working, coffee sourcing, and visiting Bloom Café.
          </p>
        </Reveal>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeCategory === c
                  ? "bg-[#2C3E2E] text-white shadow-xs"
                  : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <Reveal key={faq.question} delayMs={idx * 40}>
                <div className="overflow-hidden rounded-2xl border border-[#E8DFD3] bg-white transition-all">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-display text-base font-semibold text-[#2C3E2E] hover:text-[#D07A60] transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#8EA696] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#D07A60]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#F0EAE0] bg-[#FAF6EE]/50 px-5 py-4 text-xs sm:text-sm text-[#4A4642] leading-relaxed animate-in slide-in-from-top-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Help Callout */}
        <div className="mt-14 rounded-3xl bg-[#2C3E2E] text-white p-8 text-center space-y-3">
          <h3 className="font-display text-2xl font-bold">Still have a question?</h3>
          <p className="text-xs text-[#E4ECE6]/80 max-w-md mx-auto">
            Our friendly team is always here to help. Reach out directly or come say hello over a warm cup of coffee.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="rounded-full bg-[#FAF6EE] text-[#2C3E2E] px-6 py-2.5 text-xs font-bold hover:bg-white transition-colors"
            >
              Contact Us
            </Link>
            <button
              onClick={openModal}
              className="rounded-full bg-white/10 border border-white/20 text-white px-6 py-2.5 text-xs font-bold hover:bg-white/20 transition-colors"
            >
              Reserve a Table
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
