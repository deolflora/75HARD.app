import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

export function DayCelebration({
  show,
  day,
  xpGained,
  level,
  onClose,
}: {
  show: boolean;
  day: number;
  xpGained: number;
  level: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const colors = ["#1a1410", "#c0392b", "#e67e22", "#f5f1e8"];
    const fire = (origin: { x: number; y: number }) =>
      confetti({ particleCount: 80, spread: 70, startVelocity: 55, origin, colors, scalar: 1.1, ticks: 200 });
    fire({ x: 0.2, y: 0.7 });
    fire({ x: 0.8, y: 0.7 });
    setTimeout(() => fire({ x: 0.5, y: 0.5 }), 250);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.7, y: 40, rotate: -3 }}
            animate={{ scale: 1, y: 0, rotate: -1.5 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", damping: 14 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-bone brutal-border brutal-shadow-blood max-w-md w-full p-8 text-center noise overflow-hidden"
          >
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Day {day} / 75 — Locked In
            </div>
            <div className="font-display text-7xl mt-4 leading-none ember-pulse text-blood">
              FORGED
            </div>
            <div className="font-serif-it text-2xl mt-2">another day in the fire.</div>

            <div className="mt-6 flex items-center justify-center gap-6 font-mono text-sm">
              <div className="brutal-border px-3 py-2">
                <div className="text-[10px] uppercase text-muted-foreground">XP</div>
                <div className="font-display text-2xl">+{xpGained}</div>
              </div>
              <div className="brutal-border px-3 py-2 bg-ink text-bone">
                <div className="text-[10px] uppercase opacity-70">Level</div>
                <div className="font-display text-2xl">{level}</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 font-condensed text-xl tracking-widest brutal-border bg-ink text-bone px-8 py-3 hover:bg-blood transition-colors"
            >
              KEEP GOING →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
