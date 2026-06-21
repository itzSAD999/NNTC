import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { RequestStatus } from "@/lib/constants";
import type { Request, RequestEvent } from "@/types/database";

export type RequestWithDocType = Request & {
  document_types: { name: string; fee_amount: number } | null;
};

export type RequestEventWithActor = RequestEvent & {
  actor: { full_name: string } | null;
};

export type RequestDetail = RequestWithDocType & {
  events: RequestEventWithActor[];
  receiptSignedUrl: string | null;
};

export async function getRequestsByStatus(
  statuses: RequestStatus[]
): Promise<RequestWithDocType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, document_types(name, fee_amount)")
    .in("status", statuses)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as RequestWithDocType[];
}

export async function getRequestById(id: string): Promise<RequestDetail | null> {
  const supabase = await createClient();
  const { data: request, error } = await supabase
    .from("requests")
    .select("*, document_types(name, fee_amount)")
    .eq("id", id)
    .single();

  if (error || !request) return null;

  const { data: events } = await supabase
    .from("request_events")
    .select("*, actor:staff_accounts(full_name)")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  const receiptSignedUrl = await getReceiptSignedUrl(request.receipt_url);

  return {
    ...(request as RequestWithDocType),
    events: (events ?? []) as RequestEventWithActor[],
    receiptSignedUrl,
  };
}

export async function getReceiptSignedUrl(
  receiptUrl: string | null
): Promise<string | null> {
  if (!receiptUrl) return null;

  const path = receiptUrl.startsWith(`${STORAGE_BUCKETS.receipts}/`)
    ? receiptUrl.slice(`${STORAGE_BUCKETS.receipts}/`.length)
    : receiptUrl;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.receipts)
    .createSignedUrl(path, 3600);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export type PrincipalStats = {
  week: number;
  month: number;
  total: number;
};

export async function getPrincipalStats(): Promise<PrincipalStats> {
  const supabase = await createClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from("request_events")
    .select("created_at")
    .eq("action", "principal_approved");

  const rows = events ?? [];
  return {
    week: rows.filter((e) => e.created_at >= weekAgo).length,
    month: rows.filter((e) => e.created_at >= monthAgo).length,
    total: rows.length,
  };
}
