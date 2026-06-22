"use server";

import { createClient } from "@/utils/supabase/server";
import { requireAdminUser } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function getRetainedLimit(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "retained_limit")
    .maybeSingle();

  if (error || !data) {
    return 47;
  }
  return parseInt(data.value) || 47;
}

export async function updateRetainedLimit(limit: number): Promise<boolean> {
  await requireAdminUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("system_settings")
    .upsert({ key: "retained_limit", value: limit.toString() });

  if (error) {
    console.error("Error updating retained_limit:", error);
    return false;
  }
  revalidatePath("/admin/records");
  revalidatePath("/");
  return true;
}

export async function getWaitlistedLimit(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "waitlisted_limit")
    .maybeSingle();

  if (error || !data) {
    return 10;
  }
  return parseInt(data.value) || 10;
}

export async function updateWaitlistedLimit(limit: number): Promise<boolean> {
  await requireAdminUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("system_settings")
    .upsert({ key: "waitlisted_limit", value: limit.toString() });

  if (error) {
    console.error("Error updating waitlisted_limit:", error);
    return false;
  }
  revalidatePath("/admin/records");
  revalidatePath("/");
  return true;
}
