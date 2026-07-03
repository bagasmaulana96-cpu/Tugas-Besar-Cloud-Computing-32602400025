export type TaskPriority = 'low' | 'medium' | 'high';
export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense';

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

export interface TransactionWithCategory extends Transaction {
  finance_categories: FinanceCategory | null;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentLevelExp: number;
  nextLevelExp: number;
  progressPercent: number;
}

export type TaskFilter = 'all' | 'active' | 'completed' | 'today';

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface ProfileStats {
  level: number;
  expToday: number;
  balance: number;
  tasksCompletedToday: number;
}
