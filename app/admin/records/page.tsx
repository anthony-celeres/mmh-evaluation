import { getAllEvaluations } from "@/lib/evaluation-actions";
import { getRetainedLimit } from "@/lib/settings-actions";
import { getAllProfiles } from "@/lib/admin";
import { RecordsTable } from "@/components/admin/RecordsTable";

export default async function AdminRecordsPage() {
  const [profiles, evaluations, initialRetainedLimit] = await Promise.all([
    getAllProfiles(),
    getAllEvaluations(),
    getRetainedLimit()
  ]);

  // Filter out admin users
  const occupants = profiles.filter((p: any) => p.role !== 'admin');

  // Process data for each occupant
  const processedRecords = occupants.map((profile: any) => {
    const evaluation = evaluations.find((e: any) => e.occupant_id === profile.auth_user_id);

    const occupantObj = {
      auth_user_id: profile.auth_user_id,
      full_name: profile.full_name,
      room_number: profile.room_number,
      degree_program: profile.degree_program,
      year: profile.year,
    };

    const isFirstSemNA = evaluation?.first_sem === "N/A";
    const hasCompleteEval = evaluation && evaluation.second_sem && (evaluation.first_sem || isFirstSemNA);

    if (hasCompleteEval) {
      const secondSemPoints = parseFloat(evaluation.second_sem) || 0;
      const firstSemPoints = isFirstSemNA ? null : (parseFloat(evaluation.first_sem) || 0);
      // If 1st sem is N/A, 2nd sem score is 100% of the final score
      const finalScore = isFirstSemNA
        ? secondSemPoints
        : (secondSemPoints * 0.6) + ((firstSemPoints ?? 0) * 0.4);
      
      return {
        id: evaluation.id,
        occupant: occupantObj,
        evaluator_points: evaluation.evaluator_points,
        record_points: evaluation.record_points,
        secondSemPoints,
        firstSemPoints,
        finalScore,
        remarks: finalScore < 70 ? "Failed" : "Passed"
      };
    } else {
      return {
        id: profile.auth_user_id, // unique key
        occupant: occupantObj,
        evaluator_points: null,
        record_points: null,
        secondSemPoints: null,
        firstSemPoints: null,
        finalScore: null,
        remarks: null
      };
    }
  });

  // Calculate ranks only for evaluated occupants
  const evaluatedRecords = processedRecords.filter((r) => r.finalScore !== null);
  const sortedEvaluated = [...evaluatedRecords].sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  const finalData = processedRecords.map((item) => {
    if (item.finalScore !== null) {
      const rank = sortedEvaluated.findIndex(r => r.id === item.id) + 1;
      return { ...item, rank };
    }
    return { ...item, rank: null };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          Reports
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
          Evaluation Records
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          View all occupant evaluations, final grades, and rankings across semesters. Click any row to evaluate.
        </p>
      </section>

      <RecordsTable data={finalData} evaluations={evaluations} initialRetainedLimit={initialRetainedLimit} />
    </div>
  );
}
