"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

type OccupantFormValues = {
  authUserId?: string;
  fullName?: string;
  email?: string;
  degreeProgram?: string;
  year?: number;
  roomNumber?: string | null;
  role?: "admin" | "occupant";
};

type OccupantFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  values?: OccupantFormValues;
  requirePassword?: boolean;
  onCancel?: () => void;
};

export function OccupantForm({
  action,
  submitLabel,
  values,
  requirePassword = false,
  onCancel,
}: OccupantFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleCancel = onCancel || (() => {
    router.push("/admin/occupants");
  });

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {values?.authUserId ? (
        <input type="hidden" name="auth_user_id" value={values.authUserId} />
      ) : null}

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={values?.fullName ?? ""}
          placeholder="Juan Dela Cruz"
          required
        />
      </div>

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={values?.email ?? ""}
          placeholder="student@example.com"
          required
        />
      </div>

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={requirePassword ? "Create occupant's password" : "Leave blank to keep current"}
            required={requirePassword}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="degree_program">Degree program</Label>
        <Input
          id="degree_program"
          name="degree_program"
          defaultValue={values?.degreeProgram ?? ""}
          placeholder="BS Computer Science"
          required
        />
      </div>

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          name="year"
          type="number"
          min="1"
          max="10"
          defaultValue={values?.year ?? 1}
          required
        />
      </div>

      <div className="grid gap-2 md:col-span-1">
        <Label htmlFor="room_number">Room number</Label>
        <Input
          id="room_number"
          name="room_number"
          defaultValue={values?.roomNumber ?? ""}
          placeholder="Room 204"
          required
        />
      </div>

      {values?.role ? <input type="hidden" name="role" value={values.role} /> : null}

      <div className="md:col-span-2 pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 w-full">
        <Button 
          type="button" 
          variant="destructive" 
          onClick={handleCancel}
          className="w-full sm:w-fit font-semibold"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full sm:w-fit font-semibold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}