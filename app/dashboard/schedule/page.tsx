"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { getOccurrencesInRange } from "@/lib/schedule";
import CalendarGrid from "@/components/schedule/calendar-grid";
import DayPanel from "@/components/schedule/day-panel";
import ScheduleForm, {
  ScheduleFormData,
} from "@/components/schedule/schedule-form";
import { Schedule } from "@/types";

export default function SchedulePage() {
  const supabase = createClient();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", user.id);
      setSchedules(data ?? []);
      setLoading(false);
    }
    fetchSchedules();
  }, []);

  const occurrences = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: 1,
    });
    const gridEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return getOccurrencesInRange(schedules, gridStart, gridEnd);
  }, [schedules, currentMonth]);

  const selectedDateOccurrences =
    occurrences.get(format(selectedDate, "yyyy-MM-dd")) ?? [];

  function handlePrevMonth() {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }

  function handleToday() {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }

  function handleAddClick() {
    setEditingSchedule(null);
    setFormOpen(true);
  }

  function handleEdit(schedule: Schedule) {
    setEditingSchedule(schedule);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: ScheduleFormData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (editingSchedule) {
      await supabase
        .from("schedules")
        .update({
          title: data.title,
          description: data.description || null,
          date: data.date,
          start_time: data.start_time,
          end_time: data.end_time,
          color: data.color,
          is_recurring: data.is_recurring,
          recurrence_type: data.recurrence_type,
          recurrence_days: data.recurrence_days,
          recurrence_end_date: data.recurrence_end_date,
        })
        .eq("id", editingSchedule.id);

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                title: data.title,
                description: data.description || null,
                date: data.date,
                start_time: data.start_time,
                end_time: data.end_time,
                color: data.color,
                is_recurring: data.is_recurring,
                recurrence_type: data.recurrence_type,
                recurrence_days: data.recurrence_days,
                recurrence_end_date: data.recurrence_end_date,
              }
            : s,
        ),
      );
    } else {
      const { data: inserted } = await supabase
        .from("schedules")
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          date: data.date,
          start_time: data.start_time,
          end_time: data.end_time,
          color: data.color,
          is_recurring: data.is_recurring,
          recurrence_type: data.recurrence_type,
          recurrence_days: data.recurrence_days,
          recurrence_end_date: data.recurrence_end_date,
        })
        .select()
        .single();

      if (inserted) {
        setSchedules((prev) => [...prev, inserted]);
      }
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("schedules").delete().eq("id", id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={handleAddClick}
          className="bg-purple-main hover:bg-purple-light text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Schedule
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          Loading schedule...
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            occurrences={occurrences}
            onSelectDate={setSelectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <DayPanel
            selectedDate={selectedDate}
            occurrences={selectedDateOccurrences}
            onAddClick={handleAddClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <ScheduleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingSchedule}
        defaultDate={format(selectedDate, "yyyy-MM-dd")}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
