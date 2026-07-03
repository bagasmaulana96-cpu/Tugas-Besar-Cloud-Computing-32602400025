import {
  Trophy,
  TrendingUp,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { ProfileStats } from "@/types";

interface StatsWidgetProps {
  stats: ProfileStats;
  levelTitle: string;
}

export default function StatsWidget({ stats, levelTitle }: StatsWidgetProps) {
  const { level, expToday, balance, tasksCompletedToday } = stats;
  const expPercent = Math.min(100, (expToday / 5000) * 100);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Card 1 */}
      <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs uppercase tracking-wide">
            <Trophy size={14} />
            Current Rank
          </div>
          <span className="bg-green-main/10 text-green-main border border-green-main/20 rounded-full text-xs px-2 py-0.5">
            ACTIVE
          </span>
        </div>
        <p className="text-4xl font-bold text-purple-light">Level {level}</p>
        <p className="text-text-secondary text-sm mt-1">{levelTitle} Class</p>
      </div>

      {/* Card 2 */}
      <div
        className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 animate-fade-in"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex items-center gap-1.5 text-text-secondary text-xs uppercase tracking-wide mb-4">
          <TrendingUp size={14} />
          EXP Today
        </div>
        <p className="text-4xl font-bold text-text-primary">
          {expToday.toLocaleString()}{" "}
          <span className="text-text-muted text-lg">/ 5000</span>
        </p>
        <div className="mt-3 h-1.5 bg-bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-main rounded-full animate-exp-fill"
            style={{ "--exp-width": `${expPercent}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Card 3 */}
      <div
        className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 animate-fade-in"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex items-center gap-1.5 text-text-secondary text-xs uppercase tracking-wide mb-4">
          <Wallet size={14} />
          Credit Balance
        </div>
        <p className="text-4xl font-bold text-purple-light">
          {balance.toLocaleString()}
        </p>
        <p className="text-text-secondary text-sm mt-1">Quantum Credits</p>
      </div>

      {/* Card 4 */}
      <div
        className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 animate-fade-in"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-text-secondary text-xs uppercase tracking-wide">
            <CheckCircle2 size={14} />
            Tasks Executed
          </div>
          <ArrowUpRight size={14} className="text-text-secondary" />
        </div>
        <p className="text-4xl font-bold text-text-primary">
          {tasksCompletedToday}
        </p>
        <p className="text-text-secondary text-sm mt-1">Operations logged</p>
      </div>
    </div>
  );
}
