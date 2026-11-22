import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Users, Eye, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdminOverview } from "@/components/AdminOverview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { RegistrationRecord } from "@/lib/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type AppRole } from "@/lib/auth-schemas";
import { registrationsQuery } from "@/lib/admin-users.functions";
import { ROLE_HOME } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if (context.role !== "admin") throw redirect({ to: ROLE_HOME[context.role] });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(registrationsQuery()),
  head: () => ({ meta: [{ title: "Registration dashboard — CropPilot Admin" }, { name: "description", content: "Review registered CropPilot users, roles and account confirmation." }, { property: "og:title", content: "Registration dashboard — CropPilot Admin" }, { property: "og:description", content: "CropPilot administrator registration overview." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, role } = Route.useRouteContext();
  const { data, refetch, isRefetching, isRefetchError } = useSuspenseQuery(registrationsQuery());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AppRole | "all">("all");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<RegistrationRecord | null>(null);
  const term = search.trim().toLowerCase();
  const filtered = data.filter((row) => (filter === "all" || row.role === filter) && (status === "all" || row.confirmed === (status === "confirmed")) && [row.fullName, row.email, row.location, row.organization, row.designation].some((value) => value.toLowerCase().includes(term))).sort((a, b) => sort === "name" ? a.fullName.localeCompare(b.fullName) : sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * 20, currentPage * 20);
  return (
    <AppShell user={user} role={role}>
      <div id="overview" className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase text-primary"><ShieldCheck className="size-4" />CropPilot administration</p><h1 className="font-display text-3xl font-semibold sm:text-4xl">Admin dashboard</h1><p className="mt-2 text-sm text-muted-foreground">Community overview & registration records</p></div>
        <Button variant="outline" onClick={() => void refetch()} disabled={isRefetching}><RefreshCw className={isRefetching ? "animate-spin" : ""} />Refresh</Button>
      </div>
      {isRefetchError && <p role="alert" className="mt-4 text-sm text-destructive">Registrations could not be refreshed. Please try again.</p>}
      <AdminOverview records={data} />
      <section id="registrations" className="mt-8 scroll-mt-6">
        <div className="flex items-center justify-between gap-3"><h2 className="font-display text-2xl font-semibold">Registered users</h2><Badge variant="outline">{filtered.length} results</Badge></div>
        <div className="my-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-60"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search registrations" placeholder="Search name, email or location" className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
          <div aria-label="Filter by role" className="flex flex-wrap gap-1">{(["all", "farmer", "officer", "admin"] as const).map((value) => <Button key={value} size="sm" variant={filter === value ? "secondary" : "ghost"} aria-pressed={filter === value} onClick={() => { setFilter(value); setPage(1); }}>{value === "all" ? "All roles" : ROLE_LABELS[value]}</Button>)}</div>
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}><SelectTrigger aria-label="Email status" className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All email statuses</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent></Select>
          <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}><SelectTrigger aria-label="Sort registrations" className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="oldest">Oldest first</SelectItem><SelectItem value="name">Name A–Z</SelectItem></SelectContent></Select>
        </div>
        {rows.length === 0 ? <div className="border-y py-14 text-center"><Users className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 text-muted-foreground">{data.length === 0 ? "No registrations yet." : "No matching registrations."}</p></div> : <div className="overflow-x-auto border-y"><table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground"><tr>{["User", "Role", "Registration details", "Email status", "Registered", "Details"].map((label) => <th key={label} className="whitespace-nowrap px-3 py-3 font-medium">{label}</th>)}</tr></thead>
          <tbody className="divide-y">{rows.map((row) => <tr key={row.id} className="transition-colors hover:bg-muted/40">
            <td className="min-w-48 max-w-64 px-3 py-4"><p className="break-words font-medium">{row.fullName || "—"}</p><p className="mt-1 break-all text-muted-foreground">{row.email || "—"}</p></td>
            <td className="px-3 py-4"><Badge variant="secondary" className="whitespace-nowrap">{ROLE_LABELS[row.role]}</Badge></td>
            <td className="min-w-40 max-w-60 break-words px-3 py-4 text-muted-foreground">{row.role === "officer" ? <>{row.organization || "—"}{row.designation && <p className="mt-1">{row.designation}</p>}</> : row.location || "—"}</td>
            <td className="whitespace-nowrap px-3 py-4"><Badge variant={row.confirmed ? "outline" : "secondary"}>{row.confirmed ? "Confirmed" : "Pending"}</Badge></td>
            <td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(row.createdAt))}</td>
             <td className="px-3 py-4"><Button size="icon" variant="ghost" aria-label={`View details for ${row.fullName || row.email}`} title="View user details" onClick={() => setSelected(row)}><Eye className="size-4" /></Button></td>
          </tr>)}</tbody>
        </table></div>}
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>{filtered.length} users · Page {currentPage} of {pageCount}</span><div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next page" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></div></div>
      </section>
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
          <DialogHeader><DialogTitle className="font-display text-2xl">User details</DialogTitle><DialogDescription>Registration record</DialogDescription></DialogHeader>
          {selected && <><div className="border-b pb-4"><p className="break-words text-lg font-semibold">{selected.fullName || "Name not provided"}</p><p className="mt-1 break-all text-sm text-muted-foreground">{selected.email || "—"}</p><Badge className="mt-3" variant="secondary">{ROLE_LABELS[selected.role]}</Badge></div>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">{[
              ["Email status", selected.confirmed ? "Confirmed" : "Pending confirmation"],
              ["Registered (Bangladesh time)", new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(selected.createdAt))],
              ["Location", selected.location || "Not provided"],
              ["Organization", selected.organization || "Not provided"],
              ["Designation", selected.designation || "Not provided"],
            ].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value}</dd></div>)}</dl>
          </>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
