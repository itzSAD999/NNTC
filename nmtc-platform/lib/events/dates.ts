/** Whether an event belongs in the past archive (by date, not manual flag). */
export function isEventPast(
  startsAt: string,
  endsAt: string | null | undefined
): boolean {
  const now = Date.now();
  if (endsAt) return new Date(endsAt).getTime() < now;
  return new Date(startsAt).getTime() < now;
}

export function eventStatusLabel(
  startsAt: string,
  endsAt: string | null | undefined
): "Upcoming" | "Past" {
  return isEventPast(startsAt, endsAt) ? "Past" : "Upcoming";
}
