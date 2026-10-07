import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { socialPlatformOptions } from "../fields/socialPlatforms";
import { blockAdmin } from "./block-admin";

export const contactBlock: Block = {
  slug: "contactBlock",
  interfaceName: "ContactBlock",
  labels: {
    singular: { uk: "Контакти", en: "Contact block" },
    plural: { uk: "Контактні блоки", en: "Contact blocks" },
  },
  admin: blockAdmin("contact-block"),
  fields: [
    ...sectionLabel(),
    {
      name: "address",
      type: "textarea",
      localized: true,
      label: { uk: "Адреса", en: "Address" },
      admin: {
        placeholder: {
          uk: "65029, м. Одеса, вул. Мечникова, 34, каб. 206",
          en: "65029, Odesa, 34 Mechnykova St., room 206",
        },
      },
    },
    {
      name: "email",
      type: "email",
      label: { uk: "Електронна пошта", en: "Email" },
      admin: {
        placeholder: { uk: "iec@onmu.odessa.ua", en: "iec@onmu.odessa.ua" },
      },
    },
    {
      name: "phones",
      type: "array",
      label: { uk: "Телефони", en: "Phone numbers" },
      labels: {
        singular: { uk: "телефон", en: "phone" },
        plural: { uk: "телефони", en: "phones" },
      },
      fields: [
        {
          name: "number",
          type: "text",
          required: true,
          label: { uk: "Номер", en: "Number" },
          admin: {
            placeholder: { uk: "+380 (97) 456 85 03", en: "+380 (97) 456 85 03" },
          },
        },
        {
          name: "label",
          type: "text",
          localized: true,
          label: { uk: "Чий це номер", en: "Whose number" },
          admin: {
            placeholder: { uk: "Напр. «Приймальна комісія»", en: 'e.g. "Admissions Committee"' },
          },
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      label: { uk: "Соцмережі", en: "Social links" },
      // "профіль" rather than "соцмережа": Payload interpolates the singular
      // unchanged, and the feminine noun would need the accusative "соцмережу"
      // to read correctly in "Додати {{label}}". This masculine noun is
      // identical in both cases.
      labels: {
        singular: { uk: "профіль", en: "profile" },
        plural: { uk: "профілі", en: "profiles" },
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          label: { uk: "Мережа", en: "Platform" },
          options: socialPlatformOptions,
        },
        {
          name: "url",
          type: "text",
          required: true,
          label: { uk: "Посилання", en: "Link" },
          admin: {
            placeholder: { uk: "https://facebook.com/onmu", en: "https://facebook.com/onmu" },
          },
        },
      ],
    },
    sectionSettings(),
  ],
};
