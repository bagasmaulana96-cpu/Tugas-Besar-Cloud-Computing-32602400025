import {
  eachDayOfInterval,
  isWithinInterval,
  getDate,
  getDay,
  format,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import { Schedule } from "@/types";

export function getOccurrencesInRange(
  schedules: Schedule[],
  rangeStart: Date,
  rangeEnd: Date,
): Map<string, Schedule[]> {
  const map = new Map<string, Schedule[]>();

  function addToMap(dateKey: string, schedule: Schedule) {
    const existing = map.get(dateKey) ?? [];
    existing.push(schedule);
    map.set(dateKey, existing);
  }

  for (const schedule of schedules) {
    const anchorDate = parseISO(schedule.date);

    if (!schedule.is_recurring) {
      if (isWithinInterval(anchorDate, { start: rangeStart, end: rangeEnd })) {
        addToMap(format(anchorDate, "yyyy-MM-dd"), schedule);
      }
      continue;
    }

    const seriesEnd = schedule.recurrence_end_date
      ? parseISO(schedule.recurrence_end_date)
      : rangeEnd;
    const effectiveEnd = isBefore(seriesEnd, rangeEnd) ? seriesEnd : rangeEnd;
    const effectiveStart = isAfter(anchorDate, rangeStart)
      ? anchorDate
      : rangeStart;

    if (isAfter(effectiveStart, effectiveEnd)) continue;

    const daysInRange = eachDayOfInterval({
      start: effectiveStart,
      end: effectiveEnd,
    });

    if (schedule.recurrence_type === "daily") {
      for (const day of daysInRange) {
        addToMap(format(day, "yyyy-MM-dd"), schedule);
      }
    } else if (schedule.recurrence_type === "weekly") {
      const allowedDays = schedule.recurrence_days ?? [];
      for (const day of daysInRange) {
        if (allowedDays.includes(getDay(day))) {
          addToMap(format(day, "yyyy-MM-dd"), schedule);
        }
      }
    } else if (schedule.recurrence_type === "monthly") {
      const targetDayOfMonth = getDate(anchorDate);
      for (const day of daysInRange) {
        if (getDate(day) === targetDayOfMonth) {
          addToMap(format(day, "yyyy-MM-dd"), schedule);
        }
      }
    }
  }

  for (const [key, occurrences] of map.entries()) {
    map.set(key, sortOccurrencesByTime(occurrences));
  }

  return map;
}

export function sortOccurrencesByTime(schedules: Schedule[]): Schedule[] {
  return [...schedules].sort((a, b) =>
    a.start_time.localeCompare(b.start_time),
  );
}
