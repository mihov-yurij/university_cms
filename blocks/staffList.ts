import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

// `source` still ships with only the 'manual' option. The contextual sources —
// "everyone appointed to this institute", "everyone appointed to this
// department" — need the block to know which record's page it is on, which is
// only true once it is used inside `institutes.about` / `departments.about`.
// Offering a radio that cannot yet resolve is worse than one that grows later;
// adding an option to a select is a one-line change.
//
// Both contextual sources resolve through the unit's own `staff` join, which
// the route fetches once and hands to the mapper — no block runs its own query.
export const staffList: Block = {
  slug: "staffList",
  interfaceName: "StaffListBlock",
  labels: {
    singular: { uk: "Співробітники", en: "Staff list" },
    plural: { uk: "Списки співробітників", en: "Staff lists" },
  },
  admin: blockAdmin("staff-list"),
  fields: [
    ...sectionLabel(),
    {
      name: "source",
      type: "radio",
      defaultValue: "manual",
      label: { uk: "Кого показати", en: "Who to show" },
      admin: {
        description: {
          uk: "«Усі з цього інституту» та «Усі з цієї кафедри» збирають список автоматично з призначень — додали людині призначення, і вона з'явилася тут.",
          en: "The two contextual options build the list from appointments — add one to a person and they appear here.",
        },
      },
      options: [
        { label: { uk: "Обрані вручну", en: "Picked by hand" }, value: "manual" },
        { label: { uk: "Усі з цього інституту", en: "Everyone at this institute" }, value: "institute" },
        { label: { uk: "Усі з цієї кафедри", en: "Everyone in this department" }, value: "department" },
      ],
    },
    {
      name: "people",
      type: "relationship",
      relationTo: "teachers",
      hasMany: true,
      label: { uk: "Люди", en: "People" },
      admin: {
        condition: (_, siblingData) => siblingData?.source === "manual",
        description: {
          uk: "Оберіть із довідника викладачів. Порядок карток — той, у якому ви їх додали; перетягніть, щоб змінити. Посада береться з призначення людини, тому на різних сторінках вона може відрізнятися.",
          en: "Pick from the teacher directory. Cards show in the order added — drag to reorder. The position comes from the person's appointment, so it can differ between pages.",
        },
      },
    },
    {
      name: "variant",
      type: "select",
      required: true,
      defaultValue: "grid",
      label: { uk: "Як показати", en: "Layout" },
      admin: {
        description: {
          uk: "«Сітка» — рівні картки в чотири колонки. «Карусель» — прокрутка вбік. «Рядки» — один під одним. «Компактний» — лише імена й посади.",
          en: '"Grid" — four even columns. "Carousel" — scrolls sideways. "Rows" — one under another. "Compact" — names and positions only.',
        },
      },
      options: [
        { label: { uk: "Сітка", en: "Grid" }, value: "grid" },
        { label: { uk: "Карусель", en: "Carousel" }, value: "carousel" },
        { label: { uk: "Рядки", en: "Rows" }, value: "rows" },
        { label: { uk: "Компактний", en: "Compact" }, value: "compact" },
      ],
    },
    {
      name: "initialVisible",
      type: "number",
      label: { uk: "Показати спочатку", en: "Show at first" },
      admin: {
        placeholder: { uk: "Усіх", en: "All of them" },
        description: {
          uk: "Скільки карток видно до натискання «Побачити більше». Порожньо — показати всіх одразу.",
          en: 'How many cards show before "See more". Empty shows everyone at once.',
        },
      },
    },
    sectionSettings(),
  ],
};
