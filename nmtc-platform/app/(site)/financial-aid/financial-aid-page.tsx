import type { Metadata } from "next";

import { FinancialAidSections } from "@/components/marketing/financial-aid-sections";
import { PageHeader } from "@/components/layout/page-header";
import { getFinancialAidPageData } from "@/lib/data/fees";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return {
 title: `Fees & Financial Aid — ${settings.college_name}`,
 description: `Tuition fees, payment methods, scholarships, SLTF, and financial support at ${settings.college_name}.`,
 };
}

export default async function FinancialAidPage() {
 const [data, settings] = await Promise.all([
 getFinancialAidPageData(),
 getSettings(),
 ]);

 return (
 <>
 <PageHeader
 eyebrow="Finance"
 title="Fees & financial aid"
 description="Fees, payments, and scholarships."
 />
 <FinancialAidSections data={data} settings={settings} />
 </>
 );
}
