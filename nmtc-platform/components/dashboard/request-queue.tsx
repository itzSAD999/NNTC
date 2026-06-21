import Link from "next/link";

import type { RequestWithDocType } from "@/lib/data/dashboard-requests";
import { formatShortDate } from "@/lib/utils/format";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_LABELS } from "@/lib/requests/status-labels";
import type { RequestStatus } from "@/lib/constants";

interface RequestQueueProps {
  requests: RequestWithDocType[];
  emptyMessage: string;
}

export function RequestQueue({ requests, emptyMessage }: RequestQueueProps) {
  if (requests.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-widest text-caption">
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Document</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const docRel = req.document_types as
              | { name: string }
              | { name: string }[]
              | null;
            const docName = Array.isArray(docRel)
              ? docRel[0]?.name
              : docRel?.name ?? "—";

            return (
              <tr key={req.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <ReferenceDisplay referenceNo={req.reference_no} size="md" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{req.student_name}</p>
                  <p className="text-xs text-caption">{req.student_id}</p>
                </td>
                <td className="px-4 py-3 text-caption">{docName}</td>
                <td className="px-4 py-3 ref-mono text-caption">
                  {formatShortDate(req.created_at)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill
                    status={req.status as RequestStatus}
                    label={STATUS_LABELS[req.status as RequestStatus]}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/requests/${req.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
