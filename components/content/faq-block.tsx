import type { FaqItem } from "@/lib/faq";

/**
 * Visible FAQ plus FAQPage structured data. Both come from the same items so
 * the markup and the JSON-LD cannot drift apart.
 */
export function FaqBlock({
  items,
  heading = "Frequently asked questions",
  className,
}: {
  items: FaqItem[];
  heading?: string;
  className?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      className={
        className ??
        "mt-10 rounded-[1.6rem] border border-border/70 bg-background/70 p-6 md:p-8"
      }
    >
      <h2 className="font-heading text-2xl text-foreground">{heading}</h2>
      <dl className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="text-base font-semibold text-foreground">
              {item.q}
            </dt>
            <dd className="mt-2 text-[15px] leading-7 text-muted-foreground">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}