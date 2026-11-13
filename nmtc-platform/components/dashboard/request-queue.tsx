"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpDown, ChevronRight } from "lucide-react";

import type { RequestWithDocType } from "@/lib/data/dashboard-requests";
import { formatShortDate } from "@/lib/utils/format";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import type { RequestStatus } from "@/lib/constants";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { isPreviewId } from "@/lib/data/admin-preview";
import { Input } from "@/components/ui/input";

interface RequestQueueProps {
  requests: RequestWithDocType[];
  emptyMessage: string;
  stage?: "pending" | "processed" | "signed";
}

export function RequestQueue({
  requests,
  emptyMessage,
  stage,
}: RequestQueueProps) {
  const [search, setSearch] = useState("");
  const [docFilter, setDocFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Extract unique document types from the requests list
  const docTypeOptions = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((req) => {
      const docRel = req.document_types as
        | { name: string }
        | { name: string }[]
        | null;
      const docName = Array.isArray(docRel) ? docRel[0]?.name : docRel?.name;
      if (docName) set.add(docName);
    });
    return Array.from(set).sort();
  }, [requests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests
      .filter((req) => {
        // Document type filter
        if (docFilter !== "all") {
          const docRel = req.document_types as
            | { name: string }
            | { name: string }[]
            | null;
          const docName = Array.isArray(docRel) ? docRel[0]?.name : docRel?.name;
          if (docName !== docFilter) return false;
        }

        // Delivery filter
        if (deliveryFilter !== "all" && req.delivery_method !== deliveryFilter) {
          return false;
        }

        // Search query (reference_no, student_name, student_id, student_email, phone, purpose)
        if (q) {
          const matchRef = req.reference_no.toLowerCase().includes(q);
          const matchName = req.student_name.toLowerCase().includes(q);
          const matchId = req.student_id.toLowerCase().includes(q);
          const matchEmail = req.student_email.toLowerCase().includes(q);
          const matchPhone = req.student_phone?.toLowerCase().includes(q) ?? false;
          const matchProgram = req.program?.toLowerCase().includes(q) ?? false;
          if (!matchRef && !matchName && !matchId && !matchEmail && !matchPhone && !matchProgram) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [requests, search, docFilter, deliveryFilter, sortOrder]);

  const hasActiveFilters = search.trim() !== "" || docFilter !== "all" || deliveryFilter !== "all";

  function clearFilters() {
    setSearch("");
    setDocFilter("all");
    setDeliveryFilter("all");
  }

  if (requests.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-4">
      {requests.some((req) => isPreviewId(req.id)) ? <PreviewBanner /> : null}
      <div className="border border-line bg-white p-3.5 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Real-time search input */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, index number, or NMTC reference..."
              className="pl-9 text-xs sm:text-sm bg-bg/50 focus:bg-surface"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-caption hover:text-ink text-xs"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Document Type Dropdown Filter */}
          {docTypeOptions.length > 1 && (
            <div className="shrink-0 w-full sm:w-auto">
              <select
                value={docFilter}
                onChange={(e) => setDocFilter(e.target.value)}
                className="flex h-9 w-full border border-line bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="all">All Document Types</option>
                {docTypeOptions.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Delivery Method Filter */}
          <div className="shrink-0 w-full sm:w-auto">
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="flex h-9 w-full border border-line bg-white px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="all">All delivery modes</option>
              <option value="collection">Collection at college</option>
              <option value="email">Email delivery</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-medium text-caption hover:text-ink shrink-0"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            </span>
          </button>
        </div>

        {/* Filter status row & Clear button */}
        <div className="flex items-center justify-between text-xs text-caption pt-1 border-t border-line/50">
          <p>
            Showing <strong className="text-ink">{filteredRequests.length}</strong> of{" "}
            <strong>{requests.length}</strong>{" "}
            {stage ?? "queued"} requests
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <X className="h-3 w-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="border border-line bg-white p-8 text-center space-y-3">
          <p className="text-sm font-medium text-ink">No requests match your filters.</p>
          <p className="text-xs text-caption">Try adjusting your search terms or clearing filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-deep"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-[#f7f7f7] text-[0.7rem] uppercase tracking-wider text-caption font-semibold">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredRequests.map((req) => {
                const docRel = req.document_types as
                  | { name: string }
                  | { name: string }[]
                  | null;
                const docName = Array.isArray(docRel)
                  ? docRel[0]?.name
                  : docRel?.name ?? "—";

                return (
                  <tr
                    key={req.id}
                    className="transition-colors hover:bg-bg/40 group"
                  >
                    <td className="px-4 py-3">
                      <ReferenceDisplay referenceNo={req.reference_no} size="md" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink leading-tight">
                        {req.student_name}
                      </p>
                      <p className="text-xs text-caption font-mono mt-0.5">
                        {req.student_id}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-ink">{docName}</p>
                      {req.program && (
                        <p className="text-[0.65rem] text-caption truncate max-w-[180px]">
                          {req.program}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block capitalize rounded bg-bg px-2 py-0.5 text-xs text-caption">
                        {req.delivery_method}
                      </span>
                    </td>
                    <td className="px-4 py-3 ref-mono text-caption text-xs">
                      {formatShortDate(req.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        status={req.status as RequestStatus}
                        label={STATUS_LABELS[req.status as RequestStatus]}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/requests/${req.id}`}
                        className="inline-flex items-center gap-1 bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-deep"
                      >
                        <span>Review</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
