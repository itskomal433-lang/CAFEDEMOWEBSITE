import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Coffee,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Search,
  Plus,
  Trash2,
  Lock,
  Volume2,
  VolumeX,
  Sparkles,
  Printer,
  ShoppingBag,
  RotateCcw,
  Bell,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useCart, ActiveOrder } from "@/context/CartContext";
import { useApp, ReservationItem } from "@/context/AppContext";
import { fullMenu, cafe } from "@/data/cafe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AdminPOS } from "@/components/admin/AdminPOS";
import { AdminInventory } from "@/components/admin/AdminInventory";
import { AdminFloorPlan } from "@/components/admin/AdminFloorPlan";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { ReceiptModal } from "@/components/admin/ReceiptModal";
import { AdminNotificationDrawer } from "@/components/admin/AdminNotificationDrawer";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Barista & Management Console — Bloom Café Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (
        search.includes("auth=true") ||
        search.includes("token=manager") ||
        search.includes("key=bloom2025") ||
        search.includes("pin=1234")
      ) {
        sessionStorage.setItem("bloom_admin_auth", "true");
        return true;
      }
      return sessionStorage.getItem("bloom_admin_auth") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (
        search.includes("auth=true") ||
        search.includes("token=manager") ||
        search.includes("key=bloom2025") ||
        search.includes("pin=1234")
      ) {
        setIsAuthenticated(true);
        sessionStorage.setItem("bloom_admin_auth", "true");
        toast.success("✨ Verified! Logged into Barista & Management Console.");
      }
    }
  }, []);

  const [pin, setPin] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "pos" | "kds" | "floor" | "reservations" | "inventory" | "analytics" | "settings"
  >("pos");

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ActiveOrder | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<ActiveOrder | null>(null);
  const [isStaffCancelModalOpen, setIsStaffCancelModalOpen] = useState(false);
  const [staffCancelReason, setStaffCancelReason] = useState("Ingredient out of stock (86'd)");

  const { activeOrder, cancelActiveOrder, clearCart, clearActiveOrder } = useCart();
  const {
    reservations,
    updateReservationStatus,
    cancelReservation,
    addReservation,
    reviewsList,
    deleteReview,
    storeSettings,
    updateStoreSettings,
    soldOutItemIds,
    toggleItemSoldOut,
    resetAllAppData,
    notifications,
    addNotification,
    unreadAdminCount,
  } = useApp();

  const handleOpenCancelModal = (order: ActiveOrder) => {
    setOrderToCancel(order);
    setStaffCancelReason("Ingredient out of stock (86'd)");
    setIsStaffCancelModalOpen(true);
  };

  const handleConfirmStaffCancel = () => {
    if (!orderToCancel) return;

    if (activeOrder && activeOrder.orderId === orderToCancel.orderId) {
      cancelActiveOrder(staffCancelReason, false, "admin");
    } else {
      setMockOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderToCancel.orderId ? { ...o, status: "cancelled" as any } : o
        )
      );

      addNotification({
        title: `Order #${orderToCancel.orderId} Cancelled by Barista`,
        message: `Notice to ${orderToCancel.customerName}: Your order #${orderToCancel.orderId} was cancelled. Reason: "${staffCancelReason}". Full refund of $${orderToCancel.total.toFixed(2)} AUD processed.`,
        type: "order_cancelled",
        recipient: "customer",
        orderId: orderToCancel.orderId,
        cancelledBy: "admin",
        reason: staffCancelReason,
        refundAmount: orderToCancel.total,
        customerName: orderToCancel.customerName,
      });

      toast.error(`Order #${orderToCancel.orderId} Cancelled`, {
        description: `Customer ${orderToCancel.customerName} notified. Reason: ${staffCancelReason}.`,
      });
    }

    setIsStaffCancelModalOpen(false);
    setOrderToCancel(null);
  };

  const handleClearAllData = (mode: "reset-defaults" | "wipe-all") => {
    if (mode === "wipe-all") {
      setMockOrders([]);
      clearActiveOrder();
      clearCart();
    } else {
      setMockOrders([
        {
          orderId: "8492",
          createdAt: "10:14 AM",
          items: [
            {
              cartItemId: "mock-1",
              itemId: "flat-white",
              name: "Melbourne Flat White",
              basePrice: 4.8,
              unitPrice: 5.4,
              quantity: 2,
              category: "coffee",
              options: { milk: "Oat Milk", temperature: "Hot", extraShots: 1 },
            },
          ],
          diningType: "dine-in",
          tableNumber: "06",
          pickupTime: "Table #06",
          customerName: "Liam Thompson",
          customerPhone: "(03) 9876 1122",
          subtotal: 10.8,
          discount: 0,
          tip: 2.0,
          total: 12.8,
          status: "received",
          estimatedMinutes: 6,
        },
      ]);
      clearActiveOrder();
      clearCart();
    }

    resetAllAppData();

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("bloom_floor_plan");
        localStorage.removeItem("bloom_inventory");
        localStorage.removeItem("bloom_staff_roster");
        localStorage.removeItem("bloom_duty_checklist");
      } catch {}
    }

    setIsClearDataModalOpen(false);
    toast.success(
      mode === "wipe-all"
        ? "🧹 Complete Database Purge: All orders, tickets & records wiped!"
        : "✨ All Café Data Restored to Clean Demo Defaults!"
    );
  };

  // Mock past orders list merged with active order for full KDS demo
  const [mockOrders, setMockOrders] = useState<ActiveOrder[]>([
    {
      orderId: "8492",
      createdAt: "10:14 AM",
      items: [
        {
          cartItemId: "mock-1",
          itemId: "flat-white",
          name: "Melbourne Flat White",
          basePrice: 4.8,
          unitPrice: 5.4,
          quantity: 2,
          category: "coffee",
          options: { milk: "Oat Milk", temperature: "Hot", extraShots: 1 },
        },
        {
          cartItemId: "mock-2",
          itemId: "almond-croissant",
          name: "Twice-Baked Almond Croissant",
          basePrice: 4.9,
          unitPrice: 4.9,
          quantity: 1,
          category: "bakery",
          options: {},
        },
      ],
      diningType: "dine-in",
      tableNumber: "06",
      pickupTime: "Table #06",
      customerName: "Liam Thompson",
      customerPhone: "(03) 9876 1122",
      subtotal: 15.7,
      discount: 0,
      tip: 2.3,
      total: 18.0,
      status: "brewing",
      estimatedMinutes: 8,
      notes: "Extra hot flat white please",
    },
    {
      orderId: "8491",
      createdAt: "10:05 AM",
      items: [
        {
          cartItemId: "mock-3",
          itemId: "iced-matcha",
          name: "Iced Ceremonial Matcha Latte",
          basePrice: 5.8,
          unitPrice: 5.8,
          quantity: 1,
          category: "coffee",
          options: { temperature: "Iced" },
        },
        {
          cartItemId: "mock-4",
          itemId: "berry-pancakes-menu",
          name: "Berry Pancakes Stack",
          basePrice: 8.9,
          unitPrice: 8.9,
          quantity: 1,
          category: "brunch",
          options: {},
        },
      ],
      diningType: "pickup",
      pickupTime: "Counter Pickup",
      customerName: "Hannah Wright",
      customerPhone: "(03) 9123 7788",
      subtotal: 14.7,
      discount: 1.47,
      tip: 2.0,
      total: 15.23,
      status: "ready",
      estimatedMinutes: 5,
    },
  ]);

  // Merge activeOrder from context into display queue (excluding completed and cancelled)
  const allOrders = activeOrder
    ? [activeOrder, ...mockOrders.filter((o) => o.orderId !== activeOrder.orderId)]
    : mockOrders;
  const displayOrders = allOrders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === "1234" || pin === "admin" || pin === "") {
      setIsAuthenticated(true);
      sessionStorage.setItem("bloom_admin_auth", "true");
      toast.success("Welcome back, Barista Lead!");
    } else {
      toast.error("Incorrect PIN. Default demo PIN is 1234");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("bloom_admin_auth");
    toast.info("Logged out of Admin Portal");
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: "received" | "brewing" | "ready" | "completed" | "cancelled"
  ) => {
    setMockOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    if (soundEnabled) playChime();
    toast.success(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);
  };

  const handlePOSOrderPlaced = (newOrder: ActiveOrder) => {
    setMockOrders((prev) => [newOrder, ...prev]);
    if (soundEnabled) playChime();
  };

  const handlePreviewReceipt = (order: ActiveOrder) => {
    setSelectedReceiptOrder(order);
    setIsReceiptModalOpen(true);
  };

  // Walk-in modal state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInGuests, setWalkInGuests] = useState("2");
  const [walkInSeating, setWalkInSeating] = useState("Indoor Cozy Arch");

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName) return;
    addReservation({
      name: walkInName,
      phone: walkInPhone || "(Walk-in)",
      guests: walkInGuests,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seating: walkInSeating,
      specialRequest: "Walk-in Guest",
    });
    setWalkInName("");
    setWalkInPhone("");
    setIsWalkInModalOpen(false);
    toast.success("Walk-in table seated!");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center bg-[#FAF6EE] px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#E8DFD3] bg-white p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2C3E2E] text-[#FAF6EE] shadow-md">
            <Lock className="h-6 w-6 text-[#D07A60]" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-[#2C3E2E]">
              Bloom Staff & Barista Portal
            </h1>
            <p className="text-xs text-[#6D6964] mt-1">
              Enter 4-digit barista PIN or click Quick Login to access POS Register, KDS, Floor Plan, Inventory & Daily Z-Reports.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              placeholder="Enter PIN (e.g. 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono rounded-2xl border border-[#E8DFD3] py-3 text-[#2C3E2E] focus:outline-none focus:border-[#2C3E2E]"
            />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white py-3 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Unlock Dashboard
              </Button>
              <button
                type="button"
                onClick={() => {
                  setPin("1234");
                  setIsAuthenticated(true);
                  sessionStorage.setItem("bloom_admin_auth", "true");
                  toast.success("Quick Login as Manager Lead");
                }}
                className="text-xs text-[#D07A60] hover:underline font-semibold"
              >
                Demo 1-Click Quick Login
              </button>
            </div>
          </form>

          {/* Magic Link Box */}
          <div className="rounded-2xl border border-[#E8DFD3] bg-[#FAF6EE] p-3.5 text-left space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C3E2E] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#D07A60]" /> Direct Instant Login Link:
            </span>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value="http://localhost:8080/admin?auth=true"
                className="w-full rounded-xl bg-white border border-[#E8DFD3] px-2.5 py-1.5 text-[11px] font-mono text-[#4A4642] select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText("http://localhost:8080/admin?auth=true");
                    toast.success("Direct Login link copied to clipboard! 📋");
                  }
                }}
                className="rounded-xl bg-[#2C3E2E] hover:bg-[#1E2B20] text-white px-3 py-1.5 text-[11px] font-bold shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pb-24">
      {/* Top Admin Header */}
      <div className="bg-[#2C3E2E] text-white px-4 py-3.5 sm:px-8 border-b border-white/10 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#D07A60]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg font-bold tracking-wider">
                  BLOOM CAFÉ CONSOLE
                </h1>
                <span className="rounded-full bg-[#7D9987] px-2 py-0.5 text-[10px] font-bold text-[#FAF6EE]">
                  Manager & POS
                </span>
              </div>
              <p className="text-[11px] text-[#E4ECE6]/70">
                Melbourne Flagship • Status: {storeSettings.isOpen ? "🟢 Live / Open" : "🔴 Closed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Notifications Bell with Badge */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="View live notifications & cancellation alerts"
            >
              <Bell className="h-4 w-4" />
              {unreadAdminCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D07A60] px-1 text-[9px] font-bold text-white shadow-xs animate-pulse">
                  {unreadAdminCount}
                </span>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(`Audio Chime ${!soundEnabled ? "Enabled 🔔" : "Muted 🔕"}`);
              }}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 transition-colors"
              title="Toggle order sound alerts"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-gray-400" />}
              <span className="text-[11px] hidden sm:inline">{soundEnabled ? "Audio On" : "Muted"}</span>
            </button>

            {/* Clear / Reset Data Action Button */}
            <Button
              onClick={() => setIsClearDataModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-full border-rose-400/50 bg-rose-500/20 text-rose-100 hover:bg-rose-600 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Clear or reset all café records and orders"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Data</span>
            </Button>

            <Link
              to="/"
              className="text-xs text-[#E4ECE6] hover:text-white underline font-medium"
            >
              ← Back to Website
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 text-black hover:bg-white/10 text-xs"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Metrics Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Today's Revenue</span>
              <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">$1,842.50</div>
              <span className="text-[10px] text-emerald-600 font-semibold">+18% vs yesterday</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Active Tickets</span>
              <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">
                {displayOrders.length} {displayOrders.length === 1 ? "Order" : "Orders"}
              </div>
              <span className="text-[10px] text-[#6D6964]">Avg prep: 6.2 mins</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-[#D07A60]">
              <Coffee className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Seated Tables</span>
              <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">5 / 12 Tables</div>
              <span className="text-[10px] text-emerald-600 font-semibold">7 Available now</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Kitchen Queue</span>
              <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">~{storeSettings.waitTime}</div>
              <span className="text-[10px] text-[#6D6964]">Closes at {storeSettings.closingTime}</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8DFD3] no-scrollbar">
          {[
            { id: "pos", label: "⚡ Fast Barista POS" },
            { id: "kds", label: "☕ Barista KDS", count: displayOrders.length },
            { id: "floor", label: "🗺️ Floor Plan & Tables" },
            { id: "reservations", label: "📅 Reservations", count: reservations.length },
            { id: "inventory", label: "📦 Stock & 86'd Menu", count: soldOutItemIds.length > 0 ? `${soldOutItemIds.length} 86'd` : undefined },
            { id: "analytics", label: "📊 Sales & Z-Report" },
            { id: "settings", label: "⚙️ Store Controls" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#2C3E2E] text-[#FAF6EE] shadow-md"
                  : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#FAF6EE] hover:text-[#2C3E2E]"
              }`}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    activeTab === t.id ? "bg-[#D07A60] text-white" : "bg-[#E8DFD3] text-[#2C3E2E]"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Fast Barista POS (Point of Sale) */}
        {activeTab === "pos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
                  In-Store Point of Sale (POS Register)
                </h2>
                <p className="text-xs text-[#6D6964]">
                  Tap items to bill walk-in orders, customize espresso shots and milks, tender payments, and print thermal receipts.
                </p>
              </div>
            </div>

            <AdminPOS
              onOrderPlaced={handlePOSOrderPlaced}
              onPreviewReceipt={handlePreviewReceipt}
            />
          </div>
        )}

        {/* TAB 2: Barista KDS (Kitchen Display System) */}
        {activeTab === "kds" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
                  Live Kitchen Display System (KDS)
                </h2>
                <p className="text-xs text-[#6D6964]">
                  Real-time ticket feed for baristas and kitchen crew. Updates instantly when orders are placed.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const testOrder: ActiveOrder = {
                      orderId: `${Math.floor(1000 + Math.random() * 9000)}`,
                      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      items: [
                        {
                          cartItemId: `tst-${Date.now()}`,
                          itemId: "flat-white",
                          name: "Melbourne Flat White",
                          basePrice: 4.8,
                          unitPrice: 5.4,
                          quantity: 1,
                          category: "coffee",
                          options: { milk: "Oat Milk", extraShots: 1 },
                        },
                      ],
                      diningType: "dine-in",
                      tableNumber: "03",
                      pickupTime: "Table #03",
                      customerName: "Alex Morgan",
                      customerPhone: "(03) 9555 1234",
                      subtotal: 5.4,
                      discount: 0,
                      tip: 1.0,
                      total: 6.4,
                      status: "received",
                      estimatedMinutes: 6,
                    };
                    handlePOSOrderPlaced(testOrder);
                    toast.success("Simulated incoming online ticket!");
                  }}
                  variant="outline"
                  className="rounded-full border-[#E8DFD3] text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#FAF6EE]"
                >
                  <Plus className="h-3.5 w-3.5 text-[#2C3E2E]" />
                  <span className="font-semibold text-[#2C3E2E]">Simulate Ticket</span>
                </Button>
              </div>
            </div>

            {displayOrders.length === 0 ? (
              <div className="rounded-3xl border border-[#E8DFD3] bg-white p-12 text-center space-y-3 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 mx-auto">
                  <Coffee className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#2C3E2E]">
                  Kitchen Queue All Clear!
                </h3>
                <p className="text-xs text-[#6D6964] max-w-sm mx-auto">
                  All active orders are prepped and served. New customer orders from the online menu or POS register will pop up here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayOrders.map((order) => {
                const isReady = order.status === "ready";
                const isBrewing = order.status === "brewing";

                return (
                  <div
                    key={order.orderId}
                    className={`flex flex-col justify-between rounded-3xl border p-5 shadow-xs transition-all ${
                      isReady
                        ? "border-emerald-300 bg-emerald-50/40"
                        : isBrewing
                        ? "border-[#D07A60]/50 bg-white shadow-sm"
                        : "border-[#E8DFD3] bg-white"
                    }`}
                  >
                    <div>
                      {/* Ticket Top Ribbon */}
                      <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3 mb-3">
                        <div>
                          <span className="font-mono text-lg font-extrabold text-[#2C3E2E]">
                            #{order.orderId}
                          </span>
                          <span className="text-[11px] text-[#6D6964] block">
                            Ordered at {order.createdAt}
                          </span>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              order.diningType === "dine-in"
                                ? "bg-[#2C3E2E] text-white"
                                : "bg-[#D07A60] text-white"
                            }`}
                          >
                            {order.diningType === "dine-in"
                              ? `Table #${order.tableNumber || "01"}`
                              : "Takeaway"}
                          </span>
                          <span className="text-[10px] text-[#9E9B95] block mt-0.5 font-medium">
                            {order.diningType === "dine-in"
                              ? "Dine-In Service"
                              : order.pickupTime || "Counter Pickup"}
                          </span>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="text-xs text-[#4A4642] mb-3">
                        <span className="font-bold text-[#2C3E2E]">{order.customerName}</span>
                        {order.customerPhone && (
                          <span className="text-[#6D6964]"> • {order.customerPhone}</span>
                        )}
                        {order.notes && (
                          <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900 font-medium">
                            📝 Special: "{order.notes}"
                          </div>
                        )}
                      </div>

                      {/* Items ticket */}
                      <div className="space-y-2 border-t border-[#F0EAE0] pt-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between font-bold text-[#2C3E2E]">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-sans font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                            </div>
                            {/* Options */}
                            <div className="text-[11px] text-[#6D6964] pl-3 space-y-0.5 mt-0.5">
                              {item.options.milk && item.options.milk !== "Full Cream" && (
                                <div>• <strong>Milk:</strong> {item.options.milk}</div>
                              )}
                              {item.options.temperature && item.options.temperature !== "Hot" && (
                                <div>• <strong>Temp:</strong> {item.options.temperature}</div>
                              )}
                              {item.options.extraShots && item.options.extraShots > 0 && (
                                <div className="text-[#D07A60] font-bold">• +{item.options.extraShots} Extra Shot</div>
                              )}
                              {item.options.syrups && item.options.syrups.length > 0 && (
                                <div>• <strong>Syrup:</strong> {item.options.syrups.join(", ")}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 border-t border-[#F0EAE0] pt-3 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#2C3E2E]">
                          Total: <span className="font-sans font-extrabold text-[#D07A60]">${order.total.toFixed(2)}</span>
                        </span>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handlePreviewReceipt(order)}
                            className="text-[#6D6964] hover:text-[#2C3E2E] flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                            title="Print thermal receipt"
                          >
                            <Printer className="h-3.5 w-3.5 text-[#2C3E2E]" />
                            <span className="text-[10px]">Receipt</span>
                          </button>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                              isReady
                                ? "bg-emerald-100 text-emerald-800"
                                : isBrewing
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            ● {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        {order.status === "received" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.orderId, "brewing")}
                            className="w-full rounded-full bg-[#D07A60] hover:bg-[#B86850] text-white text-xs font-bold cursor-pointer"
                          >
                            Start Brewing
                          </Button>
                        )}

                        {order.status === "brewing" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.orderId, "ready")}
                            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Mark Ready
                          </Button>
                        )}

                        {order.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.orderId, "completed")}
                            className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold cursor-pointer"
                          >
                            Complete & Clear
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenCancelModal(order)}
                          className="rounded-full border-[#E8DFD3] text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          Cancel Order
                        </Button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

        {/* TAB 3: Visual Floor Plan & Table Management */}
        {activeTab === "floor" && <AdminFloorPlan />}

        {/* TAB 4: Table Reservations Manager */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
                  Table Reservations & Seating
                </h2>
                <p className="text-xs text-[#6D6964]">
                  Manage guest bookings, seat tables, and record walk-ins.
                </p>
              </div>

              <Button
                onClick={() => setIsWalkInModalOpen(true)}
                className="rounded-full bg-[#2C3E2E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Seat Walk-In</span>
              </Button>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto rounded-3xl border border-[#E8DFD3] bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#4A4642] border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFD3] bg-[#F5EFE4] text-[#2C3E2E] font-bold">
                    <th className="py-4 px-5">Guest Name</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-3 text-center">Party Size</th>
                    <th className="py-4 px-4">Date & Time</th>
                    <th className="py-4 px-4">Seating Area</th>
                    <th className="py-4 px-3 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE0]">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF6EE] transition-colors">
                      <td className="py-3.5 px-5 font-display text-sm font-bold text-[#2C3E2E]">
                        {r.name}
                        {r.specialRequest && (
                          <span className="block text-[11px] font-normal text-[#A67C52] italic">
                            "{r.specialRequest}"
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {r.phone}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold">
                        {r.guests} Guests
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#2C3E2E]">{r.time}</span>
                        <span className="block text-[10px] text-[#9E9B95]">{r.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {r.seating}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            r.status === "seated"
                              ? "bg-blue-100 text-blue-800"
                              : r.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "cancelled"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-1.5">
                        {r.status === "confirmed" && (
                          <button
                            onClick={() => updateReservationStatus(r.id, "seated")}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-[11px] font-bold cursor-pointer"
                          >
                            Seat Table
                          </button>
                        )}
                        {r.status === "seated" && (
                          <button
                            onClick={() => updateReservationStatus(r.id, "completed")}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-[11px] font-bold cursor-pointer"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => cancelReservation(r.id)}
                          className="rounded-full border border-[#E8DFD3] text-rose-600 hover:bg-rose-50 px-2.5 py-1 text-[11px] font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Unified Stock & 86'd Menu Hub */}
        {activeTab === "inventory" && <AdminInventory />}

        {/* TAB 6: Sales Analytics & Daily Z-Report */}
        {activeTab === "analytics" && <AdminAnalytics />}

        {/* TAB 7: Store Live Settings & Data Reset */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
                Live Store Controls & Broadcast
              </h2>
              <p className="text-xs text-[#6D6964]">
                Update opening status, kitchen queue wait estimates, and customer announcement ribbons in real time.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              {/* Open/Closed switch */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE0]">
                <div>
                  <h4 className="font-display text-base font-bold text-[#2C3E2E]">Store Open / Closed</h4>
                  <p className="text-xs text-[#6D6964]">Controls the live indicator badge in the website header.</p>
                </div>
                <button
                  onClick={() => updateStoreSettings({ isOpen: !storeSettings.isOpen })}
                  className={`rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    storeSettings.isOpen
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-rose-600 text-white shadow-xs"
                  }`}
                >
                  {storeSettings.isOpen ? "🟢 OPEN NOW" : "🔴 CLOSED"}
                </button>
              </div>

              {/* Wait Time Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6D6964]">
                  Kitchen Queue Wait Time Estimate:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["3-5 mins", "5-8 mins", "10-15 mins", "20+ mins"].map((wt) => (
                    <button
                      key={wt}
                      onClick={() => updateStoreSettings({ waitTime: wt })}
                      className={`rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
                        storeSettings.waitTime === wt
                          ? "bg-[#2C3E2E] text-white shadow-xs"
                          : "bg-[#F5EFE4] text-[#6D6964] hover:bg-[#E8DFD3]"
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closing Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6D6964]">
                  Today's Closing Time:
                </label>
                <input
                  type="text"
                  value={storeSettings.closingTime}
                  onChange={(e) => updateStoreSettings({ closingTime: e.target.value })}
                  className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-3 py-2 text-xs font-bold text-[#2C3E2E]"
                />
              </div>

              {/* Announcement Banner */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6D6964]">
                  Store Announcement Ribbon:
                </label>
                <textarea
                  value={storeSettings.announcement}
                  onChange={(e) => updateStoreSettings({ announcement: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] p-3 text-xs text-[#2C3E2E]"
                />
              </div>

              {/* Data Management & Database Reset Section */}
              <div className="pt-4 border-t border-[#F0EAE0] space-y-3">
                <div>
                  <h4 className="font-display text-sm font-bold text-[#2C3E2E] flex items-center gap-1.5">
                    <RotateCcw className="h-4 w-4 text-rose-600" />
                    <span>Database & Demo Records Management</span>
                  </h4>
                  <p className="text-xs text-[#6D6964]">
                    Clear active orders, shopping carts, table reservations, and restore default stock counts.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Button
                    onClick={() => handleClearAllData("reset-defaults")}
                    variant="outline"
                    className="rounded-full border-[#E8DFD3] hover:bg-[#FAF6EE] text-xs font-bold text-[#2C3E2E] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#D07A60]" />
                    <span>Reset Demo Defaults</span>
                  </Button>

                  <Button
                    onClick={() => handleClearAllData("wipe-all")}
                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Wipe All Tickets & Orders</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Seat Walk-In Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#FAF6EE] p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-display text-xl font-bold text-[#2C3E2E]">Seat Walk-In Guest</h3>
            
            <form onSubmit={handleAddWalkIn} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#6D6964]">Guest Name *</label>
                <Input
                  required
                  placeholder="e.g. Alex"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6D6964]">Phone (Optional)</label>
                <Input
                  placeholder="(03) 9000 0000"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#6D6964]">Party Size</label>
                  <select
                    value={walkInGuests}
                    onChange={(e) => setWalkInGuests(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white p-2 text-xs"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6+ Guests</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#6D6964]">Seating Area</label>
                  <select
                    value={walkInSeating}
                    onChange={(e) => setWalkInSeating(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white p-2 text-xs"
                  >
                    <option value="Indoor Cozy Arch">Indoor Arch</option>
                    <option value="Sunlit Window Table">Window Table</option>
                    <option value="Botanical Garden Bar">Garden Bar</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 rounded-full bg-[#2C3E2E] text-white text-xs font-bold"
                >
                  Seat Table Now
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  variant="outline"
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Thermal Receipt Modal */}
      <ReceiptModal
        order={selectedReceiptOrder}
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceiptOrder(null);
        }}
      />

      {/* Admin Notification Drawer */}
      <AdminNotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      {/* Staff Order Cancellation & Customer Notification Modal */}
      {isStaffCancelModalOpen && orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#2C3E2E]">
                  Cancel Order #{orderToCancel.orderId}?
                </h3>
                <p className="text-xs text-[#6D6964]">
                  Customer: <strong>{orderToCancel.customerName}</strong> • Total: ${orderToCancel.total.toFixed(2)} AUD
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#4A4642] leading-relaxed">
                Cancelling this ticket will automatically send a real-time cancellation notice and refund receipt to the customer.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E2E]">
                  Select cancellation reason:
                </label>
                <select
                  value={staffCancelReason}
                  onChange={(e) => setStaffCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] p-2.5 text-xs text-[#2C3E2E]"
                >
                  <option value="Ingredient out of stock (86'd)">Ingredient out of stock (86'd)</option>
                  <option value="Kitchen prep volume overloaded">Kitchen prep volume overloaded</option>
                  <option value="Customer requested cancellation via phone">Customer requested cancellation via phone</option>
                  <option value="Espresso machine calibration / maintenance">Espresso machine calibration / maintenance</option>
                  <option value="Store closing early">Store closing early</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleConfirmStaffCancel}
                className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 cursor-pointer"
              >
                Confirm Cancel & Notify Customer
              </Button>
              <Button
                onClick={() => {
                  setIsStaffCancelModalOpen(false);
                  setOrderToCancel(null);
                }}
                variant="outline"
                className="rounded-full border-[#E8DFD3] text-xs font-semibold"
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#2C3E2E]">
                  Clear & Reset Café Data?
                </h3>
                <p className="text-xs text-[#6D6964]">
                  Choose how you'd like to clear or reset the application data.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF6EE] border border-[#E8DFD3] p-4 text-xs text-[#4A4642] space-y-2 leading-relaxed">
              <p><strong>This action allows you to:</strong></p>
              <ul className="list-disc pl-4 space-y-1 text-[#6D6964]">
                <li>Clear shopping cart & active customer orders</li>
                <li>Reset the Kitchen Display (KDS) queue</li>
                <li>Reset table bookings & walk-in seating</li>
                <li>Restore inventory stock levels & floor statuses</li>
                <li>Clear sold-out (86'd) item flags</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => handleClearAllData("reset-defaults")}
                className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold flex items-center justify-center gap-2 py-2.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-[#D07A60]" />
                <span>Reset to Clean Demo Records (Recommended)</span>
              </Button>

              <Button
                onClick={() => handleClearAllData("wipe-all")}
                className="w-full rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 py-2.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Wipe Everything Completely Clean</span>
              </Button>

              <Button
                onClick={() => setIsClearDataModalOpen(false)}
                variant="outline"
                className="w-full rounded-full border-[#E8DFD3] text-xs font-semibold py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
