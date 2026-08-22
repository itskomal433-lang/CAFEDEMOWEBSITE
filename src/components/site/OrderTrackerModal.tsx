import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Coffee,
  Sparkles,
  MapPin,
  Printer,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cafe } from "@/data/cafe";
import { toast } from "sonner";
import { WhatsAppIcon } from "./FloatingWhatsApp";

export function OrderTrackerModal() {
  const {
    activeOrder,
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    cancelActiveOrder,
    clearActiveOrder,
  } = useCart();

  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("Need to modify items or options");
  const [restoreItems, setRestoreItems] = useState(true);

  if (!activeOrder) return null;

  const steps = [
    {
      id: "received",
      title: "Order Placed",
      desc: "Sent directly to our barista station",
    },
    {
      id: "brewing",
      title: "Brewing & Preparing",
      desc: "Grinding beans, steaming milk & plating food",
    },
    {
      id: "ready",
      title: "Ready for Pickup!",
      desc: "Waiting for you at the front counter",
    },
  ];

  const getStepIndex = (status: typeof activeOrder.status) => {
    if (status === "received") return 0;
    if (status === "brewing") return 1;
    if (status === "ready" || status === "completed") return 2;
    return 0;
  };

  const currentIdx = getStepIndex(activeOrder.status);

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExecuteCancel = () => {
    cancelActiveOrder(cancelReason, restoreItems, "customer");
    setIsConfirmingCancel(false);
  };

  return (
    <Dialog open={isOrderTrackerOpen} onOpenChange={setIsOrderTrackerOpen}>
      <DialogContent className="max-w-lg rounded-[2rem] bg-[#FAF6EE] border-border p-0 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#2C3E2E] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E4ECE6] mb-3">
            <span className="h-2 w-2 rounded-full bg-[#D07A60] animate-ping" />
            Live Kitchen Tracking
          </div>
          <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-white">
            Order #{activeOrder.orderId}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#E4ECE6]/80 mt-1">
            {activeOrder.diningType === "pickup"
              ? `Takeaway for ${activeOrder.customerName}`
              : `Dine-In Table #${activeOrder.tableNumber}`}
          </DialogDescription>
        </div>

        {/* Tracker body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {isConfirmingCancel ? (
            /* Cancellation Confirmation Form */
            <div className="rounded-2xl border border-[#D07A60]/40 bg-white p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5 text-[#D07A60]">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-display text-base font-bold text-[#2C3E2E]">
                  Cancel Order #{activeOrder.orderId}?
                </h4>
              </div>

              <p className="text-xs text-[#6D6964] leading-relaxed">
                You can cancel this order and receive a full instant refund (${activeOrder.total.toFixed(2)} AUD).
              </p>

              {/* Cancellation Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2C3E2E]">Reason for cancellation:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-[#E8DFD3] bg-[#FAF6EE] px-3 py-2 text-xs text-[#2C3E2E] focus:outline-none"
                >
                  <option value="Need to modify items or options">Need to modify items or options</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Wait time too long">Wait time too long</option>
                  <option value="Change of plans">Change of plans</option>
                </select>
              </div>

              {/* Restore to cart checkbox */}
              <label className="flex items-center gap-2 text-xs text-[#2C3E2E] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={restoreItems}
                  onChange={(e) => setRestoreItems(e.target.checked)}
                  className="rounded border-[#C8BFB3] text-[#2C3E2E] focus:ring-[#2C3E2E]"
                />
                <span className="flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5 text-[#D07A60]" />
                  Put items back into my cart to edit & reorder
                </span>
              </label>

              {/* Confirmation Actions */}
              <div className="flex items-center gap-2.5 pt-2">
                <Button
                  type="button"
                  onClick={handleExecuteCancel}
                  className="flex-1 rounded-full bg-[#D07A60] hover:bg-[#B86850] text-white py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Cancellation
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsConfirmingCancel(false)}
                  variant="outline"
                  className="rounded-full border-[#E8DFD3] text-xs font-semibold py-2.5 cursor-pointer"
                >
                  Keep Order
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Visual Stepper */}
              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 ${
                            isDone
                              ? "bg-[#2C3E2E] text-white"
                              : isCurrent
                              ? "bg-[#D07A60] text-white shadow-md scale-110 animate-pulse"
                              : "border border-[#C8BFB3] bg-white text-[#9E9B95]"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isCurrent ? (
                            <Coffee className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        {idx < steps.length - 1 && (
                          <div
                            className={`h-8 w-0.5 my-1 transition-colors duration-500 ${
                              idx < currentIdx ? "bg-[#2C3E2E]" : "bg-[#E8DFD3]"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <h4
                          className={`font-display text-sm font-bold ${
                            isCurrent
                              ? "text-[#D07A60]"
                              : isDone
                              ? "text-[#2C3E2E]"
                              : "text-[#9E9B95]"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-[#6D6964]">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pickup / Table Details Card */}
              <div className="rounded-2xl border border-[#E8DFD3] bg-white p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-[#2C3E2E]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#D07A60]" /> Location:
                  </span>
                  <span>123 Café Street, Melbourne</span>
                </div>
                <div className="flex items-center justify-between text-[#6D6964]">
                  <span>Pickup / Dine-In Time:</span>
                  <span className="font-semibold text-[#2C3E2E]">{activeOrder.pickupTime}</span>
                </div>
                {activeOrder.notes && (
                  <div className="pt-1 border-t border-[#F0EAE0] text-[11px] text-[#A67C52]">
                    <span className="font-bold">Barista Note:</span> "{activeOrder.notes}"
                  </div>
                )}
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-display text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                    Ordered Items ({activeOrder.items.length})
                  </h5>
                  <button
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D07A60] hover:underline cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="divide-y divide-[#F0EAE0] text-xs">
                  {activeOrder.items.map((item) => (
                    <div key={item.cartItemId} className="py-2 flex justify-between">
                      <div>
                        <span className="font-semibold text-[#2C3E2E]">
                          {item.quantity}x {item.name}
                        </span>
                        {item.options.milk && item.options.milk !== "Full Cream" && (
                          <span className="text-[11px] text-[#6D6964] block">({item.options.milk})</span>
                        )}
                        {item.options.extraShots && item.options.extraShots > 0 && (
                          <span className="text-[11px] text-[#6D6964] block">+{item.options.extraShots} Extra Shot</span>
                        )}
                      </div>
                      <span className="font-bold text-[#2C3E2E]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total breakdown */}
                <div className="border-t border-[#E8DFD3] pt-2 space-y-1 text-xs">
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-[#D07A60]">
                      <span>Discount Applied</span>
                      <span>-${activeOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6D6964]">
                    <span>Barista Tip</span>
                    <span>${activeOrder.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C3E2E] pt-1 border-t border-[#E8DFD3]">
                    <span>Total Paid</span>
                    <span>${activeOrder.total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    onClick={() => setIsOrderTrackerOpen(false)}
                    className="flex-1 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-2.5 text-xs font-semibold"
                  >
                    Keep Tracking in Background
                  </Button>
                  
                  {activeOrder.status === "ready" ? (
                    <Button
                      onClick={clearActiveOrder}
                      variant="outline"
                      className="rounded-full border-[#E8DFD3] text-xs font-semibold py-2.5"
                    >
                      Clear Order
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsConfirmingCancel(true)}
                      variant="outline"
                      className="rounded-full border-[#D07A60]/40 text-[#D07A60] hover:bg-red-50 text-xs font-semibold py-2.5 flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel Order</span>
                    </Button>
                  )}
                </div>

                <a
                  href={`https://wa.me/61412345678?text=${encodeURIComponent(
                    `Hi Bloom Café! ☕ I'm checking on my Order #${activeOrder.orderId} (${activeOrder.customerName}, Total: $${activeOrder.total.toFixed(2)} AUD).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20BA56] text-white py-2.5 text-xs font-bold shadow-xs transition-transform active:scale-98"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-white" />
                  <span>Chat with Barista on WhatsApp</span>
                </a>

                <p className="text-center text-[10px] text-[#9E9B95] flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#7D9987]" />
                  100% Instant Refund Guarantee on all cancellations
                </p>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
