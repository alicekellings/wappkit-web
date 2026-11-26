import { LicenseAdminConsole } from "@/components/forms/license-admin-console";
import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import { hasAdminPageSession, isAdminTokenConfigured } from "@/lib/admin-auth";
import { constructMetadata } from "@/lib/utils";

// 必须强制动态渲染：本页依据运行时的 INTERNAL_ADMIN_TOKEN 判断是否配置。
// 若允许预渲染，构建机上没有该变量，会把「未配置」的 HTML 固化进产物，
// 之后环境变量配了也不会变（11-26 实际发生过）。
export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Internal License Admin | Wappkit",
  description:
    "Internal support page for looking up Wappkit license records and removing stuck device bindings.",
  noIndex: true,
});

export default function InternalLicenseAdminPage() {
  if (!isAdminTokenConfigured()) {
    return (
      <div className="container max-w-[980px] py-16 md:py-20">
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
    <div className="container max-w-[1520px] py-16 md:py-20">
      {hasAdminPageSession() ? (
        <LicenseAdminConsole />
      ) : (
        <LicenseAdminLoginForm />
      )}
    </div>
  );
}
