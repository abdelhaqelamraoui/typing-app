import type { Lesson } from "@/lib/lessons";

export type LanguageCode = "en" | "ar";

export const LANGUAGES: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
];

export function isRtl(language: LanguageCode): boolean {
  return language === "ar";
}

export type KeyboardLayout = "qwerty" | "azerty";

export const KEYBOARD_LAYOUTS: { code: KeyboardLayout; label: string }[] = [
  { code: "qwerty", label: "QWERTY" },
  { code: "azerty", label: "AZERTY" },
];

/**
 * Physical-key -> Latin glyph for the French AZERTY layout, for every physical key
 * whose glyph differs from QWERTY. Digits stay digits (they're typed with Shift on
 * AZERTY), so lesson keys and finger assignments are unchanged.
 */
const KEY_GLYPH_AZERTY: Record<string, string> = {
  q: "a",
  w: "z",
  a: "q",
  z: "w",
  ";": "m",
  m: ",",
  ",": ";",
  ".": ":",
  "/": "!",
};

/** Unshifted AZERTY number-row symbols, printed under each digit on the keycap. */
export const AZERTY_NUMBER_SYMBOL: Record<string, string> = {
  "1": "&",
  "2": "é",
  "3": '"',
  "4": "'",
  "5": "(",
  "6": "-",
  "7": "è",
  "8": "_",
  "9": "ç",
  "0": "à",
};

/** AZERTY legends for the non-lesson keys, keyed by their QWERTY label in virtual-keyboard.tsx. */
export const AZERTY_EXTRA_LABEL: Record<string, string> = {
  "`": "²",
  "-": ")",
  "=": "=",
  "[": "^",
  "]": "$",
  "\\": "*",
  "'": "ù",
};

function latinGlyph(key: string, layout: KeyboardLayout): string {
  if (layout !== "azerty") return key;
  return KEY_GLYPH_AZERTY[key] ?? key;
}

/** The Latin legend printed on a physical key for the given layout (letters upper-cased). */
export function latinLegend(key: string, layout: KeyboardLayout): string {
  const glyph = latinGlyph(key, layout);
  return /[a-z]/.test(glyph) ? glyph.toUpperCase() : glyph;
}

/**
 * Physical-key -> glyph map for the standard "Arabic (101)" / "Arabic-PC" keyboard
 * layout (the layout shipped with Windows and offered as "Arabic-PC" on macOS).
 * "Arabic (102) AZERTY" puts the Arabic letters on the same physical keys, so this
 * map serves both layouts.
 * Keyed by the same physical-key id used throughout lib/fingers.ts and lib/lessons.ts,
 * so finger/row assignments stay correct - only the printed glyph changes.
 */
export const KEY_GLYPH_AR: Record<string, string> = {
  q: "ض",
  w: "ص",
  e: "ث",
  r: "ق",
  t: "ف",
  y: "غ",
  u: "ع",
  i: "ه",
  o: "خ",
  p: "ح",
  a: "ش",
  s: "س",
  d: "ي",
  f: "ب",
  g: "ل",
  h: "ا",
  j: "ت",
  k: "ن",
  l: "م",
  ";": "ك",
  z: "ئ",
  x: "ء",
  c: "ؤ",
  v: "ر",
  b: "لا",
  n: "ى",
  m: "ة",
  ",": "و",
  ".": "ز",
  "/": "ظ",
};

/** The Arabic-PC "b" key types a lam-alef ligature - two characters from one keystroke. */
export const LAM_ALEF_LIGATURE = "لا";

/** The character a physical key types in the given language and keyboard layout. */
export function glyphFor(language: LanguageCode, key: string, layout: KeyboardLayout = "qwerty"): string {
  if (language !== "ar") return latinGlyph(key, layout);
  return KEY_GLYPH_AR[key] ?? key;
}

export const LESSON_TITLE_AR: Record<string, string> = {
  "f-j": "ب و ت",
  "d-k": "ي و ن",
  "s-l": "س و م",
  "a-scolon": "ش و ك",
  "home-row": "مراجعة الصف الأوسط",
  "g-h": "ل و ا",
  "r-u": "ق و ع",
  "e-i": "ث و ه",
  "w-o": "ص و خ",
  "q-p": "ض و ح",
  "t-y": "ف و غ",
  "top-row": "مراجعة الصف العلوي",
  "v-m": "ر و ة",
  "c-comma": "ؤ و و",
  "x-period": "ء و ز",
  "z-slash": "ئ و ظ",
  "b-n": "لا و ى",
  "bottom-row": "مراجعة الصف السفلي",
  numbers: "الأرقام",
  "full-keyboard": "لوحة المفاتيح كاملة",
};

export const LESSON_HINT_AR: Record<string, string> = {
  "f-j": "ضع السبابتين على ب و ت",
  "d-k": "الإصبعان الوسطى",
  "s-l": "إصبعا البنصر",
  "a-scolon": "إصبعا الخنصر",
  "home-row": "كل مفاتيح الصف الأوسط الثمانية",
  "g-h": "امتداد السبابتين إلى الداخل",
  "r-u": "امتداد السبابتين للأعلى",
  "e-i": "امتداد الوسطى للأعلى",
  "w-o": "امتداد البنصر للأعلى",
  "q-p": "امتداد الخنصر للأعلى",
  "t-y": "امتداد السبابتين نحو الوسط",
  "top-row": "الصف الأوسط والصف العلوي معًا",
  "v-m": "امتداد السبابتين للأسفل",
  "c-comma": "امتداد الوسطى للأسفل",
  "x-period": "امتداد البنصر للأسفل",
  "z-slash": "امتداد الخنصر للأسفل",
  "b-n": "امتداد السبابتين نحو الوسط",
  "bottom-row": "كل حرف وعلامة ترقيم تعلمتها حتى الآن",
  numbers: "صف الأرقام",
  "full-keyboard": "كل ما تعلمته - الحروف وعلامات الترقيم والأرقام",
};

/** Generic Arabic fallback for a lesson title when there's no explicit override above. */
function fallbackTitleAr(lesson: Pick<Lesson, "id" | "keys">): string | null {
  if (lesson.keys.length <= 2) return lesson.keys.map((key) => glyphFor("ar", key)).join(" و ");
  if (lesson.id.startsWith("accum-")) return `مراجعة (${lesson.keys.length} مفاتيح)`;
  return null;
}

export function lessonTitle(
  lesson: Pick<Lesson, "id" | "title" | "keys">,
  language: LanguageCode,
  layout: KeyboardLayout = "qwerty"
): string {
  if (language === "ar") return LESSON_TITLE_AR[lesson.id] ?? fallbackTitleAr(lesson) ?? lesson.title;
  // Key-pair titles follow the printed legends, so "A & ;" reads "Q & M" on AZERTY.
  if (lesson.keys.length <= 2) return lesson.keys.map((key) => latinLegend(key, layout)).join(" & ");
  return lesson.title;
}

const DIGIT_SHIFT_HINT: Record<LanguageCode, string> = {
  en: "hold Shift for digits on AZERTY",
  ar: "اضغط Shift لكتابة الأرقام في AZERTY",
};

export function lessonHint(
  lesson: Pick<Lesson, "id" | "hint" | "keys">,
  language: LanguageCode,
  layout: KeyboardLayout = "qwerty"
): string {
  let hint = lesson.hint;
  if (language === "ar") {
    if (LESSON_HINT_AR[lesson.id]) hint = LESSON_HINT_AR[lesson.id];
    else if (lesson.id.startsWith("accum-")) hint = "كل ما تعلمته حتى الآن، مجتمعًا";
  }
  if (layout === "azerty" && lesson.keys.some((key) => /[0-9]/.test(key))) {
    hint = `${hint} (${DIGIT_SHIFT_HINT[language]})`;
  }
  return hint;
}
