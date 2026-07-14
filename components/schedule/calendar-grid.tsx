"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { Schedule } from "@/types";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  occurrences: Map<string, Schedule[]>;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const COLOR_MAP: Record<string, string> = {
  purple: "bg-purple-main",
  green: "bg-green-main",
  blue: "bg-blue-main",
  amber: "bg-amber-main",
  red: "bg-red-main",
};

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  occurrences,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-text-primary">Schedule</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl p-1.5 transition-colors duration-150"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-mono uppercase tracking-wide text-text-primary min-w-[140px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={onNextMonth}
            className="border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl p-1.5 transition-colors duration-150"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={onToday}
          className="border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl px-3 py-1.5 text-sm transition-colors duration-150"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="text-xs uppercase text-text-secondary tracking-wide text-center py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayOccurrences = occurrences.get(dateKey) ?? [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const visibleDots = dayOccurrences.slice(0, 3);
          const extraCount = dayOccurrences.length - 3;

          return (
            <div
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={clsx(
                "bg-bg-card/40 backdrop-blur-sm border border-white/[0.04] aspect-square rounded-xl hover:bg-bg-hover transition-colors duration-150 cursor-pointer flex flex-col items-center justify-center gap-1 relative p-1",
                isTodayDate && "ring-2 ring-purple-main",
                isSelected && "bg-purple-main text-white",
                !isCurrentMonth && "text-text-faint opacity-50",
              )}
            >
              <span className="text-sm">{format(day, "d")}</span>
              {visibleDots.length > 0 && (
                <div className="flex items-center gap-0.5">
                  {visibleDots.map((occ, i) => (
                    <span
                      key={i}
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        COLOR_MAP[occ.color] ?? "bg-purple-main",
                      )}
                    />
                  ))}
                  {extraCount > 0 && (
                    <span className="text-[9px] text-text-faint">
                      +{extraCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
