import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Appbar from "@/components/appbar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Appbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
