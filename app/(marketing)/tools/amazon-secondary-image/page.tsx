import { notFound } from "next/navigation";

import { SpecPage } from "@/components/tools/spec-page";
import { getImageSpec } from "@/lib/image-specs";
import { constructMetadata } from "@/lib/utils";

const spec = getImageSpec("amazon-secondary-image");

export const metadata = spec
  ? constructMetadata({
      title: spec.metaTitle,
      description: spec.metaDescription,
      canonical: `/tools/${spec.slug}`,
    })
  : undefined;

export default function Page() {
  if (!spec) notFound();
  return <SpecPage spec={spec} />;
}
