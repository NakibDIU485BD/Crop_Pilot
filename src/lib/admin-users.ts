import type { User } from "@supabase/supabase-js";
import { primaryRole, type AppRole } from "./auth-schemas";

export function assertAdminAccess(isAdmin: boolean | null, error: unknown) {
  if (error || isAdmin !== true) throw new Error("Only admins can view registration data.");
}

export function registrationRecord(user: User, roles: AppRole[]) {
  const text = (key: string) => typeof user.user_metadata[key] === "string" ? user.user_metadata[key] as string : "";
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: text("full_name"),
    role: primaryRole(roles),
    location: text("location"),
    organization: text("organization"),
    designation: text("designation"),
    createdAt: user.created_at,
    confirmed: Boolean(user.email_confirmed_at),
  };
}

export type RegistrationRecord = ReturnType<typeof registrationRecord>;