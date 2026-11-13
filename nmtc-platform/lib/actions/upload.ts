"use server";

import { requireStaffSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOC_BYTES = 20 * 1024 * 1024;

export type UploadResult = { path?: string; error?: string };

export async function uploadPublicAsset(
  formData: FormData
): Promise<UploadResult> {
  await requireStaffSession();

  const file = formData.get("file");
  const folder = formData.get("folder")?.toString()?.trim() || "uploads";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be under 5 MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("public-assets")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) return { error: "Upload failed." };
  return { path: `public-assets/${path}` };
}

export async function uploadDocument(formData: FormData): Promise<UploadResult> {
  await requireStaffSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (file.size > MAX_DOC_BYTES) {
    return { error: "File must be under 20 MB." };
  }

  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.type)) {
    return { error: "Only PDF or Word documents are allowed." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `resources/${crypto.randomUUID()}-${safeName}`;
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) return { error: "Upload failed." };
  return { path: `documents/${path}` };
}
