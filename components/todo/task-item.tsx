"use client";

import React from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const timePart = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
}

function getDeadlineStatus(deadline: string): "overdue" | "today" | "upcoming" {
  const now = new Date();
  const d = new Date(deadline);
  if (d < now) return "overdue";
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay ? "today" : "upcoming";
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const handleDelete = () => {
    if (window.confirm("Delete this task?")) onDelete(task.id);
  };

  return (
    <div className="group relative rounded-2xl border border-bg-border p-4 md:p-5 transition-colors duration-150 hover:bg-bg-hover/30">
      <div className="flex items-start gap-3">
        <div
          onClick={() => onToggleComplete(task.id)}
          className={clsx(
            "mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors duration-150",
            task.completed
              ? "bg-blue-main border-blue-main"
              : "border-text-muted hover:border-purple-light",
          )}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              "text-text-primary font-medium",
              task.completed && "line-through opacity-60",
            )}
          >
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.completed ? (
              <span className="text-xs px-2 py-0.5 rounded-full border border-green-main/30 bg-green-main/10 text-green-main font-mono uppercase">
                [ COMPLETED ]
              </span>
            ) : (
              <>
                {task.priority === "high" && (
                  <span className="text-xs px-2 py-0.5 rounded-full border font-mono uppercase text-red-main border-red-main/30 bg-red-main/10">
                    [ HIGH_PRIORITY ]
                  </span>
                )}
                {task.priority === "medium" && (
                  <span className="text-xs px-2 py-0.5 rounded-full border font-mono uppercase text-blue-main border-blue-main/30 bg-blue-main/10">
                    [ NORMAL ]
                  </span>
                )}
                {task.priority === "low" && (
                  <span className="text-xs px-2 py-0.5 rounded-full border font-mono uppercase text-text-secondary border-bg-border bg-bg-hover">
                    [ LOW ]
                  </span>
                )}

                {task.deadline && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full border font-mono",
                      getDeadlineStatus(task.deadline) === "overdue" &&
                        "text-red-main border-red-main/30 bg-red-main/10",
                      getDeadlineStatus(task.deadline) === "today" &&
                        "text-amber-main border-amber-main/30 bg-amber-main/10",
                      getDeadlineStatus(task.deadline) === "upcoming" &&
                        "text-text-secondary border-bg-border bg-bg-hover",
                    )}
                  >
                    {formatDeadline(task.deadline)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-bg-hover transition-colors duration-150 text-text-secondary hover:text-text-primary"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-bg-hover transition-colors duration-150 text-text-secondary hover:text-red-main"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
