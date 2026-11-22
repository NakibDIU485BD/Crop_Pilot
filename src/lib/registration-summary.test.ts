import { expect, it } from "vitest";
import { registrationSummary } from "./registration-summary";
import type { RegistrationRecord } from "./admin-users";

const record = (createdAt: string, role: RegistrationRecord["role"], confirmed: boolean): RegistrationRecord => ({ id: createdAt, createdAt, role, confirmed, email: "test@example.com", fullName: "Test", location: "", organization: "", designation: "" });

it("counts each primary role and confirmation state without duplicating admins", () => {
  const result = registrationSummary([record("2026-11-22T00:00:00Z", "admin", true), record("2026-11-22T01:00:00Z", "farmer", false), record("2026-11-22T02:00:00Z", "officer", true)], new Date("2026-11-22T14:00:00Z"));
  expect(result.roles).toEqual({ admin: 1, farmer: 1, officer: 1 });
  expect(result.total).toBe(3);
  expect(result.confirmed).toBe(2);
  expect(result.pending).toBe(1);
});
it("uses Bangladesh calendar days and includes exactly seven displayed days", () => {
  const result = registrationSummary([record("2026-11-21T18:00:00Z", "farmer", true), record("2026-11-15T18:00:00Z", "officer", true), record("2026-11-15T17:59:59Z", "admin", true)], new Date("2026-11-22T14:00:00Z"));
  expect(result.today).toBe(1);
  expect(result.week).toBe(2);
  expect(result.days).toHaveLength(7);
});
it("returns zero values for an empty registration list", () => {
  const result = registrationSummary([], new Date("2026-11-22T14:00:00Z"));
  expect(result.total).toBe(0);
  expect(result.pending).toBe(0);
  expect(result.week).toBe(0);
});