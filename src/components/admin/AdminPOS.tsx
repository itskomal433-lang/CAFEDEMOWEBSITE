import React, { useState } from "react";
import {
  Coffee,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Gift,
  CheckCircle2,
  Receipt,
  User,
  ShoppingBag,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { fullMenu, MenuItem } from "@/data/cafe";
import { ActiveOrder, CartItem, CustomizationOptions } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminPOSProps {
  onOrderPlaced: (newOrder: ActiveOrder) => void;
  onPreviewReceipt: (order: ActiveOrder) => void;
}

export function AdminPOS({ onOrderPlaced, onPreviewReceipt }: AdminPOSProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [ticketItems, setTicketItems] = useState<CartItem[]>([]);
  const [diningType, setDiningType] = useState<"dine-in" | "pickup">("dine-in");
  const [tableNumber, setTableNumber] = useState<string>("01");
  const [customerName, setCustomerName] = useState<string>("Walk-in Guest");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "digital" | "giftcard">("card");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Categories
  const categories = [
    { id: "all", label: "All Items" },
    { id: "coffee", label: "☕ Coffee" },
    { id: "tea", label: "🍵 Tea & Matcha" },
    { id: "bakery", label: "🥐 Bakery" },
    { id: "brunch", label: "🍳 Brunch" },
    { id: "desserts", label: "🍰 Desserts" },
  ];

  const filteredMenu =
    selectedCategory === "all"
      ? fullMenu
      : fullMenu.filter((item) => item.category === selectedCategory);

  // Add Item to POS Ticket
  const handleAddItem = (item: MenuItem) => {
    const numericPrice = parseFloat(item.price.replace("$", "")) || 5.0;
    
    setTicketItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.itemId === item.id && Object.keys(i.options).length === 0
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      const newItem: CartItem = {
        cartItemId: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        itemId: item.id,
        name: item.name,
        basePrice: numericPrice,
        unitPrice: numericPrice,
        quantity: 1,
        image: item.image,
        category: item.category,
        options: {},
      };
      return [...prev, newItem];
    });

    toast.success(`Added ${item.name} to ticket`, { duration: 1500 });
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setTicketItems((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleApplyModifier = (
    cartItemId: string,
    modifierKey: keyof CustomizationOptions,
    value: any,
    extraCost = 0
  ) => {
    setTicketItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const newOptions = { ...i.options, [modifierKey]: value };
          const newUnitPrice = i.basePrice + extraCost;
          return { ...i, options: newOptions, unitPrice: newUnitPrice };
        }
        return i;
      })
    );
  };

  // Calculations
  const subtotal = ticketItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);
  const cashGivenNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashGivenNum - total);

  // Submit Order to KDS
  const handleProcessOrder = () => {
    if (ticketItems.length === 0) {
      toast.error("Ticket is empty! Tap items from the menu to add.");
      return;
    }

    if (paymentMethod === "cash" && cashGivenNum < total) {
      toast.error(`Cash tendered ($${cashGivenNum.toFixed(2)}) is less than total ($${total.toFixed(2)})`);
      return;
    }

    const orderId = `${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newOrder: ActiveOrder = {
      orderId,
      createdAt: timeStr,
      items: [...ticketItems],
      diningType,
      tableNumber: diningType === "dine-in" ? tableNumber : undefined,
      pickupTime: diningType === "dine-in" ? `Table #${tableNumber}` : "Counter Pickup",
      customerName: customerName.trim() || "Walk-in Guest",
      customerPhone: customerPhone.trim() || "(In-Store)",
      subtotal,
      discount: discountAmount,
      tip: 0,
      total,
      notes: orderNotes.trim() || undefined,
      status: "received",
      estimatedMinutes: diningType === "dine-in" ? 10 : 6,
    };

    onOrderPlaced(newOrder);
    onPreviewReceipt(newOrder);

    // Reset Ticket
    setTicketItems([]);
    setDiscountPercent(0);
    setCashTendered("");
    setOrderNotes("");
    toast.success(`🎉 Order #${orderId} Charged & Sent to Barista KDS!`, {
      description: `Payment confirmed via ${paymentMethod.toUpperCase()}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Fast Item Catalog */}
      <div className="lg:col-span-7 space-y-4">
        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#2C3E2E] text-[#FAF6EE] shadow-sm"
                  : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#FAF6EE] hover:text-[#2C3E2E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[660px] overflow-y-auto no-scrollbar pr-0.5">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="group flex flex-col justify-between rounded-2xl border border-[#E8DFD3] bg-white p-3 text-left shadow-xs transition-all hover:border-[#2C3E2E] hover:shadow-md active:scale-98 cursor-pointer"
            >
              <div className="space-y-1.5">
                {item.image && (
                  <div className="h-20 w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h4 className="font-display text-xs font-bold text-[#2C3E2E] line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[10px] text-[#6D6964] line-clamp-1">
                  {item.description}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-mono text-xs font-bold text-[#D07A60]">
                  {item.price}
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF6EE] text-[#2C3E2E] group-hover:bg-[#2C3E2E] group-hover:text-white transition-colors">
                  <Plus className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Register Order Ticket & Checkout */}
      <div className="lg:col-span-5 rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header Ticket Type & Table */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDiningType("dine-in")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  diningType === "dine-in"
                    ? "bg-[#2C3E2E] text-white"
                    : "bg-[#FAF6EE] text-[#6D6964]"
                }`}
              >
                🍽️ Dine-In
              </button>
              <button
                type="button"
                onClick={() => setDiningType("pickup")}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  diningType === "pickup"
                    ? "bg-[#D07A60] text-white"
                    : "bg-[#FAF6EE] text-[#6D6964]"
                }`}
              >
                🥡 Takeaway
              </button>
            </div>

            {diningType === "dine-in" && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#6D6964]">Table:</span>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  aria-label="Select table number"
                  className="rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-2 py-1 text-xs font-bold text-[#2C3E2E]"
                >
                  {[...Array(12)].map((_, idx) => {
                    const num = String(idx + 1).padStart(2, "0");
                    return (
                      <option key={num} value={num}>
                        T-{num}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {/* Customer Name input */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Guest Name (e.g. Liam)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-8 text-xs bg-[#FAF6EE] border-[#E8DFD3]"
            />
            <Input
              placeholder="Phone (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="h-8 text-xs bg-[#FAF6EE] border-[#E8DFD3]"
            />
          </div>

          {/* Ticket Items List */}
          <div className="max-h-60 overflow-y-auto no-scrollbar space-y-2 divide-y divide-gray-100 pr-0.5">
            {ticketItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9E9B95]">
                <ShoppingBag className="h-8 w-8 mx-auto text-[#D07A60]/40 mb-2" />
                <span>Ticket is empty. Tap menu items to add.</span>
              </div>
            ) : (
              ticketItems.map((item) => (
                <div key={item.cartItemId} className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C3E2E]">
                    <span className="line-clamp-1">{item.name}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Quantity & Modifiers toolbar */}
                  <div className="flex items-center justify-between text-[11px] text-[#6D6964]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateQty(item.cartItemId, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.cartItemId, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Quick Modifier Badges for Coffee */}
                    {item.category === "coffee" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApplyModifier(item.cartItemId, "milk", "Oat Milk", 0.6)}
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold border ${
                            item.options.milk === "Oat Milk"
                              ? "bg-[#2C3E2E] text-white border-[#2C3E2E]"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          +Oat ($0.60)
                        </button>
                        <button
                          onClick={() => handleApplyModifier(item.cartItemId, "extraShots", 1, 0.8)}
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold border ${
                            item.options.extraShots
                              ? "bg-[#D07A60] text-white border-[#D07A60]"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          +Shot ($0.80)
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleUpdateQty(item.cartItemId, -item.quantity)}
                      className="text-rose-500 hover:text-rose-700"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Section: Discounts, Payments & Charge */}
        <div className="space-y-3 border-t border-gray-100 pt-3">
          {/* Quick Discount buttons */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#6D6964] flex items-center gap-1">
              <Percent className="h-3.5 w-3.5" /> Discount:
            </span>
            <div className="flex items-center gap-1">
              {[0, 10, 15, 20].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscountPercent(d)}
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                    discountPercent === d
                      ? "bg-[#2C3E2E] text-white"
                      : "bg-[#FAF6EE] text-[#6D6964] hover:bg-[#E8DFD3]"
                  }`}
                >
                  {d === 0 ? "None" : `${d}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "card", label: "Card", icon: CreditCard },
              { id: "cash", label: "Cash", icon: Banknote },
              { id: "digital", label: "Tap / Pay", icon: Smartphone },
              { id: "giftcard", label: "Voucher", icon: Gift },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
                    paymentMethod === p.id
                      ? "bg-[#2C3E2E] text-white shadow-xs"
                      : "bg-[#FAF6EE] text-[#6D6964] hover:bg-[#E8DFD3]"
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cash Tendered & Change Calculation */}
          {paymentMethod === "cash" && (
            <div className="rounded-2xl bg-[#FAF6EE] p-2.5 space-y-2 border border-[#E8DFD3]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2C3E2E]">Cash Received:</span>
                <Input
                  type="number"
                  placeholder="$0.00"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="h-7 w-24 text-right font-mono text-xs bg-white"
                />
              </div>
              {/* Quick Cash Presets */}
              <div className="flex justify-end gap-1">
                {[10, 20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashTendered(String(amt))}
                    className="rounded-md bg-white border border-[#E8DFD3] px-2 py-0.5 text-[10px] font-bold text-[#2C3E2E] hover:bg-[#2C3E2E] hover:text-white"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              {cashGivenNum > 0 && (
                <div className="flex justify-between text-xs font-bold text-emerald-700 pt-1 border-t border-[#E8DFD3]">
                  <span>Change Due:</span>
                  <span>${changeDue.toFixed(2)} AUD</span>
                </div>
              )}
            </div>
          )}

          {/* Totals & Charge Button */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-[#6D6964]">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({discountPercent}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-sans text-base font-extrabold text-[#2C3E2E] pt-1 border-t tracking-tight">
              <span>Total:</span>
              <span>${total.toFixed(2)} AUD</span>
            </div>
          </div>

          <Button
            onClick={handleProcessOrder}
            className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="h-4 w-4 text-[#D07A60]" />
            <span>Charge ${total.toFixed(2)} & Send to KDS</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
