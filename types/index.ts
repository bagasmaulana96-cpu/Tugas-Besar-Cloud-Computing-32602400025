export type TaskPriority = "low" | "medium" | "high";
export type TransactionType = "income" | "expense";
export type CategoryType = "income" | "expense";

export interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  deadline: string | null;
  completed: boolean;
  created_at: string;
}

export interface FinanceCategory {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  note: string | null;
  date: string;
  created_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  total_exp: number;
  streak_days: number;
  last_claimed_at: string | null;
  created_at: string;
}

export type RecurrenceType = "daily" | "weekly" | "monthly";
export type ScheduleColor = "purple" | "green" | "blue" | "amber" | "red";

export interface Schedule {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_type: RecurrenceType | null;
  recurrence_days: number[] | null;
  recurrence_end_date: string | null;
  color: ScheduleColor;
  created_at: string;
}
export interface TransactionWithCategory extends Transaction {
  finance_categories: FinanceCategory | null;
}
// Return shape of lib/exp.ts getLevelFromExp()
export interface LevelInfo {
  level: number;
  title: string;
  currentLevelExp: number;
  nextLevelExp: number;
  progressPercent: number;
}

// Used by components/todo/task-filter.tsx and app/dashboard/todo/page.tsx
export type TaskFilter = "all" | "active" | "completed" | "today";

// Used by components/finance/finance-summary.tsx
export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

// Used by components/profile/stats-widget.tsx and app/dashboard/profile/page.tsx
export interface ProfileStats {
  level: number;
  expToday: number;
  balance: number;
  tasksCompletedToday: number;
}
