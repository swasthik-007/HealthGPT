"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/subabaseClient";

export default function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
        });

      if (error) {
        console.error("❌ Failed to sync user to Supabase:", error);
      } else {
        console.log("✅ User synced with Supabase");
      }
    };

    if (isSignedIn) {
      syncUser();
    }
  }, [user, isSignedIn]);

  return <>{children}</>;
}
