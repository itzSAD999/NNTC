"use server";

import { revalidatePath } from "next/cache";

import { requireInboxStaff } from "@/lib/auth/permissions";
import { getSettings } from "@/lib/data/settings";
import { guardPublicForm } from "@/lib/security/public-forms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildContactEmailHtml, sendEmail } from "@/lib/email/send";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";

export type ContactFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const guard = await guardPublicForm(
    "contact",
    formData.get("cf-turnstile-response")?.toString()
  );
  if (!guard.allowed) {
    return {
      error:
        guard.turnstileError ??
        `Too many messages. Try again in ${guard.retryAfterSeconds ?? 60} seconds.`,
    };
  }

  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() || undefined,
    subject: formData.get("subject")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as keyof ContactFormValues;
      if (field) fieldErrors[field] = err.message;
    });
    return { error: "Please fix the errors below.", fieldErrors };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "The contact form is not active yet — Supabase has not been connected. Add your project keys to .env.local to enable submissions.",
    };
  }

  const data = parsed.data;

  try {
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject,
      message: data.message,
    });

    if (dbError) {
      return { error: "Could not send your message. Please try again." };
    }

    const settings = await getSettings();
    const inbox =
      process.env.CONTACT_INBOX_EMAIL?.trim() ||
      process.env.EMAIL_MAIN?.trim() ||
      settings.email_main?.trim() ||
      null;

    if (inbox && process.env.RESEND_API_KEY?.trim()) {
      const html = await buildContactEmailHtml(data);
      await sendEmail({
        to: inbox,
        subject: `[NMTC Contact] ${data.subject} — ${data.name}`,
        html,
      });
    }

    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export type InboxActionState = {
  error?: string;
  success?: boolean;
};

export async function markContactReadForm(
  formData: FormData
): Promise<void> {
  const id = formData.get("id")?.toString() ?? "";
  await markContactRead(id);
}

export async function markContactRead(id: string): Promise<InboxActionState> {
  await requireInboxStaff();

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    return { error: "Could not mark message as read." };
  }

  revalidatePath("/dashboard/admin/inbox");
  return { success: true };
}
