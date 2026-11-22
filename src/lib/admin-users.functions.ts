import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdminAccess, registrationRecord, type RegistrationRecord } from "./admin-users";

export const getRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    assertAdminAccess(isAdmin, roleError);
    const { data: roles, error } = await context.supabase.from("user_roles").select("user_id, role");
    if (error) throw new Error("Could not load user roles. Please try again.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const registrations: RegistrationRecord[] = [];
    for (let page = 1; ; page++) {
      const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (listError) throw new Error("Could not load registrations. Please try again.");
      for (const user of data.users) registrations.push(registrationRecord(user, roles.filter((r) => r.user_id === user.id).map((r) => r.role)));
      if (data.users.length < 1000) break;
    }
    return registrations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

export const registrationsQuery = () => queryOptions({ queryKey: ["admin", "registrations"], queryFn: () => getRegistrations() });