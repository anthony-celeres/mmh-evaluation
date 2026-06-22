"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEvaluation } from "@/lib/evaluation-actions";
import { formatDecimal } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type EvaluationFormProps = {
  occupantId: string;
  occupantName: string;
  existingEvaluation?: {
    id: string;
    evaluator_points: number;
    record_points: number;
    first_sem: string;
    second_sem: string;
  } | null;
  onSuccess?: () => void;
};

export function EvaluationForm({ occupantId, occupantName, existingEvaluation, onSuccess }: EvaluationFormProps) {
  const [isEditing, setIsEditing] = useState(!existingEvaluation);
  const [isFirstSemNA, setIsFirstSemNA] = useState(existingEvaluation?.first_sem === "N/A");
  const [isPending, startTransition] = useTransition();

  if (!isEditing && existingEvaluation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
            Completed
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs border-border"
          >
            Edit Record
          </Button>
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Occupant</Label>
            <p className="text-sm font-medium text-foreground">{occupantName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Evaluator Points</Label>
              <p className="text-sm font-bold text-foreground">{formatDecimal(existingEvaluation.evaluator_points)}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Record Points</Label>
              <p className="text-sm font-bold text-foreground">{formatDecimal(existingEvaluation.record_points)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">1st Sem Points</Label>
              <p className={`text-sm font-bold ${existingEvaluation.first_sem === "N/A" ? "text-muted-foreground italic" : "text-foreground"}`}>{existingEvaluation.first_sem === "N/A" ? "N/A (2nd Sem only)" : formatDecimal(existingEvaluation.first_sem)}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">2nd Sem Total</Label>
              <p className="text-sm font-black text-primary">{formatDecimal(existingEvaluation.second_sem)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={(formData) => {
      startTransition(async () => {
        try {
          const startTime = Date.now();
          await addEvaluation(formData);
          
          // Ensure a minimum delay of 600ms for a smooth animation transition
          const elapsed = Date.now() - startTime;
          const remaining = 600 - elapsed;
          if (remaining > 0) {
            await new Promise((resolve) => setTimeout(resolve, remaining));
          }
          
          setIsEditing(false);
          if (onSuccess) onSuccess();
        } catch (err) {
          console.error("Submission error:", err);
        }
      });
    }} className="space-y-4">
      <input type="hidden" name="occupant_id" value={occupantId} />
      
      <div className="grid gap-2">
        <Label>Occupant</Label>
        <Input value={occupantName} disabled className="bg-muted" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="evaluator_points">Evaluator Points (Max 35)</Label>
        <Input
          id="evaluator_points"
          name="evaluator_points"
          type="number"
          min="0"
          max="35"
          step="0.00001"
          defaultValue={existingEvaluation?.evaluator_points}
          placeholder="e.g. 30"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="record_points">Record Points (Max 65)</Label>
        <Input
          id="record_points"
          name="record_points"
          type="number"
          min="0"
          max="65"
          step="0.00001"
          defaultValue={existingEvaluation?.record_points}
          placeholder="e.g. 60"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="first_sem">1st Semester Points</Label>
        <div className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            id="first_sem_na"
            checked={isFirstSemNA}
            onChange={(e) => setIsFirstSemNA(e.target.checked)}
            disabled={isPending}
            className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer disabled:opacity-50"
          />
          <Label htmlFor="first_sem_na" className="text-xs text-muted-foreground cursor-pointer">
            N/A — Occupant not available during 1st Semester
          </Label>
        </div>
        {isFirstSemNA ? (
          <input type="hidden" name="first_sem" value="N/A" />
        ) : (
          <Input
            id="first_sem"
            name="first_sem"
            type="number"
            step="0.00001"
            defaultValue={existingEvaluation?.first_sem === "N/A" ? "" : existingEvaluation?.first_sem}
            placeholder="e.g. 85"
            required
            disabled={isPending}
          />
        )}
      </div>

      <div className="flex gap-2">
        {existingEvaluation && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setIsEditing(false)}
            className="flex-1"
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isPending}
          className={`flex-1 ${existingEvaluation ? 'bg-accent hover:bg-accent/90 text-accent-foreground font-semibold' : 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'}`}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? (existingEvaluation ? 'Updating...' : 'Submitting...') : (existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation')}
        </Button>
      </div>
    </form>
  );
}
