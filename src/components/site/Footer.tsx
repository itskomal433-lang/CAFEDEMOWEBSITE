import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Facebook,
  Sparkles,
  Heart,
  ShieldCheck,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cafe, hours, mapsUrl } from "@/data/cafe";
import { BotanicalLogo } from "./Header";
import pottedPlantImg from "@/assets/bloom-potted-plant.jpg";
import { LovableIcon } from "./LovableBadge";
import { WhatsAppIcon } from "./FloatingWhatsApp";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubscribed(true);
    toast.success("Welcome to the Bloom Café circle!", {
      description: "You'll receive exclusive seasonal menus, special perks, and promo codes.",
    });
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#FAF6EE] pt-16 sm:pt-20 border-t border-[#E8DFD3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-column Footer Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-14">
          
          {/* Left Column: Newsletter card (Sage Green Rounded Box) */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-3xl bg-[#7D9987] p-6 sm:p-7 text-white shadow-md">
              {/* Envelope icon badge */}
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D07A60] text-white shadow-sm mb-4">
                <Mail className="h-5 w-5" />
              </div>

              <h3 className="font-display text-lg font-bold tracking-wider uppercase text-white">
                STAY IN THE LOOP
              </h3>
              <p className="mt-1.5 text-xs text-[#FAF6EE]/90 leading-relaxed max-w-xs">
                Subscribe to get updates on new items, offers & secret seasonal drops.
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubscribe} className="mt-5 relative">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-full bg-white px-4 py-2.5 text-xs text-[#253328] placeholder-[#9E9B95] focus:outline-none focus:ring-2 focus:ring-[#D07A60] shadow-xs pr-11"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#D07A60] text-white shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={cafe.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C3E2E] text-white transition-colors hover:bg-[#D07A60]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={cafe.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C3E2E] text-white transition-colors hover:bg-[#D07A60]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={cafe.social.pinterest}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C3E2E] text-white text-xs font-bold transition-colors hover:bg-[#D07A60]"
                  aria-label="Pinterest"
                >
                  P
                </a>
                <a
                  href={cafe.social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C3E2E] text-white text-xs font-bold transition-colors hover:bg-[#D07A60]"
                  aria-label="TikTok"
                >
                  ♪
                </a>
              </div>
            </div>
          </div>

          {/* Middle Column: Brand identity & cursive slogan */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center px-4 py-4">
            <BotanicalLogo className="justify-center scale-105 mb-3" />
            <p className="font-script text-2xl sm:text-3xl text-[#D07A60] font-normal tracking-wide mt-2">
              Good food. Good mood.
            </p>
            <p className="font-script text-2xl sm:text-3xl text-[#D07A60] font-normal tracking-wide flex items-center gap-1.5 justify-center">
              Great memories. <Heart className="h-4 w-4 fill-[#D07A60] text-[#D07A60] inline" />
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#6D6964]">
              <Link to="/faqs" className="hover:text-[#2C3E2E] transition-colors flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-[#D07A60]" /> FAQs & Help
              </Link>
            </div>
          </div>

          {/* Right Column: Contact details + Potted plant */}
          <div className="lg:col-span-4 flex items-center justify-between gap-4 border-t lg:border-t-0 border-[#E8DFD3] pt-6 lg:pt-0">
            <div className="space-y-3 text-xs text-[#4A4642]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#2C3E2E] shrink-0 mt-0.5" />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-snug hover:text-[#D07A60] transition-colors"
                >
                  {cafe.address.street},<br />{cafe.address.city}, {cafe.address.state} {cafe.address.zip}, {cafe.address.country}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#2C3E2E] shrink-0" />
                <a href={cafe.phoneHref} className="hover:text-[#D07A60] font-medium transition-colors">
                  {cafe.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="h-4 w-4 fill-[#25D366] shrink-0" />
                <a
                  href={cafe.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-semibold text-[#25D366] transition-colors"
                >
                  WhatsApp: {cafe.whatsappDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#2C3E2E] shrink-0" />
                <a href={cafe.emailHref} className="hover:text-[#D07A60] transition-colors">
                  {cafe.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#2C3E2E] shrink-0" />
                <span>Mon – Sun: 7:00 AM – 9:00 PM</span>
              </div>
            </div>

            {/* Illustrated Potted plant graphic */}
            <div className="relative w-28 sm:w-36 h-36 sm:h-44 shrink-0 overflow-hidden rounded-2xl">
              <img
                src={pottedPlantImg}
                alt="Bloom Café Potted Fiddle Leaf Fig"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Dark Olive Bottom Bar */}
      <div className="bg-[#202E22] py-4 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E4ECE6]/80 gap-3">
          <div className="flex items-center gap-2">
            <span>© 2025 Bloom Café Melbourne. All Rights Reserved.</span>
            <span>•</span>
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/90 transition-colors hover:bg-white/20 hover:text-white"
            >
              <LovableIcon className="h-3 w-3" />
              <span>Lovable</span>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <span>•</span>
            <Link to="/menu" className="hover:text-white transition-colors">Menu</Link>
            <span>•</span>
            <Link to="/giftcards" className="hover:text-white transition-colors">Gift Cards</Link>
            <span>•</span>
            <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/admin" className="text-[#D07A60] hover:text-white font-semibold transition-colors">🔐 Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
