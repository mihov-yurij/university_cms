import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  ParagraphFeature,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  FixedToolbarFeature,
} from "@payloadcms/richtext-lexical";
import { generateSlugFrom } from "./hooks/generateSlug";
import { entityBlocks } from "../blocks";

// ~23 records, each generating seven routes — the largest single win in the
// project (docs/10-institutes-departments.md:337).
//
// Copied from the main project's `collections/Departments.ts` with four
// reverse-view joins removed, because the collections they point at are not
// carried by this data-collection instance:
//
//   disciplines, publications, programmes, specialities
//
// Everything else — names, slug, institute, order, externalUrl, image, head,
// the `about` and `research` blocks, clubs, labs, contacts and the `staff`
// join — keeps the identical field name, label and shape, so a record
// exported from here imports into the main project unchanged.
//
// Two things are deliberately NOT fields here:
//   колектив — the `staff` join below, from teachers' appointments
//   новини   — a filtered `news` query on `news.department`
//
// `history` from docs/04-content-model.md:172 is dropped. It has no tab in any
// artboard and no screen (docs/10-institutes-departments.md:180, bug #4);
// anything historical belongs in `about` as a labelled richText block, where an
// editor can actually see where it will appear.
export const Departments: CollectionConfig = {
  slug: "departments",
  labels: {
    singular: { uk: "Кафедра", en: "Department" },
    plural: { uk: "Кафедри", en: "Departments" },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "institute", "order", "updatedAt"],
    group: { uk: "Структура", en: "Structure" },
    description: {
      uk: "Кафедри інститутів. Кожен запис дає сім сторінок — про кафедру, колектив, наукова робота, дисципліни, гуртки, лабораторії, новини.",
      en: "Institute departments. Each record produces seven pages — about, staff, research, disciplines, clubs, labs, news.",
    },
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  hooks: {
    beforeValidate: [generateSlugFrom("name")],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
      label: { uk: "Назва", en: "Name" },
      admin: {
        placeholder: { uk: "Кафедра судноводіння", en: "Department of Navigation" },
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      index: true,
      // Deliberately NOT unique: the slug is scoped to its institute, and two
      // institutes may each have a «Кафедра економіки». The address is the
      // institute slug plus this one, and that pair is what must be unique —
      // enforced by the compound index below.
      label: { uk: "Частина адреси", en: "Slug" },
      admin: {
        position: "sidebar",
        description: {
          uk: "Генерується автоматично з назви (укр.). Повна адреса — адреса інституту плюс ця частина.",
          en: "Auto-generated from the Ukrainian name. The full address is the institute's plus this.",
        },
      },
    },
    {
      name: "institute",
      type: "relationship",
      relationTo: "institutes",
      required: true,
      index: true,
      label: { uk: "Інститут", en: "Institute" },
      admin: {
        position: "sidebar",
        description: {
          uk: "Визначає адресу сторінки та в переліку якого інституту кафедра з'явиться.",
          en: "Decides the page address and which institute lists this department.",
        },
      },
    },
    {
      name: "order",
      type: "number",
      label: { uk: "Порядок", en: "Order" },
      admin: {
        position: "sidebar",
        description: {
          uk: "Менше число — вище в переліку кафедр інституту.",
          en: "A smaller number sorts higher in the institute's list.",
        },
      },
    },
    {
      name: "externalUrl",
      type: "text",
      label: { uk: "Зовнішній сайт", en: "External site" },
      admin: {
        position: "sidebar",
        placeholder: { uk: "https://nnimf-kntks.google.site", en: "https://…" },
        description: {
          uk: "Для кафедр, які ведуть власний сайт. Сторінка кафедри лишається як є — угорі вкладки «Про кафедру» додається посилання на цей сайт.",
          en: "For departments that run a site of their own. The department page stays as it is; a link to that site appears at the top of the About tab.",
        },
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: { uk: "Зображення сторінки", en: "Page image" },
      admin: {
        description: {
          uk: "Необов'язково. Сторінки кафедр у макеті — без фонового фото, з темним заголовком на білому.",
          en: "Optional. The department artboards have no background photo — dark title on white.",
        },
      },
    },
    {
      name: "head",
      type: "relationship",
      relationTo: "teachers",
      label: { uk: "Завідувач кафедри", en: "Head of department" },
      admin: {
        description: {
          uk: "Показується окремим блоком із портретом. Людина має бути в довіднику викладачів.",
          en: "Rendered as its own block with a portrait. The person must exist in the teacher directory.",
        },
      },
    },
    {
      name: "about",
      type: "blocks",
      label: { uk: "Про кафедру", en: "About" },
      labels: {
        singular: { uk: "блок", en: "block" },
        plural: { uk: "блоки", en: "blocks" },
      },
      admin: {
        initCollapsed: false,
        description: {
          uk: "Вміст першої вкладки. Заголовок сторінки та смуга вкладок додаються автоматично.",
          en: "The content of the first tab. The page header and the tab strip are added automatically.",
        },
      },
      blocks: entityBlocks,
    },
    {
      name: "research",
      type: "blocks",
      label: { uk: "Наукова та навчально-методична робота", en: "Research and methodical work" },
      labels: {
        singular: { uk: "блок", en: "block" },
        plural: { uk: "блоки", en: "blocks" },
      },
      admin: {
        initCollapsed: true,
        description: {
          uk: "Вступний текст вкладки. Сам перелік публікацій буде окремим розділом — 50 позицій у текстовому полі неможливо ні шукати, ні гортати.",
          en: "The tab's introductory text. The publication list itself becomes its own collection — 50 citations in one rich-text field can be neither searched nor paged.",
        },
      },
      blocks: entityBlocks,
    },
    {
      name: "clubs",
      type: "array",
      label: { uk: "Наукові гуртки", en: "Research clubs" },
      labels: {
        singular: { uk: "гурток", en: "club" },
        plural: { uk: "гуртки", en: "clubs" },
      },
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true, localized: true, label: { uk: "Назва", en: "Name" } },
        { name: "description", type: "textarea", localized: true, label: { uk: "Опис", en: "Description" } },
        {
          name: "supervisor",
          type: "relationship",
          relationTo: "teachers",
          label: { uk: "Керівник", en: "Supervisor" },
        },
      ],
    },
    {
      name: "labs",
      type: "array",
      label: { uk: "Навчально-наукові лабораторії", en: "Laboratories" },
      labels: {
        singular: { uk: "лабораторію", en: "laboratory" },
        plural: { uk: "лабораторії", en: "laboratories" },
      },
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true, localized: true, label: { uk: "Назва", en: "Name" } },
        { name: "description", type: "textarea", localized: true, label: { uk: "Опис", en: "Description" } },
        { name: "image", type: "upload", relationTo: "media", label: { uk: "Фото", en: "Photo" } },
        {
          name: "equipment",
          type: "richText",
          localized: true,
          label: { uk: "Обладнання", en: "Equipment" },
          editor: lexicalEditor({
            features: () => [
              FixedToolbarFeature(),
              ParagraphFeature(),
              HeadingFeature({ enabledHeadingSizes: ["h3"] }),
              BoldFeature(),
              ItalicFeature(),
              LinkFeature(),
              UnorderedListFeature(),
            ],
          }),
        },
      ],
    },
    {
      name: "contacts",
      type: "group",
      label: { uk: "Контакти", en: "Contacts" },
      fields: [
        { name: "address", type: "text", localized: true, label: { uk: "Адреса", en: "Address" } },
        { name: "room", type: "text", localized: true, label: { uk: "Аудиторія", en: "Room" } },
        { name: "phone", type: "text", label: { uk: "Телефон", en: "Phone" } },
        { name: "email", type: "email", label: { uk: "Електронна пошта", en: "Email" } },
      ],
    },
    // Reverse views for the admin. Everything rendered reads these collections
    // by query instead — a join returns its rows unpopulated at every depth, so
    // a discipline's lecturers and files would come back as bare ids
    // (docs/04-content-model.md:247).
    //
    // The joins to `disciplines`, `publications`, `programmes` and
    // `specialities` from the main project are not here: this instance does
    // not carry those collections.
    //
    // See the note on `defaultLimit: 0` in collections/Institutes.ts — a join
    // without it silently stops at ten, which for a 30-person department means
    // twenty missing people and no error anywhere.
    //
    // NOTE: this join returns a teacher once per appointment they hold, not
    // once per appointment matching this unit — someone appointed to both an
    // institute and one of its departments appears twice here. It is kept for
    // the admin's reverse view, where a duplicate row is cosmetic. Everything
    // rendered on the site goes through app/content/staff.ts:findUnitStaff,
    // which queries instead and returns each person once.
    {
      name: "staff",
      type: "join",
      collection: "teachers",
      on: "appointments.unit",
      defaultLimit: 0,
      label: { uk: "Колектив кафедри", en: "Department staff" },
      admin: {
        description: {
          uk: "Збирається автоматично з призначень. Щоб додати людину — відкрийте її картку у «Викладачі».",
          en: "Assembled from appointments. To add someone, open their record under Teachers.",
        },
      },
    },
  ],
  indexes: [
    // The address is institute + slug, so that pair is what has to be unique.
    { fields: ["institute", "slug"], unique: true },
  ],
};
