import type { Block } from "payload";
import { sectionLabel, sectionSettings } from "../fields/sectionFields";
import { blockAdmin } from "./block-admin";

// A YouTube or Vimeo player in the content column — «Відео-презентація
// спеціальності» on the speciality artboard. The editor pastes the address they
// see in the browser; app/content/video.ts turns it into the player URL, so no
// one has to know what an embed link is.
//
// Only those two hosts: an iframe to an arbitrary address is a page of someone
// else's content inside ours, and both players are what the university already
// publishes to.
const VIDEO_HOST = /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i;

export const videoEmbed: Block = {
  slug: "videoEmbed",
  interfaceName: "VideoEmbedBlock",
  labels: {
    singular: { uk: "Відео", en: "Video" },
    plural: { uk: "Відео", en: "Videos" },
  },
  admin: blockAdmin("video-embed"),
  fields: [
    ...sectionLabel(),
    {
      name: "url",
      type: "text",
      required: true,
      label: { uk: "Посилання на відео", en: "Video address" },
      admin: {
        placeholder: { uk: "https://www.youtube.com/watch?v=…", en: "https://www.youtube.com/watch?v=…" },
        description: {
          uk: "Адреса відео на YouTube або Vimeo — та, що в рядку браузера.",
          en: "The YouTube or Vimeo address, as it appears in the browser's address bar.",
        },
      },
      validate: (value: unknown) =>
        typeof value === "string" && VIDEO_HOST.test(value.trim())
          ? true
          : "Потрібне посилання на YouTube або Vimeo.",
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: { uk: "Назва відео", en: "Video title" },
      admin: {
        placeholder: { uk: "Відео-презентація спеціальності", en: "Speciality video presentation" },
        description: {
          uk: "Не показується на сторінці, але її зачитує програма екранного доступу.",
          en: "Not shown on the page, but read out by screen readers.",
        },
      },
    },
    sectionSettings(),
  ],
};
