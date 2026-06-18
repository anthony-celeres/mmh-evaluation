import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEvaluation } from "@/lib/evaluation-actions";

type EvaluationFormProps = {
  occupantId: string;
  occupantName: string;
};

export function EvaluationForm({ occupantId, occupantName }: EvaluationFormProps) {
  return (
    <form action={addEvaluation} className="space-y-4">
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
          placeholder="e.g. 85"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Submit Evaluation
      </Button>
    </form>
  );
}
