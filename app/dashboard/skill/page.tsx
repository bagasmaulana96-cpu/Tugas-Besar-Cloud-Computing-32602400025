"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getLevelFromExp,
  getExpPerSession,
  calculateStreak,
  hasClaimedToday,
} from "@/lib/exp";
import SkillForm from "@/components/skill/skill-form";
import SkillCard from "@/components/skill/skill-card";
import { Skill } from "@/types";

export default function SkillPage() {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setSkills(data ?? []);
      setLoading(false);
    }
    fetchSkills();
  }, []);

  const dailyYield = skills.reduce((sum, skill) => {
    if (hasClaimedToday(skill.last_claimed_at)) {
      const level = getLevelFromExp(skill.total_exp).level;
      return sum + getExpPerSession(level, skill.streak_days);
    }
    return sum;
  }, 0);

  async function handleAddSkill(name: string, description: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inserted } = await supabase
      .from("skills")
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        total_exp: 0,
        streak_days: 0,
        last_claimed_at: null,
      })
      .select()
      .single();

    if (inserted) {
      setSkills((prev) => [...prev, inserted]);
    }
  }

  async function handleClaim(id: string) {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;

    const level = getLevelFromExp(skill.total_exp).level;
    const expGain = getExpPerSession(level, skill.streak_days);
    const newStreak = calculateStreak(skill.last_claimed_at, skill.streak_days);
    const now = new Date().toISOString();

    await supabase
      .from("skills")
      .update({
        total_exp: skill.total_exp + expGain,
        streak_days: newStreak,
        last_claimed_at: now,
      })
      .eq("id", id);

    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              total_exp: s.total_exp + expGain,
              streak_days: newStreak,
              last_claimed_at: now,
            }
          : s,
      ),
    );
  }

  async function handleDelete(id: string) {
    await supabase.from("skills").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
        Skill Matrix
      </h1>
      <p className="text-text-secondary text-sm mt-1 mb-6 max-w-2xl">
        Initialize learning protocols. Expand your cognitive parameters and
        maintain optimal daily streaks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-card/60 backdrop-blur-md border border-purple-mid/40 rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wide font-mono mb-2">
            [ System Status ]
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {skills.length}
          </p>
          <p className="text-text-secondary text-sm mt-1">Active Skills</p>
        </div>
        <div className="bg-bg-card/60 backdrop-blur-md border border-purple-mid/40 rounded-2xl p-5">
          <p className="text-text-secondary text-xs uppercase tracking-wide font-mono mb-2">
            [ Daily Yield ]
          </p>
          <p className="text-3xl font-bold text-purple-light">
            +{dailyYield} <span className="text-lg text-text-muted">EXP</span>
          </p>
          <p className="text-text-secondary text-sm mt-1">Today's total gain</p>
        </div>
        <SkillForm onSubmit={handleAddSkill} />
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          Loading skill matrix...
        </p>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles size={40} className="text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">
            No skills yet. Initialize your first sequence above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClaim={handleClaim}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
