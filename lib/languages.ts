import type { Lesson } from "@/lib/lessons";

export type LanguageCode = "en" | "ar";

export const LANGUAGES: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
];

/**
 * Physical-key -> glyph map for the standard "Arabic (101)" / "Arabic-PC" keyboard
 * layout (the layout shipped with Windows and offered as "Arabic-PC" on macOS).
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

export function glyphFor(language: LanguageCode, key: string): string {
  if (language !== "ar") return key;
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

export function lessonTitle(lesson: Pick<Lesson, "id" | "title" | "keys">, language: LanguageCode): string {
  if (language !== "ar") return lesson.title;
  return LESSON_TITLE_AR[lesson.id] ?? fallbackTitleAr(lesson) ?? lesson.title;
}

export function lessonHint(lesson: Pick<Lesson, "id" | "hint">, language: LanguageCode): string {
  if (language !== "ar") return lesson.hint;
  if (LESSON_HINT_AR[lesson.id]) return LESSON_HINT_AR[lesson.id];
  if (lesson.id.startsWith("accum-")) return "كل ما تعلمته حتى الآن، مجتمعًا";
  return lesson.hint;
}

export const STRINGS: Record<
  LanguageCode,
  {
    justStart: string;
    perfectRun: string;
    errorsBadge: (n: number) => string;
    newDrill: string;
    retry: string;
    lessonLocked: string;
    lessonLockedDesc: string;
    wpm: string;
    acc: string;
    errors: string;
  }
> = {
  en: {
    justStart: "Just start typing - no need to click anything.",
    perfectRun: "Perfect run - next lesson unlocked",
    errorsBadge: (n) =>
      `${n} error${n === 1 ? "" : "s"} - type with zero errors to unlock the next lesson. Press Enter to retry.`,
    newDrill: "New drill",
    retry: "Retry",
    lessonLocked: "Lesson locked",
    lessonLockedDesc: "Finish the previous lesson with zero errors to unlock this one.",
    wpm: "wpm",
    acc: "acc",
    errors: "errors",
  },
  ar: {
    justStart: "ابدأ الكتابة مباشرة - لا حاجة للنقر على أي شيء.",
    perfectRun: "أداء مثالي - تم فتح الدرس التالي",
    errorsBadge: (n) =>
      `${n === 1 ? "خطأ واحد" : `${n} أخطاء`} - اكتب بدون أخطاء لفتح الدرس التالي. اضغط Enter لإعادة المحاولة.`,
    newDrill: "تمرين جديد",
    retry: "إعادة المحاولة",
    lessonLocked: "الدرس مقفل",
    lessonLockedDesc: "أنهِ الدرس السابق بدون أخطاء لفتح هذا الدرس.",
    wpm: "كلمة/د",
    acc: "الدقة",
    errors: "أخطاء",
  },
};
