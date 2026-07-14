"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MenuSelectStack from "@/components/menu-select/menu-select-stack";

export default function MenuSelectPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setChecked(true);
    }
    checkSession();
  }, []);

  if (!checked) {
    return <div className="fixed inset-0 bg-bg-base" />;
  }

  return <MenuSelectStack />;
}
