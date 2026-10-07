import type { CollectionConfig } from "payload";
import { generateSlugFrom } from "./hooks/generateSlug";
import { entityBlocks } from "../blocks";

// Six records: nniitip, miti, nni-mf, nn-imb, nnmgi, f-intern-stud.
//
// Copied from the main project's `collections/Institutes.ts` with three
// fields removed, because the collections they point at are not carried by
// this data-collection instance:
//
//   regulations, ratingLists  → relationship to `documents`
//   specialities              → join to `specialities`
//
// Everything else — names, slugs, order, images, `about` blocks, contacts,
// the `departments` and `staff` joins — keeps the identical field name, label
// and shape, so a record exported from here imports into the main project
// unchanged.
//
// The director's address is an ordinary «Цитата» block in `about` (admin's
// call, 2026-09-19): the editor chooses where it sits and who it is
// attributed to.
export const Institutes: CollectionConfig = {
  slug: "institutes",
  labels: {
    singular: { uk: "Інститут", en: "Institute" },
    plural: { uk: "Інститути", en: "Institutes" },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "shortName", "order", "updatedAt"],
    group: { uk: "Структура", en: "Structure" },
    description: {
      uk: "Навчально-наукові інститути та факультет. Кожен запис — окрема сторінка; перелік кафедр на ній збирається автоматично.",
      en: "Institutes and the faculty. Each record is its own page; its list of departments is assembled automatically.",
    },
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  hooks: {
    // `name`, not `title` — passing the wrong source field produces no slug
    // and a required-field error that names `slug`, pointing nowhere useful.
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
        placeholder: {
          uk: "Навчально-науковий інститут морського флоту",
          en: "Educational and Research Institute of the Maritime Fleet",
        },
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: { uk: "URL-адреса", en: "Slug" },
      admin: {
        position: "sidebar",
        description: {
          uk: "Генерується автоматично з назви (укр.). Змінювати після публікації не варто — зміна ламає наявні посилання.",
          en: "Auto-generated from the Ukrainian name. Avoid changing it after publishing — it breaks existing links.",
        },
      },
    },
    {
      name: "shortName",
      type: "text",
      localized: true,
      label: { uk: "Скорочена назва", en: "Short name" },
      admin: {
        position: "sidebar",
        placeholder: { uk: "ННІМФ", en: "NNIMF" },
        description: {
          uk: "Необов'язково. Меню та фільтри показують повну назву; поле лишається для вузьких місць і службових переліків.",
          en: "Optional. The menu and the filters show the full name; this is kept for narrow placements and admin lists.",
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
          uk: "Менше число — вище в меню та на головній сторінці.",
          en: "A smaller number sorts higher in the menu and on the homepage.",
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
          uk: "Фон угорі сторінки інституту. Текст виводиться поверх затемненого фото.",
          en: "The background at the top of the institute page. Text sits over a darkened photo.",
        },
      },
    },
    {
      name: "homepageImage",
      type: "upload",
      relationTo: "media",
      label: { uk: "Зображення для головної", en: "Homepage image" },
      admin: {
        description: {
          uk: "Необов'язково. Смуга на всю ширину на головній сторінці. За відсутності використовується зображення сторінки.",
          en: "Optional. The full-width band on the homepage. Falls back to the page image.",
        },
      },
    },
    {
      name: "about",
      type: "blocks",
      label: { uk: "Вміст сторінки", en: "Page content" },
      labels: {
        singular: { uk: "блок", en: "block" },
        plural: { uk: "блоки", en: "blocks" },
      },
      admin: {
        initCollapsed: false,
        description: {
          uk: "Основний вміст сторінки: «Про інститут», спеціальності, звернення директора (блок «Цитата»), дирекція. Заголовок сторінки та перелік кафедр додаються автоматично — їх тут немає.",
          en: "The body of the page: About, specialities, the director's address (a pull-quote block), the directorate. The page header and the department list are added automatically and are not here.",
        },
      },
      blocks: entityBlocks,
    },
    {
      name: "contacts",
      type: "group",
      label: { uk: "Контакти інституту", en: "Institute contacts" },
      fields: [
        { name: "address", type: "text", localized: true, label: { uk: "Адреса", en: "Address" } },
        { name: "room", type: "text", localized: true, label: { uk: "Аудиторія", en: "Room" } },
        { name: "phone", type: "text", label: { uk: "Телефон", en: "Phone" } },
        { name: "email", type: "email", label: { uk: "Електронна пошта", en: "Email" } },
      ],
    },
    // Reverse views. Every one of these is a `join`, never a second
    // relationship field — two stored records of the same fact are free to
    // disagree, a join cannot (docs/11-specialities.md:165).
    //
    // `defaultLimit: 0` is not optional. traverseFields.js:307 reads
    // `limit: field.defaultLimit ?? 10`, so a join silently returns ten rows
    // and no error anywhere says so; `:309` treats 0 as unlimited.
    //
    {
      name: "departments",
      type: "join",
      collection: "departments",
      on: "institute",
      defaultLimit: 0,
      defaultSort: "order",
      label: { uk: "Кафедри", en: "Departments" },
      admin: {
        description: {
          uk: "Усі кафедри цього інституту. Перелік у шапці сторінки будується звідси — додали кафедру, і вона з'явилася в меню.",
          en: "Every department of this institute. The list in the page header is built from it — add a department and it appears in the menu.",
        },
      },
    },
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
      label: { uk: "Дирекція", en: "Directorate" },
      admin: {
        description: {
          uk: "Збирається автоматично: усі, у кого є призначення в цьому інституті. Щоб додати людину — відкрийте її картку у «Викладачі» й додайте призначення.",
          en: "Assembled automatically from everyone with an appointment at this institute. To add someone, open their record under Teachers and add an appointment.",
        },
      },
    },
  ],
};
