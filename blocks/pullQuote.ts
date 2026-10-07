import type { Block } from "payload";
import {
  lexicalEditor,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  FixedToolbarFeature,
} from "@payloadcms/richtext-lexical";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

// Full width, rules above and below, centred. `text` is richText (not plain
// text) because a quote can span multiple paragraphs.
export const pullQuote: Block = {
  slug: "pullQuote",
  interfaceName: "PullQuoteBlock",
  labels: {
    singular: { uk: "Цитата", en: "Pull quote" },
    plural: { uk: "Цитати", en: "Pull quotes" },
  },
  admin: blockAdmin("pull-quote"),
  fields: [
    ...sectionLabel(),
    {
      name: "text",
      type: "richText",
      required: true,
      localized: true,
      label: { uk: "Текст цитати", en: "Quote text" },
      admin: {
        description: {
          uk: "Можна кілька абзаців. Форматування — жирний і курсив.",
          en: "Multiple paragraphs allowed. Formatting is bold and italic only.",
        },
      },
      editor: lexicalEditor({
        features: () => [FixedToolbarFeature(), ParagraphFeature(), BoldFeature(), ItalicFeature()],
      }),
    },
    {
      name: "attribution",
      type: "text",
      localized: true,
      label: { uk: "Хто це сказав", en: "Attribution" },
      admin: {
        placeholder: {
          uk: "Напр. «Іван Петренко, ректор»",
          en: 'e.g. "Ivan Petrenko, Rector"',
        },
      },
    },
    sectionSettings(),
  ],
};
