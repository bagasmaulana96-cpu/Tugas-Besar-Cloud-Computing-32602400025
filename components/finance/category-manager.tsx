"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import clsx from "clsx";
import { FinanceCategory, CategoryType } from "@/types";

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FinanceCategory[];
  onAddCategory: (name: string, type: CategoryType) => Promise<void>;
}

export default function CategoryManager({
  open,
  onOpenChange,
  categories,
  onAddCategory,
}: CategoryManagerProps) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<CategoryType>("expense");
  const [loading, setLoading] = useState(false);

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    await onAddCategory(newName.trim(), newType);
    setNewName("");
    setLoading(false);
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
            Manage Categories
          </Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-green-main mb-2">
                Income
              </p>
              {incomeCategories.length === 0 ? (
                <p className="text-text-muted text-xs italic">
                  No categories yet
                </p>
              ) : (
                incomeCategories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-surface text-sm text-text-primary mb-1.5"
                  >
                    {c.name}
                    {c.is_default && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-hover text-text-muted">
                        Default
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-red-main mb-2">
                Expense
              </p>
              {expenseCategories.length === 0 ? (
                <p className="text-text-muted text-xs italic">
                  No categories yet
                </p>
              ) : (
                expenseCategories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-surface text-sm text-text-primary mb-1.5"
                  >
                    {c.name}
                    {c.is_default && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-hover text-text-muted">
                        Default
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-bg-border my-6" />

          <div>
            <p className="text-sm font-medium text-text-primary mb-3">
              Add New Category
            </p>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setNewType("income")}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150 border",
                  newType === "income"
                    ? "bg-green-main/10 text-green-main border-green-main/30"
                    : "text-text-secondary border-bg-border hover:bg-bg-hover",
                )}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setNewType("expense")}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-sm font-medium transition-colors duration-150 border",
                  newType === "expense"
                    ? "bg-red-main/10 text-red-main border-red-main/30"
                    : "text-text-secondary border-bg-border hover:bg-bg-hover",
                )}
              >
                Expense
              </button>
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
            />
            <button
              onClick={handleAdd}
              disabled={loading || !newName.trim()}
              className="bg-purple-main hover:bg-purple-light text-white rounded-xl px-4 py-2.5 font-medium transition-colors duration-150 w-full mt-3 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
