import clsx from "clsx";

interface ExpProgressProps {
  progressPercent: number;
  currentLevel: number;
  nextLevel: number;
}

export default function ExpProgress({
  progressPercent,
  currentLevel,
  nextLevel,
}: ExpProgressProps) {
  const isMaxLevel = currentLevel === nextLevel;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-text-secondary text-xs uppercase tracking-wide">
          {isMaxLevel ? "Max Level Reached" : `Progress to Lvl ${nextLevel}`}
        </span>
        <span className="text-text-secondary text-xs font-mono">
          {progressPercent}%
        </span>
      </div>
      <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full bg-purple-main rounded-full animate-exp-fill",
            progressPercent >= 90 && "shadow-[0_0_8px_#c084fc]",
          )}
          style={
            { "--exp-width": `${progressPercent}%` } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
