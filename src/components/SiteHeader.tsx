import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/classes", label: "Classes" },
  { to: "/trainers", label: "Trainers" },
  { to: "/schedule", label: "Schedule" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`glass flex items-center justify-between gap-6 px-5 py-3 transition-all ${scrolled ? "rounded-full" : "rounded-2xl"}`}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 ember-bg rounded-lg blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative ember-bg rounded-lg p-1.5">
                <Dumbbell className="size-4 text-background" strokeWidth={2.6} />
              </div>
            </div>
            <div className="font-display font-black text-lg tracking-tight leading-none">
              IRON<span className="ember-text">PULSE</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-px ember-bg" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/admin" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3">
              Admin
            </Link>
            <Link to="/admin" className="btn-ember text-xs">Profile Studio</Link>
          </div>

          <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-foreground p-2" aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 reveal">
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                    path === n.to ? "text-primary bg-white/5" : "text-muted-foreground"
                  }`}>
                  {n.label}
                </Link>
              ))}
              <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider text-muted-foreground">Admin</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="btn-ember justify-center mt-2 text-xs">Profile Studio</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}