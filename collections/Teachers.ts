import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  FixedToolbarFeature,
} from "@payloadcms/richtext-lexical";
import { generateSlugFrom } from "./hooks/generateSlug";

// The people directory behind every staff card on the site: an institute's
// Дирекція, a department's Колектив and Завідувач, a programme's Гарант ОП.
//
// The shape that matters here is `appointments`, not a flat `department`
// relationship. Confirmed with the admin (docs/04-content-model.md:229): a
// person moves between departments, works in several at once, and may also hold
// an administrative role at an institute — all three simultaneously. So:
//
//   move                = change `unit` on one row
//   dual appointment    = a second row, with its own position
//   institute admin     = a row whose `unit` is an institute; any institute
//                         appointment is administrative by definition, so there
//                         is no extra flag to forget to tick
//
// Employment history is deliberately not modelled. Payload's document versions
// already record every appointment change, and a "former staff" view is not
// something any screen asks for.
export const Teachers: CollectionConfig = {
  slug: "teachers",
  labels: {
    singular: { uk: "Викладач", en: "Teacher" },
    plural: { uk: "Викладачі", en: "Teachers" },
  },
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "degree", "updatedAt"],
    group: { uk: "Структура", en: "Structure" },
    description: {
      uk: "Довідник співробітників. Картки на сторінках інститутів і кафедр збираються звідси — людину додають один раз, а потім призначають на кафедри.",
      en: "The staff directory. Cards on institute and department pages are built from it — add a person once, then appoint them to units.",
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "fullName",
      type: "text",
      required: true,
      localized: true,
      label: { uk: "Прізвище, ім'я, по батькові", en: "Full name" },
      admin: {
        placeholder: { uk: "Петренко Іван Васильович", en: "Petrenko Ivan Vasylovych" },
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
          uk: "Генерується автоматично з ПІБ (укр.). Поки не використовується — сторінок викладачів ще немає.",
          en: "Auto-generated from the Ukrainian name. Unused for now — there are no teacher pages yet.",
        },
      },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: { uk: "Фотографія", en: "Photo" },
      admin: {
        description: {
          uk: "Портрет. Обрізається до співвідношення 3:4 — краще завантажувати вертикальне фото.",
          en: "A portrait. Cropped to 3:4, so a vertical photo works best.",
        },
      },
    },
    {
      name: "degree",
      type: "text",
      localized: true,
      label: { uk: "Науковий ступінь, звання", en: "Degree and title" },
      admin: {
        placeholder: {
          uk: "кандидат технічних наук, доцент",
          en: "Candidate of Technical Sciences, Associate Professor",
        },
        description: {
          uk: "Належить людині, а не посаді, — тому показується на всіх картках однаково.",
          en: "Belongs to the person rather than to a post, so it shows the same on every card.",
        },
      },
    },
    {
      name: "email",
      type: "email",
      label: { uk: "Електронна пошта", en: "Email" },
    },
    {
      name: "appointments",
      type: "array",
      required: true,
      minRows: 1,
      label: { uk: "Призначення", en: "Appointments" },
      // Lowercase singular: Payload interpolates it into "Додати {{label}}".
      labels: {
        singular: { uk: "призначення", en: "appointment" },
        plural: { uk: "призначення", en: "appointments" },
      },
      admin: {
        initCollapsed: false,
        description: {
          uk: "Де людина працює. Кілька кафедр — кілька рядків, у кожного своя посада. Перехід на іншу кафедру — зміна підрозділу в наявному рядку, не новий запис.",
          en: "Where the person works. Several units means several rows, each with its own position. A move is a change of unit on an existing row, not a new record.",
        },
      },
      fields: [
        {
          name: "unit",
          type: "relationship",
          relationTo: ["institutes", "departments"],
          required: true,
          index: true,
          label: { uk: "Підрозділ", en: "Unit" },
          admin: {
            description: {
              uk: "Кафедра або інститут. Призначення в інституті вважається адміністративним.",
              en: "A department or an institute. An institute appointment is administrative by definition.",
            },
          },
        },
        {
          name: "position",
          type: "text",
          localized: true,
          label: { uk: "Посада", en: "Position" },
          admin: {
            placeholder: { uk: "завідувач кафедри", en: "Head of department" },
            description: {
              uk: "Показується лише на сторінці цього підрозділу. У різних підрозділах посади різні.",
              en: "Shown only on this unit's page. Positions differ between units.",
            },
          },
        },
        {
          name: "isPrimary",
          type: "checkbox",
          defaultValue: false,
          label: { uk: "Основне місце роботи", en: "Primary appointment" },
        },
        {
          name: "order",
          type: "number",
          label: { uk: "Порядок у списку", en: "Order in the list" },
          admin: {
            description: {
              uk: "Менше число — вище в списку підрозділу. Порожньо — за алфавітом.",
              en: "A smaller number sorts higher within the unit. Empty sorts alphabetically.",
            },
          },
        },
      ],
    },
    {
      name: "bio",
      type: "richText",
      localized: true,
      label: { uk: "Біографія", en: "Biography" },
      admin: {
        description: {
          uk: "Необов'язково. Сторінок викладачів поки немає — це поле готує вміст на майбутнє.",
          en: "Optional. There are no teacher pages yet; this prepares the content for when there are.",
        },
      },
      editor: lexicalEditor({
        features: () => [
          FixedToolbarFeature(),
          ParagraphFeature(),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature(),
          UnorderedListFeature(),
        ],
      }),
    },
  ],
  hooks: {
    beforeValidate: [generateSlugFrom("fullName")],
  },
};
