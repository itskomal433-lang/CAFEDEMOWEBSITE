import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Coffee,
  CreditCard,
  Banknote,
  Gift,
  FileText,
  Printer,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cafe } from "@/data/cafe";

export function AdminAnalytics() {
  const [isZReportOpen, setIsZReportOpen] = useState(false);

  const hourlyData = [
    { hour: "7:00 AM", amount: 140, percentage: 30, orders: 14 },
    { hour: "8:30 AM", amount: 480, percentage: 95, orders: 42 },
    { hour: "10:30 AM", amount: 310, percentage: 65, orders: 28 },
    { hour: "12:30 PM", amount: 520, percentage: 100, orders: 36 },
    { hour: "2:30 PM", amount: 240, percentage: 48, orders: 22 },
    { hour: "4:30 PM", amount: 152, percentage: 32, orders: 12 },
  ];

  const topItems = [
    { rank: 1, name: "Melbourne Flat White", category: "Coffee", qty: 48, revenue: 254.4 },
    { rank: 2, name: "Twice-Baked Almond Croissant", category: "Bakery", qty: 32, revenue: 156.8 },
    { rank: 3, name: "Berry Pancakes Stack", category: "Brunch", qty: 22, revenue: 195.8 },
    { rank: 4, name: "Iced Ceremonial Matcha Latte", category: "Tea", qty: 19, revenue: 110.2 },
    { rank: 5, name: "Smashed Avocado Toast", category: "Brunch", qty: 16, revenue: 142.4 },
  ];

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
            Financial Analytics & Daily Register Closeout
          </h2>
          <p className="text-xs text-[#6D6964]">
            Live revenue breakdown, payment reconciliation, hourly peak charts, and cashier Z-Reports.
          </p>
        </div>

        <Button
          onClick={() => setIsZReportOpen(true)}
          className="rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <FileText className="h-4 w-4 text-[#D07A60]" />
          <span>Generate Daily Z-Report</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Gross Sales</span>
          <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">$1,842.50</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.4% vs last week</span>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Net Sales (Ex GST)</span>
          <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">$1,675.00</div>
          <span className="text-[10px] text-[#6D6964]">GST Tax (10%): $167.50</span>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Tips Collected</span>
          <div className="font-sans text-2xl font-extrabold text-[#D07A60] mt-0.5 tracking-tight">$98.40</div>
          <span className="text-[10px] text-[#6D6964]">Distributed to baristas</span>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D6964]">Avg Order Ticket</span>
          <div className="font-sans text-2xl font-extrabold text-[#2C3E2E] mt-0.5 tracking-tight">$15.22</div>
          <span className="text-[10px] text-emerald-600 font-semibold">121 Total Orders</span>
        </div>
      </div>

      {/* Hourly Sales Distribution & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Volume Bar Chart */}
        <div className="lg:col-span-8 rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                Hourly Revenue & Peak Traffic
              </h3>
              <p className="text-xs text-[#6D6964]">
                Shows morning coffee commute peak and midday brunch rushes.
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-[#D07A60]" />
          </div>

          <div className="space-y-3 pt-2">
            {hourlyData.map((h, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#2C3E2E] w-20">{h.hour}</span>
                  <span className="text-[#6D6964]">{h.orders} orders</span>
                  <span className="font-mono font-bold text-[#2C3E2E] w-20 text-right">
                    ${h.amount.toFixed(2)}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#FAF6EE] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7D9987] to-[#2C3E2E] transition-all duration-500"
                    style={{ width: `${h.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Tender Breakdown */}
        <div className="lg:col-span-4 rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#2C3E2E] border-b border-gray-100 pb-3">
              Payment Breakdown
            </h3>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C3E2E]">
                  <CreditCard className="h-4 w-4 text-[#2C3E2E]" />
                  <span>EFTPOS / Card (68%)</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#2C3E2E]">$1,252.90</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C3E2E]">
                  <Banknote className="h-4 w-4 text-emerald-600" />
                  <span>Cash Tendered (22%)</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#2C3E2E]">$405.35</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-bold text-[#2C3E2E]">
                  <Gift className="h-4 w-4 text-[#D07A60]" />
                  <span>Gift Cards / Vouchers (10%)</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#2C3E2E]">$184.25</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FAF6EE] p-4 border border-[#E8DFD3] text-xs space-y-1">
            <span className="font-bold text-[#2C3E2E] block">Cash Drawer Balance:</span>
            <div className="flex justify-between font-mono">
              <span className="text-[#6D6964]">Opening Float:</span>
              <span>$200.00</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#6D6964]">Cash Sales:</span>
              <span>+$405.35</span>
            </div>
            <div className="flex justify-between font-mono font-bold text-[#2C3E2E] border-t border-[#E8DFD3] pt-1">
              <span>Expected Cash in Drawer:</span>
              <span>$605.35</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Best-Selling Products Ranking */}
      <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-xs space-y-4">
        <h3 className="font-display text-base font-bold text-[#2C3E2E]">
          Top Selling Menu Items Today
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A4642] border-collapse">
            <thead>
              <tr className="border-b border-[#E8DFD3] text-[#2C3E2E] font-bold">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-4">Item Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Volume Sold</th>
                <th className="py-2.5 px-4 text-right">Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE0]">
              {topItems.map((item) => (
                <tr key={item.rank} className="hover:bg-[#FAF6EE]">
                  <td className="py-3 px-3 font-bold text-[#D07A60]">#{item.rank}</td>
                  <td className="py-3 px-4 font-bold text-[#2C3E2E]">{item.name}</td>
                  <td className="py-3 px-4 text-[#6D6964]">{item.category}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{item.qty} units</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#2C3E2E]">
                    ${item.revenue.toFixed(2)} AUD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Z-Report Cashier Closeout Modal */}
      {isZReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="border-t-4 border-b-4 border-dashed border-[#E8DFD3] py-4 font-mono text-xs text-[#253328] space-y-3">
              <div className="text-center space-y-0.5">
                <div className="font-bold text-sm text-[#2C3E2E]">BLOOM CAFÉ MELBOURNE</div>
                <div className="text-[10px] text-gray-500">ABN: 48 192 847 102</div>
                <div className="text-[11px] font-bold py-1 border-t border-b border-gray-200 my-2">
                  *** DAILY Z-REPORT (REGISTER CLOSEOUT) ***
                </div>
              </div>

              <div className="text-[11px] space-y-0.5">
                <div><strong>Report Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Closed At:</strong> {new Date().toLocaleTimeString()}</div>
                <div><strong>Manager:</strong> Lead Barista (PIN #1234)</div>
              </div>

              <div className="border-t border-gray-200 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Gross Sales:</span>
                  <span className="font-bold">$1,842.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounts Given:</span>
                  <span>-$38.20</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Sales (Ex Tax):</span>
                  <span>$1,675.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total GST (10%):</span>
                  <span>$167.50</span>
                </div>
                <div className="flex justify-between text-[#D07A60]">
                  <span>Total Tips:</span>
                  <span>+$98.40</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 space-y-1">
                <div className="font-bold text-[10px] uppercase">Payment Summary:</div>
                <div className="flex justify-between">
                  <span>EFTPOS / Card:</span>
                  <span>$1,252.90</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span>$405.35</span>
                </div>
                <div className="flex justify-between">
                  <span>Vouchers:</span>
                  <span>$184.25</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 space-y-1">
                <div className="font-bold text-[10px] uppercase">Cash Drawer Count:</div>
                <div className="flex justify-between">
                  <span>Opening Float:</span>
                  <span>$200.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash Inflow:</span>
                  <span>+$405.35</span>
                </div>
                <div className="flex justify-between font-bold border-t border-black pt-1">
                  <span>Drawer Balance:</span>
                  <span>$605.35 AUD</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-gray-500">
                End of Shift Reconciliation Complete ✓
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePrintZReport}
                className="flex-1 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Z-Report</span>
              </Button>
              <Button
                onClick={() => setIsZReportOpen(false)}
                variant="outline"
                className="rounded-full text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
