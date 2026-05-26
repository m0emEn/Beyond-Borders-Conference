"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Award, DollarSign, TrendingUp, Clock, Camera,
  TrendingDown, ShieldCheck, Target, Handshake, Truck, Star,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type DashboardStats } from "@/app/actions/dashboard";

type Props = {
  role: string;
  stats: DashboardStats | null;
};

export default function DashboardClient({ role, stats }: Props) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString() + " | " + d.toLocaleDateString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">Command Center</Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-white uppercase font-black">
            {role.replace(/_/g, " ")} Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Tactical AIESEC operations and real-time department statistics.
          </p>
        </div>
        <div className="glass-card bg-surface-2/40 px-4 py-2 border border-white/10 rounded-xl text-right">
          <span className="text-[10px] text-text-muted uppercase block font-semibold tracking-widest">Live Ops Ticker</span>
          <span className="font-mono text-xs text-text-primary mt-0.5 block">{currentTime || "Loading..."}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── 1. OCP ── */}
        {role === "OCP" && (
          <motion.div key="ocp" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total Registrations", value: stats?.ocp?.totalRegistrations ?? "...", icon: Users, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                { label: "Confirmed Delegates", value: stats?.ocp?.confirmedDelegates ?? "...", icon: ShieldCheck, color: "text-accent-teal", bg: "bg-accent-teal/10" },
                { label: "Pending Payments", value: stats?.ocp?.pendingPayments ?? "...", icon: Clock, color: "text-accent-amber", bg: "bg-accent-amber/10" },
                { label: "Facilitators Approved", value: stats?.ocp?.facilitatorsApproved ?? "...", icon: Award, color: "text-accent-pink", bg: "bg-accent-pink/10" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="glass-card p-6 border border-white/10 bg-surface-1/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">{s.label}</span>
                        <h2 className="text-3xl font-bold font-display text-text-primary tracking-tight">{s.value}</h2>
                      </div>
                      <div className={`p-3 rounded-xl ${s.bg}`}><Icon className={s.color} size={20} /></div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 md:col-span-2 space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Conference Signups Timeline</span>
                <div className="h-44 w-full bg-surface-3/15 rounded-2xl border border-white/5 p-4 overflow-hidden text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.ocp?.signupsTimeline?.length ? stats.ocp.signupsTimeline : [{ date: "No data", signups: 0 }]}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#070814", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} itemStyle={{ color: "#c084fc" }} />
                      <Area type="monotone" dataKey="signups" stroke="#c084fc" fillOpacity={1} fill="url(#colorSignups)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 flex flex-col justify-between space-y-4">
                <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Operations Log</span>
                <ul className="space-y-3 text-xs text-text-secondary">
                  <li>• Registrations: {stats?.ocp?.totalRegistrations ?? 0} total, {stats?.ocp?.confirmedDelegates ?? 0} confirmed.</li>
                  <li>• Payments pending review: {stats?.ocp?.pendingPayments ?? 0}.</li>
                  <li>• Facilitator pool: {stats?.ocp?.facilitatorsApproved ?? 0} / {stats?.ocp?.totalFacilitators ?? 0} approved.</li>
                </ul>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ── 2. DXP ── */}
        {(role === "OCVP_DXP" || role === "OC_DXP_MEMBER") && (
          <motion.div key="dxp" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total EPs Registered", value: `${stats?.dxp?.totalEPs ?? "..."} Delegates`, icon: Users, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                { label: "Facilitators Approved", value: `${stats?.dxp?.approvedFacilitators ?? "..."} Approved`, icon: Award, color: "text-accent-pink", bg: "bg-accent-pink/10" },
                { label: "Survey Satisfaction Avg", value: `${stats?.dxp?.avgSatisfaction === "4.8 / 5.0" ? "N/A" : (stats?.dxp?.avgSatisfaction ?? "...")}`, icon: Star, color: "text-accent-teal", bg: "bg-accent-teal/10" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">{s.label}</span>
                      <h3 className="text-2xl font-bold font-display text-text-primary">{s.value}</h3>
                    </div>
                    <div className={`p-3 ${s.bg} rounded-xl ${s.color}`}><Icon size={20} fill={s.color.includes("teal") ? "currentColor" : "none"} /></div>
                  </Card>
                );
              })}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
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

        {/* ── 3. MKT ── */}
        {(role === "OCVP_MKT" || role === "OC_MKT_MEMBER") && (
          <motion.div key="mkt" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total Reach", value: `${stats?.mkt?.reach?.toLocaleString() ?? "..."} Views`, icon: TrendingUp, color: "text-accent-purple", bg: "bg-accent-purple/10" },
                { label: "Aggregated Clicks", value: `${stats?.mkt?.clicks?.toLocaleString() ?? "..."} Clicks`, icon: Clock, color: "text-accent-teal", bg: "bg-accent-teal/10" },
                { label: "Conversions", value: `${stats?.mkt?.conversions?.toLocaleString() ?? "..."} Signups`, icon: Camera, color: "text-accent-pink", bg: "bg-accent-pink/10" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">{s.label}</span>
                      <h3 className="text-2xl font-bold font-display text-text-primary">{s.value}</h3>
                    </div>
                    <div className={`p-3 ${s.bg} rounded-xl ${s.color}`}><Icon size={20} /></div>
                  </Card>
                );
              })}
            </div>
            <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
              <span className="text-2xs uppercase text-text-muted font-bold tracking-wider">Top Campaigns by Conversion</span>
              <ul className="space-y-3 text-xs">
                {stats?.mkt?.topCampaigns?.length ? stats.mkt.topCampaigns.map((c) => (
                  <li key={c.id} className="flex justify-between items-center p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span>{c.title} — {c.platform.replace(/_/g, " ")}</span>
                    <span className="font-mono text-accent-teal font-bold">{c.conversions} conversions</span>
                  </li>
                )) : (
                  <li className="text-text-muted">No campaigns tracked yet.</li>
                )}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* ── 4. FINANCE ── */}
        {role === "OCVP_FINANCE" && (
          <motion.div key="finance" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total Inflows</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-teal">{stats?.finance?.inflows?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-teal/10 rounded-xl text-accent-teal"><DollarSign size={20} /></div>
              </Card>
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Total Outflows</span>
                  <h3 className="text-2xl font-bold font-mono text-red-400">{stats?.finance?.outflows?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400"><TrendingDown size={20} /></div>
              </Card>
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Net Reserves</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-purple">{stats?.finance?.netReserves?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><TrendingUp size={20} /></div>
              </Card>
            </div>
            <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 flex flex-col items-center text-center space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Required Break-Even EP Signups</span>
                <h2 className="text-4xl font-black font-display text-accent-teal mt-2">{stats?.finance?.breakEvenEPs ?? "..."}</h2>
                <span className="text-3xs text-text-secondary mt-1 block">Delegates at 85 TND pricing ticket</span>
              </div>
              <Button href="/admin/finances" size="sm" variant="glass">Manage Calculator Sliders</Button>
            </Card>
          </motion.div>
        )}

        {/* ── 5. LOGISTICS & ER ── */}
        {(role === "OCVP_LOG_ER" || role === "OC_LOG_ER_MEMBER") && (
          <motion.div key="logistics" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
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
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Pipeline Target</span>
                  <h3 className="text-2xl font-bold font-mono text-accent-purple">{stats?.log_er?.targetGoal?.toLocaleString() ?? "..."} TND</h3>
                </div>
                <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><Target size={20} /></div>
              </Card>
              <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-wider text-text-muted font-bold">Logistics Prep</span>
                  <h3 className="text-2xl font-bold font-display text-accent-pink">{stats?.log_er?.prepLevel ?? "..."}% ready</h3>
                </div>
                <div className="p-3 bg-accent-pink/10 rounded-xl text-accent-pink"><Truck size={20} /></div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
