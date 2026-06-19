import { getAllProfiles } from "@/lib/admin";
import { OccupantManagerHeader } from "@/components/admin/OccupantManagerHeader";
import { getAllEvaluations } from "@/lib/evaluation-actions";
import { OccupantTableWithEvaluation } from "@/components/admin/OccupantTableWithEvaluation";

export default async function OccupantsPage() {
  const users = await getAllProfiles();
  const evaluations = await getAllEvaluations();

  return (
    <div className="space-y-6">
      <OccupantManagerHeader />

      <div className="grid gap-6">
        <OccupantTableWithEvaluation users={users} evaluations={evaluations} />
      </div>
    </div>
  );
}
