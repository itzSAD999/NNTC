import { createClient } from "@/lib/supabase/server";
import type { RequestStatus } from "@/lib/constants";

export type AuditEventRow = {
  id: string;
  action: string;
  actor_label: string;
  note: string | null;
  created_at: string;
  request_id: string;
  reference_no: string;
  request_status: RequestStatus;
};

export type AuditFilters = {
  month?: string;
  status?: RequestStatus | "";
  actor?: string;
};

export async function listAuditEvents(
  filters: AuditFilters,
  limit = 200
): Promise<AuditEventRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("request_events")
    .select(
      "id, action, actor_label, note, created_at, request_id, requests(reference_no, status)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.month) {
    const start = `${filters.month}-01T00:00:00.000Z`;
    const [y, m] = filters.month.split("-").map(Number);
    const nextMonth =
      m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    const end = `${nextMonth}-01T00:00:00.000Z`;
    query = query.gte("created_at", start).lt("created_at", end);
  }

  if (filters.actor?.trim()) {
    query = query.ilike("actor_label", `%${filters.actor.trim()}%`);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  let rows = (data as Array<{
    id: string;
    action: string;
    actor_label: string;
    note: string | null;
    created_at: string;
    request_id: string;
    requests: { reference_no: string; status: RequestStatus } | { reference_no: string; status: RequestStatus }[] | null;
  }>).map((row) => {
    const req = Array.isArray(row.requests) ? row.requests[0] : row.requests;
    return {
      id: row.id,
      action: row.action,
      actor_label: row.actor_label,
      note: row.note,
      created_at: row.created_at,
      request_id: row.request_id,
      reference_no: req?.reference_no ?? "—",
      request_status: req?.status ?? "submitted",
    };
  });

  if (filters.status) {
    rows = rows.filter((r) => r.request_status === filters.status);
  }

  return rows;
}

export async function listAuditActors(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("request_events")
    .select("actor_label")
    .order("actor_label");

  const labels = new Set((data ?? []).map((r) => r.actor_label));
  return Array.from(labels).sort();
}
