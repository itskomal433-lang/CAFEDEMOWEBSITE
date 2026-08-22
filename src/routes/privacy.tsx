import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Shield, Eye, Database, Bell } from "lucide-react";
import { cafe } from "@/data/cafe";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bloom Café Melbourne" },
      {
        name: "description",
        content:
          "Learn how Bloom Café collects, protects, and handles your personal information, reservations, and online order data in Melbourne.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E4ECE6] px-4 py-1 text-xs font-semibold text-[#2C3E2E]">
            <Lock className="h-3.5 w-3.5 text-[#D07A60]" />
            Data Protection & Privacy
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#2C3E2E]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6D6964]">
            Effective Date: January 1, 2025 • Compliance with Australian Privacy Principles (APPs)
          </p>
        </div>

        {/* Content Box */}
        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-8 sm:p-12 shadow-sm space-y-8 text-[#4A4642] text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#D07A60]" />
              Our Commitment to Your Privacy
            </h2>
            <p>
              At <strong>Bloom Café</strong>, we value the trust you place in us when sharing your personal information. We are committed to safeguarding your privacy in compliance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#D07A60]" />
              Information We Collect
            </h2>
            <p>We may collect personal details when you interact with our website and cafe services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Table Reservations:</strong> Name, phone number, email address, date, party size, and dining/dietary preferences.</li>
              <li><strong>Online Orders & Takeaway:</strong> Customer contact info, pickup time selections, special barista instructions, and payment transaction tokens.</li>
              <li><strong>Newsletter Subscription:</strong> Email address for seasonal menu updates and cafe news (you may unsubscribe at any time).</li>
              <li><strong>Gift Card Recipients:</strong> Recipient name, email, and gift note.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#D07A60]" />
              How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate cafe operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Confirming and managing your table reservations via SMS/Email.</li>
              <li>Preparing and communicating the live status of your coffee and brunch orders.</li>
              <li>Processing secure digital payments. We never store raw credit card numbers on our servers.</li>
              <li>Improving our kitchen menu, customer service, and website user experience.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#D07A60]" />
              Security & Payment Protection
            </h2>
            <p>
              We implement industry-standard 256-bit SSL encryption across our entire digital ordering workflow. Online payment transactions are securely handled by certified Level 1 PCI-DSS payment gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#2C3E2E] flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#D07A60]" />
              Your Rights & Unsubscribing
            </h2>
            <p>
              You have the right to access, update, or request the deletion of your personal data at any time. To exercise these rights or opt out of promotional communications, please email us at <a href={cafe.emailHref} className="text-[#D07A60] font-bold underline">{cafe.email}</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
