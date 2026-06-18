"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";

type Record = {
  id: string;
  rank: number;
  occupant: {
    full_name: string;
    room_number: string | null;
    degree_program: string;
    year: number;
  };
  evaluator_points: number;
  record_points: number;
  secondSemPoints: number;
  firstSemPoints: number;
  finalScore: number;
  remarks: string;
};

type RecordsTableProps = {
  data: Record[];
};

export function RecordsTable({ data }: RecordsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [remarksFilter, setRemarksFilter] = useState<"all" | "Passed" | "Failed">("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Record | "full_name"; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });

  const filteredAndSortedRecords = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch = 
          item.occupant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.occupant.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.occupant.degree_program.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRemarks = remarksFilter === "all" || item.remarks === remarksFilter;
        
        return matchesSearch && matchesRemarks;
      })
      .sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === "full_name") {
          valA = a.occupant.full_name.toLowerCase();
          valB = b.occupant.full_name.toLowerCase();
        } else {
          valA = a[sortConfig.key as keyof Record];
          valB = b[sortConfig.key as keyof Record];
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, remarksFilter, sortConfig]);

  const toggleSort = (key: keyof Record | "full_name") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Occupant Evaluation List</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Weighted final grade calculation: 2nd Sem (60%) and 1st Sem (40%).
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, room, or program..."
                className="pl-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 outline-none transition-colors hover:bg-slate-50"
              value={remarksFilter}
              onChange={(e) => setRemarksFilter(e.target.value as any)}
            >
              <option value="all">All Remarks</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 text-left font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3 cursor-pointer hover:text-slate-900" onClick={() => toggleSort("rank")}>
                  <div className="flex items-center">
                    Rank <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-3 cursor-pointer hover:text-slate-900" onClick={() => toggleSort("full_name")}>
                  <div className="flex items-center">
                    Name <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-3">Room</th>
                <th className="px-3 py-3">Program/Year</th>
                <th className="px-3 py-3 text-center">Evaluators</th>
                <th className="px-3 py-3 text-center">Records</th>
                <th className="px-3 py-3 text-center">2nd Sem</th>
                <th className="px-3 py-3 text-center">1st Sem</th>
                <th className="px-3 py-3 text-center cursor-pointer hover:text-slate-900" onClick={() => toggleSort("finalScore")}>
                  <div className="flex items-center justify-center">
                    Final <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-3 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredAndSortedRecords.length > 0 ? (
                filteredAndSortedRecords.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-3 py-3 font-bold text-blue-600">#{record.rank}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{record.occupant.full_name}</td>
                    <td className="px-3 py-3 text-slate-600">{record.occupant.room_number ?? 'N/A'}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {record.occupant.degree_program} - Y{record.occupant.year}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-slate-700">{record.evaluator_points}</td>
                    <td className="px-3 py-3 text-center font-medium text-slate-700">{record.record_points}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
