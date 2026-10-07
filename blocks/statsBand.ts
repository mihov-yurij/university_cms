import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

// Large numerals with a caption under each. Its first consumer is the row of
// speciality codes on the department page (docs/10-institutes-departments.md:69).
//
// It has to work both full-bleed on the homepage and inside the 792-wide
// content column, so the renderer sizes from its container and never assumes
// the page width.
//
// `source` was missing until phase 3, and its absence was silent: a seed script
// passing `source: 'specialities'` had the key dropped on save with no error
// anywhere, because Payload discards fields a block does not declare. The
// department band derives its codes from the unit's `specialities` join now,
// which is also what stops it going stale the way the artboard's 122/124/125
// already has (docs/11-specialities.md:79).
export const statsBand: Block = {
  slug: "statsBand",
  interfaceName: "StatsBandBlock",
  labels: {
    singular: { uk: "Числа", en: "Stats band" },
    plural: { uk: "Числа", en: "Stats bands" },
  },
  admin: blockAdmin("stats-band"),
  fields: [
    ...sectionLabel(),
    {
      name: "source",
      type: "radio",
      defaultValue: "manual",
      label: { uk: "Що показати", en: "What to show" },
      admin: {
        description: {
          uk: "«Спеціальності цього підрозділу» бере коди й назви зі спеціальностей, закріплених за цим інститутом або кафедрою. Працює лише на їхніх сторінках.",
          en: '"This unit\'s specialities" reads the codes and names of every speciality pointing at this institute or department. Only meaningful on their pages.',
        },
      },
      options: [
        { label: { uk: "Введені вручну", en: "Typed by hand" }, value: "manual" },
        {
          label: { uk: "Спеціальності цього підрозділу", en: "This unit's specialities" },
          value: "specialities",
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      // No `minRows`: an admin.condition only hides a field, it does not stop
      // it being validated, so a required row would block every save made with
      // the derived source selected.
      label: { uk: "Показники", en: "Stats" },
      labels: {
        singular: { uk: "показник", en: "stat" },
        plural: { uk: "показники", en: "stats" },
      },
      admin: {
        condition: (_, siblingData) => siblingData?.source !== "specialities",
        initCollapsed: false,
      },
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          localized: true,
          label: { uk: "Число", en: "Value" },
          admin: {
            placeholder: { uk: "J5", en: "J5" },
            description: {
              uk: "Текст, а не число — сюди йдуть і коди на кшталт «J5.01», і значення на кшталт «понад 80».",
              en: 'Text rather than a number — it holds codes like "J5.01" as well as values like "80+".',
            },
          },
        },
        {
          name: "caption",
          type: "text",
          localized: true,
          label: { uk: "Підпис", en: "Caption" },
          admin: { placeholder: { uk: "Морський та внутрішній водний транспорт", en: "Maritime transport" } },
        },
      ],
    },
    sectionSettings(),
  ],
};
