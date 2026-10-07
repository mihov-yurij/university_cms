import type { OptionObject } from "payload";

// Shared between `contactBlock` (per-page contact info) and, later, the
// footer global (site-wide social links). One list of icons to keep in sync.
export const socialPlatformOptions: OptionObject[] = [
  { label: { uk: "Facebook", en: "Facebook" }, value: "facebook" },
  { label: { uk: "Instagram", en: "Instagram" }, value: "instagram" },
  { label: { uk: "YouTube", en: "YouTube" }, value: "youtube" },
  { label: { uk: "Telegram", en: "Telegram" }, value: "telegram" },
  { label: { uk: "WhatsApp", en: "WhatsApp" }, value: "whatsapp" },
  { label: { uk: "LinkedIn", en: "LinkedIn" }, value: "linkedin" },
  { label: { uk: "X (Twitter)", en: "X (Twitter)" }, value: "x" },
];
