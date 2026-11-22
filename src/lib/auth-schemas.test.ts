import { describe, expect, it } from "vitest";
import { loginSchema, primaryRole, registerSchema } from "./auth-schemas";

const ok = { role: "farmer", location: "Bogura", organization: "", designation: "", fullName: "Nakib Ahasan", email: "a@b.com", password: "Farm1234", confirmPassword: "Farm1234" };

describe("registerSchema", () => {
  it("accepts valid input", () => expect(registerSchema.safeParse(ok).success).toBe(true));
  it("rejects short password", () =>
    expect(registerSchema.safeParse({ ...ok, password: "Ab1", confirmPassword: "Ab1" }).success).toBe(false));
  it("requires a number", () =>
    expect(registerSchema.safeParse({ ...ok, password: "Farmerss", confirmPassword: "Farmerss" }).success).toBe(false));
  it("rejects mismatched confirm", () =>
    expect(registerSchema.safeParse({ ...ok, confirmPassword: "Farm12345" }).success).toBe(false));
  it("rejects bad email", () => expect(registerSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false));
});

describe("loginSchema", () => {
  it("requires password", () => expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false));
});

describe("roles", () => {
  it("cannot self-register as admin", () => expect(registerSchema.safeParse({ ...ok, role: "admin" }).success).toBe(false));
  it("farmer needs a location", () => expect(registerSchema.safeParse({ ...ok, location: "" }).success).toBe(false));
  it("officer needs organization and designation", () => {
    expect(registerSchema.safeParse({ ...ok, role: "officer" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...ok, role: "officer", organization: "DAE", designation: "SAAO" }).success).toBe(true);
  });
  it("admin outranks others", () => expect(primaryRole(["farmer", "admin"])).toBe("admin"));
  it("defaults to farmer", () => expect(primaryRole([])).toBe("farmer"));
});
