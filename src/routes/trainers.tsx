import { createFileRoute } from "@tanstack/react-router";
import { TRAINERS } from "@/lib/gym-data";
import { Star, Award, Users } from "lucide-react";

export const Route = createFileRoute("/trainers")({
  head: () => ({ meta: [{ title: "Trainers — Iron Pulse Gym" }, { name: "description", content: "Meet the certified coaches behind Iron Pulse." }] }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">The Team</div>
      <h1 className="font-display font-black uppercase text-6xl md:text-7xl leading-[0.9]">Our <span className="ember-text">trainers</span></h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {TRAINERS.map((t) => (
          <div key={t.name} className="glass rounded-2xl overflow-hidden group">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-5">
              <div className="font-display font-bold text-xl uppercase">{t.name}</div>
              <div className="text-xs text-primary uppercase tracking-widest mt-1">{t.role}</div>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Award className="size-3.5 text-primary" />{t.cert}</div>
                <div className="flex items-center gap-2"><Users className="size-3.5 text-primary" />{t.clients} active clients</div>
                <div className="flex items-center gap-2"><Star className="size-3.5 fill-primary text-primary" />{t.rating} · {t.exp} experience</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});