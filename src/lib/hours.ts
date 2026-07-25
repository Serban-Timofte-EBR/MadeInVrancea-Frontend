import type { OperatingHour } from "../types";

export const DAY_NAMES_RO = [
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
  "Duminică",
] as const;

/** Returns the ISO-style weekday used across the app: 1 = Monday … 7 = Sunday. */
export function currentDayOfWeek(now: Date = new Date()): number {
  const js = now.getDay(); // 0 = Sunday … 6 = Saturday
  return js === 0 ? 7 : js;
}

export function getTodayHours(
  hours: OperatingHour[],
  now: Date = new Date(),
): OperatingHour | undefined {
  const dow = currentDayOfWeek(now);
  return hours.find((h) => h.dayOfWeek === dow);
}

function toMinutes(value: string): number {
  const [h, m] = value.split(":");
  return Number(h) * 60 + Number(m);
}

/** Whether the business is open at `now`, based on today's schedule. */
export function isOpenNow(
  hours: OperatingHour[],
  now: Date = new Date(),
): boolean {
  const today = getTodayHours(hours, now);
  if (!today || today.isClosed || !today.openTime || !today.closeTime)
    return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (
    minutes >= toMinutes(today.openTime) && minutes < toMinutes(today.closeTime)
  );
}

/** Human-friendly label for a single day's schedule. */
export function formatHours(hour: OperatingHour): string {
  if (hour.isClosed || !hour.openTime || !hour.closeTime) return "Închis";
  return `${hour.openTime} – ${hour.closeTime}`;
}
