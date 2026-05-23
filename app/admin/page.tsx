"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Award,
  DollarSign,
  TrendingUp,
  Clock,
  Volume2,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Percent,
  CheckSquare,
  ShieldCheck,
  Target,
  Handshake,
  Truck,
  Utensils,
  Camera,
  Star,
  Lock,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [role, setRole] = useState("OCP");
  const [currentTime, setCurrentTime] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString() + " | " + d.toLocaleDateString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const syncRole = () => {
      setRole(localStorage.getItem("admin_role") || "OCP");
    };
    syncRole();
    window.addEventListener("admin_role_changed", syncRole);

    import("@/app/actions/dashboard").then((module) => {
      module.getDashboardStats().then((res: any) => {
        if (res?.data) setStats(res.data);
      });
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("admin_role_changed", syncRole);
    };
  }, []);

  // ─── RENDER DASHBOARD BASED ON ROLE ─────────────────────────
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Command Center
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-white uppercase font-black">
            {role.replace("_", " ")} Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Tactical AIESEC operations and real-time department statistics.
          </p>
        </div>

        <div className="glass-card bg-surface-2/40 px-4 py-2 border border-white/10 rounded-xl text-right">
          <span className="text-[10px] text-text-muted uppercase block font-semibold tracking-widest">
            Live Ops Ticker
          </span>
          <span className="font-mono text-xs text-text-primary mt-0.5 block">
            {currentTime || "Loading..."}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ────────────────── 1. OCP GLOBAL COMMAND ────────────────── */}
        {(role === "OCP") && (
          <motion.div
            key="ocp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Global Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Registrations", value: stats?.ocp?.totalRegistrations ?? "...", icon: Users, color: "text-accent-purple", bg: "bg-accent-purple/10", trend: "Live updates" },
                { label: "Confirmed Delegates", value: stats?.ocp?.confirmedDelegates ?? "...", icon: ShieldCheck, color: "text-accent-teal", bg: "bg-accent-teal/10", trend: "Approved ratio" },
                { label: "Pending Payments", value: stats?.ocp?.pendingPayments ?? "...", icon: Clock, color: "text-accent-amber", bg: "bg-accent-amber/10", trend: "Finance review needed" },
                { label: "Facilitators approved", value: stats?.ocp?.facilitatorsApproved ?? "...", icon: Award, color: "text-accent-pink", bg: "bg-accent-pink/10", trend: `Out of ${stats?.ocp?.totalFacilitators ?? "..."} applicants` },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="glass-card p-6 border border-white/10 bg-surface-1/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">{s.label}</span>
                        <h2 className="text-3xl font-bold font-display text-text-primary tracking-tight">{s.value}</h2>
                      </div>
                      <div className={`p-3 rounded-xl ${s.bg}`}>
                        <Icon className={s.color} size={20} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* OCP Charts & Logs */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 md:col-span-2 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Conference Signups Timeline</span>
                <div className="h-44 w-full bg-surface-3/15 rounded-2xl border border-white/5 p-4 overflow-hidden relative text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { date: 'May 15', signups: 12 },
                      { date: 'May 16', signups: 19 },
                      { date: 'May 17', signups: 25 },
                      { date: 'May 18', signups: 32 },
                      { date: 'May 19', signups: 45 },
                      { date: 'May 20', signups: 60 },
                      { date: 'May 21', signups: 85 },
                      { date: 'May 22', signups: 110 },
                      { date: 'May 23', signups: 142 },
                    ]}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#070814', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#c084fc' }}
                      />
                      <Area type="monotone" dataKey="signups" stroke="#c084fc" fillOpacity={1} fill="url(#colorSignups)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 flex flex-col justify-between space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Operations Log</span>
                <ul className="space-y-3 text-xs text-text-secondary">
                  <li>• EP amine.d@aiesec.net completed registration slip.</li>
                  <li>• Sponsor &apos;BNA Bank&apos; signed custom deliverables block.</li>
                  <li>• Logistics VP Sarra locked Route A transport shuttles.</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ────────────────── 2. DXP DELEGATE EXPERIENCE ────────────────── */}
        {(role === "OCVP_DXP" || role === "OC_DXP_MEMBER") && (
          <motion.div
            key="dxp"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* DXP Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total EPs Registered</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.dxp?.totalEPs ?? "..."} Delegates</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><Users size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Facilitators Approved</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.dxp?.approvedFacilitators ?? "..."} Approved</h3>
                </div>
                <div className="p-3 bg-accent-pink/10 rounded-xl text-accent-pink"><Award size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Survey Satisfactions Avg</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.dxp?.avgSatisfaction ?? "..."} Rating</h3>
                </div>
                <div className="p-3 bg-accent-teal/10 rounded-xl text-accent-teal"><Star size={20} fill="currentColor" /></div>
              </Card>
            </div>

            {/* DXP Vetting checklists */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Facilitator Vetting Pipeline</span>
                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between items-center p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span>Dr. Elena - &quot;Negotiation Across Borders&quot;</span>
                    <Badge variant="teal">Approved</Badge>
                  </li>
                  <li className="flex justify-between items-center p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span>Yassine Jlassi - &quot;Crisis Leadership&quot;</span>
                    <Badge variant="amber">Awaiting Vetting</Badge>
                  </li>
                </ul>
              </Card>

              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">EP Dietary Preferences</span>
                <div className="grid gap-2 grid-cols-2 text-xs">
                  <div className="p-3 bg-surface-2/30 border border-white/5 rounded-xl">
                    <span className="text-text-muted block">Vegetarian EPs</span>
                    <span className="font-bold text-text-primary text-sm font-mono block mt-1">{stats?.dxp?.vegetarianCount ?? "..."} Delegates</span>
                  </div>
                  <div className="p-3 bg-surface-2/30 border border-white/5 rounded-xl">
                    <span className="text-text-muted block">Gluten-Free EPs</span>
                    <span className="font-bold text-text-primary text-sm font-mono block mt-1">{stats?.dxp?.glutenFreeCount ?? "..."} Delegates</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ────────────────── 3. MKT MARKETING ────────────────── */}
        {(role === "OCVP_MKT" || role === "OC_MKT_MEMBER") && (
          <motion.div
            key="mkt"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* MKT Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total Reach metrics</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.mkt?.reach?.toLocaleString() ?? "..."} Views</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><TrendingUp size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Aggregated Clicks</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.mkt?.clicks?.toLocaleString() ?? "..."} Clicks</h3>
                </div>
                <div className="p-3 bg-accent-teal/10 rounded-xl text-accent-teal"><Clock size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Conversions Generated</span>
                  <h3 className="text-2xl font-bold font-display text-text-primary">{stats?.mkt?.conversions?.toLocaleString() ?? "..."} Signups</h3>
                </div>
                <div className="p-3 bg-accent-pink/10 rounded-xl text-accent-pink"><Camera size={20} /></div>
              </Card>
            </div>

            {/* MKT Content Briefs */}
            <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
              <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Social Content conversions</span>
              <ul className="space-y-3 text-xs">
                {stats?.mkt?.topCampaigns?.map((c: any) => (
                  <li key={c.id} className="flex justify-between items-center p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span>{c.title} - {c.platform.replace("_", " ")}</span>
                    <span className="font-mono text-accent-teal font-bold">{c.conversions} conversions</span>
                  </li>
                )) || (
                  <li className="text-text-muted">No campaigns data available.</li>
                )}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* ────────────────── 4. FINANCE HUB ────────────────── */}
        {(role === "OCVP_FINANCE") && (
          <motion.div
            key="finance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Finance Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total Inflows (Actual)</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-teal">{stats?.finance?.inflows?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-teal/10 rounded-xl text-accent-teal"><DollarSign size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total Outflows (Booked)</span>
                  <h3 className="text-2xl font-bold font-mono text-red-400">{stats?.finance?.outflows?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><TrendingDown size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Net Reserves Surplus</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-purple">{stats?.finance?.netReserves?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><TrendingUp size={20} /></div>
              </Card>
            </div>

            {/* Break-even widgets link */}
            <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 flex flex-col justify-between items-center text-center space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Required Break-Even EP Signups</span>
                <h2 className="text-4xl font-black font-display text-accent-teal mt-2">64</h2>
                <span className="text-3xs text-text-secondary mt-1 block">Delegates at 85 TND pricing ticket</span>
              </div>
              <Button href="/admin/finances" size="sm" variant="glass">
                Manage Calculator Sliders
              </Button>
            </Card>
          </motion.div>
        )}

        {/* ────────────────── 5. LOGISTICS & ER ────────────────── */}
        {(role === "OCVP_LOG_ER" || role === "OC_LOG_ER_MEMBER") && (
          <motion.div
            key="logistics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Logistics Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Confirmed Sponsorships</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-teal">{stats?.log_er?.confirmedSponsorships?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-teal/10 rounded-xl text-accent-teal"><Handshake size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Pipeline Target Goal</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-purple">{stats?.log_er?.targetGoal?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><Target size={20} /></div>
              </Card>

              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Logistics Prep Level</span>
                  <h3 className="text-2xl font-bold font-display text-accent-pink">{stats?.log_er?.prepLevel ?? "..."}% ready</h3>
                </div>
                <div className="p-3 bg-accent-pink/10 rounded-xl text-accent-pink"><Truck size={20} /></div>
              </Card>
            </div>

            {/* Shuttles & Rooming */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Transport & Rooming Allocation</span>
                <div className="space-y-3 text-xs text-text-secondary">
                  <div className="flex justify-between items-center">
                    <span>Route A (Tunis Airport - Hotel)</span>
                    <Badge variant="teal">Ready</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Route B (Bizerte Station - Hotel)</span>
                    <Badge variant="teal">Ready</Badge>
                  </div>
                </div>
              </Card>

              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Meal Requirements</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Standard Halal meals</span>
                    <span className="font-bold text-text-primary font-mono">106 daily</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vegetarian meals</span>
                    <span className="font-bold text-text-primary font-mono">22 daily</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
