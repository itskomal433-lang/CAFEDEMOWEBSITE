import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  Menu,
  X,
  ShoppingBag,
  Gift,
  Coffee,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Wifi,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import { useBookTable } from "./BookTableModal";
import { useCart } from "@/context/CartContext";
import { LiveStatusBadge } from "./LiveStatusBadge";
import { cafe, mapsUrl } from "@/data/cafe";

export function BotanicalLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      {/* Botanical Coffee Sprout Emblem */}
      <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#2C3E2E]/25 bg-[#FAF6EE] shadow-xs shrink-0 group transition-transform hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2C3E2E"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 sm:h-6 sm:w-6"
        >
          {/* Coffee cup bowl */}
          <path d="M5 13C5 17.5 8 19 12 19C16 19 19 17.5 19 13H5Z" fill="#2C3E2E" fillOpacity="0.08" />
          <path d="M19 13.5C20.5 13.5 21.5 12.5 21.5 11C21.5 9.5 20.5 8.5 19 8.5" />
          <path d="M4 20.5H20" />
          {/* Botanical steam leaves */}
          <path d="M12 13V6" stroke="#D07A60" />
          <path d="M12 6C12 3 16 3 16 3C16 7 12 6 12 6Z" fill="#D07A60" />
          <path d="M12 9C12 6 8 5.5 8 5.5C8 9.5 12 9 12 9Z" fill="#8EA696" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#D07A60] text-[8px] text-white">
          ✦
        </span>
      </div>

      <div className="flex flex-col text-left">
        <span className="font-display text-lg sm:text-xl font-bold tracking-[0.16em] text-[#2C3E2E] leading-none">
          BLOOM CAFÉ
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6D6964] font-semibold mt-1">
          COFFEE • FOOD • GOOD TIMES
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useBookTable();
  const { cart, itemCount, setIsCartOpen, activeOrder, setIsOrderTrackerOpen } = useCart();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT US" },
    { to: "/menu", label: "MENU" },
    { to: "/gallery", label: "GALLERY" },
    { to: "/giftcards", label: "GIFT CARDS" },
    { to: "/reviews", label: "REVIEWS" },
    { to: "/faqs", label: "FAQS" },
    { to: "/contact", label: "CONTACT" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DFD3]/80 bg-[#FAF6EE]/95 backdrop-blur-md transition-all">
      {/* Top micro bar for Live Status */}
      <div className="bg-[#F5EFE4] border-b border-[#E8DFD3] py-1 px-4 text-center hidden md:flex items-center justify-between text-[11px] text-[#6D6964]">
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between">
          <LiveStatusBadge />
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#2C3E2E] font-medium">
              <Wifi className="h-3.5 w-3.5 text-[#2C3E2E]" />
              <span>Free 100Mbps Wi-Fi & Dog Friendly 🐾</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#2C3E2E]" />
              <a href={cafe.phoneHref} className="font-semibold hover:text-[#D07A60] transition-colors">{cafe.phone}</a>
            </span>
            <span>•</span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold hover:text-[#D07A60] transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-[#2C3E2E]" />
              <span>123 Café Street, Melbourne</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="transition-opacity hover:opacity-90 shrink-0">
          <BotanicalLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 xl:gap-6 lg:flex">
          {navLinks.map((link, idx) => {
            const isActive =
              link.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.to);

            return (
              <Link
                key={`${link.label}-${idx}`}
                to={link.to}
                className={`text-xs font-semibold tracking-[0.08em] transition-colors hover:text-[#D07A60] whitespace-nowrap ${
                  isActive
                    ? "text-[#2C3E2E] font-bold border-b-2 border-[#2C3E2E] pb-0.5"
                    : "text-[#4A4642]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Active Order, Cart & Book Table */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Active order status pill if brewing */}
          {activeOrder && (
            <button
              onClick={() => setIsOrderTrackerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#E4ECE6] border border-[#2C3E2E]/20 px-3 py-1.5 text-xs font-bold text-[#2C3E2E] animate-pulse cursor-pointer"
            >
              <Coffee className="h-3.5 w-3.5 text-[#D07A60]" />
              <span className="hidden sm:inline">Order #{activeOrder.orderId}</span>
              <span className="sm:hidden">Tracking</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E8DFD3] bg-white text-[#2C3E2E] shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#2C3E2E]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D07A60] text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>

          {/* Book A Table Button */}
          <button
            onClick={openModal}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#2C3E2E] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#FAF6EE] shadow-sm transition-all duration-200 hover:bg-[#1E2B20] hover:shadow-md active:scale-97 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-[#E4ECE6]" />
            <span>BOOK A TABLE</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DFD3] bg-white text-[#2C3E2E] lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-[#E8DFD3] bg-[#FAF6EE] px-6 py-5 lg:hidden animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3.5">
            {navLinks.map((link, idx) => (
              <Link
                key={`mobile-${link.label}-${idx}`}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold tracking-wider text-[#2C3E2E] py-1 border-b border-[#E8DFD3]/50 hover:text-[#D07A60]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openModal();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2C3E2E] py-2.5 text-xs font-semibold tracking-wider text-[#FAF6EE]"
              >
                <Calendar className="h-4 w-4" />
                <span>BOOK A TABLE</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
