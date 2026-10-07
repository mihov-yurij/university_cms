"use client";

import { useRowLabel } from "@payloadcms/ui";

// Renders the collapsed header of a block in `layout` as
// "Заголовок сторінки — Про університет" instead of "Untitled", so a page of
// six blocks reads as an outline without expanding every one.

const BLOCK_NAMES: Record<string, string> = {
  pageHero: "Заголовок сторінки",
  richText: "Текст",
  pullQuote: "Цитата",
  staffList: "Співробітники",
  documentList: "Документи",
  contactBlock: "Контакти",
};

const PREVIEW_MAX = 60;

type LexicalNode = { text?: unknown; children?: unknown };

// Pulls the plain text out of a Lexical editor value so a rich text block can
// preview its own first words.
function lexicalToText(value: unknown): string {
  const root = (value as { root?: unknown } | null)?.root;
  if (!root) return "";

  const collected: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const { text, children } = node as LexicalNode;
    if (typeof text === "string") collected.push(text);
    if (Array.isArray(children)) children.forEach(walk);
  };

  walk(root);
  return collected.join(" ").replace(/\s+/g, " ").trim();
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// The most useful thing to show per block type: whatever the editor actually
// typed into it. Falls back to the section label, then to nothing.
function previewFor(data: Record<string, unknown>): string {
  switch (data.blockType) {
    case "pageHero":
      return asText(data.title) || asText(data.subtitle);
    case "richText":
      return lexicalToText(data.content);
    case "pullQuote":
      return lexicalToText(data.text) || asText(data.attribution);
    case "contactBlock":
      return asText(data.address) || asText(data.email);
    default:
      return "";
  }
}

function truncate(value: string): string {
  return value.length > PREVIEW_MAX ? `${value.slice(0, PREVIEW_MAX).trimEnd()}…` : value;
}

export function BlockRowLabel() {
  const { data } = useRowLabel<Record<string, unknown>>();

  const blockName = BLOCK_NAMES[String(data?.blockType)] ?? "";
  const preview = data ? truncate(previewFor(data) || asText(data.label)) : "";

  if (!blockName) return null;

  return (
    <span>
      {blockName}
      {preview ? <span style={{ opacity: 0.6 }}>{` — ${preview}`}</span> : null}
    </span>
  );
}
