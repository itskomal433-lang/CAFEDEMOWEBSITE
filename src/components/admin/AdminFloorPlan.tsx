import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Coffee,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface CafeTable {
  id: string;
  tableNumber: string;
  zone: "bar" | "indoor" | "window" | "patio";
  zoneName: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "dirty";
  currentGuest?: string;
  orderTotal?: number;
  seatedSince?: string;
}

const initialTables: CafeTable[] = [
  { id: "t-1", tableNumber: "01", zone: "bar", zoneName: "Espresso Bar Stool", capacity: 2, status: "occupied", currentGuest: "Liam Thompson", orderTotal: 17.82, seatedSince: "18m ago" },
  { id: "t-2", tableNumber: "02", zone: "bar", zoneName: "Espresso Bar Stool", capacity: 2, status: "available" },
  { id: "t-3", tableNumber: "03", zone: "indoor", zoneName: "Indoor Cozy Arch", capacity: 4, status: "occupied", currentGuest: "Olivia & Friend", orderTotal: 28.5, seatedSince: "35m ago" },
  { id: "t-4", tableNumber: "04", zone: "indoor", zoneName: "Indoor Cozy Arch", capacity: 4, status: "reserved", currentGuest: "Marcus Evans (1:00 PM)" },
  { id: "t-5", tableNumber: "05", zone: "indoor", zoneName: "Indoor Cozy Arch", capacity: 6, status: "available" },
  { id: "t-6", tableNumber: "06", zone: "indoor", zoneName: "Indoor Cozy Arch", capacity: 2, status: "dirty" },
  { id: "t-7", tableNumber: "07", zone: "window", zoneName: "Sunlit Window Alley", capacity: 2, status: "occupied", currentGuest: "Emma Davis", orderTotal: 12.0, seatedSince: "10m ago" },
  { id: "t-8", tableNumber: "08", zone: "window", zoneName: "Sunlit Window Alley", capacity: 2, status: "available" },
  { id: "t-9", tableNumber: "09", zone: "window", zoneName: "Sunlit Window Alley", capacity: 4, status: "available" },
  { id: "t-10", tableNumber: "10", zone: "patio", zoneName: "Botanical Garden Patio", capacity: 4, status: "occupied", currentGuest: "Jack Miller", orderTotal: 34.2, seatedSince: "42m ago" },
  { id: "t-11", tableNumber: "11", zone: "patio", zoneName: "Botanical Garden Patio", capacity: 4, status: "reserved", currentGuest: "Sarah Jenkins (1:30 PM)" },
  { id: "t-12", tableNumber: "12", zone: "patio", zoneName: "Botanical Garden Patio", capacity: 6, status: "available" },
];

export function AdminFloorPlan() {
  const [tables, setTables] = useState<CafeTable[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_floor_plan");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialTables;
  });

  const [selectedTable, setSelectedTable] = useState<CafeTable | null>(null);
  const [quickGuestName, setQuickGuestName] = useState("");

  const saveTables = (newTables: CafeTable[]) => {
    setTables(newTables);
    if (typeof window !== "undefined") {
      localStorage.setItem("bloom_floor_plan", JSON.stringify(newTables));
    }
  };

  const handleUpdateStatus = (
    tableId: string,
    newStatus: "available" | "occupied" | "reserved" | "dirty",
    guestName?: string
  ) => {
    const updated = tables.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          currentGuest: newStatus === "occupied" ? guestName || "Walk-in Guest" : newStatus === "reserved" ? guestName : undefined,
          orderTotal: newStatus === "occupied" ? t.orderTotal || 15.0 : undefined,
          seatedSince: newStatus === "occupied" ? "Just seated" : undefined,
        };
      }
      return t;
    });

    saveTables(updated);
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(updated.find((t) => t.id === tableId) || null);
    }
    toast.success(`Table #${tables.find((t) => t.id === tableId)?.tableNumber} status updated to ${newStatus.toUpperCase()}`);
  };

  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const availableCount = tables.filter((t) => t.status === "available").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;
  const dirtyCount = tables.filter((t) => t.status === "dirty").length;

  return (
    <div className="space-y-6">
      {/* Header & Table Summary Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
            Live Café Floor Plan & Table Status
          </h2>
          <p className="text-xs text-[#6D6964]">
            Visual seating management across indoor rooms, garden patio, and window benches.
          </p>
        </div>

        {/* Legend / Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {availableCount} Available
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            {occupiedCount} Occupied
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {reservedCount} Reserved
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            {dirtyCount} Needs Bussing
          </span>
        </div>
      </div>

      {/* Main Floor Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Floor Map */}
        <div className="lg:col-span-8 rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-6">
          {["indoor", "window", "patio", "bar"].map((zoneKey) => {
            const zoneTables = tables.filter((t) => t.zone === zoneKey);
            const zoneTitle =
              zoneKey === "indoor"
                ? "🌿 Zone A: Indoor Cozy Arch (Main Hall)"
                : zoneKey === "window"
                ? "☀️ Zone B: Sunlit Window Alley"
                : zoneKey === "patio"
                ? "🌸 Zone C: Botanical Garden Patio (Outdoor)"
                : "☕ Zone D: Espresso Bar Counter";

            return (
              <div key={zoneKey} className="space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#6D6964] border-b border-gray-100 pb-1">
                  {zoneTitle}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {zoneTables.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    const isOccupied = table.status === "occupied";
                    const isReserved = table.status === "reserved";
                    const isDirty = table.status === "dirty";

                    return (
                      <button
                        key={table.id}
                        onClick={() => setSelectedTable(table)}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[#2C3E2E] shadow-md scale-102"
                            : "hover:shadow-xs"
                        } ${
                          isOccupied
                            ? "border-rose-300 bg-rose-50/60"
                            : isReserved
                            ? "border-amber-300 bg-amber-50/60"
                            : isDirty
                            ? "border-gray-300 bg-gray-100/70"
                            : "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-bold text-[#2C3E2E]">
                            T-{table.tableNumber}
                          </span>
                          <span className="text-[10px] text-[#6D6964] flex items-center gap-0.5">
                            <Users className="h-3 w-3" /> {table.capacity}p
                          </span>
                        </div>

                        <div className="my-2 space-y-0.5">
                          {isOccupied && (
                            <>
                              <span className="block font-display text-xs font-bold text-rose-900 line-clamp-1">
                                {table.currentGuest}
                              </span>
                              <span className="block text-[10px] text-rose-700">
                                ⏱️ {table.seatedSince} • ${table.orderTotal?.toFixed(2)}
                              </span>
                            </>
                          )}
                          {isReserved && (
                            <span className="block font-display text-xs font-bold text-amber-900 line-clamp-1">
                              📅 {table.currentGuest}
                            </span>
                          )}
                          {isDirty && (
                            <span className="block text-[11px] font-bold text-gray-700">
                              🧹 Needs Bussing
                            </span>
                          )}
                          {table.status === "available" && (
                            <span className="block text-[11px] font-semibold text-emerald-700">
                              🟢 Ready to Seat
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] uppercase font-bold tracking-wider text-right">
                          <span
                            className={
                              isOccupied
                                ? "text-rose-700"
                                : isReserved
                                ? "text-amber-700"
                                : isDirty
                                ? "text-gray-600"
                                : "text-emerald-700"
                            }
                          >
                            {table.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 4 Cols: Table Detail & Action Panel */}
        <div className="lg:col-span-4 rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-xs flex flex-col justify-between">
          {selectedTable ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="font-mono text-lg font-bold text-[#2C3E2E]">
                    Table #{selectedTable.tableNumber}
                  </span>
                  <span className="text-xs text-[#6D6964] block">
                    {selectedTable.zoneName} (Capacity: {selectedTable.capacity} guests)
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    selectedTable.status === "occupied"
                      ? "bg-rose-100 text-rose-800"
                      : selectedTable.status === "reserved"
                      ? "bg-amber-100 text-amber-800"
                      : selectedTable.status === "dirty"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {selectedTable.status}
                </span>
              </div>

              {/* Occupied Details */}
              {selectedTable.status === "occupied" && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 space-y-1.5 text-xs text-rose-950">
                  <div className="font-bold flex items-center justify-between">
                    <span>Guest: {selectedTable.currentGuest}</span>
                    <span className="font-mono">${selectedTable.orderTotal?.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Seated for: {selectedTable.seatedSince}
                  </div>
                </div>
              )}

              {/* Quick Seat input */}
              {selectedTable.status === "available" && (
                <div className="space-y-2 rounded-2xl bg-[#FAF6EE] p-3 border border-[#E8DFD3]">
                  <label className="text-xs font-bold text-[#2C3E2E]">
                    Seat Walk-in Guest at Table #{selectedTable.tableNumber}:
                  </label>
                  <input
                    placeholder="Guest Name (e.g. Liam)"
                    value={quickGuestName}
                    onChange={(e) => setQuickGuestName(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white p-2 text-xs"
                  />
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedTable.id, "occupied", quickGuestName || "Walk-in Guest");
                      setQuickGuestName("");
                    }}
                    className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold"
                  >
                    Seat Table Now
                  </Button>
                </div>
              )}

              {/* Status Change Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D6964]">
                  Change Table State:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTable.id, "available")}
                    className="rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
                  >
                    🟢 Available
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTable.id, "dirty")}
                    className="rounded-xl border-gray-300 text-gray-800 hover:bg-gray-50 text-xs font-bold"
                  >
                    🧹 Needs Bussing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTable.id, "occupied", "Walk-in")}
                    className="rounded-xl border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-bold"
                  >
                    🔴 Occupied
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTable.id, "reserved", "Guest Reservation")}
                    className="rounded-xl border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold"
                  >
                    🟡 Reserved
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-[#9E9B95] space-y-2">
              <Coffee className="h-8 w-8 mx-auto text-[#D07A60]/40" />
              <p>Select any table on the floor plan to view details, seat guests, or update status.</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <Button
              onClick={() => {
                saveTables(initialTables);
                toast.success("Floor layout reset to default");
              }}
              variant="ghost"
              className="w-full text-xs text-[#6D6964] hover:text-[#2C3E2E]"
            >
              Reset Floor Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
