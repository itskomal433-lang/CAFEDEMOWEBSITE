import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, Calendar, Send, Sparkles, Instagram, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { cafe, fullAddress, mapEmbedUrl, mapsUrl } from "@/data/cafe";
import { useBookTable } from "@/components/site/BookTableModal";
import { WhatsAppIcon } from "@/components/site/FloatingWhatsApp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Find Bloom Café — Melbourne" },
      {
        name: "description",
        content:
          "Visit Bloom Café at 123 Café Street, Melbourne. Call (03) 9123 4567, reserve your table, or send an inquiry.",
      },
      { property: "og:title", content: "Contact & Location — Bloom Café Melbourne" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { openModal } = useBookTable();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitted(true);
    toast.success("Thank you for reaching out!", {
      description: "Our Bloom Café team will get back to you within 24 hours.",
    });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="bg-[#FAF6EE] min-h-screen pb-20">
      {/* Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 text-center border-b border-[#E8DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Reveal>
            <span className="font-script text-3xl sm:text-4xl text-[#D07A60] block">
              We'd love to see you
            </span>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E2E]">
              Get in Touch & Visit
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="max-w-xl mx-auto text-sm text-[#6D6964]">
              Have a question about event bookings, wholesale beans, or catering? Drop us a note or come by for a cup of coffee.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Details & Booking */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
                Bloom Café Details
              </h2>

              <div className="space-y-4 text-sm text-[#4A4642]">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4ECE6] text-[#2C3E2E] shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2C3E2E] block">Address</span>
                    <span>{fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4ECE6] text-[#2C3E2E] shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2C3E2E] block">Phone</span>
                    <a href={cafe.phoneHref} className="hover:text-[#D07A60] transition-colors">
                      {cafe.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4ECE6] text-[#2C3E2E] shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2C3E2E] block">Email</span>
                    <a href={cafe.emailHref} className="hover:text-[#D07A60] transition-colors">
                      {cafe.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8EE] text-[#25D366] shrink-0">
                    <WhatsAppIcon className="h-5 w-5 fill-[#25D366]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2C3E2E] block">WhatsApp Chat</span>
                    <a
                      href={cafe.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#25D366] hover:underline transition-colors flex items-center gap-1"
                    >
                      {cafe.whatsappDisplay} <span className="text-[11px] font-normal text-[#6D6964]">• Instant Barista Chat</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4ECE6] text-[#2C3E2E] shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2C3E2E] block">Hours</span>
                    <span>Monday – Sunday: 7:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Quick Table Reservation Callout */}
              <div className="rounded-2xl bg-[#F5EFE4] p-5 border border-[#E8DFD3] text-center space-y-3">
                <span className="font-script text-2xl text-[#D07A60] block">
                  Planning a visit?
                </span>
                <p className="text-xs text-[#6D6964]">
                  Reserve a cozy booth or sunlit arch table ahead of time.
                </p>
                <button
                  onClick={openModal}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2C3E2E] py-2.5 text-xs font-semibold tracking-wider text-[#FAF6EE] hover:bg-[#1E2B20] transition-colors cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>RESERVE A TABLE</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-10 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                Send a Message
              </span>
              <h2 className="font-display text-3xl font-bold text-[#2C3E2E] mt-1 mb-6">
                How Can We Help You?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#6D6964] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-4 py-2.5 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#6D6964] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-4 py-2.5 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#6D6964] block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Catering, Private Event, Feedback..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-4 py-2.5 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#6D6964] block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what you're thinking..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] p-4 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] px-8 py-3 text-xs font-bold tracking-wider text-[#FAF6EE] hover:bg-[#1E2B20] transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>SEND MESSAGE</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Interactive Location & Google Maps Section */}
        <div className="mt-14 rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D07A60]">
                Find Us In Melbourne
              </span>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E] mt-0.5">
                Bloom Café Melbourne Location & Directions
              </h3>
              <p className="text-xs text-[#6D6964] mt-1">
                {fullAddress} • Free street parking and tram stops right outside our door.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white px-5 py-2.5 text-xs font-bold transition-transform active:scale-95 shadow-sm"
              >
                <MapPin className="h-4 w-4 text-[#D07A60]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              <a
                href={cafe.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#E8DFD3] bg-[#FAF6EE] hover:bg-[#F3EDE2] text-[#2C3E2E] px-5 py-2.5 text-xs font-bold transition-all"
              >
                <Instagram className="h-4 w-4 text-[#D07A60]" />
                <span>Follow {cafe.social.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Map Embed Frame */}
          <div className="h-72 sm:h-96 w-full overflow-hidden rounded-2xl border border-[#E8DFD3] shadow-inner">
            <iframe
              title="Bloom Café Location on Google Maps"
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
