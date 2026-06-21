import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PREVIEW_ORG_UNITS } from "@/lib/data/preview-expansion";
import type { OrgUnit } from "@/lib/types/expansion";

export async function getOrgUnits(): Promise<OrgUnit[]> {
  if (!isSupabaseConfigured()) return PREVIEW_ORG_UNITS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("org_units")
      .select("*")
      .order("sort_order");

    if (error || !data) return PREVIEW_ORG_UNITS;
    return data as OrgUnit[];
  } catch {
    return PREVIEW_ORG_UNITS;
  }
}

export type OrgTreeNode = OrgUnit & { children: OrgTreeNode[] };

export function buildOrgTree(units: OrgUnit[]): OrgTreeNode[] {
  const map = new Map<string, OrgTreeNode>();
  for (const u of units) {
    map.set(u.id, { ...u, children: [] });
  }
  const roots: OrgTreeNode[] = [];
  for (const node of Array.from(map.values())) {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortNodes = (nodes: OrgTreeNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}
