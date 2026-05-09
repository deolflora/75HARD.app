import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Props = {
  index: number;
  title: string;
  subtitle: string;
  tag: string;
  done: boolean;
  onToggle: () => void;
};

export function GoalRow({ index, title, subtitle, tag, done, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full text-left brutal-border bg-card p-5 transition-all ${
        done ? "brutal-shadow-blood" : "brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
      }`}
    >
      <div className="flex items-start gap-5">
        <div className="font-mono text-xs text-muted-foreground pt-1 w-8">
          {String(index).padStart(2, "0")}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className={`font-display text-2xl uppercase leading-none ${done ? "line-through decoration-blood decoration-[3px]" : ""}`}>
              {title}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest border border-ink px-1.5 py-0.5">
              {tag}
            </span>
          </div>
          <p className="font-serif-it text-lg mt-1 text-muted-foreground">{subtitle}</p>
        </div>

        <div
          className={`shrink-0 w-12 h-12 brutal-border flex items-center justify-center transition-colors ${
            done ? "bg-ink text-bone" : "bg-bone"
          }`}
        >
          {done && (
            <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>
              <Check className="w-6 h-6" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          className="absolute -top-3 right-6 stamp text-xs bg-bone"
        >
          DONE
        </motion.div>
      )}
    </motion.button>
  );
}
