import type { Block } from "payload";
import { richText } from "./richText";
import { pullQuote } from "./pullQuote";
import { videoEmbed } from "./videoEmbed";
import { pillLinks } from "./pillLinks";
import { statsBand } from "./statsBand";
import { personCard } from "./personCard";
import { staffList } from "./staffList";
import { contactBlock } from "./contactBlock";

// The block library, in the order an editor sees it in the «Додати блок»
// picker — the main project's `contentBlocks` minus `documentList`, which
// needs the `documents` collection this instance does not carry.

/** Blocks that build the body of a section. */
export const contentBlocks: Block[] = [
  richText,
  pullQuote,
  videoEmbed,
  pillLinks,
  statsBand,
  personCard,
  staffList,
  contactBlock,
];

/**
 * For entity collections — institutes, departments — whose hero is derived, not
 * authored. `pageHero` is absent here for the same reason it is absent in the
 * main project's entity blocks: the route composes it in code.
 */
export const entityBlocks: Block[] = contentBlocks;
