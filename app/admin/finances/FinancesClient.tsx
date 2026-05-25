"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Plus,
  Scale,
  AlertTriangle,
  FolderOpen,
  PieChart,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FinancialTransaction } from "@prisma/client";
import { createTransaction } from "@/app/actions/finances";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface FinancesClientProps {
  initialTransactions: FinancialTransaction[];
}

export default function FinancesClient({ initialTransactions }: FinancesClientProps) {
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  // Form states
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [category, setCategory] = useState("SPONSORSHIPS");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  // Break-even calculator states
  const [ticketPrice, setTicketPrice] = useState(85); // 85 TND
  const [fixedCosts, setFixedCosts] = useState(3800); // 3800 TND (venue deposit, marketing, media)
  const [variableCosts, setVariableCosts] = useState(35); // 35 TND per EP (food, credentials, bag)

  const { execute, status: actionStatus } = useAction(createTransaction, {
    onSuccess: () => {
      toast.success("Transaction booked successfully.");
      setAmount("");
      setDesc("");
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to book transaction"),
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    execute({ type: type as any, category: category as any, amount: parseFloat(amount), description: desc });
  };

  const totalIncome = initialTransactions.filter(t => t.type === "INCOME").reduce((acc, c) => acc + c.amount, 0);
  const totalExpense = initialTransactions.filter(t => t.type === "EXPENSE").reduce((acc, c) => acc + c.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const breakEvenEps = Math.ceil(fixedCosts / (ticketPrice - variableCosts));

  const filteredLedger = initialTransactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

  const chartData = useMemo(() => {
    const grouped = initialTransactions.reduce((acc: any, curr) => {
      const date = new Date(curr.date).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
      if (curr.type === "INCOME") acc[date].income += curr.amount;
      if (curr.type === "EXPENSE") acc[date].expense += curr.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [initialTransactions]);

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Finance
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Conference Finance Hub
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time cash flow ledgers, budgets, and automated break-even algorithms.
          </p>
        </div>
      </div>

      {/* CORE FINANCIALS SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Total Inflows (Actual)
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-teal tracking-tight">
              {totalIncome.toLocaleString()} TND
            </h3>
          </div>
          <div className="p-3.5 bg-accent-teal/10 rounded-xl border border-accent-teal/20 text-accent-teal">
            <TrendingUp size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Total Outflows (Booked)
            </span>
            <h3 className="text-2xl font-bold font-mono text-red-400 tracking-tight">
              {totalExpense.toLocaleString()} TND
            </h3>
          </div>
          <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
            <TrendingDown size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Net Reserves Surplus
            </span>
            <h3 className={`text-2xl font-bold font-mono tracking-tight ${netProfit >= 0 ? "text-accent-purple" : "text-red-400"}`}>
              {netProfit.toLocaleString()} TND
            </h3>
          </div>
          <div className="p-3.5 bg-accent-purple/10 rounded-xl border border-accent-purple/20 text-accent-purple">
            <DollarSign size={20} />
          </div>
        </Card>
      </div>

      {/* LEDGER & ADD TRANSACTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ADD TRANSACTION FORM */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 h-fit space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Book Transaction</h3>
            <p className="text-xs text-text-muted">Manually log revenue or expense entries.</p>
          </div>

          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-2 bg-surface-2/65 p-1 border border-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => { setType("INCOME"); setCategory("SPONSORSHIPS"); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${type === "INCOME" ? "bg-gradient-cta text-white" : "text-text-secondary"}`}
              >
                Inflow (Income)
              </button>
              <button
                type="button"
                onClick={() => { setType("EXPENSE"); setCategory("VENUE"); }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${type === "EXPENSE" ? "bg-red-500/80 text-white" : "text-text-secondary"}`}
              >
                Outflow (Expense)
              </button>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Category</label>
                {type === "INCOME" ? (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                  >
                    <option value="SPONSORSHIPS">Sponsorships</option>
                    <option value="REGISTRATIONS">EP Registrations</option>
                    <option value="MERCHANDISE">Merchandise</option>
                    <option value="EXTERNAL_SUPPORT">External Support</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                  >
                    <option value="VENUE">Venue rent</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="ACCOMMODATION">Accommodation</option>
                    <option value="MEALS">Catering / Meals</option>
                    <option value="MATERIALS">Print & Materials</option>
                    <option value="MARKETING">Marketing / Ads</option>
                    <option value="OTHER">Other</option>
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Amount (TND)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary font-medium">Description</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Printer cartridges and flipcharts"
                className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <Button type="submit" disabled={actionStatus === "executing"} className="w-full justify-center gap-2 h-10 mt-2">
              <Plus size={16} />
              {actionStatus === "executing" ? "Booking..." : "Commit Transaction"}
            </Button>
          </form>
        </Card>

        {/* LEDGER DETAILS TABLE */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display font-semibold text-text-primary text-base">Account Ledger</h3>
              <p className="text-xs text-text-muted">Chronological transactional details.</p>
            </div>

            {/* Filter segments */}
            <div className="flex items-center bg-surface-2 p-1 border border-white/5 rounded-lg text-xs">
              {["ALL", "INCOME", "EXPENSE"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1 font-semibold rounded-md transition ${filter === f ? "bg-white/10 text-white" : "text-text-secondary hover:text-text-primary"}`}
                >
                  {f === "ALL" ? "All" : f === "INCOME" ? "Inflows" : "Outflows"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface-2/40 text-text-muted font-semibold">
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 font-mono">Amount</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLedger.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-text-muted text-xs">
                      No transactions found.
                    </td>
                  </tr>
                )}
                {filteredLedger.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition">
                    <td className="p-3">
                      <Badge variant={t.type === "INCOME" ? "teal" : "pink"} className="uppercase text-4xs font-bold tracking-widest border border-white/5">
                        {t.category}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium text-text-primary leading-normal">{t.description}</td>
                    <td className={`p-3 font-mono font-semibold ${t.type === "INCOME" ? "text-accent-teal" : "text-red-400"}`}>
                      {t.type === "INCOME" ? "+" : "-"}{t.amount.toLocaleString()} TND
                    </td>
                    <td className="p-3 text-right font-mono text-text-muted">{new Date(t.date).toISOString().split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* FINANCIAL TRENDS CHART */}
      {chartData.length > 0 && (
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
          <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Income vs Expense Trends</span>
          <div className="h-64 w-full bg-surface-3/15 rounded-2xl border border-white/5 p-4 overflow-hidden relative text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070814', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#14b8a6" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* AUTOMATED BREAK-EVEN ALGORITHMIC CALCULATOR */}
      <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Scale className="text-accent-purple" size={22} />
          <div>
            <h3 className="font-display font-semibold text-base text-text-primary">
              Interactive Break-Even Risk Calculator
            </h3>
            <p className="text-xs text-text-muted">Simulate delegate pricing models and variable thresholds.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Controls Sliders */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">EP Delegate Ticket Price</span>
                <span className="font-bold text-accent-purple font-mono">{ticketPrice} TND</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-purple"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Total Fixed Operations Costs</span>
                <span className="font-bold text-accent-pink font-mono">{fixedCosts} TND</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="200"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-pink"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Variable Cost per Delegate (Food/Bags)</span>
                <span className="font-bold text-accent-teal font-mono">{variableCosts} TND</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={variableCosts}
                onChange={(e) => setVariableCosts(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-teal"
              />
            </div>
          </div>

          {/* Calculator Results Display */}
          <div className="bg-surface-2/45 p-6 border border-white/5 rounded-2xl flex flex-col justify-center items-center text-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block">
                Required Break-Even EP Signups
              </span>
              <h2 className="text-4xl font-black font-display text-accent-teal mt-2">
                {breakEvenEps}
              </h2>
              <span className="text-[10px] text-text-secondary block mt-1">Delegates</span>
            </div>

            {breakEvenEps > 150 ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-3xs">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Risk: Break-even target exceeds venue max capacity (150).</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-3xs">
                <Scale size={14} className="shrink-0" />
                <span>Stable: Under maximum occupancy caps. Safety secured.</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
