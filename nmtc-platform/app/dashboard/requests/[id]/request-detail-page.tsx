import { notFound } from "next/navigation";

import { RequestDetailView } from "@/components/dashboard/request-detail-view";
import { requireStaffSession } from "@/lib/auth/session";
import { getRequestById } from "@/lib/data/dashboard-requests";
import type { Role } from "@/lib/constants";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStaffSession();
  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  const role = session.staff.role as Role;
  const backHref =
    role === "accounts"
      ? "/dashboard/accounts"
      : role === "principal"
        ? "/dashboard/principal"
        : "/dashboard/academic";

  const backLabel =
    role === "accounts"
      ? "Back to Accounts queue"
      : role === "principal"
        ? "Back to Principal queue"
        : "Back to Academic queue";

  return (
    <RequestDetailView
      request={request}
      role={role}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}
