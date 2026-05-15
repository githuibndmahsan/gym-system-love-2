import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  tagline: string;
  image: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  stat: { label: string; value: string };
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Summer 2026 · Lahore",
    title: (
      <>
        Ignite your <span className="ember-text">strength</span>
      </>
    ),
    tagline: "Forge an unstoppable body with elite coaches and equipment engineered for athletes.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=85",
    primary: { label: "Join Now", to: "/pricing" },
    secondary: { label: "Explore Memberships", to: "/pricing" },
    stat: { label: "Members forged", value: "1,200+" },
  },
  {
    eyebrow: "Performance Lab",
    title: (
      <>
        Train like an <span className="ember-text">athlete</span>
      </>
    ),
    tagline: "Hammer Strength, Rogue, Concept2 — calibrated daily, ready when you are.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=85",
    primary: { label: "Start Free Trial", to: "/pricing" },
    secondary: { label: "Browse Classes", to: "/classes" },
    stat: { label: "Sessions / week", value: "60+" },
  },
  {
    eyebrow: "Transformations",
    title: (
      <>
        Transform your <span className="ember-text">body</span>
      </>
    ),
    tagline: "Elite coaching, real accountability, and a community that pushes harder than you.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=2400&q=85",
    primary: { label: "Join Now", to: "/pricing" },
    secondary: { label: "Meet Trainers", to: "/trainers" },
    stat: { label: "Avg. rating", value: "4.9 ★" },
  },
];

const DURATION = 6000;

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef<number>(0);

  const go = useCallback((i: number) => {
    setActive((prev) => {
      const len = SLIDES.length;
      const next = ((i % len) + len) % len;
      return next;
    });
    setProgress(0);
    lastTick.current = performance.now();
  }, []);

  const next = useCallback(() => go(active + 1), [active, go]);
  const prev = useCallback(() => go(active - 1), [active, go]);

  // Auto-advance + progress bar
  useEffect(() => {
    lastTick.current = performance.now();
    const tick = (t: number) => {
      if (!paused) {
        const dt = t - lastTick.current;
        lastTick.current = t;
        setProgress((p) => {
          const np = p + (dt / DURATION) * 100;
          if (np >= 100) {
            setActive((a) => (a + 1) % SLIDES.length);
            return 0;
          }
          return np;
        });
      } else {
        lastTick.current = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Preload neighbors
  useEffect(() => {
    [active + 1, active - 1].forEach((i) => {
      const idx = ((i % SLIDES.length) + SLIDES.length) % SLIDES.length;
      const img = new Image();
      img.src = SLIDES[idx].image;
    });
  }, [active]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  return (
    <section
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Slides — crossfade + Ken Burns zoom */}
      {SLIDES.map((s, i) => {
        const isActive = i === active;
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity]"
            style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            <img
              src={s.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transform: isActive ? "scale(1.08)" : "scale(1.0)",
                transition: "transform 7s ease-out",
                filter: "brightness(1.05) contrast(1.05) saturate(1.1)",
              }}
            />
            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            {/* Crystal sheen */}
            <div
              className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 50% at 75% 30%, rgba(255,255,255,0.35), transparent 60%)",
              }}
            />
            {/* Orange glow accent */}
            <div
              className="absolute -top-32 -right-32 size-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.72 0.21 45 / 0.45), transparent 65%)",
                filter: "blur(40px)",
              }}
            />
          </div>
        );
      })}

      {/* Floating glass orbs */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute top-1/4 right-[15%] size-32 rounded-full glass animate-float-slow" />
        <div className="absolute bottom-1/3 right-[8%] size-20 rounded-full glass-strong animate-float-slower" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 pt-24">
          <div className="max-w-3xl">
            <div
              key={`eb-${active}`}
              className="inline-flex items-center gap-2 glass rounded-full pl-1.5 pr-4 py-1.5 mb-6 animate-fade-in"
            >
              <span className="ember-bg rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background flex items-center gap-1">
                <Sparkles className="size-2.5" /> Live
              </span>
              <span className="text-xs text-white/80 uppercase tracking-widest">
                {SLIDES[active].eyebrow}
              </span>
            </div>

            <h1
              key={`t-${active}`}
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white text-[clamp(3rem,9vw,8rem)] animate-fade-in"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.45)" }}
            >
              {SLIDES[active].title}
            </h1>

            <p
              key={`p-${active}`}
              className="mt-6 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed animate-fade-in"
              style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
            >
              {SLIDES[active].tagline}
            </p>

            <div
              key={`b-${active}`}
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in"
              style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
            >
              <Link to={SLIDES[active].primary.to} className="btn-ember text-sm">
                {SLIDES[active].primary.label} <ArrowRight className="size-4" />
              </Link>
              <Link to={SLIDES[active].secondary.to} className="btn-ghost text-sm bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10">
                {SLIDES[active].secondary.label}
              </Link>
            </div>

            {/* Floating stat card */}
            <div className="mt-10 inline-flex items-center gap-4 glass-strong rounded-2xl px-5 py-3 animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "backwards" }}>
              <div className="size-9 rounded-xl ember-bg flex items-center justify-center pulse-glow">
                <Sparkles className="size-4 text-background" strokeWidth={2.6} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/60">{SLIDES[active].stat.label}</div>
                <div className="font-display text-xl font-bold text-white">{SLIDES[active].stat.value}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/15 hover:scale-105 transition"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-12 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/15 hover:scale-105 transition"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Bottom rail: dots + progress + pause */}
      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${
                    isActive ? "w-14 bg-white/25" : "w-6 bg-white/25 hover:bg-white/40"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-0 left-0 ember-bg rounded-full"
                      style={{ width: `${progress}%`, transition: "width 80ms linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs text-white/70 font-mono">
            <span className="tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play" : "Pause"}
              className="size-8 rounded-full glass-strong flex items-center justify-center text-white hover:bg-white/15 transition"
            >
              {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1.5 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}