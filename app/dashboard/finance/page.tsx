"use client";

import React, { useState, useEffect } from "react";
import { Plus, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FinanceSummaryCards from "@/components/finance/finance-summary";
import DonutChart from "@/components/finance/donut-chart";
import TransactionForm, {
  TransactionFormData,
} from "@/components/finance/transaction-form";
import TransactionList from "@/components/finance/transaction-list";
import CategoryManager from "@/components/finance/category-manager";
import {
  TransactionWithCategory,
  FinanceCategory,
  FinanceSummary,
  TransactionType,
} from "@/types";

export default function FinancePage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    [],
  );
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formDefaultType, setFormDefaultType] =
    useState<TransactionType>("income");
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: txData } = await supabase
        .from("transactions")
        .select("*, finance_categories(*)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      const { data: catData } = await supabase
        .from("finance_categories")
        .select("*")
        .eq("user_id", user.id);

      setTransactions(txData ?? []);
      setCategories(catData ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const summary: FinanceSummary = {
    totalIncome: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0),
    totalExpense: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0),
    netBalance: 0,
  };
  summary.netBalance = summary.totalIncome - summary.totalExpense;

  function groupByCategory(type: TransactionType) {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === type)
      .forEach((t) => {
        const name = t.finance_categories?.name ?? "Uncategorized";
        map.set(name, (map.get(name) ?? 0) + Number(t.amount));
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }

  const expenseData = groupByCategory("expense");
  const incomeData = groupByCategory("income");

  async function handleAddTransaction(data: TransactionFormData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inserted } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: data.type,
        amount: data.amount,
        category_id: data.categoryId,
        note: data.note || null,
        date: data.date,
      })
      .select("*, finance_categories(*)")
      .single();

    if (inserted) {
      setTransactions((prev) => [inserted, ...prev]);
    }
  }

  async function handleDeleteTransaction(id: string) {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleAddCategory(name: string, type: TransactionType) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inserted } = await supabase
      .from("finance_categories")
      .insert({ user_id: user.id, name, type, is_default: false })
      .select()
      .single();

    if (inserted) {
      setCategories((prev) => [...prev, inserted]);
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
        Financial Overview
      </h1>
      <p className="text-text-secondary text-sm mt-1 mb-6">
        Real-time telemetry and resource analysis.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => {
            setFormDefaultType("income");
            setFormOpen(true);
          }}
          className="bg-green-main/10 hover:bg-green-main/20 text-green-main border border-green-main/20 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <Plus size={14} />
          Add Income
        </button>
        <button
          onClick={() => {
            setFormDefaultType("expense");
            setFormOpen(true);
          }}
          className="bg-red-main/10 hover:bg-red-main/20 text-red-main border border-red-main/20 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
        >
          <Plus size={14} />
          Add Expense
        </button>
        <button
          onClick={() => setCategoryManagerOpen(true)}
          className="border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-2"
        >
          <Settings2 size={14} />
          Manage Categories
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          Loading finance data...
        </p>
      ) : (
        <>
          <FinanceSummaryCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
            <DonutChart data={expenseData} title="Pengeluaran per Kategori" />
            <DonutChart data={incomeData} title="Pemasukan per Sumber" />
          </div>

          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />
        </>
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        categories={categories}
        defaultType={formDefaultType}
        onSubmit={handleAddTransaction}
      />

      <CategoryManager
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}
