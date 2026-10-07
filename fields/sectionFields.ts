import type { Field } from "payload";

// Every block in a `layout` field is built as:
//
//   ...sectionLabel(), <the block's own content fields>, sectionSettings()
//
// The label comes first because it *is* content — it renders as the section
// heading. Everything that only configures behaviour goes into the collapsed
// settings panel at the bottom, so an editor opening a block sees the fields
// they came to fill, not switches they rarely touch.
//
// Field *names* are unchanged from the flat version, so the stored data shape
// and the generated types stay identical — this is presentation only.

export function sectionLabel(): Field[] {
  return [
    {
      name: "label",
      type: "text",
      localized: true,
      label: { uk: "Заголовок секції", en: "Section heading" },
      admin: {
        placeholder: {
          uk: "Напр. «Про інститут»",
          en: 'e.g. "About the institute"',
        },
        description: {
          uk: "Показується ліворуч від вмісту. Залиште порожнім — і секція займе всю ширину сторінки.",
          en: "Shown to the left of the content. Leave empty and the section spans the full page width.",
        },
      },
    },
  ];
}

export function sectionSettings(): Field {
  return {
    type: "collapsible",
    label: { uk: "Налаштування секції", en: "Section settings" },
    admin: {
      initCollapsed: true,
      description: {
        uk: "Необов'язкові налаштування. Можна не відкривати.",
        en: "Optional settings. Safe to leave closed.",
      },
    },
    fields: [
      {
        // The label rule is binary — a label means two columns, no label means
        // full width — and the department screens need a third state: a block
        // that continues the column of the labelled section above it, with no
        // heading of its own (docs/10-institutes-departments.md:85).
        //
        // `auto` is exactly today's behaviour, so nothing already authored
        // changes. One field on every block beats a wrapper block, and keeps
        // the admin a flat list.
        name: "width",
        type: "radio",
        defaultValue: "auto",
        label: { uk: "Ширина секції", en: "Section width" },
        options: [
          { label: { uk: "Автоматично", en: "Automatic" }, value: "auto" },
          {
            label: { uk: "У колонці тексту (продовження секції вище)", en: "In the text column" },
            value: "content",
          },
          { label: { uk: "На всю ширину", en: "Full width" }, value: "full" },
        ],
        admin: {
          description: {
            uk: "«Автоматично» — із заголовком у дві колонки, без заголовка на всю ширину. «У колонці тексту» — коли блок продовжує секцію вище й свого заголовка не має.",
            en: 'Automatic: two columns with a heading, full width without one. "In the text column": when the block continues the section above and has no heading of its own.',
          },
        },
      },
      {
        name: "collapsible",
        type: "checkbox",
        defaultValue: false,
        label: { uk: "Дозволити згортати секцію", en: "Let visitors collapse this section" },
        admin: {
          description: {
            uk: "Відвідувач сайту зможе згорнути й розгорнути цю секцію, натиснувши на заголовок.",
            en: "Visitors can collapse and expand this section by clicking its heading.",
          },
        },
      },
      {
        name: "collapsedByDefault",
        type: "checkbox",
        defaultValue: false,
        label: { uk: "Показувати згорнутою", en: "Start collapsed" },
        admin: {
          condition: (_, siblingData) => Boolean(siblingData?.collapsible),
          description: {
            uk: "Секція буде згорнута, доки відвідувач не натисне на заголовок.",
            en: "The section stays collapsed until a visitor clicks its heading.",
          },
        },
      },
    ],
  };
}
