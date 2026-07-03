"use client";

import React, { useState } from "react";
import { Flame, Trash2 } from "lucide-react";
import clsx from "clsx";
import { getLevelFromExp, getLevelColor, hasClaimedToday } from "@/lib/exp";
import ExpProgress from "./exp-progress";
import { Skill } from "@/types";

interface SkillCardProps {
  skill: Skill;
  onClaim: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function SkillCard({
  skill,
  onClaim,
  onDelete,
}: SkillCardProps) {
  const [claiming, setClaiming] = useState(false);

  const levelInfo = getLevelFromExp(skill.total_exp);
  const claimedToday = hasClaimedToday(skill.last_claimed_at);
  const levelColorClass = getLevelColor(levelInfo.level);
  const nextLevel = levelInfo.level === 10 ? 10 : levelInfo.level + 1;

  const handleClaim = async () => {
    if (claimedToday || claiming) return;
    setClaiming(true);
    await onClaim(skill.id);
    setClaiming(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete skill "${skill.name}"?`)) onDelete(skill.id);
  };

  return (
    <div className="group relative bg-bg-card/60 backdrop-blur-md border border-purple-mid/40 rounded-2xl p-5 flex flex-col">
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-text-muted hover:text-red-main transition-colors duration-150 p-1 opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 pr-6">
        <span
          className={clsx(
            "text-xs px-2.5 py-1 rounded-lg border font-mono uppercase border-current/30",
            levelColorClass,
          )}
        >
          [ Lvl {levelInfo.level} : {levelInfo.title} ]
        </span>
        <div
          className={clsx(
            "flex items-center gap-1 text-xs text-text-secondary rounded-full px-2 py-0.5",
            skill.streak_days >= 7 && "animate-glow-pulse",
          )}
        >
          <Flame size={12} className="text-amber-main" />
          {skill.streak_days} Day Streak
        </div>
      </div>

      <h3 className="text-xl font-bold text-text-primary mb-1">{skill.name}</h3>

      {skill.description && (
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {skill.description}
        </p>
      )}

      <div className="mb-4">
        <ExpProgress
          progressPercent={levelInfo.progressPercent}
          currentLevel={levelInfo.level}
          nextLevel={nextLevel}
        />
      </div>

      <button
        onClick={handleClaim}
        disabled={claimedToday || claiming}
        className={clsx(
          "w-full border rounded-xl py-2.5 text-sm font-mono uppercase tracking-wide transition-colors duration-150 mt-auto",
          claimedToday || claiming
            ? "border-bg-border text-text-muted cursor-not-allowed"
            : "border-purple-mid text-purple-light hover:bg-purple-dim",
        )}
      >
        {claiming
          ? "[ Claiming... ]"
          : claimedToday
            ? "[ Already Learned Today ]"
            : "[ I Learned Today ]"}
      </button>
    </div>
  );
}
