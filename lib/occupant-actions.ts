"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/utils/supabase/admin";
import { requireAdminUser } from "@/lib/admin";
import { ensureOccupantEvaluationExists } from "@/lib/evaluation-actions";

function parseYear(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 1;
}

export async function createOccupant(formData: FormData) {
  await requireAdminUser();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const degreeProgram = String(formData.get("degree_program") || "").trim();
  const roomNumber = String(formData.get("room_number") || "").trim();
  const role = String(formData.get("role") || "occupant") as "admin" | "occupant";

  if (!fullName || !email || !password || !degreeProgram || !roomNumber) {
    redirect("/admin/occupants");
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      degree_program: degreeProgram,
      year: String(parseYear(formData.get("year"))),
      room_number: roomNumber,
      role,
    },
  });

  if (error || !data.user) {
    console.log(error);
    redirect("/admin/occupants");
  }

  const { error: profileError } = await admin.from("users").upsert(
    {
      auth_user_id: data.user.id,
      full_name: fullName,
      email,
      degree_program: degreeProgram,
      year: parseYear(formData.get("year")),
      room_number: roomNumber,
      role,
    },
    { onConflict: "auth_user_id" }
  );

  if (profileError) {
    console.log(profileError);
  } else if (role === "occupant") {
    await ensureOccupantEvaluationExists(data.user.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/occupants");
  redirect("/admin/occupants");
}

export async function updateOccupant(formData: FormData) {
  await requireAdminUser();

  const authUserId = String(formData.get("auth_user_id") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const degreeProgram = String(formData.get("degree_program") || "").trim();
  const roomNumber = String(formData.get("room_number") || "").trim();
  const role = String(formData.get("role") || "occupant") as "admin" | "occupant";

  if (!authUserId || !fullName || !email || !degreeProgram || !roomNumber) {
    redirect("/admin/occupants");
  }

  const admin = createAdminClient();

  const authUpdatePayload: {
    email: string;
    password?: string;
    user_metadata: Record<string, string>;
  } = {
    email,
    user_metadata: {
      full_name: fullName,
      degree_program: degreeProgram,
      year: String(parseYear(formData.get("year"))),
      room_number: roomNumber,
      role,
    },
  };

  if (password) {
    authUpdatePayload.password = password;
  }

  const { error: authError } = await admin.auth.admin.updateUserById(
    authUserId,
    authUpdatePayload
  );

  if (authError) {
    console.log(authError);
    redirect("/admin/occupants");
  }

  const { error: profileError } = await admin
    .from("users")
    .upsert(
      {
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        degree_program: degreeProgram,
        year: parseYear(formData.get("year")),
        room_number: roomNumber,
        role,
      },
      { onConflict: "auth_user_id" }
    );

  if (profileError) {
    console.log(profileError);
  } else if (role === "occupant") {
    await ensureOccupantEvaluationExists(authUserId);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/occupants");
  revalidatePath(`/admin/occupants/${authUserId}/edit`);
  redirect("/admin/occupants");
}

export async function deleteOccupant(formData: FormData) {
  await requireAdminUser();

  const authUserId = String(formData.get("auth_user_id") || "");

  if (!authUserId) {
    redirect("/admin/occupants");
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(authUserId);

  if (error) {
    console.log(error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/occupants");
  redirect("/admin/occupants");
}