"use client";

import { useMemo } from "react";

import { Lesson } from "@/lib/lessons";
import {
  Finger,
  FINGER_COLOR,
  FINGER_LABEL,
  HOME_KEY_FOR_FINGER,
  KEY_FINGER,
  KEY_ROW_OFFSET,
  reachDescription,
} from "@/lib/fingers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const LEFT_FINGERS: Finger[] = ["l-pinky", "l-ring", "l-middle", "l-index"];
const RIGHT_FINGERS: Finger[] = ["r-index", "r-middle", "r-ring", "r-pinky"];

function primaryReach(keys: string[]): { key: string; offset: number } | null {
  let best: { key: string; offset: number } | null = null;
  for (const k of keys) {
    const offset = KEY_ROW_OFFSET[k] ?? 0;
    if (offset === 0) continue;
    if (!best || Math.abs(offset) > Math.abs(best.offset)) best = { key: k, offset };
  }
  return best;
}

function FingerTip({ finger, keys }: { finger: Finger; keys: string[] }) {
  const active = keys.length > 0;
  const reach = active ? primaryReach(keys) : null;
  const homeKey = HOME_KEY_FOR_FINGER[finger];

  return (
    <div className="flex w-10 flex-col items-center gap-1">
      <div className="flex h-6 flex-col items-center justify-end font-mono text-[10px] font-semibold leading-none text-foreground">
        {reach && (
          <>
            <span>{reach.offset < 0 ? "↑" : "↓"}</span>
            <span className="uppercase">{reach.key === " " ? "␣" : reach.key}</span>
          </>
        )}
      </div>
      <div
        className={`size-8 rounded-full border-2 transition-all duration-200 ${
          active
            ? `${FINGER_COLOR[finger]} scale-110 border-foreground/50 shadow-sm`
            : "border-border/60 bg-muted opacity-40"
        }`}
      />
      <span className="font-mono text-[10px] text-muted-foreground">{homeKey}</span>
    </div>
  );
}

type Props = {
  lesson: Lesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HandGuideModal({ lesson, open, onOpenChange }: Props) {
  const keysByFinger = useMemo(() => {
    const map = new Map<Finger, string[]>();
    for (const k of lesson.keys) {
      const finger = KEY_FINGER[k];
      if (!finger) continue;
      const arr = map.get(finger) ?? [];
      arr.push(k);
      map.set(finger, arr);
    }
    return map;
  }, [lesson]);

  const usesSpace = lesson.keys.includes(" ");
  const uniqueKeys = useMemo(() => Array.from(new Set(lesson.keys)), [lesson]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Finger positions — {lesson.title}</DialogTitle>
          <DialogDescription>
            Rest your fingers on the home row (A S D F · J K L ;) and reach out only for the highlighted keys below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          <div className="shrink-0 rounded-xl border bg-muted/30 p-4">
            <div className="flex items-end justify-center gap-1.5">
              {LEFT_FINGERS.map((finger) => (
                <FingerTip key={finger} finger={finger} keys={keysByFinger.get(finger) ?? []} />
              ))}
              <div className="w-4" />
              {RIGHT_FINGERS.map((finger) => (
                <FingerTip key={finger} finger={finger} keys={keysByFinger.get(finger) ?? []} />
              ))}
            </div>

            <div className="mt-3 flex justify-center">
              <div
                className={`rounded-full border-2 px-4 py-1 font-mono text-[11px] transition-all duration-200 ${
                  usesSpace
                    ? "scale-105 border-foreground/50 bg-neutral-400 text-neutral-900 shadow-sm"
                    : "border-border/60 bg-muted text-muted-foreground opacity-40"
                }`}
              >
                thumbs · space
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-1.5 text-sm">
            {uniqueKeys.map((key) => {
              const finger = KEY_FINGER[key];
              if (!finger) return null;
              return (
                <li key={key} className="flex items-center gap-2">
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs text-neutral-900 ${FINGER_COLOR[finger]}`}
                  >
                    {key === " " ? "␣" : key}
                  </span>
                  <span className="text-muted-foreground">
                    {FINGER_LABEL[finger]} — {reachDescription(key)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
