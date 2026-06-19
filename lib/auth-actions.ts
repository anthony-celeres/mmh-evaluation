"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/utils/supabase/admin";
import { getCurrentUserProfile } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const metadata = user.user_metadata ?? {};
    const adminSupabase = createAdminClient();

    const profile = {
      auth_user_id: user.id,
      full_name: (metadata.full_name as string) || user.email || "Unknown",
      email: user.email || data.email,
      degree_program: (metadata.degree_program as string) || "Undeclared",
      year: Number(metadata.year) || 1,
      room_number: (metadata.room_number as string) || null,
      role: (metadata.role as string) || "occupant",
    };

    const { error: profileError } = await adminSupabase
      .from("users")
      .upsert(profile, { onConflict: "auth_user_id" });

    if (profileError) {
      console.log(profileError);
    }
  }

  revalidatePath("/", "layout");

  const profile = await getCurrentUserProfile();
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}
