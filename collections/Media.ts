import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { uk: "Медіафайл", en: "Media file" },
    plural: { uk: "Медіатека", en: "Media" },
  },
  admin: {
    group: { uk: "Медіа", en: "Media" },
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(dirname, "../media"),
    // Adding a size here does NOT regenerate existing uploads — only files
    // uploaded afterwards get the new variant. Add sizes before the content
    // they are for arrives, or plan to re-upload.
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 800 },
      { name: "hero", width: 1600 },
      // Staff cards are 3:4 on every screen that has one — institute Дирекція,
      // department Колектив (docs/10-institutes-departments.md:407). Cropping
      // here rather than in CSS means the browser never downloads the parts of
      // a portrait it is going to throw away.
      { name: "portrait", width: 600, height: 800, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      label: { uk: "Альтернативний текст", en: "Alt text" },
      admin: {
        description: {
          uk: "Опис зображення для людей, які не бачать картинку, і для пошукових систем.",
          en: "Describes the image for people who can't see it, and for search engines.",
        },
      },
    },
  ],
};
