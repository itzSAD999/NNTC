import { NextResponse } from "next/server";

import { verifyPaystackSignature } from "@/lib/paystack/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendPaymentConfirmedSms } from "@/lib/sms/arkesel";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (process.env.NODE_ENV === "production" && !verifyPaystackSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "charge.success") {
      const data = payload.data;
      const referenceNo =
        data.metadata?.reference_no ||
        data.metadata?.custom_fields?.find(
          (f: { variable_name: string }) => f.variable_name === "reference_no"
        )?.value ||
        data.reference;

      const amountGhs = data.amount / 100;

      if (referenceNo && isSupabaseConfigured()) {
        const supabase = createAdminClient();

        const { data: req } = await supabase
          .from("requests")
          .select("id, student_name, student_phone, student_email, status, reference_no")
          .eq("reference_no", referenceNo)
          .maybeSingle();

        if (req && req.status !== "payment_confirmed" && req.status !== "approved") {
          await supabase
            .from("requests")
            .update({ status: "payment_confirmed" })
            .eq("id", req.id);

          await supabase.from("request_events").insert({
            request_id: req.id,
            actor_id: null,
            actor_label: "Paystack (MoMo)",
            action: "payment_confirmed",
            note: `Payment of GHS ${amountGhs.toFixed(2)} verified via Paystack (${data.channel || "mobile_money"}).`,
          });

          // Send confirmation SMS if phone is available
          if (req.student_phone) {
            await sendPaymentConfirmedSms({
              phone: req.student_phone,
              studentName: req.student_name,
              referenceNo: req.reference_no,
              amountGhs,
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook handler error" },
      { status: 400 }
    );
  }
}

