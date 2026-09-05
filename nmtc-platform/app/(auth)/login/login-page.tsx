import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { isAuthBypassEnabled } from "@/lib/auth/dev-bypass";

export const metadata: Metadata = {
  title: "Staff Login — NMTC",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const devBypass = isAuthBypassEnabled();

  return (
    <div className="space-y-4">
      {devBypass ? (
        <div className="rounded border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <p className="font-medium text-warning">Dev preview mode is on</p>
          <p className="mt-1 text-caption">
            Login is skipped locally.{" "}
            <Link href="/dashboard" className="font-medium text-primary underline">
              Open dashboard
            </Link>{" "}
            and use the role switcher at the top.
          </p>
        </div>
      ) : null}
      <LoginForm />
    </div>
  );
}
