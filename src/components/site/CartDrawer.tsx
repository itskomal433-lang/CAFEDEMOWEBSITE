import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Coffee,
  Tag,
  AlertCircle,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { WhatsAppIcon } from "./FloatingWhatsApp";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    tipPercentage,
    setTipPercentage,
    diningType,
    setDiningType,
    tableNumber,
    setTableNumber,
    pickupTime,
    setPickupTime,
    orderNotes,
    setOrderNotes,
    tax,
    tipAmount,
    total,
    placeOrder,
  } = useCart();

  const { loyaltyPoints } = useApp();

  const [promoInput, setPromoInput] = useState("");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "applepay" | "counter">("applepay");
  const [isPlacing, setIsPlacing] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoInput("");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number for the order.");
      return;
    }

    if (diningType === "dine-in" && !tableNumber) {
      toast.error("Please enter your Table Number for Dine-In.");
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      setIsPlacing(false);
      setIsCheckoutModalOpen(false);
      placeOrder({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        notes: orderNotes,
      });
    }, 700);
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-[#FAF6EE] p-0 flex flex-col justify-between border-l border-[#E8DFD3]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD3] bg-[#FAF6EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2C3E2E] text-white">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="font-display text-xl font-bold text-[#2C3E2E]">
                    Your Bloom Order
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#6D6964]">
                    {itemCount} {itemCount === 1 ? "item" : "items"} selected
                  </SheetDescription>
                </div>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#D07A60] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Dining Type Selector */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 bg-[#F3EDE2] p-1 rounded-2xl border border-[#E8DFD3]">
              <button
                type="button"
                onClick={() => setDiningType("pickup")}
                className={`rounded-xl py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                  diningType === "pickup"
                    ? "bg-[#2C3E2E] text-white shadow-xs"
                    : "text-[#6D6964] hover:text-[#2C3E2E]"
                }`}
              >
                Takeaway / Pickup
              </button>
              <button
                type="button"
                onClick={() => setDiningType("dine-in")}
                className={`rounded-xl py-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                  diningType === "dine-in"
                    ? "bg-[#2C3E2E] text-white shadow-xs"
                    : "text-[#6D6964] hover:text-[#2C3E2E]"
                }`}
              >
                Dine-In Table
              </button>
            </div>

            {diningType === "dine-in" && (
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white p-2.5 border border-[#E8DFD3] text-xs">
                <span className="font-semibold text-[#2C3E2E]">Enter Table Number:</span>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-16 text-center font-bold text-[#2C3E2E] border-b-2 border-[#2C3E2E] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E4ECE6] text-[#2C3E2E]">
                  <Coffee className="h-8 w-8 text-[#2C3E2E]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#2C3E2E]">Your order is empty</h3>
                <p className="text-xs text-[#6D6964] max-w-xs">
                  Discover our freshly roasted specialty coffees, all-day brunch, and artisan cakes.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-[#2C3E2E] text-[#FAF6EE] text-xs mt-2"
                >
                  Explore Menu
                </Button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[#E8DFD3] bg-white p-3.5 shadow-xs"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-bold text-[#2C3E2E] truncate">
                        {item.name}
                      </h4>
                      <span className="font-semibold text-xs text-[#D07A60] block">
                        ${item.unitPrice.toFixed(2)}
                      </span>

                      {/* Customization pills */}
                      <div className="mt-1 space-y-0.5 text-[11px] text-[#6D6964]">
                        {item.options.milk && item.options.milk !== "Full Cream" && (
                          <div>• {item.options.milk}</div>
                        )}
                        {item.options.temperature && item.options.temperature !== "Hot" && (
                          <div>• {item.options.temperature}</div>
                        )}
                        {item.options.extraShots && item.options.extraShots > 0 && (
                          <div>• +{item.options.extraShots} Extra Shot(s)</div>
                        )}
                        {item.options.syrups && item.options.syrups.length > 0 && (
                          <div>• {item.options.syrups.join(", ")}</div>
                        )}
                        {item.options.foodOptions && item.options.foodOptions.length > 0 && (
                          <div>• {item.options.foodOptions.join(", ")}</div>
                        )}
                        {item.options.specialInstructions && (
                          <div className="italic text-[#A67C52]">"{item.options.specialInstructions}"</div>
                        )}
                      </div>
                    </div>

                    {/* Quantity and Delete */}
                    <div className="flex flex-col items-end justify-between h-full space-y-2">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#9E9B95] hover:text-[#D07A60] transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center gap-2 bg-[#FAF6EE] rounded-full border border-[#E8DFD3] px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="text-[#2C3E2E] text-xs font-bold"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-[#2C3E2E]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="text-[#2C3E2E] text-xs font-bold"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Entry */}
                <div className="pt-2">
                  {promoCode ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#E4ECE6] border border-[#2C3E2E]/20 p-2.5 text-xs text-[#2C3E2E]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Tag className="h-3.5 w-3.5 text-[#D07A60]" />
                        <span>Code: {promoCode}</span>
                        <span className="text-[#D07A60]">(-${discountAmount.toFixed(2)})</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-xs text-[#6D6964] hover:text-[#D07A60] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. BLOOM10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 rounded-xl border border-[#E8DFD3] bg-white px-3 py-2 text-xs text-[#2C3E2E] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-[#2C3E2E] text-white px-4 py-2 text-xs font-bold hover:bg-[#1E2B20]"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Barista & Dietary Instruction notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D6964] uppercase tracking-wider">
                    Barista / Kitchen Notes (Optional):
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra hot, oat milk in ceramic cup, no seeds"
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3 py-2 text-xs text-[#2C3E2E] focus:outline-none"
                  />
                </div>

                {/* Dietary Reminder */}
                <div className="rounded-xl bg-[#F5EFE4] p-2.5 text-[10px] text-[#6D6964] flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#D07A60] shrink-0" />
                  <span>Have a dietary requirement or allergy? Add a note above or notify our barista.</span>
                </div>
              </>
            )}
          </div>

          {/* Footer with Totals and Checkout Button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8DFD3] bg-[#FAF6EE] space-y-3">
              {/* Pickup Time (if pickup) */}
              {diningType === "pickup" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#6D6964] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#D07A60]" /> Ready Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3 py-1.5 text-xs text-[#253328] focus:outline-none"
                  >
                    <option>As soon as possible (~15 mins)</option>
                    <option>In 30 minutes</option>
                    <option>In 45 minutes</option>
                    <option>In 1 hour</option>
                  </select>
                </div>
              )}

              {/* Tip Selector */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#6D6964] uppercase tracking-wider">
                  <span>Support Barista Team</span>
                  <span>{tipPercentage}% (${tipAmount.toFixed(2)})</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 20].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipPercentage(tip)}
                      className={`rounded-lg py-1 text-xs font-semibold transition-all ${
                        tipPercentage === tip
                          ? "bg-[#2C3E2E] text-white shadow-xs"
                          : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#F3EDE2]"
                      }`}
                    >
                      {tip === 0 ? "No Tip" : `${tip}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 border-t border-[#E8DFD3] pt-2 text-xs">
                <div className="flex justify-between text-[#6D6964]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D07A60] font-semibold">
                    <span>Discount ({promoCode})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6D6964]">
                  <span>GST (10% included)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6D6964]">
                  <span>Barista Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2C3E2E] pt-1 border-t border-[#E8DFD3]">
                  <span>Total</span>
                  <span>${total.toFixed(2)} AUD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-transform active:scale-98 cursor-pointer"
              >
                Proceed to Checkout (${total.toFixed(2)})
              </Button>

              <a
                href={`https://wa.me/61412345678?text=${encodeURIComponent(
                  `Hi Bloom Café! ☕ I'm looking at ordering ${cart
                    .map((i) => `${i.quantity}x ${i.name}`)
                    .join(", ")} (Total: $${total.toFixed(2)} AUD).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#E8F8EE] py-2 text-[11px] font-semibold text-[#25D366] transition-colors"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366]" />
                <span>Or ask questions via WhatsApp</span>
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Dialog Modal */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-[2rem] border-border bg-[#FAF6EE] p-0 shadow-2xl">
          <div className="bg-[#2C3E2E] px-6 py-5 text-white text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[11px] text-[#E4ECE6] mb-1">
              <Sparkles className="h-3 w-3 text-[#D07A60]" />
              Bloom Instant Checkout
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-white">
              Complete Your Order
            </DialogTitle>
            <DialogDescription className="text-xs text-[#E4ECE6]/80 mt-0.5">
              {diningType === "pickup"
                ? `Takeaway Pickup: ${pickupTime}`
                : `Dine-In Table #${tableNumber}`}
            </DialogDescription>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-[#6D6964]">Your Name *</Label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-xl border-[#E8DFD3] bg-white mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-[#6D6964]">Mobile Number (for pickup SMS) *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="(03) 9123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-xl border-[#E8DFD3] bg-white mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-[#6D6964]">Email (Optional for digital receipt)</Label>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="rounded-xl border-[#E8DFD3] bg-white mt-1"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-[#6D6964] uppercase tracking-wider">
                Payment Method
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("applepay")}
                  className={`rounded-xl p-2.5 text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === "applepay"
                      ? "border-[#2C3E2E] bg-[#E4ECE6]/60 text-[#2C3E2E]"
                      : "border-[#E8DFD3] bg-white text-[#6D6964]"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-[#D07A60]" />
                  <span>Apple / G-Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`rounded-xl p-2.5 text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#2C3E2E] bg-[#E4ECE6]/60 text-[#2C3E2E]"
                      : "border-[#E8DFD3] bg-white text-[#6D6964]"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-[#2C3E2E]" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("counter")}
                  className={`rounded-xl p-2.5 text-xs font-semibold border flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === "counter"
                      ? "border-[#2C3E2E] bg-[#E4ECE6]/60 text-[#2C3E2E]"
                      : "border-[#E8DFD3] bg-white text-[#6D6964]"
                  }`}
                >
                  <Coffee className="h-4 w-4 text-[#2C3E2E]" />
                  <span>Pay at Counter</span>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="rounded-2xl bg-[#F5EFE4] p-3 border border-[#E8DFD3] flex items-center justify-between text-xs">
              <span className="font-bold text-[#2C3E2E]">Total to Pay:</span>
              <span className="font-display text-base font-bold text-[#2C3E2E]">
                ${total.toFixed(2)} AUD
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPlacing}
                className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-3 text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer"
              >
                {isPlacing ? "Authorizing Order..." : `Place Order • $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
