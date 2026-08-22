import React, { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckSquare,
  Square,
  Sparkles,
  Coffee,
  Plus,
  Send,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  clockedIn: boolean;
  clockInTime?: string;
  hourlyRate: number;
}

interface DutyChecklistItem {
  id: string;
  title: string;
  category: "morning" | "service" | "closing";
  completed: boolean;
  completedBy?: string;
}

const initialStaff: StaffMember[] = [
  { id: "staff-1", name: "Matteo Rossi", role: "Head Barista & Roaster", shift: "6:30 AM – 2:30 PM", clockedIn: true, clockInTime: "6:28 AM", hourlyRate: 32.5 },
  { id: "staff-2", name: "Chloe Chen", role: "Specialty Barista & Milk Lead", shift: "7:00 AM – 3:00 PM", clockedIn: true, clockInTime: "6:55 AM", hourlyRate: 28.0 },
  { id: "staff-3", name: "Clara Dubois", role: "Executive Pastry Chef", shift: "5:30 AM – 1:30 PM", clockedIn: true, clockInTime: "5:25 AM", hourlyRate: 34.0 },
  { id: "staff-4", name: "Lucas Wright", role: "Front of House & Host", shift: "7:30 AM – 3:30 PM", clockedIn: false, hourlyRate: 26.5 },
  { id: "staff-5", name: "Sophia Martinez", role: "Evening Supervisor", shift: "1:00 PM – 9:30 PM", clockedIn: false, hourlyRate: 30.0 },
];

const initialChecklist: DutyChecklistItem[] = [
  { id: "duty-1", title: "Dial-in House Espresso (18g in ➔ 36g out in 27-29s)", category: "morning", completed: true, completedBy: "Matteo" },
  { id: "duty-2", title: "Calibrate steam wand temps (60-65°C)", category: "morning", completed: true, completedBy: "Chloe" },
  { id: "duty-3", title: "Inspect pastry case & place allergen tags", category: "morning", completed: true, completedBy: "Clara" },
  { id: "duty-4", title: "Wipe down & sanitize botanical patio tables", category: "service", completed: true, completedBy: "Lucas" },
  { id: "duty-5", title: "Restock oat milk & single origin bean hoppers", category: "service", completed: false },
  { id: "duty-6", title: "Clean grinder chutes & purge steam wands", category: "closing", completed: false },
  { id: "duty-7", title: "Perform chemical backflush on La Marzocco groupheads", category: "closing", completed: false },
];

export function AdminStaffRoster() {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_staff_roster");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialStaff;
  });

  const [checklist, setChecklist] = useState<DutyChecklistItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bloom_duty_checklist");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialChecklist;
  });

  const [handoverNote, setHandoverNote] = useState("");
  const [notesList, setNotesList] = useState<string[]>([
    "Morning rush peak was 8:45 AM. Oat milk demand is high today; Clara baked an extra batch of Almond Croissants at 10 AM.",
    "VIP guest table reserved for 1:30 PM on the Botanical Patio (Table #11).",
  ]);

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaffList(newStaff);
    if (typeof window !== "undefined") {
      localStorage.setItem("bloom_staff_roster", JSON.stringify(newStaff));
    }
  };

  const saveChecklist = (newChecklist: DutyChecklistItem[]) => {
    setChecklist(newChecklist);
    if (typeof window !== "undefined") {
      localStorage.setItem("bloom_duty_checklist", JSON.stringify(newChecklist));
    }
  };

  const toggleClockIn = (staffId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const updated = staffList.map((s) => {
      if (s.id === staffId) {
        const newStatus = !s.clockedIn;
        toast.success(
          newStatus
            ? `${s.name} clocked IN at ${now} ⏱️`
            : `${s.name} clocked OUT at ${now} 👋`
        );
        return {
          ...s,
          clockedIn: newStatus,
          clockInTime: newStatus ? now : undefined,
        };
      }
      return s;
    });
    saveStaff(updated);
  };

  const toggleDuty = (dutyId: string) => {
    const updated = checklist.map((d) => {
      if (d.id === dutyId) {
        const newCompleted = !d.completed;
        return {
          ...d,
          completed: newCompleted,
          completedBy: newCompleted ? "Barista on Duty" : undefined,
        };
      }
      return d;
    });
    saveChecklist(updated);
    toast.success("Duty checklist updated!");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverNote.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setNotesList((prev) => [`[${time}] ${handoverNote.trim()}`, ...prev]);
    setHandoverNote("");
    toast.success("Handover note posted for next shift!");
  };

  const activeStaffCount = staffList.filter((s) => s.clockedIn).length;
  const completedDutiesCount = checklist.filter((d) => d.completed).length;

  return (
    <div className="space-y-6">
      {/* Header & Metric Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
            Staff Shifts, Attendance & Barista Duties
          </h2>
          <p className="text-xs text-[#6D6964]">
            Manage clock-ins, daily machine maintenance protocols, and shift handover notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            🟢 {activeStaffCount} Staff Clocked In Now
          </span>
          <span className="rounded-full bg-[#FAF6EE] border border-[#E8DFD3] px-3 py-1 text-xs font-bold text-[#2C3E2E]">
            ✅ {completedDutiesCount}/{checklist.length} Duties Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Staff Roster & Clock-In */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#2C3E2E] flex items-center justify-between">
              <span>Today's Active Shift Roster</span>
              <span className="text-xs text-[#6D6964] font-normal">
                {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}
              </span>
            </h3>

            <div className="divide-y divide-gray-100">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF6EE]/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold text-xs ${
                        staff.clockedIn
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-bold text-[#2C3E2E]">
                          {staff.name}
                        </span>
                        {staff.clockedIn && (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.2 text-[9px] font-bold">
                            On Shift ({staff.clockInTime})
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#6D6964] block">
                        {staff.role} • Shift: {staff.shift}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleClockIn(staff.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        staff.clockedIn
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          : "bg-[#2C3E2E] text-white hover:bg-[#1E2B20]"
                      }`}
                    >
                      {staff.clockedIn ? "Clock Out" : "Clock In"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Handover Communication Board */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#2C3E2E]">
              Shift Handover & Manager Notes
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                placeholder="Type shift update or barista note..."
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                className="bg-[#FAF6EE] text-xs border-[#E8DFD3]"
              />
              <Button
                type="submit"
                className="rounded-xl bg-[#2C3E2E] hover:bg-[#1E2B20] text-white px-4 text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </Button>
            </form>

            <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
              {notesList.map((note, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#FAF6EE] p-3 text-xs text-[#4A4642] border border-[#E8DFD3]/80 leading-relaxed"
                >
                  📝 {note}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Barista Quality & Maintenance Checklist */}
        <div className="lg:col-span-5 rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                Daily Coffee & Machine Protocol
              </h3>
              <p className="text-[11px] text-[#6D6964]">
                Quality standards for dial-in, milk steaming & hygiene.
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto no-scrollbar pr-0.5">
            {["morning", "service", "closing"].map((cat) => {
              const catItems = checklist.filter((c) => c.category === cat);
              const catTitle =
                cat === "morning"
                  ? "🌅 Morning Opening Dial-In"
                  : cat === "service"
                  ? "☀️ Midday Service Checks"
                  : "🌙 End of Day Closing Chemical Clean";

              return (
                <div key={cat} className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964] block">
                    {catTitle}
                  </span>

                  <div className="space-y-1.5">
                    {catItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleDuty(item.id)}
                        className={`w-full flex items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors border cursor-pointer ${
                          item.completed
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                            : "bg-[#FAF6EE]/70 border-[#E8DFD3] text-[#2C3E2E] hover:bg-[#FAF6EE]"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.completed ? (
                            <CheckSquare className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </div>

                        <div className="text-xs">
                          <span
                            className={
                              item.completed ? "line-through opacity-80 font-medium" : "font-bold"
                            }
                          >
                            {item.title}
                          </span>
                          {item.completedBy && (
                            <span className="block text-[10px] text-emerald-700">
                              ✓ Verified by {item.completedBy}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
