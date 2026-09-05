"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireContentStaff } from "@/lib/auth/permissions";
import { isEventPast } from "@/lib/events/dates";
import { createClient } from "@/lib/supabase/server";
import { eventFormSchema } from "@/lib/validation/events";

export type EventActionState = { error?: string; success?: boolean };

function deriveIsPast(startsAt: string, endsAt: string | null): boolean {
  return isEventPast(startsAt, endsAt);
}

export async function createEvent(
  _prev: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  await requireContentStaff();

  const parsed = eventFormSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    starts_at: formData.get("starts_at")?.toString() ?? "",
    ends_at: formData.get("ends_at")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    cover_image_url: formData.get("cover_image_url")?.toString() ?? "",
    registration_url: formData.get("registration_url")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const startsIso = new Date(d.starts_at).toISOString();
  const endsIso = d.ends_at ? new Date(d.ends_at).toISOString() : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: d.title,
      slug: d.slug,
      description: d.description,
      starts_at: startsIso,
      ends_at: endsIso,
      location: d.location,
      cover_image_url: d.cover_image_url || null,
      registration_url: d.registration_url || null,
      is_past: deriveIsPast(startsIso, endsIso),
    })
    .select("id")
    .single();

  if (error) return { error: "Could not create event. Slug may already exist." };

  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/dashboard/admin/events");
  redirect(`/dashboard/admin/events/${data.id}`);
}

export async function updateEvent(
  _prev: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  await requireContentStaff();

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Missing event ID." };

  const parsed = eventFormSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    starts_at: formData.get("starts_at")?.toString() ?? "",
    ends_at: formData.get("ends_at")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    cover_image_url: formData.get("cover_image_url")?.toString() ?? "",
    registration_url: formData.get("registration_url")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const d = parsed.data;
  const startsIso = new Date(d.starts_at).toISOString();
  const endsIso = d.ends_at ? new Date(d.ends_at).toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      title: d.title,
      slug: d.slug,
      description: d.description,
      starts_at: startsIso,
      ends_at: endsIso,
      location: d.location,
      cover_image_url: d.cover_image_url || null,
      registration_url: d.registration_url || null,
      is_past: deriveIsPast(startsIso, endsIso),
    })
    .eq("id", id);

  if (error) return { error: "Could not save event." };

  revalidatePath("/events");
  revalidatePath(`/events/${d.slug}`);
  revalidatePath("/");
  revalidatePath("/dashboard/admin/events");
  return { success: true };
}

export async function deleteEventForm(formData: FormData): Promise<void> {
  await requireContentStaff();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/dashboard/admin/events");
  redirect("/dashboard/admin/events");
}
