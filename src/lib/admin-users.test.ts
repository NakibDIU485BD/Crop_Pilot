import { describe, expect, it } from "vitest";
import { assertAdminAccess, registrationRecord } from "./admin-users";
import type { User } from "@supabase/supabase-js";

describe("registration data permissions", () => {
  it("allows verified admin access", () => expect(() => assertAdminAccess(true, null)).not.toThrow());
  it("denies non-admin access", () => expect(() => assertAdminAccess(false, null)).toThrow());
  it("denies missing role results", () => expect(() => assertAdminAccess(null, null)).toThrow());
  it("denies failed role checks", () => expect(() => assertAdminAccess(true, new Error("failed"))).toThrow());
  it("uses stored roles rather than editable metadata and excludes private metadata", () => {
    const user: User = { id: "test-user", aud: "authenticated", created_at: "2026-11-22T00:00:00Z", app_metadata: {}, user_metadata: { full_name: "Farmer Name", role: "admin", private_value: "secret", location: "Bogura" }, email: "farmer@example.com" };
    const record = registrationRecord(user, ["farmer"]);
    expect(record.role).toBe("farmer");
    expect(record.fullName).toBe("Farmer Name");
    expect(record.location).toBe("Bogura");
    expect(record).not.toHaveProperty("private_value");
    expect(record).not.toHaveProperty("app_metadata");
  });
});