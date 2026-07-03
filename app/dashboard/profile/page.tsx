import { createClient } from "@/lib/supabase/server";
import { getLevelFromExp } from "@/lib/exp";
import AvatarUpload from "@/components/profile/avatar-upload";
import StatsWidget from "@/components/profile/stats-widget";
import { Pencil } from "lucide-react";
import { ProfileStats } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: tasksCompletedToday } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("completed", true)
    .gte("created_at", todayStart.toISOString());

  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", user!.id);

  const totalIncome = (transactions ?? [])
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = (transactions ?? [])
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const { data: topSkill } = await supabase
    .from("skills")
    .select("total_exp")
    .eq("user_id", user!.id)
    .order("total_exp", { ascending: false })
    .limit(1)
    .maybeSingle();

  const levelInfo = getLevelFromExp(topSkill?.total_exp ?? 0);

  const stats: ProfileStats = {
    level: levelInfo.level,
    expToday: topSkill?.total_exp ?? 0,
    balance,
    tasksCompletedToday: tasksCompletedToday ?? 0,
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="bg-bg-card/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-8 flex flex-col items-center text-center h-fit">
          <AvatarUpload
            avatarUrl={profile?.avatar_url ?? null}
            name={profile?.name ?? null}
            onUploadSuccess={() => {}}
          />
          <h1 className="mt-4 text-2xl font-bold text-purple-light">
            {profile?.name ?? "Unnamed User"}
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-wide mt-1">
            [ MEMBER ]
          </p>
          <p className="mt-4 text-text-secondary text-sm leading-relaxed">
            {profile?.bio ?? "No bio yet. Click Edit Profile to add one."}
          </p>
          <button
            title="Coming soon"
            className="mt-6 border border-bg-border hover:bg-bg-hover text-text-secondary rounded-xl px-4 py-2 text-sm transition-colors duration-150 flex items-center gap-2 w-full justify-center"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>

        <StatsWidget stats={stats} levelTitle={levelInfo.title} />
      </div>
    </div>
  );
}
