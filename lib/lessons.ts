export type Lesson = {
  id: string;
  title: string;
  hint: string;
  keys: string[];
};

export const LESSONS: Lesson[] = [
  { id: "f-j", title: "F & J", hint: "Index fingers rest on F and J", keys: ["f", "j"] },
  { id: "d-k", title: "D & K", hint: "Middle fingers", keys: ["d", "k"] },
  { id: "s-l", title: "S & L", hint: "Ring fingers", keys: ["s", "l"] },
  { id: "a-scolon", title: "A & ;", hint: "Pinky fingers", keys: ["a", ";"] },
  {
    id: "home-row",
    title: "Home Row Review",
    hint: "All eight home row keys",
    keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
  },
  { id: "g-h", title: "G & H", hint: "Index fingers stretch inward", keys: ["g", "h"] },
  { id: "r-u", title: "R & U", hint: "Index fingers reach up", keys: ["r", "u"] },
  { id: "e-i", title: "E & I", hint: "Middle fingers reach up", keys: ["e", "i"] },
  { id: "w-o", title: "W & O", hint: "Ring fingers reach up", keys: ["w", "o"] },
  { id: "q-p", title: "Q & P", hint: "Pinky fingers reach up", keys: ["q", "p"] },
  { id: "t-y", title: "T & Y", hint: "Index fingers reach the middle", keys: ["t", "y"] },
  {
    id: "top-row",
    title: "Top Row Review",
    hint: "All ten top row keys",
    keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  },
  { id: "v-m", title: "V & M", hint: "Index fingers reach down", keys: ["v", "m"] },
  { id: "c-comma", title: "C & ,", hint: "Middle fingers reach down", keys: ["c", ","] },
  { id: "x-period", title: "X & .", hint: "Ring fingers reach down", keys: ["x", "."] },
  { id: "z-slash", title: "Z & /", hint: "Pinky fingers reach down", keys: ["z", "/"] },
  { id: "b-n", title: "B & N", hint: "Index fingers reach to the middle", keys: ["b", "n"] },
  {
    id: "bottom-row",
    title: "Bottom Row Review",
    hint: "All ten bottom row keys",
    keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  },
  {
    id: "numbers",
    title: "Numbers",
    hint: "The number row",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  },
  {
    id: "full-keyboard",
    title: "Full Keyboard",
    hint: "Every letter, mixed together",
    keys: "abcdefghijklmnopqrstuvwxyz".split(""),
  },
];

const WORD_COUNT = 45;
const MIN_WORD_LEN = 2;
const MAX_WORD_LEN = 5;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generates a long drill of pseudo-words built only from the lesson's own keys. */
export function generateDrillText(keys: string[]): string {
  const words: string[] = [];
  for (let w = 0; w < WORD_COUNT; w++) {
    const len = MIN_WORD_LEN + Math.floor(Math.random() * (MAX_WORD_LEN - MIN_WORD_LEN + 1));
    let word = "";
    for (let i = 0; i < len; i++) word += pick(keys);
    words.push(word);
  }
  return words.join(" ");
}
