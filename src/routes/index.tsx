import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell, Zap, Star, Quote, Trophy, Users, Flame, Activity } from "lucide-react";
import { CLASSES, TRAINERS, PLANS, TESTIMONIALS } from "@/lib/gym-data";
import { HeroSlider } from "@/components/HeroSlider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iron Pulse Gym — Ignite Your Strength · Lahore" },
      { name: "description", content: "Forge real strength at Lahore's elite training facility. Group classes, expert coaches, modern equipment, and memberships from PKR 2,500/month." },
    ],
  }),
  component: Index,
});

const STATS = [
  { v: "1.2K+", l: "Active Members", icon: Users },
  { v: "24", l: "Expert Trainers", icon: Trophy },
  { v: "60+", l: "Classes / Week", icon: Activity },
  { v: "9", l: "Years Forging", icon: Flame },
];

function Index() {
  return (
    <>
      {/* HERO SLIDER — cinematic, crystal-clear */}
      <div className="-mt-24">
        <HeroSlider />
      </div>

      {/* STATS strip */}
      <section className="relative -mt-12 z-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.l} className="glass-strong rounded-2xl p-5">
                <s.icon className="size-5 text-primary mb-3" />
                <div className="font-display font-black text-4xl">{s.v}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader kicker="The Difference" title={<>Why choose <span className="ember-text">Iron Pulse</span></>} />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {[
              { icon: Trophy, title: "Elite Coaches", text: "Certified trainers with 5+ years guiding pros, athletes, and beginners with equal care." },
              { icon: Dumbbell, title: "Modern Equipment", text: "Hammer Strength, Rogue, Concept2 — every machine maintained, calibrated, and ready." },
              { icon: Zap, title: "Diverse Classes", text: "From hypertrophy to mobility, HIIT to yoga — 60+ sessions a week across two batches." },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-7 group hover:border-primary/40 transition-colors">
                <div className="size-12 rounded-xl ember-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="size-5 text-background" strokeWidth={2.6} />
                </div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <SectionHeader kicker="Train With Purpose" title={<>Featured <span className="ember-text">classes</span></>} align="left" />
            <Link to="/classes" className="text-xs uppercase tracking-widest font-semibold text-primary inline-flex items-center gap-1.5 hover:gap-3 transition-all">View all <ArrowRight className="size-3.5" /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLASSES.slice(0, 6).map((c) => (
              <ClassCard key={c.name} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader kicker="The Team" title={<>Meet your <span className="ember-text">trainers</span></>} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {TRAINERS.map((t) => (
              <div key={t.name} className="glass rounded-2xl overflow-hidden group hover:border-primary/40 transition">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 glass rounded-lg px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">{t.exp}</div>
                </div>
                <div className="p-5">
                  <div className="font-display font-bold text-xl uppercase tracking-tight">{t.name}</div>
                  <div className="text-xs text-primary uppercase tracking-widest mt-1">{t.role}</div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 text-xs">
                    <span className="flex items-center gap-1"><Star className="size-3 fill-primary text-primary" /> {t.rating}</span>
                    <span className="text-muted-foreground">{t.clients} clients</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader kicker="Memberships" title={<>Flexible <span className="ember-text">plans</span></>} sub="No contracts. Cancel anytime. Free 7-day trial on every tier." />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {PLANS.map((p) => (
              <PlanCard key={p.name} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader kicker="Voices" title={<>Real <span className="ember-text">transformations</span></>} />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-7 relative">
                <Quote className="size-8 text-primary/30 absolute top-5 right-5" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="size-3.5 fill-primary text-primary" />)}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
                  <img src={t.img} alt={t.name} className="size-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-[11px] text-primary uppercase tracking-widest">{t.plan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative glass-strong rounded-[2rem] overflow-hidden p-12 md:p-20 text-center">
            <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Limited Time</div>
              <h2 className="font-display font-black uppercase text-5xl md:text-7xl leading-none">Your first<br /><span className="ember-text">7 days are free.</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto mt-6">No credit card. No commitment. Just walk in, train hard, and decide.</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <Link to="/pricing" className="btn-ember">Claim Free Week <ArrowRight className="size-4" /></Link>
                <Link to="/contact" className="btn-ghost">Talk to a coach</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ kicker, title, sub, align = "center" }: { kicker: string; title: React.ReactNode; sub?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{kicker}</div>
      <h2 className="font-display font-black uppercase text-5xl md:text-6xl leading-[0.95] tracking-tight">{title}</h2>
      {sub && <p className="text-muted-foreground mt-4">{sub}</p>}
    </div>
  );
}

function ClassCard({ c }: { c: typeof CLASSES[number] }) {
  return (
    <div className="group relative glass rounded-2xl overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">{c.tag}</div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display font-black uppercase text-3xl tracking-tight leading-none">{c.name}</h3>
        <div className="flex items-center gap-3 mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>{c.duration}</span>
          <span className="size-1 rounded-full bg-primary" />
          <span>{c.calories}</span>
          <span className="size-1 rounded-full bg-primary" />
          <span>{c.level}</span>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ p }: { p: typeof PLANS[number] }) {
  const featured = p.tag === "POPULAR";
  return (
    <div className={`relative rounded-3xl p-8 ${featured ? "glass-strong glow-ring" : "glass"}`}>
      {p.tag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 ember-bg text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{p.tag}</div>
      )}
      <div className="text-xs uppercase tracking-[0.3em] text-primary">{p.name}</div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display font-black text-6xl tracking-tight">Rs {p.price.toLocaleString()}</span>
        <span className="text-muted-foreground text-sm">/{p.period}</span>
      </div>
      <ul className="mt-6 space-y-3 border-t border-white/5 pt-6">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <div className="size-4 rounded-full ember-bg flex items-center justify-center mt-0.5 shrink-0">
              <svg className="size-2.5 text-background" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/pricing" className={`mt-7 block text-center ${featured ? "btn-ember" : "btn-ghost"} w-full justify-center`}>Select {p.name}</Link>
    </div>
  );
}
