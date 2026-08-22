import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Ban,
  Boxes,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fullMenu } from "@/data/cafe";
import { useApp } from "@/context/AppContext";

export interface InventoryItem {
  id: string;
  name: string;
  category: "beans" | "milk" | "bakery" | "syrups" | "packaging";
  currentStock: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
}

const initialInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Bloom House Espresso Blend",
    category: "beans",
    currentStock: 18.5,
    unit: "kg",
    minThreshold: 10,
    supplier: "Melbourne Coffee Roasters",
    costPerUnit: 28.0,
    lastRestocked: "2 days ago",
  },
  {
    id: "inv-2",
    name: "Ethiopia Yirgacheffe Single Origin",
    category: "beans",
    currentStock: 4.2,
    unit: "kg",
    minThreshold: 5,
    supplier: "Single O Direct",
    costPerUnit: 34.0,
    lastRestocked: "5 days ago",
  },
  {
    id: "inv-3",
    name: "Full Cream Dairy Milk",
    category: "milk",
    currentStock: 32,
    unit: "L",
    minThreshold: 15,
    supplier: "St David Dairy",
    costPerUnit: 2.1,
    lastRestocked: "Today, 6:00 AM",
  },
  {
    id: "inv-4",
    name: "Oatly Barista Edition Oat Milk",
    category: "milk",
    currentStock: 6,
    unit: "L",
    minThreshold: 12,
    supplier: "Alternative Dairy Co",
    costPerUnit: 3.4,
    lastRestocked: "3 days ago",
  },
  {
    id: "inv-5",
    name: "Almond Breeze Barista Blend",
    category: "milk",
    currentStock: 14,
    unit: "L",
    minThreshold: 8,
    supplier: "Alternative Dairy Co",
    costPerUnit: 3.2,
    lastRestocked: "Yesterday",
  },
  {
    id: "inv-6",
    name: "Uji Ceremonial Grade Matcha",
    category: "syrups",
    currentStock: 0.8,
    unit: "kg",
    minThreshold: 1.0,
    supplier: "Kyoto Direct Import",
    costPerUnit: 110.0,
    lastRestocked: "10 days ago",
  },
  {
    id: "inv-7",
    name: "Organic Madagascar Vanilla Syrup",
    category: "syrups",
    currentStock: 5,
    unit: "Bottles",
    minThreshold: 3,
    supplier: "Monin Australia",
    costPerUnit: 14.5,
    lastRestocked: "1 week ago",
  },
  {
    id: "inv-8",
    name: "Artisan Sourdough Loaves",
    category: "bakery",
    currentStock: 12,
    unit: "Loaves",
    minThreshold: 6,
    supplier: "Baker Bleu Melbourne",
    costPerUnit: 6.5,
    lastRestocked: "Today, 5:30 AM",
  },
  {
    id: "inv-9",
    name: "Biodegradable 8oz / 12oz Cups",
    category: "packaging",
    currentStock: 240,
    unit: "Cups",
    minThreshold: 100,
    supplier: "BioPak Australia",
    costPerUnit: 0.18,
    lastRestocked: "4 days ago",
  },
];

export function AdminInventory() {
  const { soldOutItemIds, toggleItemSoldOut } = useApp();
  const [subTab, setSubTab] = useState<"raw" | "86menu">("raw");
  const [items, setItems] = useState<InventoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_inventory");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialInventory;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const saveItems = (newItems: InventoryItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bloom_inventory", JSON.stringify(newItems));
      } catch {}
    }
  };

  const handleRestock = (id: string, amount: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newStock = Number((item.currentStock + amount).toFixed(1));
        toast.success(`Restocked ${item.name} (+${amount} ${item.unit})`);
        return {
          ...item,
          currentStock: newStock,
          lastRestocked: "Just now",
        };
      }
      return item;
    });
    saveItems(updated);
  };

  const handleUseStock = (id: string, amount: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newStock = Math.max(0, Number((item.currentStock - amount).toFixed(1)));
        toast.info(`Logged usage for ${item.name} (-${amount} ${item.unit})`);
        return { ...item, currentStock: newStock };
      }
      return item;
    });
    saveItems(updated);
  };

  const lowStockItems = items.filter((i) => i.currentStock <= i.minThreshold);

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
            Inventory & Kitchen Stock Hub
          </h2>
          <p className="text-xs text-[#6D6964]">
            Track raw materials stock, manage reorders, and instantly toggle 86'd (sold out) menu items.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#F3EDE2] p-1 rounded-2xl border border-[#E8DFD3]">
          <button
            type="button"
            onClick={() => setSubTab("raw")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              subTab === "raw"
                ? "bg-[#2C3E2E] text-white shadow-xs"
                : "text-[#6D6964] hover:text-[#2C3E2E]"
            }`}
          >
            <Boxes className="h-3.5 w-3.5" />
            <span>Raw Materials</span>
            {lowStockItems.length > 0 && (
              <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[9px]">
                {lowStockItems.length} Low
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("86menu")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              subTab === "86menu"
                ? "bg-[#2C3E2E] text-white shadow-xs"
                : "text-[#6D6964] hover:text-[#2C3E2E]"
            }`}
          >
            <Ban className="h-3.5 w-3.5 text-rose-300" />
            <span>86'd Menu Items</span>
            {soldOutItemIds.length > 0 && (
              <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[9px]">
                {soldOutItemIds.length} 86'd
              </span>
            )}
          </button>
        </div>
      </div>

      {subTab === "86menu" ? (
        /* 86'd Menu Availability Management */
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#E8DFD3] p-4 flex items-center justify-between text-xs">
            <span className="text-[#6D6964]">
              Items marked as <strong>86'd (Sold Out)</strong> are instantly disabled on the live customer ordering menu.
            </span>
            <span className="font-bold text-[#2C3E2E]">
              {soldOutItemIds.length} of {fullMenu.length} items 86'd
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fullMenu.map((item) => {
              const isSoldOut = soldOutItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 shadow-xs transition-all ${
                    isSoldOut ? "border-rose-300 bg-rose-50/50 opacity-80" : "border-[#E8DFD3] bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-display text-xs font-bold text-[#2C3E2E]">{item.name}</h4>
                      <span className="font-sans text-xs font-bold text-[#D07A60]">{item.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleItemSoldOut(item.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                      isSoldOut
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-[#E4ECE6] text-[#2C3E2E] hover:bg-[#D4E0D7]"
                    }`}
                  >
                    {isSoldOut ? "86'd (Sold Out)" : "In Stock"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Raw Materials Inventory Table */
        <div className="space-y-6">
          {/* Low Stock Warning Alert Banner */}
          {lowStockItems.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-xs flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display text-sm font-bold text-amber-900">
                  Low Stock Warning ({lowStockItems.length} items need restock)
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {lowStockItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800"
                    >
                      <span>{item.name}:</span>
                      <span className="font-mono text-rose-600 font-bold">
                        {item.currentStock} {item.unit} left
                      </span>
                      <button
                        onClick={() => handleRestock(item.id, item.minThreshold * 2)}
                        className="ml-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 text-[10px]"
                      >
                        +Restock
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {[
                { id: "all", label: "All Supplies" },
                { id: "beans", label: "☕ Beans" },
                { id: "milk", label: "🥛 Milks" },
                { id: "syrups", label: "🍯 Syrups & Tea" },
                { id: "bakery", label: "🥐 Bakery" },
                { id: "packaging", label: "📦 Packaging" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-2xl px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#2C3E2E] text-[#FAF6EE] shadow-xs"
                      : "bg-white border border-[#E8DFD3] text-[#6D6964] hover:bg-[#FAF6EE]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search ingredient or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs bg-white border-[#E8DFD3] rounded-xl h-8.5"
              />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto rounded-3xl border border-[#E8DFD3] bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#4A4642] border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFD3] bg-[#F5EFE4] text-[#2C3E2E] font-bold">
                  <th className="py-4 px-5">Item & Supplier</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Stock Level</th>
                  <th className="py-4 px-4 text-center">Min Threshold</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4">Last Restock</th>
                  <th className="py-4 px-5 text-right">Quick Restock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE0]">
                {filteredItems.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  const isCritical = item.currentStock === 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF6EE] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-display text-sm font-bold text-[#2C3E2E] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#9E9B95]">
                          {item.supplier} • Est. ${item.costPerUnit.toFixed(2)}/{item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 capitalize font-medium text-[#6D6964]">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-sm font-bold text-[#2C3E2E]">
                          {item.currentStock} {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center text-[#6D6964]">
                        {item.minThreshold} {item.unit}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isCritical
                              ? "bg-rose-100 text-rose-800"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isCritical ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#6D6964]">
                        {item.lastRestocked}
                      </td>

                      <td className="py-3.5 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => handleRestock(item.id, item.unit === "kg" ? 5 : item.unit === "L" ? 10 : 50)}
                          className="rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white px-3 py-1 text-[11px] font-bold cursor-pointer transition-transform active:scale-95"
                        >
                          +{item.unit === "kg" ? "5kg" : item.unit === "L" ? "10L" : "50"}
                        </button>
                        <button
                          onClick={() => handleUseStock(item.id, item.unit === "kg" ? 1 : item.unit === "L" ? 2 : 10)}
                          className="rounded-full border border-[#E8DFD3] hover:bg-gray-100 text-[#6D6964] px-2.5 py-1 text-[11px] font-semibold"
                          title="Log stock used"
                        >
                          Log Used
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
