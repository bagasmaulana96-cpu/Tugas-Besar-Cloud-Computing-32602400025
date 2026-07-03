"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, User, LogOut } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function LandingNavbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-bg-surface/80 backdrop-blur-md border-b border-bg-border">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo – always visible */}
        <Link href="/" className="flex items-center gap-2">
          <Zap size={18} className="text-purple-light" />
          <span className="font-bold text-purple-light uppercase tracking-wide text-sm md:text-base">
            LEVEL UP PROJECT
          </span>
        </Link>

        {/* Right side – varies by state */}
        {loading ? (
          // placeholder to keep layout stable while loading
          <div className="w-8 h-8" />
        ) : user ? (
          // Logged‑in view
          <>
            {/* Center navigation – hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard/profile"
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors duration-150 rounded-full hover:bg-bg-hover"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/todo"
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors duration-150 rounded-full hover:bg-bg-hover"
              >
                To‑Do
              </Link>
              <Link
                href="/dashboard/finance"
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors duration-150 rounded-full hover:bg-bg-hover"
              >
                Finance
              </Link>
              <Link
                href="/dashboard/skill"
                className="px-4 py-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors duration-150 rounded-full hover:bg-bg-hover"
              >
                Skill
              </Link>
            </nav>

            {/* Avatar dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-8 h-8 rounded-full bg-purple-dim border border-purple-mid flex items-center justify-center outline-none">
                  <span className="text-purple-light text-sm font-bold uppercase">
                    {user.email?.charAt(0) ?? "?"}
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="bg-bg-card/90 backdrop-blur-xl border border-bg-border rounded-2xl p-1 min-w-[180px] z-50 animate-fade-in"
                >
                  <div className="text-text-secondary text-xs px-3 py-2 truncate">
                    {user.email}
                  </div>
                  <DropdownMenu.Separator className="border-t border-bg-border my-1" />
                  <DropdownMenu.Item
                    onSelect={async () => {
                      await supabase.auth.signOut();
                      router.push("/login");
                    }}
                    className="flex gap-2 items-center px-3 py-2 rounded-xl hover:bg-bg-hover text-red-main text-sm cursor-pointer outline-none"
                  >
                    <LogOut size={14} />
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        ) : (
          // Guest view
          <button
            onClick={() => router.push("/login")}
            className="rounded-full p-2 border border-bg-border hover:bg-bg-hover transition-colors duration-150"
            aria-label="Account"
          >
            <User size={18} className="text-text-secondary" />
          </button>
        )}
      </div>
    </header>
  );
}
