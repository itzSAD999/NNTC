"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { uploadPublicAsset } from "@/lib/actions/upload";
import { getStoragePublicUrl } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  value: string;
  folder: string;
  onChange: (path: string) => void;
};

export function ImageUploadField({
  name,
  label,
  value,
  folder,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = getStoragePublicUrl(value || null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await uploadPublicAsset(fd);
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
      {preview ? (
        <div className="relative h-32 w-32 overflow-hidden rounded border border-line">
          <Image src={preview} alt="" fill className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
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
