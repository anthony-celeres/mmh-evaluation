"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

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
    if (item.first_sem && item.second_sem) {
      completedIds.add(item.occupant_id);
    }
  }
  return completedIds;
}

export async function addEvaluation(formData: FormData) {
  const supabase = await createClient();

  try {
    const occupant_id = formData.get("occupant_id") as string;
    const evaluator_points = parseFloat(formData.get("evaluator_points") as string) || 0;
    const record_points = parseFloat(formData.get("record_points") as string) || 0;
    const first_sem = formData.get("first_sem") as string;
    const second_sem = (evaluator_points + record_points).toString();

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
  const supabase = await createClient();

  // Get all recent evaluations to calculate ranking
  const { data: allEvaluations, error: allErr } = await supabase
    .from("occupant_evaluations")
    .select("id, occupant_id, second_sem, first_sem")
    .order("created_at", { ascending: false });

  if (allErr) {
    console.error("Error fetching all evaluations for rank calculation:", allErr);
    return [];
  }

  // Calculate scores for all
  const scoredData = (allEvaluations || []).map(item => {
    const s2 = parseFloat(item.second_sem) || 0;
    const s1 = parseFloat(item.first_sem) || 0;
    return { id: item.id, final: (s2 * 0.6) + (s1 * 0.4) };
  });

  // Sort all to get ranks
  const sorted = [...scoredData].sort((a, b) => b.final - a.final);

  // Get specific user's evaluations
  const { data, error } = await supabase
    .from("occupant_evaluations")
    .select("*")
    .eq("occupant_id", occupantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching evaluations:", error);
    return [];
  }

  // Attach rank to each evaluation
  return (data || []).map(item => {
    const s2 = parseFloat(item.second_sem) || 0;
    const s1 = parseFloat(item.first_sem) || 0;
    const final = (s2 * 0.6) + (s1 * 0.4);
    const rank = sorted.findIndex(r => r.final <= final) + 1; // Simplistic rank
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
