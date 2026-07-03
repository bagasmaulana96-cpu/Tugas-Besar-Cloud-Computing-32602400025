"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface SkillFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
}

export default function SkillForm({ onSubmit }: SkillFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit(name.trim(), description.trim());
    setName("");
    setDescription("");
    setExpanded(false);
    setLoading(false);
  };

  return (
    <div className="bg-bg-card/60 backdrop-blur-md border border-purple-mid/40 rounded-2xl p-5">
      <p className="text-text-secondary text-xs uppercase tracking-wide font-mono mb-3">
        [ Initialize New Sequence ]
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Enter skill parameter..."
            className="flex-1 bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted text-sm"
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="bg-purple-main hover:bg-purple-light text-white rounded-xl px-3.5 py-2.5 transition-colors duration-150 disabled:opacity-50 flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>

        {expanded && (
          <div className="mt-3 animate-fade-in">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="bg-bg-surface border border-bg-border focus:border-purple-main rounded-xl px-3 py-2.5 outline-none transition-colors duration-150 text-text-primary placeholder:text-text-muted text-sm w-full"
            />
          </div>
        )}
      </form>
    </div>
  );
}
