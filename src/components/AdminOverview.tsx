import { Users, UserCheck, Clock3, CalendarDays, Tractor, ClipboardCheck, ShieldCheck } from "lucide-react";
import { ROLE_LABELS } from "@/lib/auth-schemas";
import type { RegistrationRecord } from "@/lib/admin-users";
import { registrationSummary } from "@/lib/registration-summary";

const roleIcons = { farmer: Tractor, officer: ClipboardCheck, admin: ShieldCheck };
const roleColors = { farmer: "text-primary", officer: "text-chart-2", admin: "text-chart-1" };

export function AdminOverview({ records }: { records: RegistrationRecord[] }) {
  const summary = registrationSummary(records);
  const metrics = [
    { label: "Total registrations", value: summary.total, detail: "Across all roles", Icon: Users },
    { label: "Confirmed emails", value: summary.confirmed, detail: `${summary.total ? Math.round(summary.confirmed / summary.total * 100) : 0}% of registrations`, Icon: UserCheck },
    { label: "Awaiting confirmation", value: summary.pending, detail: "Email confirmation pending", Icon: Clock3 },
    { label: "New today", value: summary.today, detail: `${summary.week} in the last 7 days`, Icon: CalendarDays },
  ];
  return <>
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, detail, Icon }) => <div key={label} className="rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-5 shrink-0 text-primary" /></div>
        <p className="mt-4 font-display text-4xl font-semibold tabular-nums">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      </div>)}
    </div>
    <div className="mt-10 grid gap-8 border-y py-7 lg:grid-cols-2">
      <section aria-labelledby="role-distribution"><div className="mb-6 flex items-center justify-between"><h2 id="role-distribution" className="font-display text-xl font-semibold">Community by role</h2><span className="text-xs text-muted-foreground">{summary.total} users</span></div>
        <div className="space-y-5">{(["farmer", "officer", "admin"] as const).map((role) => { const Icon = roleIcons[role]; return <div key={role}>
          <div className="mb-2 flex items-center gap-2 text-sm"><Icon className={`size-4 ${roleColors[role]}`} /><span>{ROLE_LABELS[role]}</span><span className="ml-auto font-semibold tabular-nums">{summary.roles[role]}</span><span className="w-10 text-right text-xs text-muted-foreground">{summary.total ? Math.round(summary.roles[role] / summary.total * 100) : 0}%</span></div>
          <meter aria-label={`${ROLE_LABELS[role]} share`} min={0} max={Math.max(1, summary.total)} value={summary.roles[role]} className={`admin-meter w-full ${roleColors[role]}`} />
        </div>; })}</div>
      </section>
      <section aria-labelledby="registration-trend" className="lg:border-l lg:pl-8"><div className="mb-4 flex items-center justify-between gap-2"><h2 id="registration-trend" className="font-display text-xl font-semibold">Registration activity</h2><span className="text-xs text-muted-foreground">Last 7 days · BD time</span></div>
        <div className="space-y-2">{summary.days.map((day) => <div key={day.key} className="grid grid-cols-[3.5rem_1fr_1.5rem] items-center gap-3 text-xs"><span className="text-muted-foreground">{day.label}</span><meter aria-label={`Registrations on ${day.label}`} min={0} max={Math.max(1, ...summary.days.map((item) => item.count))} value={day.count} className="admin-meter w-full text-chart-2" /><span className="text-right font-medium tabular-nums">{day.count}</span></div>)}</div>
      </section>
    </div>
  </>;
}