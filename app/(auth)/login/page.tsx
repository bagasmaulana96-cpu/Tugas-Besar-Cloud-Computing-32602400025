"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/profile");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-main/20 blur-[120px] pointer-events-none z-0" />

      <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap size={20} className="text-purple-light" />
          <span className="font-bold text-purple-light text-lg tracking-tight">
            LevelUp
          </span>
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-1 text-center">
          Welcome Back
        </h1>
        <p className="text-text-secondary text-sm mb-6 text-center">
          Sign in to continue your journey
        </p>

        {error && (
          <div className="bg-red-main/10 border border-red-main/20 text-red-main text-sm rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
            />
          </div>

          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-main hover:bg-purple-light text-white rounded-xl px-4 py-2.5 font-medium transition-colors duration-150 w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-text-secondary text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-purple-light hover:text-purple-glow transition-colors duration-150 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
