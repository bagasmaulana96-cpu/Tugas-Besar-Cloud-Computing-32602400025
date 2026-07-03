"use client";

import clsx from "clsx";
import { TaskFilter } from "@/types";

interface TaskFilterProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export default function TaskFilterTabs({
  activeFilter,
  onFilterChange,
}: TaskFilterProps) {
  const FILTERS: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "today", label: "Today" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm transition-colors duration-150 whitespace-nowrap flex-shrink-0",
            activeFilter === filter.value
              ? "bg-purple-dim border border-purple-mid text-purple-light font-medium"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-transparent",
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
