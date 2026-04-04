import { constructMetadata } from "@/lib/utils";
import { LicenseRetrievalForm } from "@/components/forms/license-retrieval-form";

export const metadata = constructMetadata({
  title: "Retrieve a License | Wappkit",
  description:
    "Recover a Wappkit license using order details and the purchase email.",
});

export default function LicenseRetrievePage() {
  return (
    <div className="container max-w-3xl py-16 md:py-20">
      <div className="rounded-[2rem] border bg-card p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          License Retrieval
        </p>
        <h1 className="mt-3 font-heading text-4xl text-foreground">
          Find your license by order details
        </h1>
        <p className="mt-4 text-muted-foreground">
          Enter the original order ID and purchase email to look up the license
          mirrored from Creem. Direct display is the primary recovery flow, and
          email resend is available when configured.
        </p>

        <div className="mt-8">
          <LicenseRetrievalForm />
        </div>
      </div>
    </div>
  );
}
