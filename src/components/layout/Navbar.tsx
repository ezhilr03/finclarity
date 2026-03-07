import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/utils";

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fin-blue to-fin-green flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-fin-blue font-display">
            Fin<span className="text-fin-green">Clarity</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.slice(0, 6).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-blue-50 text-fin-blue"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-blue-50 text-fin-blue"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
