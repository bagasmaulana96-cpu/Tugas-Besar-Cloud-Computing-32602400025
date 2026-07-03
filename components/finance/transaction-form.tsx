"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import clsx from "clsx";
import { FinanceCategory, TransactionType } from "@/types";

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  categoryId: string;
  note: string;
  date: string;
}

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FinanceCategory[];
  defaultType: TransactionType;
  onSubmit: (data: TransactionFormData) => Promise<void>;
}

export default function TransactionForm({
  open,
  onOpenChange,
  categories,
  defaultType,
  onSubmit,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);

  // reset when dialog opens
  useEffect(() => {
    if (open) {
      setType(defaultType);
      setAmount("");
      setCategoryId("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [open, defaultType]);

  // reset category when type changes
  useEffect(() => {
    setCategoryId("");
  }, [type]);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    if (!categoryId) return;
    if (!date) return;
    setLoading(true);
    await onSubmit({ type, amount: amountNum, categoryId, note, date });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-card/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 w-[calc(100%-2rem)] max-w-md z-50 animate-fade-in max-h-[90vh] overflow-y-auto">
          <Dialog.Close className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <X size={18} />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-bold text-text-primary mb-6">
            {type === "income" ? "Add Income" : "Add Expense"}
          </Dialog.Title>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setType("income")}
              className={clsx(
                "flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150 border",
                type === "income"
                  ? "bg-green-main/10 text-green-main border-green-main/30"
                  : "text-text-secondary border-bg-border hover:bg-bg-hover",
              )}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={clsx(
                "flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150 border",
                type === "expense"
                  ? "bg-red-main/10 text-red-main border-red-main/30"
                  : "text-text-secondary border-bg-border hover:bg-bg-hover",
              )}
            >
              Expense
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Category
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary w-full"
              >
                <option value="">Select category</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
                Note (optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
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
                className={clsx(
                  "flex-1 rounded-xl px-4 py-2.5 font-medium transition-colors duration-150 text-white disabled:opacity-50",
                  type === "income"
                    ? "bg-green-main hover:bg-green-main/80"
                    : "bg-red-main hover:bg-red-main/80",
                )}
              >
                {loading ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
