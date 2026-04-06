import { LicenseAdminConsole } from "@/components/forms/license-admin-console";
import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import { hasAdminPageSession, isAdminTokenConfigured } from "@/lib/admin-auth";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Internal License Admin | Wappkit",
  description:
    "Internal support page for looking up Wappkit license records and removing stuck device bindings.",
  noIndex: true,
});

export default function InternalLicenseAdminPage() {
  if (!isAdminTokenConfigured()) {
    return (
      <div className="container max-w-4xl py-16 md:py-20">
        <div className="rounded-[2rem] border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Internal Admin
          </p>
          <h1 className="mt-3 font-heading text-4xl text-foreground">
            Admin access is not configured
          </h1>
          <p className="mt-4 text-muted-foreground">
            Add <code>INTERNAL_ADMIN_TOKEN</code> in your local environment and
            in Vercel before using this internal license page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-16 md:py-20">
      {hasAdminPageSession() ? (
        <LicenseAdminConsole />
      ) : (
        <LicenseAdminLoginForm />
      )}
    </div>
  );
}
