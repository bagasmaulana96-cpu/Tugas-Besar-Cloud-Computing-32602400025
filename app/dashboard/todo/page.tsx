"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TaskForm, { TaskFormData } from "@/components/todo/task-form";
import TaskFilterTabs from "@/components/todo/task-filter";
import TaskList from "@/components/todo/task-list";
import { Task, TaskFilter } from "@/types";

export default function TodoPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTasks(data ?? []);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "today") {
      if (!task.deadline) return false;
      const d = new Date(task.deadline);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
    return true;
  });

  async function handleToggleComplete(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    await supabase
      .from("tasks")
      .update({ completed: newCompleted })
      .eq("id", id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)),
    );
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleDelete(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleFormSubmit(data: TaskFormData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingTask) {
      await supabase
        .from("tasks")
        .update({
          title: data.title,
          description: data.description || null,
          priority: data.priority,
          deadline: data.deadline || null,
        })
        .eq("id", editingTask.id);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: data.title,
                description: data.description || null,
                priority: data.priority,
                deadline: data.deadline || null,
              }
            : t,
        ),
      );
    } else {
      const { data: inserted } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          priority: data.priority,
          deadline: data.deadline || null,
          completed: false,
        })
        .select()
        .single();

      if (inserted) {
        setTasks((prev) => [inserted, ...prev]);
      }
    }
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingTask(null);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Active Protocols
        </h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
          className="bg-purple-main hover:bg-purple-light text-white rounded-full px-5 py-2.5 font-medium text-sm transition-colors duration-150 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <p className="text-text-secondary text-sm mb-6">
        Manage your objectives, Commander.
      </p>

      <TaskFilterTabs activeFilter={filter} onFilterChange={setFilter} />

      <div className="border-b border-bg-border my-6" />

      {loading ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          Loading tasks...
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TaskForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        initialData={editingTask}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
