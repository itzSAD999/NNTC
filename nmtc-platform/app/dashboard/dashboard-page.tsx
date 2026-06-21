import { redirect } from "next/navigation";

import { getRoleDashboardPath, requireStaffSession } from "@/lib/auth/session";

export default async function DashboardHomePage() {
  const session = await requireStaffSession();
  redirect(getRoleDashboardPath(session.staff.role));
}
