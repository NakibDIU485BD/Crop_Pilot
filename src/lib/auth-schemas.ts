import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email address" })
  .max(255, { message: "Email must be under 255 characters" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(72, { message: "Password must be under 72 characters" })
  .regex(/[a-z]/, { message: "Include at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Include at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Include at least one number" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

export const SELF_ROLES = ["farmer", "officer"] as const;
export type AppRole = "farmer" | "officer" | "admin";

export const ROLE_LABELS: Record<AppRole, string> = {
  farmer: "Farmer",
  officer: "Extension Officer",
  admin: "Admin",
};

/** Highest-privilege role wins. */
export function primaryRole(roles: AppRole[]): AppRole {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("officer")) return "officer";
  return "farmer";
}

const optText = (max: number) => z.string().trim().max(max, { message: `Must be under ${max} characters` });

export const registerSchema = z
  .object({
    role: z.enum(SELF_ROLES, { message: "Choose Farmer or Extension Officer" }),
    location: optText(100),
    organization: optText(120),
    designation: optText(80),
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be under 100 characters" })
      .regex(/^[\p{L} .'-]+$/u, { message: "Name can only contain letters, spaces, . ' -" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((d, ctx) => {
    if (d.password !== d.confirmPassword)
      ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
    if (d.role === "farmer" && d.location.length < 2)
      ctx.addIssue({ code: "custom", message: "Enter your farm location (district/upazila)", path: ["location"] });
    if (d.role === "officer") {
      if (d.organization.length < 2)
        ctx.addIssue({ code: "custom", message: "Enter your organization", path: ["organization"] });
      if (d.designation.length < 2)
        ctx.addIssue({ code: "custom", message: "Enter your designation", path: ["designation"] });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
