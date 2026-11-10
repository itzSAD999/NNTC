"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  Building2,
  CheckCircle2,
  FileText,
  Award,
  Languages,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  Copy,
  RefreshCw,
  Clock,
  Coins,
  Mail,
  Sparkles,
  AlertCircle,
  Database,
  Smartphone,
  QrCode,
  Sliders,
} from "lucide-react";

import {
  updateDocumentTypeFee,
  updateSettings,
  type SettingsActionState,
} from "@/lib/actions/settings";
import type { DocumentType, Settings } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary text-white hover:bg-primary-deep shadow-sm"
    >
      {pending ? (
        <span className="flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Saving changes…
        </span>
      ) : (
        label
      )}
    </Button>
  );
}

function Message({ state }: { state: SettingsActionState }) {
  if (state.error) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{state.error}</span>
      </div>
    );
  }
  if (state.success) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Configuration saved successfully.</span>
      </div>
    );
  }
  return null;
}

const DOC_ICON_MAP: Record<string, React.ElementType> = {
  TR: FileText,
  AT: Award,
  EP: Languages,
  RL: GraduationCap,
  SR: FileCheck,
  CT: ShieldCheck,
};

const DOC_TIMELINES: Record<string, string> = {
  TR: "3–5 working days · Registrar verification",
  AT: "2–3 working days · Academic Affairs",
  EP: "2–3 working days · Language desk review",
  RL: "5 working days · Principal endorsement",
  SR: "2 working days · Examination records check",
  CT: "1–2 working days · Registry stamp & seal",
};

type SettingsTab = "branding" | "fees" | "notifications" | "system";

export function AdminSettingsForm({
  settings,
  documentTypes,
}: {
  settings: Settings;
  documentTypes: DocumentType[];
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("branding");
  const [settingsState, settingsAction] = useActionState(updateSettings, {});

  // Live preview reactive states
  const [collegeName, setCollegeName] = useState(settings.college_name ?? "Nandom NMTC");
  const [motto, setMotto] = useState(settings.motto ?? "Excellence in Nursing and Midwifery");
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color ?? "#1A5E3A");
  const [accentColor, setAccentColor] = useState(settings.accent_color ?? "#9A1B2F");

  // Template textarea ref for inserting tokens
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const insertToken = (token: string) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const text = el.value;
    const newText = text.substring(0, start) + token + text.substring(end);
    el.value = newText;
    el.focus();
    el.setSelectionRange(start + token.length, start + token.length);

    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const templateTokens = [
    { token: "{{student_name}}", label: "Student Name" },
    { token: "{{reference_no}}", label: "Reference No." },
    { token: "{{document_type}}", label: "Document Type" },
    { token: "{{delivery_method}}", label: "Delivery Mode" },
    { token: "{{college_name}}", label: "College Name" },
  ];

  return (
    <div className="space-y-6">
      {/* MODERN TABBED SEGMENTED CONTROL: NO ENDLESS SCROLLING */}
      <nav aria-label="Settings sections" className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("branding")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "branding"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <Building2 className="h-4 w-4" />
          <span>Branding & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("fees")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "fees"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <Coins className="h-4 w-4" />
          <span>Document Fees</span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px]",
              activeTab === "fees" ? "bg-white/20 text-white" : "bg-bg text-caption"
            )}
          >
            {documentTypes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "notifications"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <Mail className="h-4 w-4" />
          <span>Email Automation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-all shadow-sm",
            activeTab === "system"
              ? "bg-primary text-white shadow-sm font-semibold"
              : "bg-surface border border-line text-caption hover:text-ink hover:border-line/80"
          )}
        >
          <Sliders className="h-4 w-4" />
          <span>System & Gateways</span>
        </button>
      </nav>

      {/* TAB 1: INSTITUTIONAL BRANDING & LIVE CREST PREVIEW */}
      {activeTab === "branding" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-ink">
                  Institutional Identity & Design Tokens
                </h2>
                <p className="text-xs text-caption sm:text-sm">
                  Official institution branding, heraldic colours, and digital letterhead identity.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Single College Edition
            </span>
          </div>

          <form action={settingsAction} className="mt-8 space-y-8">
            <Message state={settingsState} />

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Form Fields: 7 Columns */}
              <div className="space-y-5 lg:col-span-7">
                <div className="space-y-2">
                  <Label htmlFor="college_name" className="text-xs font-semibold uppercase tracking-wider text-caption">
                    Official Institution Name *
                  </Label>
                  <Input
                    id="college_name"
                    name="college_name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Nandom Nursing and Midwifery Training College"
                    required
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motto" className="text-xs font-semibold uppercase tracking-wider text-caption">
                    Institutional Motto
                  </Label>
                  <Input
                    id="motto"
                    name="motto"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="e.g. Compassion, Integrity, Excellence"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url" className="text-xs font-semibold uppercase tracking-wider text-caption">
                    College Crest / Logo Image URL
                  </Label>
                  <Input
                    id="logo_url"
                    name="logo_url"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://… or /crest.png"
                  />
                  <p className="text-xs text-caption">
                    Shown in the public portal header, document verification pages, and official receipts.
                  </p>
                </div>

                {/* Color Controls */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="space-y-2 rounded-lg border border-line bg-bg/50 p-3.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="primary_color" className="text-xs font-semibold uppercase tracking-wider text-caption">
                        Primary Theme
                      </Label>
                      <button
                        type="button"
                        onClick={() => setPrimaryColor("#1A5E3A")}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Reset default
                      </button>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-9 w-10 cursor-pointer rounded border border-line bg-transparent p-0.5"
                      />
                      <Input
                        id="primary_color"
                        name="primary_color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        pattern="^#[0-9A-Fa-f]{6}$"
                        required
                        className="font-mono text-sm uppercase"
                      />
                    </div>
                    <span className="block text-[11px] text-caption">Official Forest / Emerald Green</span>
                  </div>

                  <div className="space-y-2 rounded-lg border border-line bg-bg/50 p-3.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accent_color" className="text-xs font-semibold uppercase tracking-wider text-caption">
                        Accent Theme
                      </Label>
                      <button
                        type="button"
                        onClick={() => setAccentColor("#9A1B2F")}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Reset default
                      </button>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-9 w-10 cursor-pointer rounded border border-line bg-transparent p-0.5"
                      />
                      <Input
                        id="accent_color"
                        name="accent_color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        pattern="^#[0-9A-Fa-f]{6}$"
                        required
                        className="font-mono text-sm uppercase"
                      />
                    </div>
                    <span className="block text-[11px] text-caption">Hospital Crimson / Nursing Red</span>
                  </div>
                </div>

                {/* Hidden email template field preserved during branding submit */}
                <input
                  type="hidden"
                  name="notification_email_template"
                  value={settings.notification_email_template ?? ""}
                />
              </div>

              {/* Live Interactive Preview Card: 5 Columns */}
              <div className="lg:col-span-5">
                <div className="sticky top-20 rounded-xl border border-line bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-caption">
                      Live Portal Crest Preview
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: primaryColor }}
                        title="Primary colour"
                      />
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: accentColor }}
                        title="Accent colour"
                      />
                    </div>
                  </div>

                  {/* Simulated Header Banner */}
                  <div
                    className="mt-4 rounded-lg p-4 text-white shadow-sm transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/10 text-white">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt="Crest Preview"
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <Building2 className="h-6 w-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-sm font-semibold tracking-wide">
                          {collegeName || "Nandom NMTC"}
                        </p>
                        <p className="truncate text-[11px] italic text-white/80">
                          {motto || "Knowledge, Compassion, Service"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[11px]">
                      <span className="rounded bg-white/15 px-2 py-0.5 font-medium">
                        Student Services Portal
                      </span>
                      <span
                        className="rounded px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm"
                        style={{ backgroundColor: accentColor, color: "#fff" }}
                      >
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Letterhead Sample Watermark */}
                  <div className="mt-4 rounded-lg border border-dashed border-line bg-bg/50 p-4 text-center">
                    <p className="text-[11px] uppercase tracking-wider text-caption">Official Letterhead Preview</p>
                    <h4 className="mt-1 font-serif text-sm font-bold text-ink">{collegeName}</h4>
                    <p className="text-[11px] text-caption">{motto}</p>
                    <div className="my-2 h-0.5 w-full" style={{ backgroundColor: accentColor }} />
                    <p className="text-[10px] text-caption">P.O. Box 40, Nandom, Upper West Region · Ghana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-line pt-5">
              <SubmitButton label="Save Institutional Branding" />
            </div>
          </form>
        </section>
      )}

      {/* TAB 2: OFFICIAL DOCUMENT FEE SCHEDULE */}
      {activeTab === "fees" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-ink">
                  Official Document Fee Schedule
                </h2>
                <p className="text-xs text-caption sm:text-sm">
                  Statutory student processing rates displayed on the public request and MoMo checkout desks.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-caption">
              {documentTypes.length} Document Types Active
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map((doc) => (
              <DocumentFeeCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: NOTIFICATION EMAIL AUTOMATION DESK */}
      {activeTab === "notifications" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-ink">
                  Student Dispatch Notification Automation
                </h2>
                <p className="text-xs text-caption sm:text-sm">
                  Automatically emailed to students when their request transitions to{" "}
                  <span className="font-medium text-ink">Ready for Pickup / Dispatched</span> status.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Automated Trigger Active
            </span>
          </div>

          <form action={settingsAction} className="mt-6 space-y-6">
            <Message state={settingsState} />

            {/* Preserved branding values during email template submit */}
            <input type="hidden" name="college_name" value={settings.college_name} />
            <input type="hidden" name="motto" value={settings.motto ?? ""} />
            <input type="hidden" name="logo_url" value={settings.logo_url ?? ""} />
            <input type="hidden" name="primary_color" value={settings.primary_color ?? "#1A5E3A"} />
            <input type="hidden" name="accent_color" value={settings.accent_color ?? "#9A1B2F"} />

            {/* Token Chips */}
            <div className="rounded-lg border border-line bg-bg/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-caption">
                Click variable token to insert at cursor position:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {templateTokens.map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => insertToken(item.token)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-mono text-ink shadow-sm hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <span>{item.token}</span>
                    <span className="text-[10px] font-sans text-caption">({item.label})</span>
                    {copiedToken === item.token ? (
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    ) : (
                      <Copy className="h-3 w-3 text-caption" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification_email_template" className="text-xs font-semibold uppercase tracking-wider text-caption">
                Dispatch Email Body Template
              </Label>
              <Textarea
                ref={textareaRef}
                id="notification_email_template"
                name="notification_email_template"
                rows={9}
                defaultValue={settings.notification_email_template ?? ""}
                placeholder="Dear {{student_name}},\n\nYour request for {{document_type}} (Ref: {{reference_no}}) is now processed and ready for collection via {{delivery_method}}.\n\nWarm regards,\nRegistrar's Office\n{{college_name}}"
                className="font-mono text-xs leading-relaxed sm:text-sm bg-white"
              />
            </div>

            <div className="flex items-center justify-end border-t border-line pt-5">
              <SubmitButton label="Save Notification Template" />
            </div>
          </form>
        </section>
      )}

      {/* TAB 4: SYSTEM & GATEWAY ARCHITECTURE STATUS */}
      {activeTab === "system" && (
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm sm:p-8 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-ink">
                  System Architecture & Integration Desks
                </h2>
                <p className="text-xs text-caption sm:text-sm">
                  Active connection protocols, gateways, and cryptographic verification status.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> All Services Operational
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Database & Single-College Architecture */}
            <div className="rounded-xl border border-line bg-bg/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                  <Database className="h-4 w-4 text-primary" />
                  <span>Supabase Single-College DB</span>
                </div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Connected
                </span>
              </div>
              <p className="text-xs text-caption leading-relaxed">
                Dedicated database schema for Nandom NMTC. Single-institution student identity (SIS), clinical rotations, and billing tables with Row Level Security (RLS) active.
              </p>
            </div>

            {/* Paystack MoMo Gateway */}
            <div className="rounded-xl border border-line bg-bg/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span>Paystack Ghana MoMo</span>
                </div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Ready
                </span>
              </div>
              <p className="text-xs text-caption leading-relaxed">
                Mobile Money channels enabled for MTN MoMo, Telecel Cash, and AT Money in GHS currency. Secure webhook dispatch listener active at <code className="text-primary font-mono text-[11px]">/api/webhooks/paystack</code>.
              </p>
            </div>

            {/* Arkesel SMS Gateway */}
            <div className="rounded-xl border border-line bg-bg/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Arkesel Ghana SMS Engine</span>
                </div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Configured
                </span>
              </div>
              <p className="text-xs text-caption leading-relaxed">
                High-throughput national SMS gateway for instant applicant text notifications upon request submission, academic clearance, and document issuance.
              </p>
            </div>

            {/* QR Verification Desk */}
            <div className="rounded-xl border border-line bg-bg/40 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink font-semibold text-sm">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span>SHA-256 Document Verification</span>
                </div>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Active
                </span>
              </div>
              <p className="text-xs text-caption leading-relaxed">
                Tamper-proof digital seal embedded in every issued certificate and transcript. Validated instantly by employers and embassies worldwide at <code className="text-primary font-mono text-[11px]">/verify/[reference_no]</code>.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DocumentFeeCard({ doc }: { doc: DocumentType }) {
  const [state, action] = useActionState(updateDocumentTypeFee, {});
  const IconComponent = DOC_ICON_MAP[doc.code] ?? FileText;
  const timeline = DOC_TIMELINES[doc.code] ?? "3–5 working days processing";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-sm hover:border-line/80 transition-shadow">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg text-primary border border-line">
            <IconComponent className="h-4 w-4" />
          </div>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-bold text-primary">
            {doc.code}
          </span>
        </div>

        <div className="mt-3">
          <h3 className="font-serif text-sm font-semibold text-ink leading-tight">
            {doc.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-caption">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">{timeline}</span>
          </div>
        </div>
      </div>

      <form action={action} className="mt-4 border-t border-line/60 pt-3 space-y-2">
        <input type="hidden" name="id" value={doc.id} />
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-caption">
              GHS
            </span>
            <Input
              id={`fee-${doc.id}`}
              name="fee_amount"
              type="number"
              min={0}
              step="0.01"
              defaultValue={doc.fee_amount}
              className="pl-12 font-mono text-sm font-semibold"
              required
            />
          </div>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="shrink-0 border-line hover:border-primary hover:text-primary"
          >
            Update
          </Button>
        </div>

        {state.error ? (
          <p className="text-[11px] text-danger">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="text-[11px] font-medium text-primary flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Updated
          </p>
        ) : null}
      </form>
    </div>
  );
}
