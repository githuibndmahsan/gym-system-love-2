import { Link } from "@tanstack/react-router";
import { Dumbbell, Instagram, Facebook, Youtube, MapPin, Clock, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="ember-bg rounded-lg p-2"><Dumbbell className="size-5 text-background" strokeWidth={2.6} /></div>
              <div className="font-display font-black text-2xl">IRON<span className="ember-text">PULSE</span></div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Lahore's premier strength &amp; conditioning facility. Elite coaching, state-of-the-art equipment, and a relentless community built to forge real results.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Youtube].map((I, i) => (
                <a key={i} href="#" className="glass size-10 rounded-full flex items-center justify-center hover:text-primary transition-colors">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Navigate</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/classes" className="hover:text-foreground transition">Classes</Link></li>
              <li><Link to="/trainers" className="hover:text-foreground transition">Trainers</Link></li>
              <li><Link to="/schedule" className="hover:text-foreground transition">Schedule</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Hours</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>Mon–Fri · 06:00–23:00</li>
              <li>Saturday · 07:00–22:00</li>
              <li>Sunday · 08:00–18:00</li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Visit</div>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground"><MapPin className="size-4 mt-0.5 text-primary shrink-0" /> Block C, DHA Phase 5,<br />Lahore, Pakistan</div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><Mail className="size-4 text-primary" /> hello@ironpulse.gym</div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground"><Clock className="size-4 text-primary" /> +92 300 IRONPLS</div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2026 Iron Pulse Gym. Forged in Lahore.</div>
          <div className="font-mono uppercase tracking-widest">Powering Fitness · v2.0</div>
        </div>
      </div>
    </footer>
  );
}