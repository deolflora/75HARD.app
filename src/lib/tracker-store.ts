import { useEffect, useState, useCallback } from "react";

export type GoalKey = "workout1" | "workout2" | "diet" | "water" | "reading" | "photo";

export const GOALS: { key: GoalKey; title: string; subtitle: string; tag: string }[] = [
  { key: "workout1", title: "Workout I", subtitle: "45 min — any conditions", tag: "indoor / outdoor" },
  { key: "workout2", title: "Workout II", subtitle: "45 min — must be outdoors", tag: "outdoor only" },
  { key: "diet", title: "Diet", subtitle: "Follow your chosen diet. No cheats.", tag: "no alcohol" },
  { key: "water", title: "Water", subtitle: "Drink 1 gallon (3.78 L)", tag: "≈ 16 cups" },
  { key: "reading", title: "Reading", subtitle: "10 pages of nonfiction", tag: "self-improvement" },
  { key: "photo", title: "Progress Photo", subtitle: "Take one daily progress photo", tag: "document it" },
];

export type DayRecord = Partial<Record<GoalKey, boolean>> & { completed?: boolean; failedAt?: string };

export type TrackerState = {
  startDate: string | null; // ISO date (YYYY-MM-DD)
  days: Record<string, DayRecord>; // day index "1".."75" -> record
  xp: number;
  resets: number;
};

const KEY = "75hard_v1";

const initial: TrackerState = { startDate: null, days: {}, xp: 0, resets: 0 };

function read(): TrackerState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function dayIndex(startDate: string | null): number {
  if (!startDate) return 0;
  const start = new Date(startDate + "T00:00:00");
  const today = new Date(todayISO() + "T00:00:00");
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(75, Math.max(1, diff + 1));
}

export function useTracker() {
  const [state, setState] = useState<TrackerState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const start = useCallback(() => {
    setState((s) => ({ ...s, startDate: todayISO(), days: {}, xp: 0 }));
  }, []);

  const reset = useCallback(() => {
    if (!confirm("Reset back to Day 1? Your streak dies here.")) return;
    setState((s) => ({ startDate: todayISO(), days: {}, xp: 0, resets: s.resets + 1 }));
  }, []);

  const hardReset = useCallback(() => {
    if (!confirm("Wipe all data?")) return;
    setState(initial);
  }, []);

  const toggleGoal = useCallback((day: number, key: GoalKey) => {
    setState((s) => {
      const dayKey = String(day);
      const rec = { ...(s.days[dayKey] || {}) };
      rec[key] = !rec[key];
      const allDone = GOALS.every((g) => rec[g.key]);
      const wasDone = s.days[dayKey]?.completed;
      rec.completed = allDone;
      const xpDelta = allDone && !wasDone ? 100 : !allDone && wasDone ? -100 : 0;
      return { ...s, days: { ...s.days, [dayKey]: rec }, xp: Math.max(0, s.xp + xpDelta) };
    });
  }, []);

  return { state, hydrated, start, reset, hardReset, toggleGoal };
}

export function streak(state: TrackerState): number {
  if (!state.startDate) return 0;
  const today = dayIndex(state.startDate);
  let count = 0;
  for (let i = today; i >= 1; i--) {
    if (state.days[String(i)]?.completed) count++;
    else if (i < today) break;
  }
  return count;
}

export function completedDays(state: TrackerState): number {
  return Object.values(state.days).filter((d) => d.completed).length;
}

export function level(xp: number) {
  // simple curve: each level needs 100*level xp
  let lvl = 1, need = 100, remaining = xp;
  while (remaining >= need) { remaining -= need; lvl++; need = 100 * lvl; }
  return { lvl, into: remaining, need };
}
