import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: { uk: "Користувач", en: "User" },
    plural: { uk: "Користувачі", en: "Users" },
  },
  admin: {
    useAsTitle: "email",
    group: { uk: "Система", en: "System" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { uk: "Ім'я", en: "Name" },
    },
  ],
};
