"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, X } from "lucide-react";
import { EvaluationForm } from "./EvaluationForm";
import { cn } from "@/lib/utils";
import { updateRetainedLimit } from "@/lib/settings-actions";

type Record = {
  id: string;
  rank: number | null;
  occupant: {
    auth_user_id: string;
    full_name: string;
    room_number: string | null;
    degree_program: string;
    year: number;
  };
  evaluator_points: number | null;
  record_points: number | null;
  secondSemPoints: number | null;
  firstSemPoints: number | null;
  finalScore: number | null;
  remarks: string | null;
};

type RecordsTableProps = {
  data: Record[];
  evaluations: any[];
  initialRetainedLimit: number;
};

export function RecordsTable({ data, evaluations, initialRetainedLimit }: RecordsTableProps) {
  const [selectedOccupant, setSelectedOccupant] = useState<{ auth_user_id: string; full_name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [remarksFilter, setRemarksFilter] = useState<"all" | "Retained" | "Waitlisted" | "Recommended" | "Failed">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [retainedLimit, setRetainedLimit] = useState<number>(initialRetainedLimit);
  const [inputValue, setInputValue] = useState<number>(initialRetainedLimit);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Record | "full_name" | "room_number"; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });

  const handleUpdateLimit = async () => {
    setIsUpdating(true);
    const finalVal = Math.max(47, inputValue);
    setInputValue(finalVal);
    await updateRetainedLimit(finalVal);
    setRetainedLimit(finalVal);
    setIsUpdating(false);
  };

  const recordsWithComputedRemarks = useMemo(() => {
    return data.map((item) => {
      if (item.finalScore === null || item.rank === null) {
        return { ...item, remarks: null };
      }
      let remarks: string;
      if (item.finalScore < 70) {
        remarks = "Failed";
      } else if (item.rank <= retainedLimit) {
        remarks = "Retained";
      } else if (item.rank <= retainedLimit + 10) {
        remarks = "Waitlisted";
      } else {
        remarks = "Recommended";
      }
      return { ...item, remarks };
    });
  }, [data, retainedLimit]);

  const filteredAndSortedRecords = useMemo(() => {
    return recordsWithComputedRemarks
      .filter((item) => {
        const matchesSearch = 
          item.occupant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.occupant.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.occupant.degree_program.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Handle remarks filter (matching string values or "all")
        const matchesRemarks = remarksFilter === "all" || item.remarks === remarksFilter;
        
        const matchesYear = yearFilter === "all" || String(item.occupant.year) === yearFilter;

        const room = item.occupant.room_number?.trim() || "";
        let level = "unassigned";
        if (room.startsWith("0")) {
          level = "ground";
        } else if (room.startsWith("1")) {
          level = "first";
        } else if (room.startsWith("2")) {
          level = "second";
        } else if (room.startsWith("3")) {
          level = "third";
        }
        const matchesLevel = levelFilter === "all" || level === levelFilter;
        
        return matchesSearch && matchesRemarks && matchesYear && matchesLevel;
      })
      .sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === "full_name") {
          valA = a.occupant.full_name.toLowerCase();
          valB = b.occupant.full_name.toLowerCase();
        } else if (sortConfig.key === "room_number") {
          valA = a.occupant.room_number || "";
          valB = b.occupant.room_number || "";
          if (valA === "" && valB !== "") return 1;
          if (valB === "" && valA !== "") return -1;
          const comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
          return sortConfig.direction === "asc" ? comparison : -comparison;
        } else {
          valA = a[sortConfig.key as keyof Record];
          valB = b[sortConfig.key as keyof Record];
        }

        // Handle null values for sorting (pushing null values to the bottom)
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [recordsWithComputedRemarks, searchTerm, remarksFilter, yearFilter, levelFilter, sortConfig]);

  const toggleSort = (key: keyof Record | "full_name" | "room_number") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const selectedEvaluation = selectedOccupant 
    ? evaluations.find(e => e.occupant_id === selectedOccupant.auth_user_id && (e.first_sem || e.first_sem === "N/A") && e.second_sem)
    : null;

  return (
    <div className="space-y-6">
      {/* Retained Limit Settings Card */}
      <Card className="border-border bg-card shadow-sm max-w-sm">
        <CardContent className="p-4 flex flex-col gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground">Retained Limit Configuration</h3>
            <p className="text-[11px] text-muted-foreground">Adjust the number of occupants to be retained (minimum: 47).</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              min={47}
              className="h-9 w-28 bg-muted/20 border-border text-xs font-semibold"
              value={inputValue}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setInputValue(isNaN(val) ? 47 : val);
              }}
            />
            <Button
              size="sm"
              className="h-9 font-bold text-xs px-4"
              onClick={handleUpdateLimit}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-lg font-bold text-foreground">Occupant Evaluation List</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Weighted final grade: 2nd Sem (60%) + 1st Sem (40%). If 1st Sem is N/A, 2nd Sem = 100%. Click any row to evaluate.
            </CardDescription>
          </div>

          {/* Search and Filters row */}
          <div className="flex flex-col gap-4 pt-3 border-t border-border/60 lg:flex-row lg:items-end lg:justify-between">
            {/* Search Bar */}
            <div className="flex flex-col gap-1 w-full lg:max-w-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Search</span>
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, room, or program..."
                  className="pl-9 text-xs h-9 bg-muted/20 border-border w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Remarks Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Remarks</span>
                <select 
                  className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                  value={remarksFilter}
                  onChange={(e) => setRemarksFilter(e.target.value as any)}
                >
                  <option value="all">All Remarks</option>
                  <option value="Retained">Retained</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              {/* Year Level Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Year Level</span>
                <select 
                  className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="all">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>

              {/* Dorm Level Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dorm Level</span>
                <select 
                  className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="ground">Ground Level</option>
                  <option value="first">1st Level</option>
                  <option value="second">2nd Level</option>
                  <option value="third">3rd Level</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort By</span>
                <select 
                  className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition-colors hover:bg-muted cursor-pointer"
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split("-");
                    setSortConfig({
                      key: key as any,
                      direction: direction as "asc" | "desc"
                    });
                  }}
                >
                  <option value="rank-asc">Rank (Low to High)</option>
                  <option value="rank-desc">Rank (High to Low)</option>
                  <option value="full_name-asc">Name (A-Z)</option>
                  <option value="full_name-desc">Name (Z-A)</option>
                  <option value="room_number-asc">Room (Low to High)</option>
                  <option value="room_number-desc">Room (High to Low)</option>
                  <option value="finalScore-desc">Final Score (High to Low)</option>
                  <option value="finalScore-asc">Final Score (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-xs">
              <thead className="bg-muted text-left font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort("rank")}>
                    <div className="flex items-center">
                      Rank <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-3 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort("full_name")}>
                    <div className="flex items-center">
                      Name <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-3 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort("room_number")}>
                    <div className="flex items-center">
                      Room <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-3 py-3">Program-Year</th>
                  <th className="px-3 py-3 text-center">Evaluators (35 points)</th>
                  <th className="px-3 py-3 text-center">Records (65 points)</th>
                  <th className="px-3 py-3 text-center">2nd Sem (60%)</th>
                  <th className="px-3 py-3 text-center">1st Sem (40%)</th>
                  <th className="px-3 py-3 text-center cursor-pointer hover:text-foreground" onClick={() => toggleSort("finalScore")}>
                    <div className="flex items-center justify-center">
                      Final Score <ArrowUpDown className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-3 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredAndSortedRecords.length > 0 ? (
                  filteredAndSortedRecords.map((record) => (
                    <tr 
                      key={record.id} 
                      onClick={() => setSelectedOccupant({
                        auth_user_id: record.occupant.auth_user_id,
                        full_name: record.occupant.full_name
                      })}
                      className={`transition-colors cursor-pointer hover:bg-muted/50 ${selectedOccupant?.auth_user_id === record.occupant.auth_user_id ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
                    >
                      <td className="px-3 py-3 font-bold text-primary">
                        {record.rank ? `#${record.rank}` : '-'}
                      </td>
                      <td className="px-3 py-3 font-medium text-foreground">{record.occupant.full_name}</td>
                      <td className="px-3 py-3 text-muted-foreground">{record.occupant.room_number ?? 'N/A'}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {record.occupant.degree_program} - {record.occupant.year}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-foreground">
                        {record.evaluator_points !== null && record.evaluator_points !== undefined ? `${record.evaluator_points} points` : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-foreground">
                        {record.record_points !== null && record.record_points !== undefined ? `${record.record_points} points` : '-'}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-foreground">
                        {record.secondSemPoints !== null && record.secondSemPoints !== undefined ? `${record.secondSemPoints} points` : '-'}
                      </td>
                      <td className={`px-3 py-3 text-center font-semibold ${record.firstSemPoints === null && record.finalScore !== null ? "italic text-muted-foreground/70" : "text-muted-foreground"}`}>
                        {record.finalScore !== null && record.firstSemPoints === null ? 'N/A' : (record.firstSemPoints !== null && record.firstSemPoints !== undefined ? `${record.firstSemPoints} points` : '-')}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {record.finalScore !== null && record.finalScore !== undefined ? (
                          <span className="rounded bg-primary/10 px-2 py-1 font-bold text-primary">
                            {record.finalScore.toFixed(5)} points
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-3">
                        {record.remarks ? (
                          <span className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            record.remarks === 'Retained' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                            record.remarks === 'Waitlisted' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                            record.remarks === 'Recommended' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                            record.remarks === 'Failed' && 'bg-destructive/10 text-destructive'
                          )}>
                            {record.remarks}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                      No records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      {selectedOccupant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedOccupant(null)} />
          
          <Card className="relative w-full max-w-md border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
            <button 
              onClick={() => setSelectedOccupant(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                {selectedEvaluation ? `Update Evaluation` : `Evaluate ${selectedOccupant.full_name.split(' ')[0]}`}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {selectedEvaluation ? `Edit records for this resident.` : `Input the points for this resident.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EvaluationForm 
                key={selectedOccupant.auth_user_id}
                occupantId={selectedOccupant.auth_user_id} 
                occupantName={selectedOccupant.full_name} 
                existingEvaluation={selectedEvaluation}
                onSuccess={() => setSelectedOccupant(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
