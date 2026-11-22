import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { Sprout, LogOut, Tractor, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS, type AppRole } from "@/lib/auth-schemas";

const ROLE_ICON = { farmer: Tractor, officer: ClipboardCheck, admin: ShieldCheck };
const NAV: Record<AppRole, string[]> = {
  farmer: ["Overview", "Crop recommendation", "Leaf check", "History"],
  officer: ["Overview", "Farmer queries", "Knowledge review"],
  admin: ["Overview", "Registered users", "Knowledge base"],
};

export function AppShell({ user, role, children }: { user: User; role: AppRole; children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const Icon = ROLE_ICON[role];
  const name = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email;

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card p-5 md:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
          <Sprout className="h-6 w-6" /> CropPilot
        </Link>
        <nav className="mt-8 space-y-1">
          {NAV[role].map((item, i) => role === "admin" && i < 2 ? (
            <Button key={item} asChild variant="ghost" className="w-full justify-start"><Link to="/admin" hash={i === 0 ? "overview" : "registrations"}>{item}</Link></Button>
          ) : (
            <div
              key={item}
              className={i === 0 ? "rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground" : "flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground"}
            >
              {item}
              {i > 0 && <span className="text-[10px] uppercase tracking-wide">soon</span>}
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="break-all text-sm text-muted-foreground">{name}</span>
            <Badge variant="secondary" className="gap-1"><Icon className="h-3.5 w-3.5" />{ROLE_LABELS[role]}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut /> Sign out</Button>
        </header>
        <main className={role === "admin" ? "mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10" : "mx-auto max-w-4xl px-6 py-12"}>{children}</main>
      </div>
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-card-foreground">{value}</p>
    </div>
  );
}
