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
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
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
        } else {
          valA = a[sortConfig.key as keyof Record];
          valB = b[sortConfig.key as keyof Record];
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, remarksFilter, yearFilter, levelFilter, sortConfig]);

  const toggleSort = (key: keyof Record | "full_name") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Occupant Evaluation List</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Weighted final grade calculation: 2nd Sem (60%) and 1st Sem (40%).
            </CardDescription>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, room, or program..."
              className="pl-9 text-xs h-9 bg-muted/20 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
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
                <option value="Passed">Passed</option>
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
          </div>

          {/* Sorting Button */}
          <div className="flex items-end h-full pt-4 sm:pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs font-bold border-border"
              onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }))}
            >
              <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              Sort: {sortConfig.direction === "asc" ? "Ascending" : "Descending"}
            </Button>
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
                <th className="px-3 py-3">Room</th>
                <th className="px-3 py-3">Program/Year</th>
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
                  <tr key={record.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-3 py-3 font-bold text-primary">#{record.rank}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{record.occupant.full_name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{record.occupant.room_number ?? 'N/A'}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {record.occupant.degree_program} - Y{record.occupant.year}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-foreground">{record.evaluator_points} points</td>
                    <td className="px-3 py-3 text-center font-medium text-foreground">{record.record_points} points</td>
                    <td className="px-3 py-3 text-center font-bold text-foreground">{record.secondSemPoints} points</td>
                    <td className="px-3 py-3 text-center font-semibold text-muted-foreground">{record.firstSemPoints} points</td>
                    <td className="px-3 py-3 text-center">
                      <span className="rounded bg-primary/10 px-2 py-1 font-bold text-primary">
                        {record.finalScore.toFixed(1)} points
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${record.remarks === 'Failed' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {record.remarks}
                      </span>
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
  );
}
