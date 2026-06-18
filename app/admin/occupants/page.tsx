import { getAllProfiles } from "@/lib/admin";
import { OccupantManagerHeader } from "@/components/admin/OccupantManagerHeader";
import { getEvaluatedOccupantIds } from "@/lib/evaluation-actions";
import { OccupantTableWithEvaluation } from "@/components/admin/OccupantTableWithEvaluation";

export default async function OccupantsPage() {
  const users = await getAllProfiles();
  const evaluatedIds = await getEvaluatedOccupantIds();

  return (
    <div className="space-y-6">
      <OccupantManagerHeader />

      <div className="grid gap-6">
        <OccupantTableWithEvaluation users={users} evaluatedIds={evaluatedIds} />
      </div>
    </div>
  );
}
