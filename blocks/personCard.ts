import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

// One person, portrait beside name and degree — «Завідувач кафедри»
// (docs/10-institutes-departments.md:75). Distinct from `staffList` with a
// single entry: this is a wide landscape card, not a column in a grid.
export const personCard: Block = {
  slug: "personCard",
  interfaceName: "PersonCardBlock",
  labels: {
    singular: { uk: "Картка людини", en: "Person card" },
    plural: { uk: "Картки людей", en: "Person cards" },
  },
  admin: blockAdmin("person-card"),
  fields: [
    ...sectionLabel(),
    {
      name: "teacher",
      type: "relationship",
      relationTo: "teachers",
      required: true,
      label: { uk: "Людина", en: "Person" },
      admin: {
        description: {
          uk: "З довідника викладачів. Фото, ступінь і посада беруться звідти — тут нічого дублювати не треба.",
          en: "From the teacher directory. Photo, degree and position come from there — nothing is duplicated here.",
        },
      },
    },
    sectionSettings(),
  ],
};
