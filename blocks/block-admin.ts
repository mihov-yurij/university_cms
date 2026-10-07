import type { Block } from "payload";

// Shared admin wiring for every block in a `layout` field: the custom collapsed
// header (blocks/block-row-label.tsx) and the wireframe shown in the "Додати"
// block picker.
//
// The Label path is resolved through Payload's import map, not the browser —
// run `npx payload generate:importmap` after changing it. The thumbnail path is
// a real URL, served from public/block-previews/.
export function blockAdmin(preview: string): Block["admin"] {
  return {
    components: {
      Label: "/blocks/block-row-label#BlockRowLabel",
    },
    images: {
      thumbnail: `/block-previews/${preview}.svg`,
    },
  };
}
