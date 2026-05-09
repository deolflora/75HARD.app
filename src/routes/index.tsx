import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame, RotateCcw, Skull } from "lucide-react";
import { GOALS, completedDays, dayIndex, level, streak, useTracker } from "@/lib/tracker-store";
import { GoalRow } from "@/components/GoalRow";
import { DayCelebration } from "@/components/DayCelebration";
import { StreakGrid } from "@/components/StreakGrid";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { state, hydrated, start, reset, hardReset, toggleGoal } = useTracker();
  const [celebrate, setCelebrate] = useState(false);
  const prevCompletedRef = useRef<boolean>(false);

  const today = dayIndex(state.startDate);
  const todayRec = state.days[String(today)] || {};
  const todayDone = !!todayRec.completed;
  const lvl = level(state.xp);
  const sk = streak(state);
  const total = completedDays(state);

  useEffect(() => {
    if (todayDone && !prevCompletedRef.current) setCelebrate(true);
    prevCompletedRef.current = todayDone;
  }, [todayDone]);

  const completedToday = useMemo(
    () => GOALS.filter((g) => todayRec[g.key]).length,
    [todayRec]
  );

  if (!hydrated) return null;

  if (!state.startDate) return <StartScreen onStart={start} />;

  return (
    <div className="min-h-screen relative">
      <DayCelebration
        show={celebrate}
        day={today}
        xpGained={100}
        level={lvl.lvl}
        onClose={() => setCelebrate(false)}
      />

      {/* Header */}
      <header className="border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="font-display text-2xl">75 / HARD</div>
            <span className="font-serif-it text-muted-foreground">— forge yourself.</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="font-mono text-[11px] uppercase tracking-widest brutal-border px-3 py-1.5 hover:bg-blood hover:text-bone flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset Streak
            </button>
            <button onClick={hardReset} className="font-mono text-[11px] uppercase tracking-widest brutal-border px-3 py-1.5 hover:bg-ink hover:text-bone flex items-center gap-1.5">
              <Skull className="w-3 h-3" /> Wipe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1.2fr_1fr] gap-10">
        {/* LEFT: Day & Goals */}
        <section>
          {/* Hero number */}
          <div className="relative">
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
              {todayDone ? "// status: forged" : "// status: in the fire"}
            </div>
            <div className="flex items-end gap-4 mt-2">
              <motion.div
                key={today}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="font-display text-[10rem] leading-[0.85] tracking-tighter"
              >
                {String(today).padStart(2, "0")}
              </motion.div>
              <div className="font-display text-4xl text-muted-foreground pb-4">/ 75</div>
              {todayDone && (
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: -8 }}
                  className="stamp text-base bg-bone mb-6 ml-auto">
                  COMPLETE
                </motion.div>
              )}
            </div>

            <div className="mt-2 font-serif-it text-2xl">
              {greeting(today, todayDone)}
            </div>
          </div>

          {/* Progress bar today */}
          <div className="mt-8">
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>Today's tasks</span>
              <span>{completedToday} / {GOALS.length}</span>
            </div>
            <div className="brutal-border mt-1.5 h-3 bg-bone overflow-hidden">
              <motion.div
                className="h-full bg-blood"
                initial={false}
                animate={{ width: `${(completedToday / GOALS.length) * 100}%` }}
                transition={{ type: "spring", damping: 20 }}
              />
            </div>
          </div>

          {/* Goals */}
          <div className="mt-8 space-y-4">
            {GOALS.map((g, i) => (
              <GoalRow
                key={g.key}
                index={i + 1}
                title={g.title}
                subtitle={g.subtitle}
                tag={g.tag}
                done={!!todayRec[g.key]}
                onToggle={() => toggleGoal(today, g.key)}
              />
            ))}
          </div>
        </section>

        {/* RIGHT: Stats */}
        <aside className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatTile label="Level" value={String(lvl.lvl)} sub={`${lvl.into}/${lvl.need} XP`} progress={lvl.into / lvl.need} />
            <StatTile label="XP" value={String(state.xp)} sub="+100 per day" />
            <StatTile label="Streak" value={String(sk)} sub="days unbroken" icon={<Flame className="w-4 h-4" />} highlight={sk > 0} />
            <StatTile label="Forged" value={String(total)} sub={`of 75 days`} />
          </div>

          <div className="brutal-border bg-card p-5 brutal-shadow noise relative">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
              The Run
            </div>
            <StreakGrid state={state} today={today} />
            <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ink inline-block brutal-border" /> done</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-ember/40 inline-block brutal-border" /> partial</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-bone inline-block brutal-border" /> empty</span>
            </div>
          </div>

          <div className="brutal-border bg-ink text-bone p-5">
            <div className="font-serif-it text-2xl leading-tight">
              "{quote(today)}"
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-60">
              — day {today} mantra
            </div>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            resets: {state.resets} · started: {state.startDate}
          </div>
        </aside>
      </main>

      <footer className="border-t-2 border-ink mt-10">
        <div className="max-w-6xl mx-auto px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex justify-between">
          <span>no excuses · no shortcuts · no compromises</span>
          <span>v1.0 — forge edition</span>
        </div>
      </footer>
    </div>
  );
}

function StatTile({
  label, value, sub, icon, progress, highlight,
}: { label: string; value: string; sub?: string; icon?: React.ReactNode; progress?: number; highlight?: boolean }) {
  return (
    <div className={`brutal-border p-4 brutal-shadow-sm ${highlight ? "bg-blood text-bone" : "bg-card"}`}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest opacity-70">
        <span>{label}</span>{icon}
      </div>
      <div className="font-display text-5xl mt-1 leading-none">{value}</div>
      {sub && <div className="font-mono text-[10px] uppercase mt-1 opacity-70">{sub}</div>}
      {typeof progress === "number" && (
        <div className="mt-2 h-1.5 brutal-border overflow-hidden">
          <div className="h-full bg-ember" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative noise">
      <div className="max-w-2xl w-full text-center">
        <div className="font-mono text-xs uppercase tracking-[0.5em] text-muted-foreground">
          // 75 day mental toughness program
        </div>
        <h1 className="font-display text-[6rem] sm:text-[9rem] leading-[0.85] tracking-tighter mt-4">
          SEVEN<br/>FIVE<br/><span className="text-blood">HARD</span>
        </h1>
        <p className="font-serif-it text-2xl mt-6 max-w-lg mx-auto">
          75 days. 6 daily tasks. Miss one — you start over from day one. No excuses.
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-left font-mono text-sm">
          {GOALS.map((g, i) => (
            <li key={g.key} className="brutal-border p-3 bg-card flex gap-3">
              <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span><span className="font-display uppercase">{g.title}</span> — <span className="text-muted-foreground">{g.subtitle}</span></span>
            </li>
          ))}
        </ul>

        <button
          onClick={onStart}
          className="mt-10 font-condensed text-3xl tracking-[0.2em] brutal-border brutal-shadow bg-blood text-bone px-12 py-5 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          BEGIN DAY 01 →
        </button>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          there is no easy mode.
        </div>
      </div>
    </div>
  );
}

function greeting(day: number, done: boolean) {
  if (done) return "you survived another one. rest. tomorrow we go again.";
  if (day === 1) return "the fire starts today. show up.";
  if (day < 25) return "the easy excuses are loudest now. ignore them.";
  if (day < 50) return "you're in the grind. this is where most quit.";
  if (day < 75) return "the finish line is in the smoke. keep walking.";
  return "final day. forge the version of you that you promised.";
}

function quote(day: number) {
  const q = [
    "discipline is freedom.",
    "the obstacle is the path.",
    "do the thing you said you would do.",
    "sweat is the cure.",
    "nobody is coming to save you.",
    "small daily actions, repeated, build empires.",
    "comfort is the enemy of progress.",
  ];
  return q[day % q.length];
}
