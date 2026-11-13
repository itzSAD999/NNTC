import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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
  const role = session.staff.role as Role;

  if (role === "content_editor") {
    redirect("/dashboard/editor");
  }

  const request = await getRequestById(id);

  if (!request) {
    notFound();
  }

  if (
    role !== "academic" &&
    role !== "accounts" &&
    role !== "principal" &&
    role !== "super_admin"
  ) {
    return (
      <div className="border border-line bg-white p-8">
        <p className="font-serif text-xl">Document requests</p>
        <p className="mt-2 text-sm text-caption">
          This desk does not process document requests.
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-primary">
          Back to dashboard
        </Link>
      </div>
    );
  }
  const backHref =
    role === "accounts"
      ? "/dashboard/accounts"
      : role === "principal"
        ? "/dashboard/principal"
        : role === "super_admin"
          ? "/dashboard/admin"
          : "/dashboard/academic";

  const backLabel =
    role === "accounts"
      ? "Back to Accounts queue"
      : role === "principal"
        ? "Back to Principal queue"
        : role === "super_admin"
          ? "Back to overview"
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
