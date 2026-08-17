import { LanguageCode, glyphFor } from "@/lib/languages";

export type Lesson = {
  id: string;
  title: string;
  hint: string;
  keys: string[];
};

type KeyLesson = { id: string; title: string; hint: string; keys: string[] };

/** Lessons that each introduce a new pair of keys, in teaching order. */
const NEW_KEY_LESSONS: KeyLesson[] = [
  { id: "f-j", title: "F & J", hint: "Index fingers rest on F and J", keys: ["f", "j"] },
  { id: "d-k", title: "D & K", hint: "Middle fingers", keys: ["d", "k"] },
  { id: "s-l", title: "S & L", hint: "Ring fingers", keys: ["s", "l"] },
  { id: "a-scolon", title: "A & ;", hint: "Pinky fingers", keys: ["a", ";"] },
  { id: "g-h", title: "G & H", hint: "Index fingers stretch inward", keys: ["g", "h"] },
  { id: "r-u", title: "R & U", hint: "Index fingers reach up", keys: ["r", "u"] },
  { id: "e-i", title: "E & I", hint: "Middle fingers reach up", keys: ["e", "i"] },
  { id: "w-o", title: "W & O", hint: "Ring fingers reach up", keys: ["w", "o"] },
  { id: "q-p", title: "Q & P", hint: "Pinky fingers reach up", keys: ["q", "p"] },
  { id: "t-y", title: "T & Y", hint: "Index fingers reach the middle", keys: ["t", "y"] },
  { id: "v-m", title: "V & M", hint: "Index fingers reach down", keys: ["v", "m"] },
  { id: "c-comma", title: "C & ,", hint: "Middle fingers reach down", keys: ["c", ","] },
  { id: "x-period", title: "X & .", hint: "Ring fingers reach down", keys: ["x", "."] },
  { id: "z-slash", title: "Z & /", hint: "Pinky fingers reach down", keys: ["z", "/"] },
  { id: "b-n", title: "B & N", hint: "Index fingers reach to the middle", keys: ["b", "n"] },
  {
    id: "numbers",
    title: "Numbers",
    hint: "The number row",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  },
];

/**
 * A handful of accumulating checkpoints keep their original id/copy (both for
 * continuity with progress already saved in localStorage, and because they
 * land at a natural milestone) instead of the generic "Review (N keys)" label.
 */
const MILESTONE_AFTER: Record<string, { id: string; title: string; hint: string }> = {
  "a-scolon": { id: "home-row", title: "Home Row Review", hint: "All eight home row keys" },
  "t-y": { id: "top-row", title: "Top Row Review", hint: "Home row and top row keys together" },
  "b-n": { id: "bottom-row", title: "Bottom Row Review", hint: "Every letter and punctuation key so far" },
  numbers: {
    id: "full-keyboard",
    title: "Full Keyboard",
    hint: "Every key you've learned - letters, punctuation, and numbers",
  },
};

/**
 * Builds the lesson sequence, inserting an accumulating review lesson after every
 * new-key lesson (starting once there are two lessons to combine) that drills every
 * key taught so far, not just the ones from the lesson that was just finished.
 */
function buildLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  const learned: string[] = [];

  NEW_KEY_LESSONS.forEach((entry, i) => {
    lessons.push({ id: entry.id, title: entry.title, hint: entry.hint, keys: entry.keys });
    learned.push(...entry.keys);
    if (i === 0) return;

    const cumulativeKeys = Array.from(new Set(learned));
    const milestone = MILESTONE_AFTER[entry.id];
    if (milestone) {
      lessons.push({ id: milestone.id, title: milestone.title, hint: milestone.hint, keys: cumulativeKeys });
    } else {
      const n = cumulativeKeys.length;
      lessons.push({
        id: `accum-${n}`,
        title: `Review (${n} keys)`,
        hint: "Everything you've learned so far, all mixed together",
        keys: cumulativeKeys,
      });
    }
  });

  return lessons;
}

export const LESSONS: Lesson[] = buildLessons();

const WORD_COUNT = 45;
const MIN_WORD_LEN = 2;
const MAX_WORD_LEN = 5;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generates a long drill of pseudo-words built only from the lesson's own keys. */
export function generateDrillText(keys: string[], language: LanguageCode = "en"): string {
  const words: string[] = [];
  for (let w = 0; w < WORD_COUNT; w++) {
    const len = MIN_WORD_LEN + Math.floor(Math.random() * (MAX_WORD_LEN - MIN_WORD_LEN + 1));
    let word = "";
    for (let i = 0; i < len; i++) word += glyphFor(language, pick(keys));
    words.push(word);
  }
  return words.join(" ");
}
