import React from "react";
import { AlertTriangle, CheckCircle2, X, Bell, RotateCcw } from "lucide-react";
import { useApp, AppNotification } from "@/context/AppContext";

export function CustomerNotificationBanner() {
  const { notifications, markNotificationAsRead } = useApp();

  // Find unread customer notifications
  const unreadCustomerNotifs = notifications.filter(
    (n) => !n.read && (n.recipient === "customer" || n.recipient === "all")
  );

  if (unreadCustomerNotifs.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-auto animate-in slide-in-from-top-4 duration-300">
      {unreadCustomerNotifs.map((notif) => {
        const isCancelled = notif.type === "order_cancelled";

        return (
          <div
            key={notif.id}
            className={`rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all ${
              isCancelled
                ? "border-rose-300 bg-white/95 text-rose-950"
                : "border-emerald-300 bg-white/95 text-emerald-950"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
                    isCancelled
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {isCancelled ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-bold">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A4642] leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.refundAmount && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 mt-1">
                      <span>✓ Full Refund: ${notif.refundAmount.toFixed(2)} AUD</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => markNotificationAsRead(notif.id)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
