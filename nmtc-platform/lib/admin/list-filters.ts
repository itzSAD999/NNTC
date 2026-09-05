export type PublishFilter = "all" | "published" | "draft";

export function matchesSearch(
  query: string,
  values: (string | null | undefined)[]
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return values.some((v) => v?.toLowerCase().includes(q));
}

export function matchesPublishFilter(
  filter: PublishFilter,
  published: boolean
): boolean {
  if (filter === "all") return true;
  if (filter === "published") return published;
  return !published;
}

export function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}
