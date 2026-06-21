import type { OrgTreeNode } from "@/lib/data/org-units";

function OrgNode({ node, depth = 0 }: { node: OrgTreeNode; depth?: number }) {
  return (
    <li className={depth > 0 ? "ml-4 border-l border-line pl-4 md:ml-6 md:pl-6" : ""}>
      <div className="rounded border border-line bg-surface px-4 py-3">
        <p className="font-medium text-ink">{node.name}</p>
        <p className="mt-1 text-sm text-caption">{node.head_name}</p>
      </div>
      {node.children.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {node.children.map((child) => (
            <OrgNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function OrgChart({ tree }: { tree: OrgTreeNode[] }) {
  if (tree.length === 0) return null;

  return (
    <section aria-labelledby="org-chart-heading">
      <h2
        id="org-chart-heading"
        className="hairline-b pb-4 font-serif text-display-md"
      >
        Organisation
      </h2>
      <ul className="mt-8 space-y-3">
        {tree.map((node) => (
          <OrgNode key={node.id} node={node} />
        ))}
      </ul>
    </section>
  );
}
