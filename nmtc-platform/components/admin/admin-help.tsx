import type { ReactNode } from "react";

import type { AdminSectionKey } from "@/lib/admin/page-guides";
import { ADMIN_SECTION_GUIDES, CMS_SCOPE_NOTE } from "@/lib/admin/page-guides";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-caption">{children}</p>;
}

export function AdminInfoPanel({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded border border-line bg-bg px-4 py-4 text-sm leading-relaxed text-caption">
      {title ? <p className="font-medium text-ink">{title}</p> : null}
      <div className={title ? "mt-2 space-y-2" : "space-y-2"}>{children}</div>
    </div>
  );
}

export function AdminScopeNote() {
  return (
    <AdminInfoPanel title="What you edit here">
      <p>{CMS_SCOPE_NOTE}</p>
    </AdminInfoPanel>
  );
}

export function AdminPageHeader({
  section,
  extra,
}: {
  section: AdminSectionKey;
  extra?: ReactNode;
}) {
  const guide = ADMIN_SECTION_GUIDES[section];

  return (
    <header className="space-y-4">
      <div>
        <h1 className="font-serif text-display-lg">{guide.title}</h1>
        <p className="mt-2 text-caption">{guide.description}</p>
        {guide.publicPath ? (
          <p className="mt-1 text-xs text-caption">
            Public page:{" "}
            <span className="ref-mono text-ink">{guide.publicPath}</span>
          </p>
        ) : null}
      </div>
      <AdminScopeNote />
      <AdminInfoPanel title="How this works">
        <p>{guide.howItWorks}</p>
      </AdminInfoPanel>
      {extra}
    </header>
  );
}

export function PublicLinkPreview({
  basePath,
  slug,
}: {
  basePath: string;
  slug: string;
}) {
  return (
    <p className="text-xs text-caption">
      Public page:{" "}
      <span className="ref-mono text-ink">
        {basePath}/{slug}
      </span>
    </p>
  );
}

type SlugFieldProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  basePath: string;
  required?: boolean;
};

export function SlugField({
  id = "slug",
  name = "slug",
  value,
  onChange,
  basePath,
  required = true,
}: SlugFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Page link (web address)</Label>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-describedby={`${id}-hint`}
      />
      <FieldHint>
        Filled in automatically from the title. Visitors open this page at{" "}
        <span className="ref-mono text-ink">
          {basePath}/{value || "…"}
        </span>
        . Use lowercase letters, numbers, and hyphens only. Change only if you
        need a shorter link.
      </FieldHint>
    </div>
  );
}

export function SortOrderLabel({ htmlFor }: { htmlFor: string }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>Display order</Label>
      <FieldHint>Lower numbers appear first on the public page.</FieldHint>
    </div>
  );
}

export function PublishLabel({ htmlFor }: { htmlFor: string }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>Published on public site</Label>
      <FieldHint>Unticked = draft (hidden from visitors).</FieldHint>
    </div>
  );
}
