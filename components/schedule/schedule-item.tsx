"use client";

import { Pencil, Trash2, Infinity as InfinityIcon } from "lucide-react";
import clsx from "clsx";
import { Schedule } from "@/types";

interface ScheduleItemProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  purple: "bg-purple-main",
  green: "bg-green-main",
  blue: "bg-blue-main",
  amber: "bg-amber-main",
  red: "bg-red-main",
};

export default function ScheduleItem({
  schedule,
  onEdit,
  onDelete,
}: ScheduleItemProps) {
  function formatTime(t: string): string {
    return t.slice(0, 5);
  }

  function handleDelete() {
    const message = schedule.is_recurring
      ? `"${schedule.title}" is a recurring schedule. Deleting it will remove the entire series, not just this occurrence. Continue?`
      : `Delete "${schedule.title}"?`;
    if (window.confirm(message)) {
      onDelete(schedule.id);
    }
  }

  return (
    <div className="group relative flex items-start gap-3 bg-bg-surface/60 border border-bg-border rounded-xl p-4 hover:bg-bg-hover/50 transition-colors duration-150">
      <div
        className={clsx(
          "w-1 self-stretch rounded-full flex-shrink-0",
          COLOR_MAP[schedule.color] ?? "bg-purple-main",
        )}
      />

      <div className="flex-1 min-w-0">
        <span className="text-xs font-mono text-text-secondary">
          {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
        </span>
        <p className="text-sm font-medium text-text-primary mt-0.5">
          {schedule.title}
        </p>
        {schedule.description && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {schedule.description}
          </p>
        )}
      </div>

      {schedule.is_recurring && (
        <InfinityIcon size={14} className="text-text-muted flex-shrink-0" />
      )}

      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(schedule)}
          className="p-1.5 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-bg-hover text-text-secondary hover:text-red-main transition-colors duration-150"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
