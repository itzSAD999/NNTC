"use client";

import { useRef, useState } from "react";

import { uploadDocument } from "@/lib/actions/upload";
import { getStoragePublicUrl } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DocumentUploadFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (path: string) => void;
};

export function DocumentUploadField({
  name,
  label,
  value,
  onChange,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloadUrl = getStoragePublicUrl(value || null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadDocument(fd);
    setUploading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.path) onChange(res.path);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={value} />
      {downloadUrl ? (
        <p className="text-sm">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Current file
          </a>
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf"
          className="max-w-xs"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {value ? (
          <Button type="button" size="sm" variant="outline" onClick={() => onChange("")}>
            Remove
          </Button>
        ) : null}
      </div>
      {uploading ? <p className="text-xs text-caption">Uploading…</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
