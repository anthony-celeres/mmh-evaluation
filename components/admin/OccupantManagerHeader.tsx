"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OccupantForm } from "@/components/admin/OccupantForm";
import { createOccupant } from "@/lib/occupant-actions";

export function OccupantManagerHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <section className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Occupant Manager
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              Manage authenticated users
            </h1>
          </div>
          <Button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isOpen ? "Cancel" : "Add Occupant"}
          </Button>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Create, edit, and remove occupant accounts. Every change updates the Supabase Auth user and the public.users profile record.
        </p>
      </section>

      {isOpen && (
        <Card className="border-slate-200 bg-white shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Add occupant</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Create an authenticated account and store the profile in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OccupantForm action={createOccupant} submitLabel="Create occupant" requirePassword />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
