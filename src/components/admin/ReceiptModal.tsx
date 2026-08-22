import React from "react";
import { Printer, X, CheckCircle, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActiveOrder } from "@/context/CartContext";
import { cafe } from "@/data/cafe";

interface ReceiptModalProps {
  order: ActiveOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close receipt"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Thermal Receipt Style */}
        <div id="thermal-receipt" className="border-t-4 border-b-4 border-dashed border-[#E8DFD3] py-4 font-mono text-xs text-[#253328] space-y-3">
          {/* Receipt Header */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 font-bold text-sm text-[#2C3E2E]">
              <Coffee className="h-4 w-4 text-[#D07A60]" />
              <span>BLOOM CAFÉ MELBOURNE</span>
            </div>
            <p className="text-[10px] text-[#6D6964] leading-tight">
              {cafe.address.street}, {cafe.address.city}
              <br />
              Tel: {cafe.phone} • ABN: 48 192 847 102
            </p>
            <div className="text-[10px] text-[#6D6964] border-t border-b border-gray-200 py-1 my-2">
              <span>TAX INVOICE / RECEIPT</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="flex justify-between text-[11px]">
            <div>
              <div><strong>Order:</strong> #{order.orderId}</div>
              <div><strong>Type:</strong> {order.diningType === "dine-in" ? `Table ${order.tableNumber || "01"}` : "Takeaway"}</div>
            </div>
            <div className="text-right">
              <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Time:</strong> {order.createdAt || "Just now"}</div>
            </div>
          </div>

          <div>
            <strong>Customer:</strong> {order.customerName} ({order.customerPhone || "In-Store"})
          </div>

          {/* Itemized Table */}
          <div className="border-t border-gray-200 pt-2 space-y-1.5">
            {order.items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-bold">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
                {item.options && (
                  <div className="text-[10px] text-gray-500 pl-2">
                    {item.options.milk && item.options.milk !== "Full Cream" && <div>• {item.options.milk}</div>}
                    {item.options.temperature && item.options.temperature !== "Hot" && <div>• {item.options.temperature}</div>}
                    {item.options.extraShots ? <div>• +{item.options.extraShots} Shot</div> : null}
                    {item.options.syrups?.length ? <div>• {item.options.syrups.join(", ")}</div> : null}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-300 pt-2 space-y-1 text-right">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.tip > 0 && (
              <div className="flex justify-between text-[#D07A60]">
                <span>Barista Tip:</span>
                <span>+${order.tip.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t border-black pt-1.5">
              <span>TOTAL (AUD):</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Includes GST (10%): ${(order.total / 11).toFixed(2)}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-gray-500 space-y-1">
            <div>☕ Thank you for visiting Bloom Café!</div>
            <div>Good food • Good mood • Everyday</div>
            <div className="font-bold text-[9px] tracking-widest pt-1">
              *** CASH REGISTER PROCESSED ***
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handlePrint}
            className="flex-1 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-full border-[#E8DFD3] text-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
