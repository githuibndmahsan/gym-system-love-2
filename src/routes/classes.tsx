import { createFileRoute, Link } from "@tanstack/react-router";
import { CLASSES } from "@/lib/gym-data";
import { Clock, Flame, BarChart3, User } from "lucide-react";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Classes — Iron Pulse Gym Lahore" },
      { name: "description", content: "Strength, HIIT, yoga, CrossFit, and personal training classes led by certified coaches at Iron Pulse." },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Train Smart</div>
      <h1 className="font-display font-black uppercase text-6xl md:text-7xl leading-[0.9] tracking-tight">All <span className="ember-text">classes</span></h1>
      <p className="text-muted-foreground mt-4 max-w-2xl">Six signature programs, one mission: turn intention into strength. Every class is capped to keep coaching personal.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {CLASSES.map((c) => (
          <article key={c.name} className="glass rounded-2xl overflow-hidden group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">{c.tag}</div>
            </div>
            <div className="p-6">
              <h3 className="font-display font-black uppercase text-2xl tracking-tight">{c.name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-3.5 text-primary" /> {c.duration}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Flame className="size-3.5 text-primary" /> {c.calories}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><BarChart3 className="size-3.5 text-primary" /> {c.level}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><User className="size-3.5 text-primary" /> {c.trainer}</div>
              </div>
              <Link to="/schedule" className="mt-5 btn-ghost w-full justify-center text-xs">Book a session</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}