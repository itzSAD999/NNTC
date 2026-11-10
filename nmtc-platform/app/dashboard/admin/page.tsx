import { requireStaffRole } from "@/lib/auth/session";
import AdminOverviewPage from "./admin-overview-page";

export default async function Page() {
  await requireStaffRole(["super_admin"]);
  return <AdminOverviewPage />;
}

