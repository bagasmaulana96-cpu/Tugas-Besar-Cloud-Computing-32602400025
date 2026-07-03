import { ClipboardList } from "lucide-react";
import TaskItem from "./task-item";
import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  if (sortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ClipboardList size={40} className="text-text-muted mb-3" />
        <p className="text-text-secondary text-sm">
          No tasks found. Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
