import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldCheck, Coffee, HeartHandshake, AlertCircle } from "lucide-react";
import { cafe } from "@/data/cafe";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Read Bloom Café's terms of service, table reservation rules, online ordering policies, digital gift card guidelines, and allergen advisories.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4ECE6] px-4 py-1 text-xs font-semibold text-[#2C3E2E]">
            <FileText className="h-3.5 w-3.5 text-[#D07A60]" />
            Legal & Customer Policies
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2C3E2E]">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#6D6964]">
            Effective Date: January 1, 2025 • Last Updated: August 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 sm:p-12 shadow-sm space-y-8 text-[#4A4642] text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">1</span>
              Welcome & Introduction
            </h2>
            <p>
              Welcome to <strong>Bloom Café</strong> ("we," "our," or "us"). By accessing or using our website, making table reservations, placing online takeaway orders, or purchasing digital gift vouchers, you agree to comply with and be bound by the following Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">2</span>
              Table Reservations & Booking Policy
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Reservation Grace Period:</strong> We hold reserved tables for up to 15 minutes past the booking time. If your party is delayed, please notify us by telephone.</li>
              <li><strong>Cancellation Notice:</strong> We appreciate at least 2 hours notice for cancellations of small parties (1-4 guests) and 24 hours notice for large parties (6+ guests).</li>
              <li><strong>Seating Requests:</strong> While we do our utmost to accommodate specific seating requests (such as our window arch or garden bar), seating assignments remain subject to availability during peak brunch hours.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">3</span>
              Online Ordering, Takeaway & Payments
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Order Fulfillment:</strong> Online orders are prepared fresh upon receipt for the estimated pickup time. Uncollected items within 45 minutes of the selected pickup time cannot be refunded or remade free of charge.</li>
              <li><strong>Pricing & Taxes:</strong> All prices displayed on our menu and checkout are in Australian Dollars (AUD) and are inclusive of the standard 10% Goods and Services Tax (GST).</li>
              <li><strong>Payment Methods:</strong> We accept major credit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, and Bloom Digital Gift Vouchers. All digital transactions are encrypted via PCI-DSS compliant payment gateways.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">4</span>
              Digital Gift Vouchers & Bloom Rewards
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Gift Card Validity:</strong> Digital gift cards issued by Bloom Café are valid for 3 years from the date of purchase in accordance with Australian Consumer Law.</li>
              <li><strong>Non-Refundable:</strong> Gift vouchers are non-refundable and cannot be redeemed for physical cash, except where required by law.</li>
              <li><strong>Bloom Loyalty Points:</strong> Loyalty rewards points have no monetary cash value and may only be redeemed for eligible menu items specified in the Rewards Club catalog.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">5</span>
              Allergen Advisory & Food Safety
            </h2>
            <div className="rounded-2xl bg-[#F5EFE4] border border-[#E8DFD3] p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#2C3E2E]">
                <AlertCircle className="h-4 w-4 text-[#D07A60]" />
                Kitchen Allergen & Dietary Disclaimer
              </div>
              <p>
                Our kitchen handles tree nuts, peanuts, sesame seeds, gluten, eggs, dairy, and soy. While our kitchen team follows strict sanitation protocols and dedicated prep boards for dietary orders, cross-contact may occur. If you have a severe anaphylactic allergy, please alert our barista or floor manager before ordering.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4ECE6] text-xs text-[#2C3E2E]">6</span>
              Customer Code of Conduct & Sanctuary Atmosphere
            </h2>
            <p>
              Bloom Café is a shared sanctuary dedicated to calm conversations, wholesome dining, and community warmth. We ask all guests to respect fellow diners, keep personal music/calls on headphones, and maintain pleasant supervision of pets in our outdoor garden areas.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#F0EAE0] pt-6">
            <h2 className="font-display text-lg font-bold text-[#2C3E2E]">
              Questions or Concerns?
            </h2>
            <p className="text-xs">
              If you have any questions regarding these terms, please reach out to our management team at:
            </p>
            <div className="text-xs text-[#6D6964] space-y-1">
              <p><strong>Email:</strong> <a href={cafe.emailHref} className="text-[#D07A60] underline">{cafe.email}</a></p>
              <p><strong>Phone:</strong> <a href={cafe.phoneHref} className="text-[#D07A60] underline">{cafe.phone}</a></p>
              <p><strong>Address:</strong> 123 Café Street, Melbourne, VIC 3000, Australia</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
