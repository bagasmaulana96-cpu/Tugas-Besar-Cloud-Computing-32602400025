"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Bell, Moon, Sun, Menu, X, LogOut } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import clsx from "clsx";

export default function Appbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Theme initialization
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  // Fetch Supabase user on mount
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    fetch();
  }, [supabase]);

  const navLinks = [
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/todo", label: "To-Do" },
    { href: "/dashboard/finance", label: "Finance" },
    { href: "/dashboard/skill", label: "Skill RPG" },
    { href: "/dashboard/schedule", label: "Schedule" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-14 bg-bg-surface/80 backdrop-blur-md border-b border-bg-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/menu-select" className="flex items-center gap-2.5">
            <div className="bg-purple-main rounded-lg p-1.5">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-purple-light text-lg tracking-tight">
              LevelUp
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              const activeCls =
                "border border-purple-mid rounded-full px-4 py-1.5 text-text-primary text-sm font-medium bg-purple-dim";
              const inactiveCls =
                "px-4 py-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors duration-150 rounded-full hover:bg-bg-hover";
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(active ? activeCls : inactiveCls)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Action items */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-bg-hover transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Moon size={16} className="text-text-secondary" />
              ) : (
                <Sun size={16} className="text-text-secondary" />
              )}
            </button>

            {/* Notification bell */}
            <button
              className="rounded-lg p-2 hover:bg-bg-hover transition-colors duration-150"
              aria-label="Notifications"
            >
              <Bell size={16} className="text-text-secondary" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden rounded-lg p-2 hover:bg-bg-hover transition-colors duration-150"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-text-secondary" />
            </button>

            {/* Avatar dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-8 h-8 rounded-full bg-purple-dim border border-purple-mid flex items-center justify-center outline-none">
                  <span className="text-purple-light text-sm font-bold uppercase">
                    {user?.email?.charAt(0) ?? "?"}
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
                    {user?.email}
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
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-bg-border rounded-t-2xl p-6 md:hidden animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-primary font-bold text-lg">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-text-secondary"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                const activeCls = "bg-purple-dim text-purple-light";
                const baseCls =
                  "text-text-primary text-lg py-3 px-2 rounded-xl hover:bg-bg-hover transition-colors duration-150";
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(baseCls, active && activeCls)}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
