"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  Users,
  Award,
  Clock,
  Volume2,
  Briefcase,
  Layers,
  AlertTriangle,
  FolderHeart,
  TrendingUp,
  Camera,
  ShieldCheck,
  UserCheck,
  Power,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Lock,
  ShieldAlert,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/timeline", label: "Timeline & Tasks", icon: CalendarDays },
  { href: "/admin/finances", label: "Finance Hub", icon: DollarSign },
  { href: "/admin/delegates", label: "Delegate Registry", icon: Users },
  { href: "/admin/scanner", label: "Live QR Scanner", icon: ScanLine },
  { href: "/admin/facilitators", label: "Facilitators", icon: Award },
  { href: "/admin/sessions", label: "Session Scheduler", icon: Clock },
  { href: "/admin/marketing", label: "Marketing Campaigns", icon: TrendingUp },
  { href: "/admin/sponsorship", label: "Sponsorship CRM", icon: Briefcase },
  { href: "/admin/logistics", label: "Logistics Hub", icon: Layers },
  { href: "/admin/risks", label: "Risk Mitigation", icon: AlertTriangle },
  { href: "/admin/oc", label: "OC Performance", icon: UserCheck },
  { href: "/admin/feedback", label: "Delegate Survey", icon: FolderHeart },
  { href: "/admin/media", label: "Content Media", icon: Camera },
  { href: "/admin/announcements", label: "Announcements CMS", icon: Volume2 },
];

// Authentication & Role states
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedRole, setSimulatedRole] = useState("OCP");
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    role: "OCP",
    dept: "GENERAL",
    clearance: "OCP"
  });

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin/login");
      return;
    } else {
      setIsAuthenticated(true);
    }
    
    const name = localStorage.getItem("simulated_persona") || "Active User";
    const role = localStorage.getItem("admin_role") || "OCP";
    const dept = localStorage.getItem("admin_department") || "GENERAL";
    
    const displayRole = role
      .replace("OCVP_", "VP ")
      .replace("OC_", "")
      .replace("_MEMBER", " Member")
      .replace("LOG_ER", "LOG & ER");

    setUserProfile({
      name,
      role: displayRole,
      dept,
      clearance: role
    });
    setSimulatedRole(role);
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_persona");
    localStorage.removeItem("simulated_persona");
    localStorage.removeItem("admin_department");
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  // Role based filtering logic
  const isAllowed = (path: string, role: string) => {
    if (role === "OCP") return true;
    
    // Core structural mapping
    const dxpRoutes = ["/admin", "/admin/timeline", "/admin/delegates", "/admin/scanner", "/admin/facilitators", "/admin/sessions", "/admin/feedback", "/admin/announcements", "/admin/oc"];
    const mktRoutes = ["/admin", "/admin/timeline", "/admin/marketing", "/admin/media", "/admin/announcements", "/admin/oc"];
    const finRoutes = ["/admin", "/admin/timeline", "/admin/finances", "/admin/delegates", "/admin/oc"];
    const logRoutes = ["/admin", "/admin/timeline", "/admin/sponsorship", "/admin/logistics", "/admin/risks", "/admin/oc"];

    switch (role) {
      case "OCVP_DXP":
      case "OC_DXP_MEMBER":
        return dxpRoutes.includes(path);
      case "OCVP_MKT":
      case "OC_MKT_MEMBER":
        return mktRoutes.includes(path);
      case "OCVP_FINANCE":
        return finRoutes.includes(path);
      case "OCVP_LOG_ER":
      case "OC_LOG_ER_MEMBER":
        return logRoutes.includes(path);
      default:
        return path === "/admin" || path === "/admin/timeline";
    }
  };

  const filteredSidebar = SIDEBAR_ITEMS.filter(item => isAllowed(item.href, simulatedRole));
  const hasAccess = isAllowed(pathname, simulatedRole);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070814] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-purple" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#070814] text-white flex relative overflow-x-hidden">
      {/* Background neon glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent-teal/5 blur-[120px] pointer-events-none" />

      {/* ────────────────── LEFT SIDEBAR (DESKTOP) ────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-white/10 bg-surface-1/40 backdrop-blur-xl relative transition-all duration-300 z-30 shrink-0",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          {!isSidebarCollapsed && (
            <Link href="/admin" className="font-display text-lg font-bold gradient-text tracking-tight">
              Beyond Borders
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/admin" className="mx-auto font-display font-black text-accent-purple text-xl">
              BB
            </Link>
          )}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-text-muted hover:text-text-primary">
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          <ul className="space-y-1.5">
            {filteredSidebar.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group relative",
                      active ? "bg-gradient-cta text-white shadow-glow-purple" : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    <Icon size={18} className={cn("shrink-0", active ? "text-white" : "text-text-muted")} />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center font-display font-semibold text-accent-purple text-sm">
                  {userProfile.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">{userProfile.name}</span>
                  <span className="text-[10px] text-text-muted">{userProfile.role}</span>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="p-2 text-text-muted hover:text-red-400 rounded-lg transition">
              <Power size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ────────────────── MOBILE HEADER ────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-1/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-40">
        <Link href="/admin" className="font-display text-base font-bold gradient-text">
          BB Command Center
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-text-primary rounded-lg border border-white/10 bg-white/5">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            className="fixed inset-0 top-16 bg-bg/98 backdrop-blur-2xl z-40 lg:hidden flex flex-col"
          >
            <nav className="flex-1 overflow-y-auto px-6 py-8">
              <ul className="space-y-2">
                {filteredSidebar.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn("flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition", active ? "bg-gradient-cta text-white" : "text-text-secondary hover:text-text-primary")}
                      >
                        <Icon size={20} className={active ? "text-white" : "text-text-muted"} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────── MAIN BODY WORKSPACE ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pt-16 lg:pt-0">
        
        {/* SUB HEADER PERS ONA SELECTOR */}
        <div className="h-auto py-3 px-6 border-b border-white/10 bg-surface-1/20 flex flex-wrap gap-4 items-center justify-between relative z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-accent-teal shrink-0" size={16} />
            <span className="text-xs font-semibold tracking-wider uppercase text-accent-teal">Secured Console</span>
            <span className="text-xs text-text-muted">|</span>
            <span className="text-xs text-text-secondary font-medium">
              AIESEC Dept: <span className="text-text-primary font-semibold">{userProfile.dept}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-secondary">Logged User:</span>
              <span className="text-xs font-semibold text-text-primary bg-surface-2/40 px-2.5 py-1.5 border border-white/10 rounded-lg">
                {userProfile.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-secondary">Role Clearance:</span>
              <div className="flex items-center gap-1 bg-surface-3/50 px-2.5 py-1 border border-white/10 rounded-lg">
                <Lock className="text-accent-purple" size={12} />
                <span className="text-xs font-mono font-bold text-accent-purple uppercase">{userProfile.clearance.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE CONTENT / ACCESS BLOCKED SCREEN */}
        <main className="flex-1 p-6 relative">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
            {hasAccess ? (
              children
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto text-center"
              >
                <Card className="glass-card border border-red-500/25 bg-red-500/5 p-8 relative overflow-hidden shadow-glow-purple/20">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-6 text-red-400">
                    <ShieldAlert size={28} />
                  </div>
                  <Badge variant="pink" className="mb-3">Clearance Level Insufficient</Badge>
                  <h3 className="font-display font-semibold text-text-primary text-base">Security Intercept</h3>
                  <p className="text-xs text-text-muted leading-relaxed mt-2">
                    Clearence levels for AIESEC role <span className="text-accent-pink font-semibold font-mono">{simulatedRole}</span> do not cover access permissions for route <span className="text-text-primary font-mono">{pathname}</span>.
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/5 text-xs text-text-muted">
                    Contact OCP <span className="text-accent-purple font-semibold">Moemen Sfaxi</span> to request elevation.
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
