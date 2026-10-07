import type { CollectionBeforeValidateHook } from "payload";

// Cabinet of Ministers of Ukraine Resolution No. 55 (27.01.2010), "Про впорядкування
// транслітерації українського алфавіту латиницею". Letters not in this map are
// transliterated the same regardless of position; the five below are not.
const SIMPLE_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
};

// КМУ 55 gives these letters a different Latin form at the start of a word
// (Ye/Yi/Y/Yu/Ya) than in the middle of one (ie/i/i/iu/ia). Slugs are lowercase,
// so only the letter form changes, not the capitalization.
const POSITIONAL_MAP: Record<string, { initial: string; medial: string }> = {
  є: { initial: "ye", medial: "ie" },
  ї: { initial: "yi", medial: "i" },
  й: { initial: "y", medial: "i" },
  ю: { initial: "yu", medial: "iu" },
  я: { initial: "ya", medial: "ia" },
};

// Soft sign and apostrophe (Ukrainian text uses several apostrophe-like unicode
// characters) are dropped without splitting the word they appear in.
const DROPPED = new Set(["ь", "'", "’", "ʼ", "`"]);

const WORD_CHAR = /[a-zа-щьюяїєґ0-9]/i;

function isWordChar(char: string | undefined): boolean {
  return !!char && WORD_CHAR.test(char);
}

export function romanizeUkrainian(input: string): string {
  const source = input.toLowerCase();
  let result = "";

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    // "зг" is reproduced as "zgh", not з+г = "zh", so it isn't read as ж.
    if (char === "з" && source[i + 1] === "г") {
      result += "zgh";
      i++;
      continue;
    }

    if (DROPPED.has(char)) continue;

    const positional = POSITIONAL_MAP[char];
    if (positional) {
      const atWordStart = !isWordChar(source[i - 1]);
      result += atWordStart ? positional.initial : positional.medial;
      continue;
    }

    const simple = SIMPLE_MAP[char];
    if (simple) {
      result += simple;
      continue;
    }

    result += /[a-z0-9]/.test(char) ? char : "-";
  }

  return result.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// Slug is shared across locales (not localized), so it's only derived from the
// uk title — editing the en fields later must not silently change it.
//
// `sourceField` is the field the slug is built from. Most collections call it
// `title`, which is the default; `teachers` calls it `fullName`. Passing the
// name in beats reaching for a hard-coded `data.title`, which fails silently —
// no slug is generated, the required-field error names `slug`, and nothing
// points at the actual cause.
export function generateSlugFrom(sourceField = "title"): CollectionBeforeValidateHook {
  return ({ data, req, originalDoc }) => {
    if (!data || data.slug) return data;
    if (req.locale && req.locale !== "uk" && req.locale !== "all") return data;

    const source = data[sourceField] ?? originalDoc?.[sourceField];
    if (typeof source !== "string" || !source) return data;

    return { ...data, slug: romanizeUkrainian(source) };
  };
}

/** The common case: a collection whose title field is called `title`. */
export const generateSlug = generateSlugFrom();
