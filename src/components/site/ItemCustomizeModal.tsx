import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Coffee, Sparkles, Check } from "lucide-react";
import { useCart, CustomizationOptions } from "@/context/CartContext";
import { MenuItem, SpecialtyItem } from "@/data/cafe";

export function ItemCustomizeModal() {
  const { customizingItem, setCustomizingItem, addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [milk, setMilk] = useState<CustomizationOptions["milk"]>("Full Cream");
  const [temperature, setTemperature] = useState<CustomizationOptions["temperature"]>("Hot");
  const [sweetness, setSweetness] = useState<CustomizationOptions["sweetness"]>("100% Regular");
  const [extraShots, setExtraShots] = useState(0);
  const [syrups, setSyrups] = useState<string[]>([]);
  const [foodOptions, setFoodOptions] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    if (customizingItem) {
      setQuantity(1);
      setMilk("Full Cream");
      setTemperature("Hot");
      setSweetness("100% Regular");
      setExtraShots(0);
      setSyrups([]);
      setFoodOptions([]);
      setSpecialInstructions("");
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const isDrink =
    customizingItem.category === "coffee" ||
    customizingItem.category === "beverages" ||
    customizingItem.name.toLowerCase().includes("latte") ||
    customizingItem.name.toLowerCase().includes("espresso") ||
    customizingItem.name.toLowerCase().includes("brew") ||
    customizingItem.name.toLowerCase().includes("cappuccino") ||
    customizingItem.name.toLowerCase().includes("tea");

  const basePrice =
    "numericPrice" in customizingItem && typeof customizingItem.numericPrice === "number"
      ? customizingItem.numericPrice
      : parseFloat(customizingItem.price.replace("$", "").trim()) || 4.5;

  const milkOptions: { label: CustomizationOptions["milk"]; extra: number }[] = [
    { label: "Full Cream", extra: 0 },
    { label: "Oat Milk", extra: 0.7 },
    { label: "Almond Milk", extra: 0.7 },
    { label: "Soy Milk", extra: 0.7 },
    { label: "Skim Milk", extra: 0 },
  ];

  const tempOptions: CustomizationOptions["temperature"][] = ["Hot", "Extra Hot", "Iced"];
  const sweetOptions: CustomizationOptions["sweetness"][] = [
    "100% Regular",
    "50% Half Sweet",
    "Sugar-Free",
    "Extra Sweet",
  ];

  const syrupChoices = [
    { id: "Vanilla", name: "Madagascar Vanilla", price: 0.5 },
    { id: "Caramel", name: "Salted Caramel", price: 0.5 },
    { id: "Hazelnut", name: "Roasted Hazelnut", price: 0.5 },
  ];

  const foodAddons = [
    { id: "Gluten-Free Bread", name: "Gluten-Free Bread", price: 1.0 },
    { id: "Poached Egg", name: "Add Free-Range Poached Egg", price: 1.5 },
    { id: "Extra Avocado", name: "Extra Smashed Avocado", price: 2.0 },
    { id: "Persian Feta", name: "Extra Persian Feta", price: 1.5 },
  ];

  const toggleSyrup = (id: string) => {
    setSyrups((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleFoodAddon = (id: string) => {
    setFoodOptions((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const calculateTotal = (): number => {
    let unit = basePrice;
    if (milk === "Oat Milk" || milk === "Almond Milk" || milk === "Soy Milk") unit += 0.7;
    unit += extraShots * 0.8;
    unit += syrups.length * 0.5;
    unit += foodOptions.reduce((acc, curr) => {
      const found = foodAddons.find((a) => a.id === curr);
      return acc + (found ? found.price : 1.5);
    }, 0);
    return Math.round(unit * quantity * 100) / 100;
  };

  const handleAdd = () => {
    const options: CustomizationOptions = isDrink
      ? {
          milk,
          temperature,
          sweetness,
          extraShots: extraShots > 0 ? extraShots : undefined,
          syrups: syrups.length > 0 ? syrups : undefined,
          specialInstructions: specialInstructions || undefined,
        }
      : {
          foodOptions: foodOptions.length > 0 ? foodOptions : undefined,
          specialInstructions: specialInstructions || undefined,
        };

    addToCart(customizingItem, options, quantity);
    setCustomizingItem(null);
  };

  return (
    <Dialog open={!!customizingItem} onOpenChange={(open) => (open ? null : setCustomizingItem(null))}>
      <DialogContent className="max-w-lg overflow-hidden rounded-[2rem] border-border bg-[#FAF6EE] p-0 shadow-2xl">
        {/* Header with image */}
        <div className="relative bg-[#2C3E2E] text-white">
          {customizingItem.image && (
            <div className="h-40 sm:h-48 w-full overflow-hidden relative">
              <img
                src={customizingItem.image}
                alt={customizingItem.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2E] via-[#2C3E2E]/40 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:px-8 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D07A60]">
                  {customizingItem.category}
                </span>
                <DialogTitle className="font-display text-2xl font-bold text-white">
                  {customizingItem.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#E4ECE6]/80 mt-1 max-w-sm">
                  {customizingItem.description}
                </DialogDescription>
              </div>
              <span className="font-display text-2xl font-bold text-[#E4ECE6] shrink-0">
                ${basePrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[58vh] overflow-y-auto">
          {isDrink ? (
            <>
              {/* Milk Option */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                  Choice of Milk
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {milkOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setMilk(opt.label)}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all ${
                        milk === opt.label
                          ? "border-[#2C3E2E] bg-[#2C3E2E] text-white shadow-xs"
                          : "border-[#E8DFD3] bg-white text-[#253328] hover:bg-[#F3EDE2]"
                      }`}
                    >
                      <span className="font-medium">{opt.label}</span>
                      {opt.extra > 0 && (
                        <span className={`text-[10px] ${milk === opt.label ? "text-[#E4ECE6]" : "text-[#D07A60]"}`}>
                          +${opt.extra.toFixed(2)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                  Temperature
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {tempOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTemperature(opt)}
                      className={`rounded-xl border py-2 text-center text-xs font-medium transition-all ${
                        temperature === opt
                          ? "border-[#2C3E2E] bg-[#2C3E2E] text-white shadow-xs"
                          : "border-[#E8DFD3] bg-white text-[#253328] hover:bg-[#F3EDE2]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Espresso Shots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                    Extra Espresso Shots (+ $0.80 / shot)
                  </Label>
                  <div className="flex items-center gap-3 bg-white rounded-full border border-[#E8DFD3] px-3 py-1">
                    <button
                      type="button"
                      disabled={extraShots === 0}
                      onClick={() => setExtraShots((s) => Math.max(0, s - 1))}
                      className="text-[#2C3E2E] disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#2C3E2E]">{extraShots}</span>
                    <button
                      type="button"
                      onClick={() => setExtraShots((s) => Math.min(4, s + 1))}
                      className="text-[#2C3E2E]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Syrups */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                  Flavor Syrups (+ $0.50 ea)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {syrupChoices.map((s) => {
                    const isSelected = syrups.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSyrup(s.id)}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                          isSelected
                            ? "border-[#2C3E2E] bg-[#E4ECE6] text-[#2C3E2E] font-semibold"
                            : "border-[#E8DFD3] bg-white text-[#253328] hover:bg-[#F3EDE2]"
                        }`}
                      >
                        <span>{s.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#2C3E2E]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Food Customization */
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
                Add-ons & Customizations
              </Label>
              <div className="space-y-2">
                {foodAddons.map((addon) => {
                  const isSelected = foodOptions.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleFoodAddon(addon.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-xs transition-all ${
                        isSelected
                          ? "border-[#2C3E2E] bg-[#E4ECE6] text-[#2C3E2E] font-semibold"
                          : "border-[#E8DFD3] bg-white text-[#253328] hover:bg-[#F3EDE2]"
                      }`}
                    >
                      <span>{addon.name}</span>
                      <span className="font-semibold text-[#D07A60]">+${addon.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#2C3E2E]">
              Special Instructions
            </Label>
            <input
              type="text"
              placeholder="e.g. Extra hot, syrup on the side, allergies..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3.5 py-2 text-xs text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer with quantity & Add to cart */}
        <div className="border-t border-[#E8DFD3] bg-white p-4 sm:p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#FAF6EE] rounded-full border border-[#E8DFD3] px-3 py-1.5">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-[#2C3E2E] disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-display text-base font-bold text-[#2C3E2E] w-5 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-[#2C3E2E]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={handleAdd}
            className="flex-1 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-[#FAF6EE] py-6 text-sm font-semibold tracking-wide shadow-md"
          >
            Add to Order • ${calculateTotal().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
