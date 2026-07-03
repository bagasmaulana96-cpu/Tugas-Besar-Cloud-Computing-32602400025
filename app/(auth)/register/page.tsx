"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Category = [string, "income" | "expense"];

const CATEGORIES: Category[] = [
  ["Gaji", "income"],
  ["Freelance", "income"],
  ["Investasi", "income"],
  ["Hadiah", "income"],
  ["Lain-lain", "income"],
  ["Jajan", "expense"],
  ["Pembayaran", "expense"],
  ["Iuran", "expense"],
  ["Nabung", "expense"],
  ["Transportasi", "expense"],
  ["Lain-lain", "expense"],
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signError) {
      setError(signError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      const userId = data.user.id;
      await supabase.from("profiles").insert({ id: userId, name });
      const catRows = CATEGORIES.map(([catName, type]) => ({
        user_id: userId,
        name: catName,
        type,
        is_default: true,
      }));
      await supabase.from("finance_categories").insert(catRows);
      router.push("/dashboard/profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-main/20 blur-[120px] pointer-events-none z-0" />
      <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={20} className="text-purple-light" />
          <span className="font-bold text-purple-light text-lg">LevelUp</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
          Create Account
        </h1>
        <p className="text-text-secondary text-sm text-center mb-6">
          Start your journey to level up
        </p>
        {error && (
          <div className="bg-red-main/10 border border-red-main/20 text-red-main text-sm rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-main hover:bg-purple-light text-white rounded-xl px-4 py-2.5 font-medium w-full disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-text-secondary text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-light hover:text-purple-glow font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
