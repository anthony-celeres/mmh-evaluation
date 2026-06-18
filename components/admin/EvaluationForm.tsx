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
};

export function EvaluationForm({ occupantId, occupantName, existingEvaluation }: EvaluationFormProps) {
  const [isEditing, setIsEditing] = useState(!existingEvaluation);

  if (!isEditing && existingEvaluation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase text-green-700">
            Completed
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs"
          >
            Edit Record
          </Button>
        </div>

        <div className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-wider text-slate-500">Occupant</Label>
            <p className="text-sm font-medium text-slate-900">{occupantName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500">Evaluator Points</Label>
              <p className="text-sm font-bold text-slate-900">{existingEvaluation.evaluator_points}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500">Record Points</Label>
              <p className="text-sm font-bold text-slate-900">{existingEvaluation.record_points}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500">1st Sem Points</Label>
              <p className="text-sm font-bold text-slate-900">{existingEvaluation.first_sem}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-wider text-slate-500">2nd Sem Total</Label>
              <p className="text-sm font-bold text-blue-600">{existingEvaluation.second_sem}</p>
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
    }} className="space-y-4">
      <input type="hidden" name="occupant_id" value={occupantId} />
      
      <div className="grid gap-2">
        <Label>Occupant</Label>
        <Input value={occupantName} disabled className="bg-slate-50" />
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
        <Button type="submit" className={`flex-1 ${existingEvaluation ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
        </Button>
      </div>
    </form>
  );
}
