import { getAllEvaluations } from "@/lib/evaluation-actions";
import { RecordsTable } from "@/components/admin/RecordsTable";

export default async function AdminRecordsPage() {
  const evaluations = await getAllEvaluations();

  // Process data for the table
  const processedRecords = evaluations.map((item: any) => {
    const secondSemPoints = parseFloat(item.second_sem) || 0;
    const firstSemPoints = parseFloat(item.first_sem) || 0;
    
    // Final = (2nd Sem * 0.6) + (1st Sem * 0.4)
    const finalScore = (secondSemPoints * 0.6) + (firstSemPoints * 0.4);
    
    return {
      ...item,
      secondSemPoints,
      firstSemPoints,
      finalScore,
      remarks: finalScore < 70 ? "Failed" : "Passed"
    };
  });

  // Sort by final score descending to calculate rank
  const sortedRecords = [...processedRecords].sort((a, b) => b.finalScore - a.finalScore);
  
  const finalData = processedRecords.map((item) => {
    const rank = sortedRecords.findIndex(r => r.id === item.id) + 1;
    return { ...item, rank };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Reports
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
          Evaluation Records
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          View all occupant evaluations, final grades, and rankings across semesters.
        </p>
      </section>

      <RecordsTable data={finalData} />
    </div>
  );
}
