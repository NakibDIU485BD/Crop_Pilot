import { supabase } from "@/integrations/supabase/client";
import { primaryRole, type AppRole } from "@/lib/auth-schemas";

export const ROLE_HOME = { farmer: "/farmer", officer: "/officer", admin: "/admin" } as const;

export async function fetchMyRole(userId: string): Promise<AppRole> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return primaryRole((data ?? []).map((r) => r.role as AppRole));
}
