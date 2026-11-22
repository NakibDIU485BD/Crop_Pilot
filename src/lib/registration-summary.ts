import type { RegistrationRecord } from "./admin-users";

const dayKey = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

export function registrationSummary(records: RegistrationRecord[], now = new Date()) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 86400000);
    return { key: dayKey(date), label: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short" }).format(date), count: 0 };
  });
  const roles = { farmer: 0, officer: 0, admin: 0 };
  let confirmed = 0;
  for (const record of records) {
    roles[record.role]++;
    if (record.confirmed) confirmed++;
    const day = days.find((item) => item.key === dayKey(new Date(record.createdAt)));
    if (day) day.count++;
  }
  return { total: records.length, roles, confirmed, pending: records.length - confirmed, days, today: days.at(-1)?.count ?? 0, week: days.reduce((sum, day) => sum + day.count, 0) };
}