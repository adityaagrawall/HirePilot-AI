import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Clock,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze", icon: Sparkles, label: "Analyze Resume" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen border-r border-border/50 bg-card/30 pt-6 pb-8 px-3">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-3 mb-8">
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-1.5">
          <Zap className="h-4 w-4 text-primary" fill="currentColor" />
        </div>
        <span className="font-bold text-base">
          Hire<span className="gradient-text">Pilot</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <item.icon
                  className={cn("h-4 w-4", isActive ? "text-primary" : "")}
                />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom promo */}
      <div className="mt-auto">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Pro Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Tailor your resume for each job to maximize your ATS score.
          </p>
        </div>
      </div>
    </aside>
  );
}
