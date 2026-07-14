"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { X } from "lucide-react";
import clsx from "clsx";
import { Schedule, RecurrenceType, ScheduleColor } from "@/types";

export interface ScheduleFormData {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  color: ScheduleColor;
  is_recurring: boolean;
  recurrence_type: RecurrenceType | null;
  recurrence_days: number[];
  recurrence_end_date: string | null;
}

interface ScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Schedule | null;
  defaultDate: string;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
}

const COLORS: { value: ScheduleColor; class: string }[] = [
  { value: "purple", class: "bg-purple-main" },
  { value: "green", class: "bg-green-main" },
  { value: "blue", class: "bg-blue-main" },
  { value: "amber", class: "bg-amber-main" },
  { value: "red", class: "bg-red-main" },
];

export default function ScheduleForm({
  open,
  onOpenChange,
  initialData,
  defaultDate,
  onSubmit,
}: ScheduleFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState<ScheduleColor>("purple");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("daily");
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
  const [noEndDate, setNoEndDate] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description ?? "");
      setDate(initialData.date);
      setStartTime(initialData.start_time.slice(0, 5));
      setEndTime(initialData.end_time.slice(0, 5));
      setColor(initialData.color as ScheduleColor);
      setIsRecurring(initialData.is_recurring);
      setRecurrenceType(
        (initialData.recurrence_type as RecurrenceType) ?? "daily",
      );
      setRecurrenceDays(initialData.recurrence_days ?? []);
      setRecurrenceEndDate(initialData.recurrence_end_date ?? "");
      setNoEndDate(!initialData.recurrence_end_date);
    } else if (open && !initialData) {
      setTitle("");
      setDescription("");
      setDate(defaultDate);
      setStartTime("09:00");
      setEndTime("10:00");
      setColor("purple");
      setIsRecurring(false);
      setRecurrenceType("daily");
      setRecurrenceDays([]);
      setRecurrenceEndDate("");
      setNoEndDate(true);
    }
  }, [open, initialData, defaultDate]);

  function toggleRecurrenceDay(day: number) {
    setRecurrenceDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !startTime || !endTime) return;
    setLoading(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      start_time: startTime,
      end_time: endTime,
      color,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? recurrenceType : null,
      recurrence_days:
        isRecurring && recurrenceType === "weekly" ? recurrenceDays : [],
      recurrence_end_date: isRecurring && !noEndDate ? recurrenceEndDate : null,
    });
    setLoading(false);
    onOpenChange(false);
  }

  const WEEKDAYS = [
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
    { value: 0, label: "Sun" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-card/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 w-[calc(100%-2rem)] max-w-md z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
          <Dialog.Close className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <X size={18} />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-bold text-text-primary mb-6">
            {initialData ? "Edit Schedule" : "Add Schedule"}
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Schedule title"
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details"
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full resize-none"
              />
            </div>

            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
                />
              </div>
              <div>
                <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={clsx(
                      "w-8 h-8 rounded-full transition-all duration-150",
                      c.class,
                      color === c.value &&
                        "ring-2 ring-offset-2 ring-offset-bg-card ring-purple-light",
                    )}
                    aria-label={c.value}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-text-secondary text-xs uppercase tracking-wide">
                  Recurring
                </label>
                <Switch.Root
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="w-9 h-5 bg-bg-border rounded-full relative data-[state=checked]:bg-purple-main transition-colors duration-150"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-150 translate-x-0.5 data-[state=checked]:translate-x-4" />
                </Switch.Root>
              </div>

              {isRecurring && (
                <div className="mt-3 flex flex-col gap-3 animate-fade-in">
                  <div>
                    <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                      Repeat
                    </label>
                    <select
                      value={recurrenceType}
                      onChange={(e) =>
                        setRecurrenceType(e.target.value as RecurrenceType)
                      }
                      className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {recurrenceType === "weekly" && (
                    <div>
                      <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                        On Days
                      </label>
                      <div className="flex gap-1.5 flex-wrap">
                        {WEEKDAYS.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => toggleRecurrenceDay(d.value)}
                            className={clsx(
                              "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 border",
                              recurrenceDays.includes(d.value)
                                ? "bg-purple-dim border-purple-mid text-purple-light"
                                : "text-text-secondary border-bg-border hover:bg-bg-hover",
                            )}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      disabled={noEndDate}
                      value={recurrenceEndDate}
                      onChange={(e) => setRecurrenceEndDate(e.target.value)}
                      className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 mt-2 text-text-secondary text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noEndDate}
                        onChange={(e) => setNoEndDate(e.target.checked)}
                        className="accent-purple-main"
                      />
                      No end date
                    </label>
                  </div>
                </div>
              )}
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
                {loading
                  ? "Saving..."
                  : initialData
                    ? "Save Changes"
                    : "Add Schedule"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
