import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analyze", label: "Analyze" },
    { href: "/history", label: "History" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass-strong border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md group-hover:blur-lg transition-all" />
              <div className="relative bg-primary/20 border border-primary/30 rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-primary" fill="currentColor" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Hire<span className="gradient-text">Pilot</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <SignedIn>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SignedIn>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <SignedIn>
              <span className="hidden sm:block text-sm text-muted-foreground">
                {user?.firstName}
              </span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-primary/30 hover:ring-primary/60 transition-all",
                  },
                }}
                userProfileMode="navigation"
                userProfileUrl="/profile"
              />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link to="/sign-up">Get Started</Link>
                </Button>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
