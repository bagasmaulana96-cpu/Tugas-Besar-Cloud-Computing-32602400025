"use client";

import { Trash2, Receipt } from "lucide-react";
import { TransactionWithCategory } from "@/types";

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this transaction?")) onDelete(id);
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-0 mb-4">
        <h3 className="text-lg font-bold text-text-primary">
          Recent Transactions
        </h3>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <Receipt size={32} className="text-text-faint mb-2" />
          <p className="text-text-secondary text-sm">No transactions yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left text-xs uppercase tracking-wide text-text-secondary font-normal px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-text-secondary font-normal px-6 py-3">
                  Category
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-text-secondary font-normal px-6 py-3">
                  Note
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-text-secondary font-normal px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-text-secondary font-normal px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-bg-border2 hover:bg-bg-hover/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {tx.finance_categories?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {tx.note || "—"}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-mono font-medium ${tx.type === "income" ? "text-green-main" : "text-red-main"}`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {Number(tx.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-text-secondary hover:text-red-main transition-colors duration-150 p-1.5 rounded-lg hover:bg-bg-hover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 p-6 pt-0">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="border border-bg-border2 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-medium text-sm">
                    {tx.finance_categories?.name ?? "—"}
                  </span>
                  <span
                    className={`font-mono font-medium text-sm ${tx.type === "income" ? "text-green-main" : "text-red-main"}`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {Number(tx.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-text-secondary text-xs">
                    {formatDate(tx.date)}
                    {tx.note ? ` · ${tx.note}` : ""}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-text-secondary hover:text-red-main transition-colors duration-150 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
