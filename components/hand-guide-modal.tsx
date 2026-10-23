"use client";

import { useMemo } from "react";

import { Lesson } from "@/lib/lessons";
import { FINGER_COLOR, KEY_FINGER, KEY_ROW_OFFSET } from "@/lib/fingers";
import { KeyboardLayout, LanguageCode, glyphFor, lessonTitle } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
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
  layout?: KeyboardLayout;
};

export function HandGuideModal({ lesson, open, onOpenChange, language = "en", layout = "qwerty" }: Props) {
  const t = STRINGS[language];
  const uniqueKeys = useMemo(() => Array.from(new Set(lesson.keys)), [lesson]);
  const homeRowGlyphs = useMemo(
    () => HOME_ROW_KEYS.map((key) => glyphFor(language, key, layout)).join(" "),
    [language, layout]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t.close} className="flex max-h-[85vh] max-w-4xl flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t.handGuideTitle(lessonTitle(lesson, language, layout))}</DialogTitle>
          <DialogDescription>{t.handGuideDesc(homeRowGlyphs)}</DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pe-1">
          <div className="shrink-0">
            <HandPositionGuide lesson={lesson} language={language} layout={layout} />
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
                    {key === " " ? "␣" : glyphFor(language, key, layout)}
                  </span>
                  <span className="text-muted-foreground">
                    {t.fingerLabel[finger]} - {t.reachDescription(KEY_ROW_OFFSET[key] ?? 0, key === " ")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t.gotIt}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
