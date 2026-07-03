import { TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { FinanceSummary } from "@/types";

interface FinanceSummaryProps {
  summary: FinanceSummary;
}

export default function FinanceSummaryCards({ summary }: FinanceSummaryProps) {
  const { totalIncome, totalExpense, netBalance } = summary;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs uppercase tracking-wide">
            Total Income
          </span>
          <TrendingUp size={16} className="text-green-main" />
        </div>
        <p className="text-3xl font-bold text-green-main">
          ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div
        className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs uppercase tracking-wide">
            Total Expense
          </span>
          <TrendingDown size={16} className="text-red-main" />
        </div>
        <p className="text-3xl font-bold text-red-main">
          $
          {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div
        className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 animate-fade-in"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-secondary text-xs uppercase tracking-wide">
            Net Balance
          </span>
          <Landmark size={16} className="text-purple-light" />
        </div>
        <p className="text-3xl font-bold text-purple-light">
          ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
