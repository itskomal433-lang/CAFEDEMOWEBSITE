import React, { createContext, useContext, useState } from "react";
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
import { Calendar as CalendarIcon, Users, Clock, Sparkles, CheckCircle2, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

interface BookTableContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const BookTableContext = createContext<BookTableContextType | undefined>(undefined);

export function BookTableProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <BookTableContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <BookTableModal />
    </BookTableContext.Provider>
  );
}

export function useBookTable() {
  const context = useContext(BookTableContext);
  if (!context) {
    throw new Error("useBookTable must be used within a BookTableProvider");
  }
  return context;
}

export function BookTableModal() {
  const { isOpen, closeModal } = useBookTable();
  const { reservations, addReservation, cancelReservation } = useApp();

  const [tab, setTab] = useState<"book" | "my-bookings">("book");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("10:30 AM");
  const [seating, setSeating] = useState("Indoor Cozy Arch");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "10:30 AM",
    "11:30 AM",
    "12:30 PM",
    "1:30 PM",
    "3:00 PM",
    "5:00 PM",
    "6:30 PM",
    "7:30 PM",
  ];

  const seatingOptions = [
    { id: "Indoor Cozy Arch", label: "Indoor Cozy Arch", desc: "Warm booth under the floral arches" },
    { id: "Sunlit Window Table", label: "Sunlit Window Table", desc: "Bright street view with morning sun" },
    { id: "Botanical Garden Bar", label: "Botanical Garden Bar", desc: "Barista front row experience" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addReservation({
        name,
        phone,
        email,
        guests,
        date,
        time,
        seating,
        specialRequest,
      });
      toast.success("Table reserved successfully!", {
        description: `We look forward to seeing you at Bloom Café on ${date} at ${time}.`,
      });
    }, 600);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setPhone("");
    setSpecialRequest("");
    setTab("book");
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : handleReset())}>
      <DialogContent className="max-w-lg overflow-hidden rounded-[2rem] border-border bg-[#FAF6EE] p-0 shadow-2xl">
        {/* Decorative Top Accent */}
        <div className="bg-[#2C3E2E] px-8 py-6 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-[#E4ECE6] backdrop-blur-sm mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#D07A60]" />
            Bloom Café Sanctuary
          </div>
          <DialogTitle className="font-display text-2xl sm:text-3xl text-white font-semibold">
            Reserve Your Table
          </DialogTitle>
          <DialogDescription className="text-[#E4ECE6]/80 text-xs sm:text-sm mt-1">
            Enjoy handcrafted coffee & wholesome brunch in our cozy atmosphere.
          </DialogDescription>

          {/* Tab switcher */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setTab("book")}
              className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase transition-all ${
                tab === "book"
                  ? "bg-[#FAF6EE] text-[#2C3E2E]"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              New Booking
            </button>
            <button
              onClick={() => setTab("my-bookings")}
              className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wider uppercase transition-all ${
                tab === "my-bookings"
                  ? "bg-[#FAF6EE] text-[#2C3E2E]"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              My Bookings ({reservations.length})
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {tab === "my-bookings" ? (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CalendarIcon className="h-10 w-10 text-[#8EA696] mx-auto opacity-60" />
                  <h4 className="font-display text-lg font-bold text-[#2C3E2E]">No Active Reservations</h4>
                  <p className="text-xs text-[#6D6964]">You have not booked any tables yet.</p>
                  <Button
                    onClick={() => setTab("book")}
                    className="rounded-full bg-[#2C3E2E] text-white text-xs mt-2"
                  >
                    Make a Reservation
                  </Button>
                </div>
              ) : (
                reservations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between rounded-2xl border border-[#E8DFD3] bg-white p-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-[#2C3E2E]">
                          {r.date} at {r.time}
                        </span>
                        <span className="rounded-full bg-[#E4ECE6] px-2 py-0.5 text-[10px] font-bold text-[#2C3E2E]">
                          {r.guests} Guests
                        </span>
                      </div>
                      <p className="text-xs text-[#6D6964]">
                        {r.seating} • Reserved under {r.name} ({r.phone})
                      </p>
                      {r.specialRequest && (
                        <p className="text-[11px] text-[#A67C52] italic">
                          Note: "{r.specialRequest}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => cancelReservation(r.id)}
                      className="text-[#9E9B95] hover:text-[#D07A60] transition-colors p-1"
                      title="Cancel reservation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E4ECE6] text-[#2C3E2E]">
                <CheckCircle2 className="h-8 w-8 text-[#2C3E2E]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2C3E2E]">Reservation Confirmed!</h3>
              <p className="text-sm text-[#6D6964] max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-[#2C3E2E]">{name}</span>! We've reserved a table for{" "}
                <span className="font-semibold text-[#2C3E2E]">{guests} guests</span> on{" "}
                <span className="font-semibold text-[#2C3E2E]">{date}</span> at{" "}
                <span className="font-semibold text-[#2C3E2E]">{time}</span> ({seating}).
              </p>
              <div className="pt-4">
                <Button
                  onClick={handleReset}
                  className="rounded-full bg-[#2C3E2E] text-[#FAF6EE] hover:bg-[#233225] px-8 cursor-pointer"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Party Size & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wider text-[#6D6964] flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#D07A60]" /> Party Size
                  </Label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3 py-2.5 text-sm text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8+">8+ Large Party</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wider text-[#6D6964] flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-[#D07A60]" /> Date
                  </Label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-[#E8DFD3] bg-white px-3 py-2 text-sm text-[#253328] focus:border-[#2C3E2E] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-[#6D6964] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#D07A60]" /> Select Time
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-lg py-1.5 text-xs font-medium transition-all ${
                        time === slot
                          ? "bg-[#2C3E2E] text-white shadow-sm"
                          : "bg-white border border-[#E8DFD3] text-[#253328] hover:bg-[#F3EDE2]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating preference */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-wider text-[#6D6964]">
                  Seating Area
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {seatingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setSeating(opt.id)}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-left cursor-pointer transition-all ${
                        seating === opt.id
                          ? "border-[#2C3E2E] bg-[#E4ECE6]/50 shadow-xs"
                          : "border-[#E8DFD3] bg-white hover:bg-[#F3EDE2]/60"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#253328]">{opt.label}</div>
                        <div className="text-[11px] text-[#6D6964]">{opt.desc}</div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          seating === opt.id ? "border-[#2C3E2E] bg-[#2C3E2E]" : "border-[#C8BFB3]"
                        }`}
                      >
                        {seating === opt.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-[#6D6964]">Full Name *</Label>
                    <Input
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-xl border-[#E8DFD3] bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#6D6964]">Phone Number *</Label>
                    <Input
                      placeholder="(03) 9123 4567"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="rounded-xl border-[#E8DFD3] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-[#6D6964]">Email (Optional for confirmation)</Label>
                  <Input
                    placeholder="jane@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-[#E8DFD3] bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs text-[#6D6964]">Special Occasion or Dietary Note (Optional)</Label>
                  <Input
                    placeholder="Birthday, anniversary, high chair needed, etc."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="rounded-xl border-[#E8DFD3] bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#202E22] text-[#FAF6EE] py-3 text-sm font-medium tracking-wide shadow-md transition-transform active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? "Confirming Reservation..." : "Confirm Reservation"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
