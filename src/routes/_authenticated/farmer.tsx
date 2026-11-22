import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell, StatCard } from "@/components/AppShell";
import { ROLE_HOME } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/farmer")({
  beforeLoad: ({ context }) => {
    if (context.role !== "farmer") throw redirect({ to: ROLE_HOME[context.role] });
  },
  head: () => ({ meta: [{ title: "Farmer dashboard — CropPilot" }, { name: "description", content: "Your farm overview on CropPilot." }, { property: "og:title", content: "Farmer dashboard — CropPilot" }, { property: "og:description", content: "Your farm overview on CropPilot." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const { user, role } = Route.useRouteContext();
  const location = user.user_metadata?.["location"] as string | undefined;
  return (
    <AppShell user={user} role={role}>
      <h1 className="font-display text-4xl font-semibold">Your farm</h1>
      <p className="mt-2 text-muted-foreground">{location ? `Location: ${location}` : "Add your farm details soon."}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Crop suggestions" value={0} />
        <StatCard label="Leaf checks" value={0} />
        <StatCard label="Saved results" value={0} />
      </div>
    </AppShell>
  );
}
