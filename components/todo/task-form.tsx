"use client"

import React, { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { Task, TaskPriority } from "@/types"

export interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  deadline: string
}

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Task | null
  onSubmit: (data: TaskFormData) => Promise<void>
}

export default function TaskForm({ open, onOpenChange, initialData, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description ?? "")
      setPriority(initialData.priority)
      setDeadline(initialData.deadline ? initialData.deadline.slice(0, 16) : "")
    } else if (open) {
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDeadline("")
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onSubmit({ title, description, priority, deadline })
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-card/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 w-[calc(100%-2rem)] max-w-md z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
          <Dialog.Close className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <X size={18} />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-bold text-text-primary mb-6">
            {initialData ? "Edit Task" : "Add Task"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional details"
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full resize-none"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
              />
            </div>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl px-4 py-2.5 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-main hover:bg-purple-light text-white rounded-xl px-4 py-2.5 font-medium transition-colors duration-150 disabled:opacity-50"
              >
                {loading ? "Saving..." : initialData ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
