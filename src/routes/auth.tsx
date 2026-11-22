import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Sprout, Loader2, MailCheck, Tractor, ClipboardCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { loginSchema, registerSchema } from "@/lib/auth-schemas";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["login", "register"]).optional() }),
  head: () => ({
    meta: [
      { title: "Log in or register — CropPilot" },
      { name: "description", content: "Create your CropPilot account or log in to manage your farm." },
      { property: "og:title", content: "Log in or register — CropPilot" },
      { property: "og:description", content: "Create your CropPilot account or log in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Errors = Record<string, string | undefined>;

function toErrors(err: z.ZodError): Errors {
  const out: Errors = {};
  for (const i of err.issues) {
    const k = String(i.path[0]);
    if (!out[k]) out[k] = i.message;
  }
  return out;
}

function Field(props: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; error?: string | undefined; autoComplete?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";
  const visibilityLabel = `${showPassword ? "Hide" : "Show"} ${props.label.toLowerCase()}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={props.id}>{props.label}</Label>
      <div className="relative">
        <Input
          id={props.id}
          type={isPassword && showPassword ? "text" : props.type ?? "text"}
          value={props.value}
          autoComplete={props.autoComplete}
          aria-invalid={!!props.error}
          aria-describedby={props.error ? `${props.id}-err` : undefined}
          onChange={(e) => props.onChange(e.target.value)}
          className={isPassword ? "pr-11" : undefined}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 size-9 text-muted-foreground hover:text-foreground"
            aria-label={visibilityLabel}
            aria-controls={props.id}
            aria-pressed={showPassword}
            title={visibilityLabel}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
      {props.error && <p id={`${props.id}-err`} className="text-sm text-destructive">{props.error}</p>}
    </div>
  );
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const mode = search.mode ?? "login";
  const [form, setForm] = useState({ role: "farmer" as "farmer" | "officer", location: "", organization: "", designation: "", fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const set = (k: Exclude<keyof typeof form, "role">) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function switchMode(m: "login" | "register") {
    setErrors({});
    navigate({ to: "/auth", search: { mode: m }, replace: true });
  }

  async function onSubmit(e: FormEvent): Promise<unknown> {
    e.preventDefault();
    if (mode === "register") {
      const r = registerSchema.safeParse(form);
      if (!r.success) return setErrors(toErrors(r.error));
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: r.data.email,
        password: r.data.password,
        options: { emailRedirectTo: window.location.origin + "/dashboard", data: {
          full_name: r.data.fullName,
          role: r.data.role,
          ...(r.data.role === "farmer" ? { location: r.data.location } : { organization: r.data.organization, designation: r.data.designation }),
        } },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      if (data.session) return navigate({ to: "/dashboard" });
      setSentTo(r.data.email);
      return undefined;
    } else {
      const r = loginSchema.safeParse(form);
      if (!r.success) return setErrors(toErrors(r.error));
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword(r.data);
      setLoading(false);
      if (error) {
        return toast.error(error.message === "Invalid login credentials" ? "Wrong email or password" : error.message);
      }
      navigate({ to: "/dashboard" });
      return undefined;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-2xl font-semibold text-primary">
          <Sprout className="h-7 w-7" /> CropPilot
        </Link>
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {sentTo ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 font-display text-2xl font-semibold">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">We sent a confirmation link to <strong>{sentTo}</strong>. Click it to activate your account.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSentTo(null); switchMode("login"); }}>Back to log in</Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-card-foreground">
                {mode === "register" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "register" ? "Start making smarter farm decisions." : "Log in to your farm dashboard."}
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                {mode === "register" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>I am a</Label>
                      <div role="radiogroup" className="grid grid-cols-2 gap-2">
                        {([["farmer", "Farmer", Tractor], ["officer", "Extension Officer", ClipboardCheck]] as const).map(([val, label, Icon]) => (
                          <button
                            key={val}
                            type="button"
                            role="radio"
                            aria-checked={form.role === val}
                            onClick={() => { setForm((f) => ({ ...f, role: val })); setErrors({}); }}
                            className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors ${form.role === val ? "border-primary bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                          >
                            <Icon className="h-5 w-5" />{label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Admin accounts are given by an existing admin.</p>
                    </div>
                    <Field id="fullName" label="Full name" value={form.fullName} onChange={set("fullName")} error={errors["fullName"]} autoComplete="name" />
                    {form.role === "farmer" ? (
                      <Field id="location" label="Farm location (district / upazila)" value={form.location} onChange={set("location")} error={errors["location"]} />
                    ) : (
                      <>
                        <Field id="organization" label="Organization" value={form.organization} onChange={set("organization")} error={errors["organization"]} autoComplete="organization" />
                        <Field id="designation" label="Designation" value={form.designation} onChange={set("designation")} error={errors["designation"]} autoComplete="organization-title" />
                      </>
                    )}
                  </>
                )}
                <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors["email"]} autoComplete="email" />
                <Field key={mode} id="password" label="Password" type="password" value={form.password} onChange={set("password")} error={errors["password"]} autoComplete={mode === "register" ? "new-password" : "current-password"} />
                {mode === "register" && (
                  <>
                    <p className="-mt-2 text-xs text-muted-foreground">8+ characters with uppercase, lowercase and a number.</p>
                    <Field id="confirmPassword" label="Confirm password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors["confirmPassword"]} autoComplete="new-password" />
                  </>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />}
                  {mode === "register" ? "Create account" : "Log in"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "register" ? "Already have an account? " : "New to CropPilot? "}
                <button type="button" className="font-medium text-primary underline-offset-4 hover:underline" onClick={() => switchMode(mode === "register" ? "login" : "register")}>
                  {mode === "register" ? "Log in" : "Create one"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
