import type { Metadata } from "next";

import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader, PageSection } from "@/components/layout";
import { getSettings } from "@/lib/data/settings";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `Contact — ${settings.college_name}`,
 description: `Get in touch with ${settings.college_name} — admissions, fees, academic enquiries, and general contact.`,
 };
}

export default async function ContactPage() {
 const settings = await getSettings();
 const supabaseReady = isSupabaseConfigured();

 return (
 <>
 <PageHeader
 eyebrow="Contact"
 title="Get in touch"
 description="Offices, map, and a short message form."
 />

 <PageSection bordered={false}>
 {!supabaseReady ? (
 <p
 role="status"
 className="mb-8 rounded border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-ink"
 >
 Preview mode — Supabase is not connected yet. Pages use sample
 content; the contact form will work once you add your project URL
 and keys to <code className="ref-mono text-xs">.env.local</code>.
 </p>
 ) : null}

 <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
 <section aria-labelledby="contact-form-heading">
 <h2
 id="contact-form-heading"
 className="font-serif text-display-sm"
 >
 Send a message
 </h2>
 <div className="mt-8">
 <ContactForm />
 </div>
 </section>

 <aside aria-label="Contact information">
 <ContactDetails settings={settings} />
 </aside>
 </div>
 </PageSection>
 </>
 );
}
