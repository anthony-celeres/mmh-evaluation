"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin";

export async function getEvaluatedOccupantIds() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occupant_evaluations")
    .select("occupant_id, first_sem, second_sem");

  if (error) {
    console.error("Error fetching evaluated occupant IDs:", error);
    return new Set<string>();
  }

  const completedIds = new Set<string>();
  for (const item of data) {
    if ((item.first_sem || item.first_sem === "N/A") && item.second_sem) {
      completedIds.add(item.occupant_id);
    }
  }
  return completedIds;
}

export async function addEvaluation(formData: FormData) {
  await requireAdminUser();
  const supabase = await createClient();

  try {
    const occupant_id = formData.get("occupant_id") as string;
    const evaluator_points = parseFloat(parseFloat(formData.get("evaluator_points") as string).toFixed(4)) || 0;
    const record_points = parseFloat(parseFloat(formData.get("record_points") as string).toFixed(4)) || 0;
    const first_sem_raw = formData.get("first_sem") as string;
    const first_sem = first_sem_raw === "N/A" ? "N/A" : (parseFloat(parseFloat(first_sem_raw).toFixed(4)) || 0).toString();
    const second_sem = parseFloat((evaluator_points + record_points).toFixed(4)).toString();

    console.log("Attempting to upsert evaluation for:", occupant_id);

    // Use upsert to handle both insert and update based on occupant_id
    // Note: This requires a unique constraint on occupant_id for upsert by occupant_id
    // If no unique constraint exists, we can still use upsert if we provide the ID, 
    // but here we might want to ensure one per user.
    
    // First, check if one exists
    const { data: existing } = await supabase
      .from("occupant_evaluations")
      .select("id")
      .eq("occupant_id", occupant_id)
      .single();

    const evaluationData = {
      occupant_id,
      evaluator_points,
      record_points,
      second_sem,
      first_sem,
    };

    let result;
    if (existing) {
      result = await supabase
        .from("occupant_evaluations")
        .update(evaluationData)
        .eq("id", existing.id)
        .select();
    } else {
      result = await supabase
        .from("occupant_evaluations")
        .insert(evaluationData)
        .select();
    }

    if (result.error) {
      console.error("Supabase Error Details:", result.error);
      throw new Error(result.error.message);
    }

    revalidatePath("/admin/occupants");
    revalidatePath("/admin/records");
    revalidatePath("/");
    
    return { success: true };
  } catch (err: any) {
    console.error("Caught error in addEvaluation:", err);
    throw new Error(err.message || "Failed to add evaluation");
  }
}

export async function getAllEvaluations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("occupant_evaluations")
    .select(`
      *,
      occupant:occupant_id (
        full_name,
        room_number,
        degree_program,
        year
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all evaluations:", error);
    return [];
  }

  return data;
}

export async function getEvaluationsByOccupantId(occupantId: string) {
  const supabase = createAdminClient();

  // Get all profiles (to filter out admins and map correctly)
  const { data: profiles, error: profErr } = await supabase
    .from("users")
    .select("*");

  if (profErr) {
    console.error("Error fetching profiles:", profErr);
    return [];
  }

  // Get all occupant evaluations
  const { data: allEvaluations, error: allErr } = await supabase
    .from("occupant_evaluations")
    .select("*");

  if (allErr) {
    console.error("Error fetching all evaluations:", allErr);
    return [];
  }

  const occupants = (profiles || []).filter((p: any) => p.role !== 'admin');

  // Process and score all
  const processed = occupants.map((profile: any) => {
    const evaluation = (allEvaluations || []).find((e: any) => e.occupant_id === profile.auth_user_id);
    if (!evaluation) return null;

    const secondSem = parseFloat(evaluation.second_sem) || 0;
    const isNA = evaluation.first_sem === "N/A";
    const firstSem = isNA ? null : (parseFloat(evaluation.first_sem) || 0);
    const hasCompleteEval = evaluation.second_sem && (evaluation.first_sem || isNA);

    if (!hasCompleteEval) return null;

    const finalScore = isNA ? secondSem : (secondSem * 0.6) + ((firstSem ?? 0) * 0.4);
    return {
      id: evaluation.id,
      occupant_id: profile.auth_user_id,
      finalScore
    };
  }).filter(Boolean) as any[];

  // Sort descending to get ranks
  const sorted = [...processed].sort((a, b) => b.finalScore - a.finalScore);

  // Get specific user's evaluations
  const userEvaluations = (allEvaluations || []).filter(e => e.occupant_id === occupantId);

  // Attach rank to each evaluation
  return userEvaluations.map(item => {
    const secondSem = parseFloat(item.second_sem) || 0;
    const isNA = item.first_sem === "N/A";
    const hasCompleteEval = item.second_sem && (item.first_sem || isNA);

    let rank = null;
    if (hasCompleteEval) {
      // Use exact index from sorted list
      rank = sorted.findIndex(r => r.id === item.id) + 1;
    }
    return { ...item, rank };
  });
}

export async function ensureOccupantEvaluationExists(authUserId: string) {
  const admin = createAdminClient();
  
  // Check if it already exists
  const { data: existing, error } = await admin
    .from("occupant_evaluations")
    .select("id")
    .eq("occupant_id", authUserId)
    .maybeSingle();
    
  if (error) {
    console.error("Error checking existing evaluation:", error);
    return;
  }
  
  if (!existing) {
    // Insert a default empty evaluation
    const { error: insertError } = await admin
      .from("occupant_evaluations")
      .insert({
        occupant_id: authUserId,
        first_sem: null,
        second_sem: null,
        evaluator_points: null,
        record_points: null
      });
      
    if (insertError) {
      console.error("Error creating default evaluation:", insertError);
    }
  }
}


