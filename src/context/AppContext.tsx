import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { reviews as initialReviews } from "@/data/cafe";

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  favoriteDish?: string;
  date: string;
}

export interface ReservationItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  guests: string;
  date: string;
  time: string;
  seating: string;
  specialRequest?: string;
  status: "confirmed" | "seated" | "completed" | "cancelled";
}

export interface StoreSettings {
  isOpen: boolean;
  closingTime: string;
  waitTime: string;
  announcement: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "order_cancelled" | "order_ready" | "reservation_cancelled" | "system";
  recipient: "admin" | "customer" | "all";
  timestamp: string;
  read: boolean;
  orderId?: string;
  cancelledBy?: "customer" | "admin";
  reason?: string;
  refundAmount?: number;
  customerName?: string;
}

interface AppContextType {
  favorites: string[];
  toggleFavorite: (itemId: string, itemName?: string) => void;
  isFavorite: (itemId: string) => boolean;
  loyaltyPoints: number;
  redeemPoints: (points: number, rewardName: string) => boolean;
  reviewsList: ReviewItem[];
  addReview: (review: Omit<ReviewItem, "id" | "date">) => void;
  deleteReview: (id: string) => void;
  reservations: ReservationItem[];
  addReservation: (res: Omit<ReservationItem, "id" | "status">) => void;
  updateReservationStatus: (id: string, status: "confirmed" | "seated" | "completed" | "cancelled") => void;
  cancelReservation: (id: string) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  soldOutItemIds: string[];
  toggleItemSoldOut: (itemId: string) => void;
  resetAllAppData: () => void;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadAdminCount: number;
  unreadCustomerCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_favorites");
        return saved ? JSON.parse(saved) : ["classic-latte", "berry-pancakes"];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Loyalty points
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_loyalty_points");
        return saved ? parseInt(saved, 10) : 145;
      } catch {
        return 145;
      }
    }
    return 145;
  });

  // Reviews
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_reviews");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialReviews.map((r, idx) => ({
      id: `rev-${idx + 1}`,
      author: r.author,
      role: r.role,
      rating: r.rating,
      text: r.text,
      favoriteDish: idx === 0 ? "Berry Pancakes Stack" : idx === 1 ? "Melbourne Flat White" : "Avocado Toast",
      date: r.date,
    }));
  });

  // Reservations
  const [reservations, setReservations] = useState<ReservationItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_reservations");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    const today = new Date().toISOString().split("T")[0];
    return [
      {
        id: "res-101",
        name: "Chloe Harrison",
        phone: "(03) 9876 5432",
        email: "chloe@example.com",
        guests: "2",
        date: today,
        time: "10:30 AM",
        seating: "Indoor Cozy Arch",
        specialRequest: "Window seat if available",
        status: "confirmed",
      },
      {
        id: "res-102",
        name: "Marcus Vance",
        phone: "(03) 9111 2233",
        email: "marcus@example.com",
        guests: "4",
        date: today,
        time: "11:30 AM",
        seating: "Sunlit Window Table",
        specialRequest: "High chair needed",
        status: "seated",
      },
    ];
  });

  // Store live settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_store_settings");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {
      isOpen: true,
      closingTime: "9:00 PM",
      waitTime: "5-8 mins",
      announcement: "Freshly roasted single-origin Ethiopian batch brew on tap today!",
    };
  });

  // Sold out items tracking
  const [soldOutItemIds, setSoldOutItemIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_sold_out");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("bloom_favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("bloom_loyalty_points", loyaltyPoints.toString());
    } catch {}
  }, [loyaltyPoints]);

  useEffect(() => {
    try {
      localStorage.setItem("bloom_reviews", JSON.stringify(reviewsList));
    } catch {}
  }, [reviewsList]);

  useEffect(() => {
    try {
      localStorage.setItem("bloom_reservations", JSON.stringify(reservations));
    } catch {}
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem("bloom_store_settings", JSON.stringify(storeSettings));
    } catch {}
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem("bloom_sold_out", JSON.stringify(soldOutItemIds));
    } catch {}
  }, [soldOutItemIds]);

  const toggleFavorite = (itemId: string, itemName?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        toast.info(`Removed ${itemName || "item"} from favorites`);
        return prev.filter((id) => id !== itemId);
      } else {
        toast.success(`Saved ${itemName || "item"} to favorites ❤️`);
        return [...prev, itemId];
      }
    });
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const redeemPoints = (points: number, rewardName: string) => {
    if (loyaltyPoints < points) {
      toast.error(`Not enough Bloom Points. You need ${points} points.`);
      return false;
    }
    setLoyaltyPoints((prev) => prev - points);
    toast.success(`Redeemed ${rewardName}! 🎉`, {
      description: `${points} points deducted. Present this to barista at the register.`,
    });
    return true;
  };

  const addReview = (review: Omit<ReviewItem, "id" | "date">) => {
    const newRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: "Just now",
    };
    setReviewsList((prev) => [newRev, ...prev]);
    toast.success("Thank you for your feedback! ⭐", {
      description: "Your review is now live on our community board.",
    });
  };

  const deleteReview = (id: string) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
    toast.info("Review deleted");
  };

  const addReservation = (res: Omit<ReservationItem, "id" | "status">) => {
    const newRes: ReservationItem = {
      ...res,
      id: `res-${Date.now()}`,
      status: "confirmed",
    };
    setReservations((prev) => [newRes, ...prev]);
  };

  const updateReservationStatus = (
    id: string,
    status: "confirmed" | "seated" | "completed" | "cancelled",
  ) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast.success(`Reservation updated to ${status}`);
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    toast.info("Reservation cancelled");
  };

  const updateStoreSettings = (settings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...settings }));
    toast.success("Store settings updated live!");
  };

  const toggleItemSoldOut = (itemId: string) => {
    setSoldOutItemIds((prev) => {
      const exists = prev.includes(itemId);
      if (exists) {
        toast.success(`Item marked back IN STOCK`);
        return prev.filter((id) => id !== itemId);
      } else {
        toast.warning(`Item marked SOLD OUT (86'd)`);
        return [...prev, itemId];
      }
    });
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_notifications");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "notif-init-1",
        title: "KDS Ready for Service",
        message: "Barista station active. Orders will stream here in real time.",
        type: "system",
        recipient: "admin",
        timestamp: "7:00 AM",
        read: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("bloom_notifications", JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const addNotification = (notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: time,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Toast alert according to recipient
    if (notif.type === "order_cancelled") {
      toast.error(`⚠️ ${notif.title}`, {
        description: notif.message,
        duration: 6000,
      });
    } else {
      toast.info(`🔔 ${notif.title}`, {
        description: notif.message,
        duration: 4000,
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("bloom_notifications");
    }
    toast.info("Notifications cleared");
  };

  const unreadAdminCount = notifications.filter(
    (n) => !n.read && (n.recipient === "admin" || n.recipient === "all")
  ).length;

  const unreadCustomerCount = notifications.filter(
    (n) => !n.read && (n.recipient === "customer" || n.recipient === "all")
  ).length;

  const resetAllAppData = () => {
    setFavorites(["classic-latte", "berry-pancakes"]);
    setLoyaltyPoints(145);
    setReviewsList(
      initialReviews.map((r, idx) => ({
        id: `rev-${idx + 1}`,
        author: r.author,
        role: r.role,
        rating: r.rating,
        text: r.text,
        favoriteDish: idx === 0 ? "Berry Pancakes Stack" : idx === 1 ? "Melbourne Flat White" : "Avocado Toast",
        date: r.date,
      }))
    );
    setReservations([
      {
        id: "res-1",
        name: "Marcus Evans",
        phone: "(03) 9876 5432",
        guests: "4",
        date: new Date().toISOString().split("T")[0],
        time: "1:00 PM",
        seating: "Sunlit Window Table",
        specialRequest: "Window booth preferred for birthday brunch",
        status: "confirmed",
      },
      {
        id: "res-2",
        name: "Sarah Jenkins",
        phone: "(03) 9123 8899",
        guests: "2",
        date: new Date().toISOString().split("T")[0],
        time: "1:30 PM",
        seating: "Botanical Garden Bar",
        specialRequest: "High stools near the espresso bar",
        status: "confirmed",
      },
      {
        id: "res-3",
        name: "David Kim",
        phone: "(03) 9345 6789",
        guests: "6",
        date: new Date().toISOString().split("T")[0],
        time: "2:00 PM",
        seating: "Indoor Cozy Arch",
        status: "seated",
      },
    ]);
    setSoldOutItemIds([]);
    setStoreSettings({
      isOpen: true,
      closingTime: "9:00 PM",
      waitTime: "5-8 mins",
      announcement: "Freshly roasted single-origin Ethiopian batch brew on tap today!",
    });
    setNotifications([]);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("bloom_cart");
        localStorage.removeItem("bloom_active_order");
        localStorage.removeItem("bloom_favorites");
        localStorage.removeItem("bloom_loyalty_points");
        localStorage.removeItem("bloom_reviews");
        localStorage.removeItem("bloom_reservations");
        localStorage.removeItem("bloom_sold_out");
        localStorage.removeItem("bloom_store_settings");
        localStorage.removeItem("bloom_inventory");
        localStorage.removeItem("bloom_floor_plan");
        localStorage.removeItem("bloom_staff_roster");
        localStorage.removeItem("bloom_duty_checklist");
        localStorage.removeItem("bloom_notifications");
      } catch {}
    }

    toast.success("🧹 All demo data and records successfully cleared!");
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loyaltyPoints,
        redeemPoints,
        reviewsList,
        addReview,
        deleteReview,
        reservations,
        addReservation,
        updateReservationStatus,
        cancelReservation,
        storeSettings,
        updateStoreSettings,
        soldOutItemIds,
        toggleItemSoldOut,
        resetAllAppData,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        unreadAdminCount,
        unreadCustomerCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
