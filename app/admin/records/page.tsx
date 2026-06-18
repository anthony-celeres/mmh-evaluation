import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllEvaluations } from "@/lib/evaluation-actions";

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

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Occupant Evaluation List</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Weighted final grade calculation: 2nd Sem (60%) and 1st Sem (40%).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-left font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-3">Rank</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Room</th>
                  <th className="px-3 py-3">Program/Year</th>
                  <th className="px-3 py-3 text-center">Evaluators (35)</th>
                  <th className="px-3 py-3 text-center">Records (65)</th>
                  <th className="px-3 py-3 text-center">2nd Sem</th>
                  <th className="px-3 py-3 text-center">1st Sem</th>
                  <th className="px-3 py-3 text-center">Final</th>
                  <th className="px-3 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {finalData.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-3 py-3 font-bold text-blue-600">#{record.rank}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{record.occupant?.full_name}</td>
                    <td className="px-3 py-3 text-slate-600">{record.occupant?.room_number}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {record.occupant?.degree_program} - Y{record.occupant?.year}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-slate-700">{record.evaluator_points ?? 0}</td>
                    <td className="px-3 py-3 text-center font-medium text-slate-700">{record.record_points ?? 0}</td>
                    <td className="px-3 py-3 text-center font-bold text-slate-900">{record.secondSemPoints}</td>
                    <td className="px-3 py-3 text-center font-semibold">{record.firstSemPoints}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded bg-blue-50 px-2 py-1 font-bold text-blue-700">
                        {record.finalScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${record.remarks === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {record.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
