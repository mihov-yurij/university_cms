import type { Field } from "payload";

// Collections a link can point at. The main project lists pages, news,
// institutes, specialities and documents; only `institutes` exists in this
// data-collection instance, so the reference field carries that one target.
// The group's field names and shape are otherwise untouched, which is what
// keeps a pill-links block exported from here importable over there.
export const LINKABLE_COLLECTIONS = ["institutes"] as const;

type LinkCondition = NonNullable<NonNullable<Field["admin"]>["condition"]>;

type LinkFieldOptions = {
  /** Field name. Defaults to "link". */
  name?: string;
  label?: Record<string, string>;
  /** Adds a localized label the editor can use to override the target's own title. */
  withLabel?: boolean;
  /** Shows the whole group only when this returns true. */
  condition?: LinkCondition;
};

// One link group, shared by the navigation menu and by blocks. An editor picks
// a page from a list or types an external address; nothing else to learn.
//
// Inner fields are deliberately NOT `required`: a half-filled link resolves to
// null and simply renders nothing, which is friendlier than a validation error
// blocking an unrelated save. See resolveLink() in app/content/links.ts.
export function linkField(opts: LinkFieldOptions = {}): Field {
  const { name = "link", label, withLabel = false, condition } = opts;

  const labelFields: Field[] = withLabel
    ? [
        {
          name: "label",
          type: "text",
          localized: true,
          label: { uk: "Текст посилання", en: "Link text" },
          admin: {
            description: {
              uk: "Необов'язково. За відсутності використовується назва сторінки.",
              en: "Optional. Falls back to the target page's own title.",
            },
          },
        },
      ]
    : [];

  return {
    name,
    type: "group",
    label: label ?? { uk: "Посилання", en: "Link" },
    admin: condition ? { condition } : {},
    fields: [
      ...labelFields,
      {
        name: "type",
        type: "radio",
        defaultValue: "reference",
        label: { uk: "Куди веде", en: "Points to" },
        options: [
          { label: { uk: "Сторінка або документ", en: "A page or document on this site" }, value: "reference" },
          { label: { uk: "Зовнішня адреса", en: "An external address" }, value: "custom" },
        ],
      },
      {
        name: "reference",
        type: "relationship",
        relationTo: [...LINKABLE_COLLECTIONS],
        label: { uk: "Сторінка або документ", en: "Page or document" },
        admin: {
          condition: (_, siblingData) => siblingData?.type !== "custom",
          description: {
            uk: "Оберіть тип, потім почніть вводити назву. Документ відкриється як файл.",
            en: "Pick the type, then start typing a title. A document opens as a file.",
          },
        },
      },
      {
        name: "url",
        type: "text",
        label: { uk: "Адреса", en: "URL" },
        admin: {
          condition: (_, siblingData) => siblingData?.type === "custom",
          placeholder: { uk: "https://onmu-moodle.od.ua", en: "https://onmu-moodle.od.ua" },
        },
      },
      {
        name: "anchor",
        type: "text",
        label: { uk: "Якір на сторінці", en: "Anchor" },
        admin: {
          // Meaningless on a document: the href is the file itself.
          condition: (_, siblingData) =>
            siblingData?.type !== "custom" && siblingData?.reference?.relationTo !== "documents",
          placeholder: { uk: "terminy-pryyomu", en: "application-deadlines" },
          description: {
            uk: "Необов'язково. Прокрутить сторінку до секції з таким id.",
            en: "Optional. Scrolls the page to the section with this id.",
          },
        },
      },
      {
        name: "newTab",
        type: "checkbox",
        defaultValue: false,
        label: { uk: "Відкривати в новій вкладці", en: "Open in a new tab" },
      },
    ],
  };
}
