import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ReferenceDisplay } from "@/components/requests/reference-display";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
 title: "Request Submitted — NMTC",
 description: "Your document request has been submitted. Save your reference number.",
};

interface RequestSubmittedPageProps {
 searchParams: Promise<{ ref?: string }>;
}

export default async function RequestSubmittedPage({
 searchParams,
}: RequestSubmittedPageProps) {
 const sp = await searchParams;
 const refs = (sp.ref?.trim() ?? "").split(",").map((r) => r.trim()).filter(Boolean);
 const referenceNo = refs[0];

 return (
 <Reveal className="section-grid max-w-2xl py-16 md:py-24">
 <p className="text-sm font-medium uppercase tracking-widest text-primary">
 Submission confirmed
 </p>
 <h1 className="mt-3 font-serif text-display-lg">Request submitted</h1>

 {referenceNo ? (
 <>
 <p className="mt-4 text-caption">
 Your request has been received. Save this reference number — you
 will need it to track your document.
 </p>

 <div className="mt-8 space-y-3 border border-line bg-white p-6 md:p-8">
 <p className="text-xs font-medium uppercase tracking-widest text-caption">
 Your reference number{refs.length > 1 ? "s" : ""}
 </p>
 {refs.map((ref) => (
 <ReferenceDisplay key={ref} referenceNo={ref} size="lg" className="mt-3" />
 ))}
 </div>

 <p className="mt-6 text-sm text-caption">
 A confirmation email has been sent if email delivery is configured.
 You can check status anytime on the track page.
 </p>

 <div className="mt-8 flex flex-wrap gap-3">
 <Button asChild>
 <Link
 href={`/request/track?ref=${encodeURIComponent(referenceNo)}`}
 >
 Track this request
 </Link>
 </Button>
 <Button asChild variant="outline">
 <Link href="/">Back to home</Link>
 </Button>
 </div>
 </>
 ) : (
 <>
 <p className="mt-4 text-caption">
 If you were redirected here after submitting, your reference number
 should appear above. If not, check your confirmation email or contact
 the college.
 </p>
 <div className="mt-8">
 <Button asChild variant="outline">
 <Link href="/request/track">Go to track page</Link>
 </Button>
 </div>
 </>
 )}
 </Reveal>
 );
}
