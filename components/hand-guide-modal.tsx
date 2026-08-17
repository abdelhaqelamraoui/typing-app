"use client";

import { useMemo } from "react";

import { Lesson } from "@/lib/lessons";
import { FINGER_COLOR, FINGER_LABEL, KEY_FINGER, reachDescription } from "@/lib/fingers";
import { LanguageCode, glyphFor, lessonTitle } from "@/lib/languages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HandPositionGuide } from "@/components/hand-position-guide";

const HOME_ROW_KEYS = ["a", "s", "d", "f", "j", "k", "l", ";"];

type Props = {
  lesson: Lesson;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: LanguageCode;
};

export function HandGuideModal({ lesson, open, onOpenChange, language = "en" }: Props) {
  const uniqueKeys = useMemo(() => Array.from(new Set(lesson.keys)), [lesson]);
  const homeRowGlyphs = useMemo(
    () => HOME_ROW_KEYS.map((key) => glyphFor(language, key)).join(" "),
    [language]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Finger positions - {lessonTitle(lesson, language)}</DialogTitle>
          <DialogDescription>
            Rest your fingers on the home row ({homeRowGlyphs}) and reach out only for the highlighted keys below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          <div className="shrink-0">
            <HandPositionGuide lesson={lesson} language={language} />
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
                    {key === " " ? "␣" : glyphFor(language, key)}
                  </span>
                  <span className="text-muted-foreground">
                    {FINGER_LABEL[finger]} - {reachDescription(key)}
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
