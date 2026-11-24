import type { FaqItem } from "@/lib/faq";

/**
 * FAQPage JSON-LD for articles whose visible FAQ already lives in the MDX body.
 * Emits markup only; the reader-facing copy comes from the article itself.
 */
export function FaqSchema({ items }: { items: FaqItem[] }) {
  if (items.length < 2) {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}