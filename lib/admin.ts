import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export type AdminUserRow = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  degree_program: string;
  year: number;
  room_number: string | null;
  role: "admin" | "occupant";
  created_at: string;
  updated_at: string;
};

export async function getCurrentUserProfile() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }

    return profile as AdminUserRow;
  } catch (error) {
    console.error("getCurrentUserProfile failed:", error);
    return null;
  }
}

export async function requireAdminUser() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    notFound();
  }

  return profile;
}

export async function getAllProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AdminUserRow[];
}

export async function getProfileByAuthId(authUserId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminUserRow;
}