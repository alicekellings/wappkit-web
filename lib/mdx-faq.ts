import type { FaqItem } from "@/lib/faq";

const FAQ_HEADING = /^##\s+(faq|common questions|frequently asked questions)\s*$/im;
const H2 = /^##\s+\S/m;
const H3 = /^###\s+(.+?)\s*$/gm;

/** Strip MDX/JSX noise so the schema text matches what a reader sees. */
function toPlainText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull Q&A pairs out of the visible FAQ section of an MDX body.
 *
 * Most generated articles carry a "## FAQ" or "## Common questions" block but
 * no FAQPage markup, so they never qualify for the rich result. Parsing the
 * published body keeps the schema and the visible copy identical by design.
 */
export function parseFaqFromBody(body: string): FaqItem[] {
  const heading = FAQ_HEADING.exec(body);
  if (!heading) {
    return [];
  }

  const afterHeading = body.slice(heading.index + heading[0].length);
  const nextSection = H2.exec(afterHeading);
  const section = nextSection ? afterHeading.slice(0, nextSection.index) : afterHeading;

  const heads: RegExpExecArray[] = [];
  const questionRe = new RegExp(H3.source, H3.flags);
  let match: RegExpExecArray | null = questionRe.exec(section);
  while (match !== null) {
    heads.push(match);
    if (match.index === questionRe.lastIndex) {
      questionRe.lastIndex += 1;
    }
    match = questionRe.exec(section);
  }
  const items: FaqItem[] = [];

  heads.forEach((head, index) => {
    const question = head[1].trim();
    const from = (head.index ?? 0) + head[0].length;
    const to = index + 1 < heads.length ? (heads[index + 1].index ?? section.length) : section.length;
    const raw = section.slice(from, to);
    const answer = toPlainText(raw);

    // Only real questions with a usable answer belong in the schema.
    if (!question.endsWith("?") || answer.length < 40) {
      return;
    }
    items.push({ q: question, a: answer });
  });

  return items.slice(0, 8);
}