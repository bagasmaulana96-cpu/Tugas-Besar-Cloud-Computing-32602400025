"use client";

import { Plus, CalendarX } from "lucide-react";
import { format, isToday as checkIsToday } from "date-fns";
import ScheduleItem from "./schedule-item";
import { Schedule } from "@/types";

interface DayPanelProps {
  selectedDate: Date;
  occurrences: Schedule[];
  onAddClick: () => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
}

export default function DayPanel({
  selectedDate,
  occurrences,
  onAddClick,
  onEdit,
  onDelete,
}: DayPanelProps) {
  const isTodaySelected = checkIsToday(selectedDate);

  return (
    <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 lg:sticky lg:top-[72px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">
            {format(selectedDate, "EEEE, d MMMM")}
          </h2>
          {isTodaySelected && (
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-dim text-purple-light border border-purple-mid">
              Today
            </span>
          )}
        </div>
        <button
          onClick={onAddClick}
          className="p-1.5 rounded-lg border border-bg-border hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          <Plus size={16} />
        </button>
      </div>

      {occurrences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
          <CalendarX size={32} className="text-text-faint" />
          <p className="text-text-secondary text-sm">
            No schedule for this day
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {occurrences.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
