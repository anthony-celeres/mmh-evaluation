"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEvaluation } from "@/lib/evaluation-actions";

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
              <p className="text-sm font-bold text-foreground">{existingEvaluation.evaluator_points}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Record Points</Label>
              <p className="text-sm font-bold text-foreground">{existingEvaluation.record_points}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">1st Sem Points</Label>
              <p className="text-sm font-bold text-foreground">{existingEvaluation.first_sem}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">2nd Sem Total</Label>
              <p className="text-sm font-black text-primary">{existingEvaluation.second_sem}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={async (formData) => {
      await addEvaluation(formData);
      setIsEditing(false);
      if (onSuccess) onSuccess();
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
          defaultValue={existingEvaluation?.evaluator_points}
          placeholder="e.g. 30"
          required
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
          defaultValue={existingEvaluation?.record_points}
          placeholder="e.g. 60"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="first_sem">1st Semester Points</Label>
        <Input
          id="first_sem"
          name="first_sem"
          type="number"
          defaultValue={existingEvaluation?.first_sem}
          placeholder="e.g. 85"
          required
        />
      </div>

      <div className="flex gap-2">
        {existingEvaluation && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" className={`flex-1 ${existingEvaluation ? 'bg-accent hover:bg-accent/90 text-accent-foreground font-semibold' : 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'}`}>
          {existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
        </Button>
      </div>
    </form>
  );
}
