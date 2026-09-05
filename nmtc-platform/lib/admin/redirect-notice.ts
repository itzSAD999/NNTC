import { redirect } from "next/navigation";

export type AdminListNotice =
  | "published"
  | "unpublished"
  | "pinned"
  | "unpinned"
  | "updated"
  | "deactivated";

export function redirectWithNotice(path: string, notice: AdminListNotice): never {
  redirect(`${path}?notice=${notice}`);
}
