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
      <section className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent">
              Occupant Manager
            </p>
            <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              Manage authenticated users
            </h1>
          </div>
          {!isOpen && (
            <Button 
              onClick={() => setIsOpen(true)}
              className="font-semibold"
            >
              Add Occupant
            </Button>
          )}
        </div>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Create, edit, and remove occupant accounts. Every change updates the Supabase Auth user and the public.users profile record.
        </p>
      </section>

      {isOpen && (
        <Card className="border-border bg-card shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Add occupant</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Create an authenticated account and store the profile in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OccupantForm 
              action={createOccupant} 
              submitLabel="Create occupant" 
              requirePassword 
              onCancel={() => setIsOpen(false)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
