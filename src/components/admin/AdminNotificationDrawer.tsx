import React from "react";
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp, AppNotification } from "@/context/AppContext";

interface AdminNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationDrawer({ isOpen, onClose }: AdminNotificationDrawerProps) {
  const { notifications, markNotificationAsRead, clearNotifications } = useApp();

  if (!isOpen) return null;

  const adminNotifications = notifications.filter(
    (n) => n.recipient === "admin" || n.recipient === "all"
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                  Notifications & Live Alerts
                </h3>
                <span className="text-xs text-[#6D6964]">
                  Order cancellations, table updates & staff alerts
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close notification panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List */}
          <div className="mt-4 space-y-3 max-h-[75vh] overflow-y-auto no-scrollbar pr-0.5">
            {adminNotifications.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#9E9B95] space-y-2">
                <Bell className="h-8 w-8 mx-auto text-gray-300" />
                <p>No new notifications or cancellation alerts.</p>
              </div>
            ) : (
              adminNotifications.map((notif) => {
                const isCancelled = notif.type === "order_cancelled";

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                      !notif.read ? "ring-1 ring-[#D07A60]" : ""
                    } ${
                      isCancelled
                        ? "border-rose-200 bg-rose-50/70 text-rose-950"
                        : "border-[#E8DFD3] bg-[#FAF6EE]/50 text-[#2C3E2E]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
                            isCancelled
                              ? "bg-rose-200 text-rose-800"
                              : "bg-[#2C3E2E] text-white"
                          }`}
                        >
                          {isCancelled ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <Bell className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs font-bold">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-[#D07A60]" />
                            )}
                          </div>

                          <p className="text-xs text-[#4A4642] leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-[10px] text-[#6D6964]">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {notif.timestamp}
                            </span>
                            {notif.cancelledBy && (
                              <span className="capitalize font-bold text-[#D07A60]">
                                Cancelled by: {notif.cancelledBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <Button
            onClick={clearNotifications}
            variant="ghost"
            size="sm"
            className="text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Notification History</span>
          </Button>

          <Button
            onClick={onClose}
            size="sm"
            className="rounded-full bg-[#2C3E2E] text-white text-xs font-bold px-4"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
