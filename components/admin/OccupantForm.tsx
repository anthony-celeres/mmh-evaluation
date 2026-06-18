import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
};

export function OccupantForm({
  action,
  submitLabel,
  values,
  requirePassword = false,
}: OccupantFormProps) {
  return (
    <form action={action} className="grid gap-4">
      {values?.authUserId ? (
        <input type="hidden" name="auth_user_id" value={values.authUserId} />
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={values?.fullName ?? ""}
          placeholder="Juan Dela Cruz"
          required
        />
      </div>

      <div className="grid gap-2">
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

      <div className="grid gap-2">
        <Label htmlFor="password">
          {requirePassword ? "Initial password" : "Password"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={requirePassword ? "Create a temporary password" : "Leave blank to keep the current password"}
          required={requirePassword}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="degree_program">Degree program</Label>
        <Input
          id="degree_program"
          name="degree_program"
          defaultValue={values?.degreeProgram ?? ""}
          placeholder="BS Computer Science"
          required
        />
      </div>

      <div className="grid gap-2">
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

      <div className="grid gap-2">
        <Label htmlFor="room_number">Room number</Label>
        <Input
          id="room_number"
          name="room_number"
          defaultValue={values?.roomNumber ?? ""}
          placeholder="Room 204"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue={values?.role ?? "occupant"}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <option value="occupant">Occupant</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button type="submit" className="w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}