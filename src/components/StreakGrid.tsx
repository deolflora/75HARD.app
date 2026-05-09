import type { TrackerState } from "@/lib/tracker-store";

export function StreakGrid({ state, today }: { state: TrackerState; today: number }) {
  const cells = Array.from({ length: 75 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
      {cells.map((n) => {
        const rec = state.days[String(n)];
        const done = rec?.completed;
        const partial = !done && rec && Object.values(rec).some(Boolean);
        const isToday = n === today;
        return (
          <div
            key={n}
            title={`Day ${n}`}
            className={`aspect-square brutal-border relative ${
              done ? "bg-ink" : partial ? "bg-ember/40" : "bg-bone"
            } ${isToday ? "outline outline-2 outline-offset-[2px] outline-blood" : ""}`}
          >
            {done && <div className="absolute inset-1 bg-blood mix-blend-multiply" />}
          </div>
        );
      })}
    </div>
  );
}
