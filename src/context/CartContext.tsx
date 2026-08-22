import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { MenuItem, SpecialtyItem } from "@/data/cafe";
import { useApp } from "@/context/AppContext";

export interface CustomizationOptions {
  milk?: "Full Cream" | "Oat Milk" | "Almond Milk" | "Soy Milk" | "Skim Milk" | "None";
  temperature?: "Hot" | "Extra Hot" | "Iced";
  sweetness?: "100% Regular" | "50% Half Sweet" | "Sugar-Free" | "Extra Sweet";
  extraShots?: number;
  syrups?: string[];
  foodOptions?: string[];
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  itemId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image?: string;
  category: string;
  options: CustomizationOptions;
}

export interface ActiveOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  diningType: "pickup" | "dine-in";
  tableNumber?: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  notes?: string;
  status: "received" | "brewing" | "ready" | "completed" | "cancelled";
  estimatedMinutes: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem | SpecialtyItem, options?: CustomizationOptions, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  tipPercentage: number;
  setTipPercentage: (tip: number) => void;
  diningType: "pickup" | "dine-in";
  setDiningType: (type: "pickup" | "dine-in") => void;
  tableNumber: string;
  setTableNumber: (num: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  tax: number;
  tipAmount: number;
  total: number;
  // Item Customizer Modal state
  customizingItem: (MenuItem | SpecialtyItem) | null;
  setCustomizingItem: (item: (MenuItem | SpecialtyItem) | null) => void;
  // Active Order Tracking & Cancellation
  activeOrder: ActiveOrder | null;
  placeOrder: (customer: { name: string; phone: string; email?: string; notes?: string }) => void;
  cancelActiveOrder: (reason?: string, restoreToCart?: boolean, cancelledBy?: "customer" | "admin") => void;
  clearActiveOrder: () => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_cart");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<(MenuItem | SpecialtyItem) | null>(null);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [diningType, setDiningType] = useState<"pickup" | "dine-in">("pickup");
  const [tableNumber, setTableNumber] = useState("12");
  const [pickupTime, setPickupTime] = useState("As soon as possible (~15 mins)");
  const [orderNotes, setOrderNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_active_order");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem("bloom_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save active order to local storage
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem("bloom_active_order", JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem("bloom_active_order");
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeOrder]);

  // Simulate order stage progression
  useEffect(() => {
    if (!activeOrder) return;
    if (activeOrder.status === "completed" || activeOrder.status === "cancelled") return;

    const timer1 = setTimeout(() => {
      setActiveOrder((prev) => (prev && prev.status !== "cancelled" ? { ...prev, status: "brewing" } : null));
    }, 10000);

    const timer2 = setTimeout(() => {
      setActiveOrder((prev) => {
        if (!prev || prev.status === "cancelled") return null;
        toast.success("Your Bloom Order is Ready!", {
          description: `Order #${prev.orderId} is fresh and ready at the barista counter.`,
        });
        return { ...prev, status: "ready" };
      });
    }, 25000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeOrder?.orderId, activeOrder?.status]);

  const addToCart = (
    item: MenuItem | SpecialtyItem,
    options: CustomizationOptions = {},
    quantity = 1,
  ) => {
    const rawPrice =
      "numericPrice" in item
        ? item.numericPrice
        : parseFloat(item.price.replace(/[^0-9.]/g, "")) || 5.0;

    let extraCost = 0;
    if (options.extraShots) extraCost += options.extraShots * 0.8;
    if (options.syrups) extraCost += options.syrups.length * 0.7;
    if (options.milk && options.milk !== "Full Cream" && options.milk !== "Skim Milk" && options.milk !== "None") {
      extraCost += 0.5; // Plant milks
    }
    if (options.foodOptions) {
      extraCost += options.foodOptions.length * 2.0;
    }

    const unitPrice = rawPrice + extraCost;
    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newItem: CartItem = {
      cartItemId,
      itemId: item.id,
      name: item.name,
      basePrice: rawPrice,
      unitPrice,
      quantity,
      image: item.image,
      category: item.category,
      options,
    };

    setCart((prev) => [...prev, newItem]);
    toast.success(`Added ${item.name} to order`, {
      description: quantity > 1 ? `${quantity} items added` : undefined,
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode("");
    setDiscountAmount(0);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "BLOOM10") {
      setPromoCode("BLOOM10");
      setDiscountAmount(subtotal * 0.1);
      toast.success("10% discount applied with code BLOOM10!");
      return true;
    }
    if (clean === "FIRSTBREW") {
      setPromoCode("FIRSTBREW");
      setDiscountAmount(Math.min(subtotal, 3.0));
      toast.success("$3.00 discount applied with code FIRSTBREW!");
      return true;
    }
    if (clean === "GOODMOOD") {
      setPromoCode("GOODMOOD");
      setDiscountAmount(subtotal * 0.15);
      toast.success("15% discount applied with code GOODMOOD!");
      return true;
    }
    if (clean === "FREESHOT") {
      setPromoCode("FREESHOT");
      setDiscountAmount(Math.min(subtotal, 1.6));
      toast.success("Free espresso shot discount applied!");
      return true;
    }
    toast.error("Invalid promo code. Try BLOOM10 or FIRSTBREW");
    return false;
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountAmount(0);
    toast.info("Promo code removed");
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% GST included
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tipAmount = (discountedSubtotal * tipPercentage) / 100;
  const total = discountedSubtotal + tipAmount;

  const placeOrder = (customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  }) => {
    if (cart.length === 0) return;

    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: ActiveOrder = {
      orderId: orderNumber,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
      diningType,
      tableNumber: diningType === "dine-in" ? tableNumber : undefined,
      pickupTime,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      subtotal,
      discount: discountAmount,
      tip: tipAmount,
      total,
      notes: customer.notes || orderNotes,
      status: "received",
      estimatedMinutes: diningType === "pickup" ? 15 : 10,
    };

    setActiveOrder(newOrder);
    setCart([]);
    setPromoCode("");
    setDiscountAmount(0);
    setOrderNotes("");
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);

    toast.success("Order Placed Successfully! ☕", {
      description: `Order #${orderNumber} is now brewing.`,
    });
  };

  const { addNotification } = useApp();

  const cancelActiveOrder = (
    reason = "Customer Request",
    restoreToCart = false,
    cancelledBy: "customer" | "admin" = "customer"
  ) => {
    if (!activeOrder) return;

    const cancelledOrderId = activeOrder.orderId;
    const oldItems = activeOrder.items;
    const totalAmount = activeOrder.total;
    const customer = activeOrder.customerName;

    if (restoreToCart) {
      setCart(oldItems);
      setIsCartOpen(true);
    }

    setActiveOrder(null);
    setIsOrderTrackerOpen(false);

    if (cancelledBy === "customer") {
      // Dispatch notification to Admin Console
      addNotification({
        title: `Order #${cancelledOrderId} Cancelled by Customer`,
        message: `${customer} cancelled order #${cancelledOrderId}. Reason: "${reason}". Full refund of $${totalAmount.toFixed(2)} AUD processed.`,
        type: "order_cancelled",
        recipient: "admin",
        orderId: cancelledOrderId,
        cancelledBy: "customer",
        reason,
        refundAmount: totalAmount,
        customerName: customer,
      });

      toast.info(`Order #${cancelledOrderId} Cancelled`, {
        description: `Reason: ${reason}. Your refund of $${totalAmount.toFixed(2)} AUD has been processed.`,
      });
    } else {
      // Dispatch notification to Customer
      addNotification({
        title: `Order #${cancelledOrderId} Cancelled by Bloom Staff`,
        message: `Notice from Barista Lead: Your order #${cancelledOrderId} was cancelled. Reason: "${reason}". Full refund of $${totalAmount.toFixed(2)} AUD has been credited back.`,
        type: "order_cancelled",
        recipient: "customer",
        orderId: cancelledOrderId,
        cancelledBy: "admin",
        reason,
        refundAmount: totalAmount,
        customerName: customer,
      });

      toast.error(`Order #${cancelledOrderId} Cancelled by Staff`, {
        description: `Customer ${customer} notified. Reason: ${reason}. Refund of $${totalAmount.toFixed(2)} AUD issued.`,
      });
    }
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
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
        customizingItem,
        setCustomizingItem,
        activeOrder,
        placeOrder,
        cancelActiveOrder,
        clearActiveOrder,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
