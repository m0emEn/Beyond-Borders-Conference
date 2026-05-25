"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const SIMULATED_ACCOUNTS = [
  {
    group: "Leadership",
    color: "text-accent-purple border-accent-purple/20 bg-accent-purple/5",
    dot: "bg-accent-purple",
    members: [
      { email: "moemen@aiesec.net", label: "Moemen Sfaxi", role: "OCP" },
    ],
  },
  {
    group: "DXP",
    color: "text-accent-teal border-accent-teal/20 bg-accent-teal/5",
    dot: "bg-accent-teal",
    members: [
      { email: "amine@aiesec.net", label: "Amine Daoud", role: "OCVP DXP" },
      { email: "linda@aiesec.net", label: "Linda", role: "OC DXP Member" },
    ],
  },
  {
    group: "MKT",
    color: "text-accent-pink border-accent-pink/20 bg-accent-pink/5",
    dot: "bg-accent-pink",
    members: [
      { email: "oussama@aiesec.net", label: "Oussama", role: "OCVP MKT" },
      { email: "bilel@aiesec.net", label: "Bilel", role: "OC MKT Member" },
    ],
  },
  {
    group: "Finance",
    color: "text-accent-amber border-accent-amber/20 bg-accent-amber/5",
    dot: "bg-accent-amber",
    members: [
      { email: "yassine@aiesec.net", label: "Yassine Trabelsi", role: "OCVP Finance" },
    ],
  },
  {
    group: "LOG & ER",
    color: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    dot: "bg-blue-400",
    members: [
      { email: "sarra@aiesec.net", label: "Sarra Ghedas", role: "OCVP LOG&ER" },
      { email: "ahmed@aiesec.net", label: "Ahmed", role: "OC LOG&ER Member" },
    ],
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Clearance verification failed.");
      }

      const user = result.data;
      
      // Store session data
      localStorage.setItem("admin_session", "true");
      localStorage.setItem("admin_role", user.role);
      localStorage.setItem("admin_department", user.department);
      localStorage.setItem("admin_persona", `${user.fullName} (${user.role})`);
      localStorage.setItem("simulated_persona", user.fullName);
      
      // Notify parent layout of active change
      window.dispatchEvent(new Event("admin_role_changed"));
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Coordinates verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick bypass click to make testing extremely seamless
  const handleQuickLogin = async (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword("beyond2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070814] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background neons */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-teal/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow-purple mb-4"
          >
            <Lock className="text-white" size={32} />
          </motion.div>
          
          <Badge variant="purple" className="mb-2">Secure OC Clearances</Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-2">Beyond Borders</h1>
          <p className="text-sm text-text-secondary mt-2">Operational Command Center Authorization</p>
        </div>

        <Card className="glass-card border border-white/10 p-8 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden shadow-glow-purple/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3"
              >
                <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={18} />
                <span className="text-xs text-red-300 font-medium leading-normal">{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-semibold uppercase tracking-wider text-text-muted">AIESEC Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. moemen@aiesec.net"
                  className="w-full glass-card px-4 py-3 pl-11 text-xs text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-semibold uppercase tracking-wider text-text-muted">Clearance Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode credentials"
                  className="w-full glass-card px-4 py-3 pl-11 text-xs text-text-primary bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 rounded-xl transition"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              </div>
            </div>

            <Button type="submit" className="w-full justify-center gap-2 h-11" disabled={isSubmitting}>
              {isSubmitting ? "Verifying Clearance..." : <>Verify Credentials <Sparkles size={14} /></>}
            </Button>
          </form>

          {/* Quick Login Tiles */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <span className="text-2xs uppercase tracking-wider text-text-muted font-bold text-center block">
              Quick Clearance Bypass
            </span>
            <div className="space-y-2.5">
              {SIMULATED_ACCOUNTS.map((group) => (
                <div key={group.group} className={`rounded-xl border p-2.5 ${group.color}`}>
                  <div className="flex items-center gap-1.5 mb-2 px-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${group.dot}`} />
                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-70">
                      {group.group}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {group.members.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => handleQuickLogin(acc.email)}
                        className="flex flex-col items-start px-2.5 py-2 bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/15 rounded-lg transition text-left"
                      >
                        <span className="text-[11px] font-semibold text-text-primary leading-tight">{acc.label}</span>
                        <span className="text-[9px] text-text-muted mt-0.5">{acc.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-text-muted mt-8">
          AIESEC in Tunisia OC Tech Team © 2026
        </p>
      </motion.div>
    </div>
  );
}
