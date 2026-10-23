"use client";

import { useMemo } from "react";

import { Lesson } from "@/lib/lessons";
import { Finger, FINGER_COLOR, KEY_FINGER, KEY_ROW_OFFSET } from "@/lib/fingers";
import { KeyboardLayout, LanguageCode, glyphFor, latinLegend } from "@/lib/languages";
import { VirtualKeyboard } from "@/components/virtual-keyboard";

// Column weights below mirror the HOME_ROW / bottom modifier row weights in
// virtual-keyboard.tsx, so this strip's columns line up under the real keys.
const CAPS_LOCK_WEIGHT = 1.75;
const APOSTROPHE_RETURN_WEIGHT = 1 + 2.2;
const HOME_ROW_FINGERS: (Finger | null)[] = [
  "l-pinky",
  "l-ring",
  "l-middle",
  "l-index",
  null, // g - reach only, no resting finger
  null, // h - reach only, no resting finger
  "r-index",
  "r-middle",
  "r-ring",
  "r-pinky",
];
const LEFT_MOD_WEIGHT = 1 + 1.15 + 1.15 + 1.4; // fn + control + option + command
const SPACE_WEIGHT = 5.5;
const RIGHT_MOD_WEIGHT = 1.4 + 1.15 + 1 + 1 + 1; // command + option + arrows

function bestReach(lesson: Lesson, finger: Finger): { key: string; offset: number } | null {
  let best: { key: string; offset: number } | null = null;
  for (const key of lesson.keys) {
    if (KEY_FINGER[key] !== finger) continue;
    const offset = KEY_ROW_OFFSET[key] ?? 0;
    if (offset === 0) continue;
    if (!best || Math.abs(offset) > Math.abs(best.offset)) best = { key, offset };
  }
  return best;
}

function keyLabel(key: string, language: LanguageCode, layout: KeyboardLayout) {
  if (language === "ar") return glyphFor(language, key, layout);
  return latinLegend(key, layout);
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
  const thumbActive = activeKeys.has(" ");

  return (
    // The keyboard is a physical object, so it keeps its left-to-right shape in RTL locales.
    <div dir="ltr" className="w-full">
      <VirtualKeyboard nextKey={null} activeKeys={activeKeys} language={language} layout={layout} />

      <div className="rounded-b-2xl border border-t-0 bg-muted/40 p-3 pt-2 shadow-inner sm:p-4 sm:pt-2">
        <div className="flex w-full gap-1">
          <div style={{ flexGrow: CAPS_LOCK_WEIGHT, flexBasis: 0 }} />
          {HOME_ROW_FINGERS.map((finger, i) => {
            const reach = finger ? bestReach(lesson, finger) : null;
            return (
              <div
                key={i}
                style={{ flexGrow: 1, flexBasis: 0 }}
                className="flex h-4 items-center justify-center font-mono text-[11px] font-semibold text-foreground"
              >
                {reach && (
                  <span>
                    {reach.offset < 0 ? "↑" : "↓"}
                    {keyLabel(reach.key, language, layout)}
                  </span>
                )}
              </div>
            );
          })}
          <div style={{ flexGrow: APOSTROPHE_RETURN_WEIGHT, flexBasis: 0 }} />
        </div>

        <div className="mt-1 flex w-full gap-1">
          <div style={{ flexGrow: CAPS_LOCK_WEIGHT, flexBasis: 0 }} />
          {HOME_ROW_FINGERS.map((finger, i) => (
            <div key={i} style={{ flexGrow: 1, flexBasis: 0 }} className="flex justify-center">
              {finger && (
                <div
                  className={`h-9 w-full rounded-full transition-colors sm:h-11 ${
                    activeFingers.has(finger) ? FINGER_COLOR[finger] : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          ))}
          <div style={{ flexGrow: APOSTROPHE_RETURN_WEIGHT, flexBasis: 0 }} />
        </div>

        <div className="mt-1 flex w-full gap-1">
          <div style={{ flexGrow: LEFT_MOD_WEIGHT, flexBasis: 0 }} />
          <div
            style={{ flexGrow: SPACE_WEIGHT, flexBasis: 0 }}
            className={`h-6 rounded-full transition-colors ${
              thumbActive ? FINGER_COLOR.thumb : "bg-muted-foreground/30"
            }`}
          />
          <div style={{ flexGrow: RIGHT_MOD_WEIGHT, flexBasis: 0 }} />
        </div>

        <div className="mt-2 flex w-full gap-6">
          <div className="h-7 flex-1 rounded-full bg-muted-foreground/20" />
          <div className="h-7 flex-1 rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}
