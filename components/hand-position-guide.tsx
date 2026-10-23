"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Lesson } from "@/lib/lessons";
import { Finger, FINGER_FILL, FINGER_STROKE, HOME_KEY_FOR_FINGER, KEY_FINGER, KEY_ROW_OFFSET } from "@/lib/fingers";
import { KeyboardLayout, LanguageCode, glyphFor } from "@/lib/languages";
import { VirtualKeyboard } from "@/components/virtual-keyboard";

type Box = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Geometry = { keys: Record<string, Box>; width: number; height: number };

type FingerSpec = {
  finger: Exclude<Finger, "thumb">;
  /** Knuckle distance below the home row, in key rows - longer fingers sit further back. */
  knuckleRows: number;
  /** Knuckle shift toward the middle of the hand, in key widths - fingers fan out from the palm. */
  knuckleInset: number;
};

// Ordered from the outer edge of the hand inward.
const LEFT_FINGERS: FingerSpec[] = [
  { finger: "l-pinky", knuckleRows: 1.3, knuckleInset: 0.4 },
  { finger: "l-ring", knuckleRows: 1.75, knuckleInset: 0.15 },
  { finger: "l-middle", knuckleRows: 1.9, knuckleInset: 0 },
  { finger: "l-index", knuckleRows: 1.7, knuckleInset: -0.1 },
];
const RIGHT_FINGERS: FingerSpec[] = LEFT_FINGERS.map((spec) => ({
  ...spec,
  finger: spec.finger.replace("l-", "r-") as FingerSpec["finger"],
}));

/** How far a knuckle follows its fingertip when the finger reaches off the home row (0 = stays put). */
const REACH_FOLLOW = 0.45;

/** Extra room under the keyboard for the palms and wrists. */
const WRIST_SPACE = 84;

const HAND_OUTLINE = "stroke-neutral-500 dark:stroke-neutral-400";
const HAND_OUTLINE_FILL = "fill-neutral-500 dark:fill-neutral-400";
const HAND_SKIN = "stroke-neutral-200 dark:stroke-neutral-600";
const HAND_PALM_FILL = "fill-neutral-200 dark:fill-neutral-600";

/** The key a finger should be shown on: its furthest reach in this lesson, or its home key. */
function targetKey(lesson: Lesson, finger: Finger): string {
  let best: { key: string; offset: number } | null = null;
  for (const key of lesson.keys) {
    if (KEY_FINGER[key] !== finger) continue;
    const offset = KEY_ROW_OFFSET[key] ?? 0;
    if (offset === 0) continue;
    if (!best || Math.abs(offset) > Math.abs(best.offset)) best = { key, offset };
  }
  return best?.key ?? HOME_KEY_FOR_FINGER[finger];
}

function measure(container: HTMLElement): Geometry | null {
  const keys: Record<string, Box> = {};
  // offsetLeft/Top ignore CSS transforms, so this stays correct during the dialog's zoom-in animation.
  container.querySelectorAll<HTMLElement>("[data-key]").forEach((el) => {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== container) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    keys[el.dataset.key!] = { x, y, w: el.offsetWidth, h: el.offsetHeight };
  });
  if (!keys.f || !keys.j || !keys.space) return null;
  return { keys, width: container.offsetWidth, height: container.offsetHeight };
}

function center(box: Box): Point {
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

type HandShape = {
  fingers: { finger: Finger; knuckle: Point; tip: Point; active: boolean }[];
  palm: Point[];
};

function buildHand(
  geometry: Geometry,
  specs: FingerSpec[],
  side: "left" | "right",
  lesson: Lesson,
  activeFingers: Set<Finger>
): HandShape | null {
  const { keys } = geometry;
  const keyW = keys.f.w;
  const rowPitch = keys.f.y - keys.r.y;
  // +1 moves toward the middle of this hand's palm (right for the left hand, left for the right hand).
  const inward = side === "left" ? 1 : -1;
  // Fingertips rest on the lower part of the key so its legend stays readable.
  const tipOffset = keys.f.h * 0.3;

  const fingers: HandShape["fingers"] = [];
  let shiftY = 0;
  for (const spec of specs) {
    const home = keys[HOME_KEY_FOR_FINGER[spec.finger]];
    const target = keys[targetKey(lesson, spec.finger)] ?? home;
    if (!home) return null;
    const homeCenter = center(home);
    const targetCenter = center(target);
    // A reaching finger drags its knuckle part of the way along, so it extends instead of stretching.
    const reachX = (targetCenter.x - homeCenter.x) * REACH_FOLLOW;
    const reachY = (targetCenter.y - homeCenter.y) * REACH_FOLLOW;
    shiftY += reachY / specs.length;
    fingers.push({
      finger: spec.finger,
      knuckle: {
        x: homeCenter.x + inward * spec.knuckleInset * keyW + reachX,
        y: homeCenter.y + spec.knuckleRows * rowPitch + reachY,
      },
      tip: { x: targetCenter.x, y: targetCenter.y + tipOffset },
      active: activeFingers.has(spec.finger),
    });
  }

  const [pinky, , middle, index] = fingers;
  const space = keys.space;
  // The thumb grows from the lower inner corner of the palm and angles up onto the space bar.
  const restingIndexKnuckleY = center(keys[HOME_KEY_FOR_FINGER[index.finger]]).y + specs[3].knuckleRows * rowPitch;
  const thumbBase = { x: index.knuckle.x - inward * 0.2 * keyW, y: restingIndexKnuckleY + shiftY + 1.5 * rowPitch };
  fingers.push({
    finger: "thumb",
    knuckle: thumbBase,
    // Anchored to the resting index position, so thumbs stay put on the space bar while fingers reach.
    tip: { x: center(keys[HOME_KEY_FOR_FINGER[index.finger]]).x + inward * 1.15 * keyW, y: center(space).y + tipOffset * 0.5 },
    active: activeFingers.has("thumb"),
  });

  // The palm and wrist follow the hand's average reach, not just the middle finger's.
  const wristY = center(keys[HOME_KEY_FOR_FINGER[middle.finger]]).y + specs[2].knuckleRows * rowPitch + shiftY + 2.4 * rowPitch;
  const palm = [
    pinky.knuckle,
    ...fingers.slice(1, 4).map((f) => f.knuckle),
    thumbBase,
    { x: index.knuckle.x - inward * 0.1 * keyW, y: wristY },
    { x: pinky.knuckle.x + inward * 0.25 * keyW, y: wristY },
  ];
  return { fingers, palm };
}

function Hand({ shape, fingerWidth }: { shape: HandShape; fingerWidth: number }) {
  const palmPoints = shape.palm.map((p) => `${p.x},${p.y}`).join(" ");
  const outlineWidth = fingerWidth + 3;

  // Drawn twice - a slightly wider outline pass, then the skin pass on top - so fingers and palm
  // merge into one silhouette with a single outline around it.
  return (
    <g>
      <polygon points={palmPoints} strokeWidth={outlineWidth} strokeLinejoin="round" className={`${HAND_OUTLINE} ${HAND_OUTLINE_FILL}`} />
      {shape.fingers.map(({ finger, knuckle, tip }) => (
        <line key={finger} x1={knuckle.x} y1={knuckle.y} x2={tip.x} y2={tip.y} strokeWidth={outlineWidth} strokeLinecap="round" className={HAND_OUTLINE} />
      ))}
      <polygon points={palmPoints} strokeWidth={fingerWidth} strokeLinejoin="round" className={`${HAND_SKIN} ${HAND_PALM_FILL}`} />
      {shape.fingers.map(({ finger, knuckle, tip, active }) => (
        <line
          key={finger}
          x1={knuckle.x}
          y1={knuckle.y}
          x2={tip.x}
          y2={tip.y}
          strokeWidth={fingerWidth}
          strokeLinecap="round"
          className={active ? FINGER_STROKE[finger] : HAND_SKIN}
        />
      ))}
      {shape.fingers.map(({ finger, tip, active }) => (
        <circle
          key={finger}
          cx={tip.x}
          cy={tip.y}
          r={fingerWidth * 0.3}
          className={`${FINGER_FILL[finger]} ${active ? "" : "opacity-70"}`}
        />
      ))}
    </g>
  );
}

export function HandPositionGuide({
  lesson,
  language = "en",
  layout = "qwerty",
}: {
  lesson: Lesson;
  language?: LanguageCode;
  layout?: KeyboardLayout;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const maskId = useId();

  const activeKeys = useMemo(
    () => new Set(lesson.keys.map((key) => glyphFor(language, key, layout))),
    [lesson, language, layout]
  );
  const activeFingers = useMemo(() => {
    const set = new Set<Finger>();
    for (const key of lesson.keys) {
      const finger = KEY_FINGER[key];
      if (finger) set.add(finger);
    }
    return set;
  }, [lesson]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => setGeometry(measure(container));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const hands = useMemo(() => {
    if (!geometry) return null;
    const left = buildHand(geometry, LEFT_FINGERS, "left", lesson, activeFingers);
    const right = buildHand(geometry, RIGHT_FINGERS, "right", lesson, activeFingers);
    return left && right ? { left, right, fingerWidth: geometry.keys.f.w * 0.6 } : null;
  }, [geometry, lesson, activeFingers]);

  return (
    // The keyboard is a physical object, so it keeps its left-to-right shape in RTL locales.
    <div ref={containerRef} dir="ltr" className="relative w-full" style={{ paddingBottom: WRIST_SPACE }}>
      <VirtualKeyboard nextKey={null} activeKeys={activeKeys} language={language} layout={layout} />

      {geometry && hands && (
        <svg
          aria-hidden
          width={geometry.width}
          height={geometry.height}
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <defs>
            {/* Fade the wrists out toward the bottom edge instead of cutting them off. */}
            <linearGradient id={`${maskId}-fade`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.7" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={`${maskId}-mask`}>
              <rect width={geometry.width} height={geometry.height} fill={`url(#${maskId}-fade)`} />
            </mask>
          </defs>
          <g mask={`url(#${maskId}-mask)`} opacity={0.72}>
            <Hand shape={hands.left} fingerWidth={hands.fingerWidth} />
            <Hand shape={hands.right} fingerWidth={hands.fingerWidth} />
          </g>
        </svg>
      )}
    </div>
  );
}
