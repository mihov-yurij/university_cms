import type { Block } from "payload";
import {
  lexicalEditor,
  ParagraphFeature,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  FixedToolbarFeature,
} from "@payloadcms/richtext-lexical";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

export const richText: Block = {
  slug: "richText",
  interfaceName: "RichTextBlock",
  labels: {
    singular: { uk: "Текст", en: "Rich text" },
    plural: { uk: "Текстові блоки", en: "Rich text blocks" },
  },
  admin: blockAdmin("rich-text"),
  fields: [
    ...sectionLabel(),
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
      label: { uk: "Текст", en: "Content" },
      admin: {
        description: {
          uk: "Кнопки форматування — на панелі над текстом.",
          en: "Formatting buttons are on the toolbar above the text.",
        },
      },
      editor: lexicalEditor({
        features: () => [
          // Always-visible toolbar. Without it the only way to reach bold, links
          // or headings is the "/" menu, which an editor has no way to discover.
          FixedToolbarFeature(),
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
    },
    sectionSettings(),
  ],
};
