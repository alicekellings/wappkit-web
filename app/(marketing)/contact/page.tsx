import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Contact | Wappkit",
  description:
    "Get in touch with Wappkit for licensing, product, or support questions.",
});

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Contact
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          Need help with a tool, payment, or activation?
        </h1>
        <p className="text-lg text-muted-foreground">
          Wappkit is intentionally lightweight. Instead of a support dashboard,
          we keep product pages, docs, and license guidance clear and direct.
          For anything else, contact the team by email.
        </p>
      </div>

      <div className="mt-10 rounded-[2rem] border bg-card p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Support email
        </p>
        <a
          href="mailto:support@wappkit.com"
          className="mt-3 block text-2xl font-semibold text-foreground underline underline-offset-4"
        >
          support@wappkit.com
        </a>
        <p className="mt-4 text-muted-foreground">
          Include the tool name, your order ID if relevant, and a short summary
          of the issue so we can help faster.
        </p>
      </div>
    </div>
  );
}
