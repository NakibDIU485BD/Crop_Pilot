import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, StatCard } from "@/components/AppShell";
import { ROLE_HOME } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/officer")({
  beforeLoad: ({ context }) => {
    if (context.role !== "officer") throw redirect({ to: ROLE_HOME[context.role] });
  },
  head: () => ({ meta: [{ title: "Extension Officer dashboard — CropPilot" }, { name: "description", content: "Review farmer questions and knowledge documents." }, { property: "og:title", content: "Extension Officer dashboard — CropPilot" }, { property: "og:description", content: "Review farmer questions and knowledge documents." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: OfficerDashboard,
});

function OfficerDashboard() {
  const { user, role } = Route.useRouteContext();
  const org = user.user_metadata?.["organization"] as string | undefined;
  const des = user.user_metadata?.["designation"] as string | undefined;
  return (
    <AppShell user={user} role={role}>
      <h1 className="font-display text-4xl font-semibold">Officer desk</h1>
      <p className="mt-2 text-muted-foreground">{[des, org].filter(Boolean).join(" · ") || "Extension Officer / Agronomist"}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Open farmer queries" value={0} />
        <StatCard label="Documents to review" value={0} />
        <StatCard label="Reviewed this month" value={0} />
      </div>
    </AppShell>
  );
}
