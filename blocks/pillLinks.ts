import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { linkField } from "../fields/link";
import { blockAdmin } from "./block-admin";

// A row of outlined, wrapping pills. Its first consumer is «Спеціальності» on
// the institute page (docs/10-institutes-departments.md:48).
//
// `source: 'specialities'` derives the pills from the `specialities` join on
// the institute or department whose page the block sits on — the same
// arrangement `staffList` uses for its contextual sources. The route fetches
// that list once and hands it to the mapper; no block runs its own query.
//
// On a `pages` document there is no unit to derive from, so the option resolves
// to nothing and the section renders empty. That is why the hand-picked option
// stays the default.
export const pillLinks: Block = {
  slug: "pillLinks",
  interfaceName: "PillLinksBlock",
  labels: {
    singular: { uk: "Плитки-посилання", en: "Pill links" },
    plural: { uk: "Плитки-посилання", en: "Pill links" },
  },
  admin: blockAdmin("pill-links"),
  fields: [
    ...sectionLabel(),
    {
      name: "source",
      type: "radio",
      defaultValue: "manual",
      label: { uk: "Що показати", en: "What to show" },
      admin: {
        description: {
          uk: "«Спеціальності цього підрозділу» збирає плитки автоматично: додали спеціальність із цим інститутом або кафедрою — вона тут з'явилася. Працює лише на сторінках інститутів і кафедр.",
          en: '"This unit\'s specialities" builds the pills automatically from every speciality pointing at this institute or department. Only meaningful on an institute or department page.',
        },
      },
      options: [
        { label: { uk: "Обрані вручну", en: "Picked by hand" }, value: "manual" },
        {
          label: { uk: "Спеціальності цього підрозділу", en: "This unit's specialities" },
          value: "specialities",
        },
      ],
    },
    {
      name: "items",
      type: "array",
      label: { uk: "Посилання", en: "Links" },
      // Lowercase singular: Payload interpolates it into "Додати {{label}}".
      labels: {
        singular: { uk: "посилання", en: "link" },
        plural: { uk: "посилання", en: "links" },
      },
      admin: {
        condition: (_, siblingData) => siblingData?.source === "manual",
        initCollapsed: false,
        description: {
          uk: "Кожен рядок — окрема плитка. Порядок змінюється перетягуванням.",
          en: "One pill per row. Drag to reorder.",
        },
      },
      fields: [linkField({ withLabel: true })],
    },
    sectionSettings(),
  ],
};
