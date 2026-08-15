export type Finger =
  | "l-pinky"
  | "l-ring"
  | "l-middle"
  | "l-index"
  | "r-index"
  | "r-middle"
  | "r-ring"
  | "r-pinky"
  | "thumb";

export const FINGER_COLOR: Record<Finger, string> = {
  "l-pinky": "bg-rose-400",
  "l-ring": "bg-amber-400",
  "l-middle": "bg-lime-500",
  "l-index": "bg-sky-400",
  "r-index": "bg-sky-400",
  "r-middle": "bg-lime-500",
  "r-ring": "bg-amber-400",
  "r-pinky": "bg-rose-400",
  thumb: "bg-neutral-400",
};

export const FINGER_LABEL: Record<Finger, string> = {
  "l-pinky": "left pinky",
  "l-ring": "left ring finger",
  "l-middle": "left middle finger",
  "l-index": "left index finger",
  "r-index": "right index finger",
  "r-middle": "right middle finger",
  "r-ring": "right ring finger",
  "r-pinky": "right pinky",
  thumb: "thumb",
};

export const KEY_FINGER: Record<string, Finger> = {
  "1": "l-pinky",
  "2": "l-ring",
  "3": "l-middle",
  "4": "l-index",
  "5": "l-index",
  "6": "r-index",
  "7": "r-index",
  "8": "r-middle",
  "9": "r-ring",
  "0": "r-pinky",
  q: "l-pinky",
  w: "l-ring",
  e: "l-middle",
  r: "l-index",
  t: "l-index",
  y: "r-index",
  u: "r-index",
  i: "r-middle",
  o: "r-ring",
  p: "r-pinky",
  a: "l-pinky",
  s: "l-ring",
  d: "l-middle",
  f: "l-index",
  g: "l-index",
  h: "r-index",
  j: "r-index",
  k: "r-middle",
  l: "r-ring",
  ";": "r-pinky",
  z: "l-pinky",
  x: "l-ring",
  c: "l-middle",
  v: "l-index",
  b: "l-index",
  n: "r-index",
  m: "r-index",
  ",": "r-middle",
  ".": "r-ring",
  "/": "r-pinky",
  " ": "thumb",
};

/** Row offset relative to the home row: negative = reach up, positive = reach down. */
export const KEY_ROW_OFFSET: Record<string, number> = {
  "1": -2,
  "2": -2,
  "3": -2,
  "4": -2,
  "5": -2,
  "6": -2,
  "7": -2,
  "8": -2,
  "9": -2,
  "0": -2,
  q: -1,
  w: -1,
  e: -1,
  r: -1,
  t: -1,
  y: -1,
  u: -1,
  i: -1,
  o: -1,
  p: -1,
  a: 0,
  s: 0,
  d: 0,
  f: 0,
  g: 0,
  h: 0,
  j: 0,
  k: 0,
  l: 0,
  ";": 0,
  z: 1,
  x: 1,
  c: 1,
  v: 1,
  b: 1,
  n: 1,
  m: 1,
  ",": 1,
  ".": 1,
  "/": 1,
  " ": 0,
};

export const HOME_KEY_FOR_FINGER: Record<Finger, string> = {
  "l-pinky": "a",
  "l-ring": "s",
  "l-middle": "d",
  "l-index": "f",
  "r-index": "j",
  "r-middle": "k",
  "r-ring": "l",
  "r-pinky": ";",
  thumb: "space",
};

export function reachDescription(key: string): string {
  const offset = KEY_ROW_OFFSET[key] ?? 0;
  if (key === " ") return "thumb taps the space bar";
  if (offset === 0) return "home key — no reach needed";
  if (offset === -1) return "reach up one row";
  if (offset === -2) return "reach up two rows";
  if (offset === 1) return "reach down one row";
  return "reach";
}
