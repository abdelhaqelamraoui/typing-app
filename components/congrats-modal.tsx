"use client";

import { useRef } from "react";
import { PartyPopper } from "lucide-react";

import { Lesson } from "@/lib/lessons";
import { KeyboardLayout, LanguageCode, lessonTitle } from "@/lib/languages";
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

type Props = {
  lesson: Lesson;
  nextLesson: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNextLesson: () => void;
  accuracy: number;
  language?: LanguageCode;
  layout?: KeyboardLayout;
};

export function CongratsModal({
  lesson,
  nextLesson,
  open,
  onOpenChange,
  onNextLesson,
  accuracy,
  language = "en",
  layout = "qwerty",
}: Props) {
  const t = STRINGS[language];
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const title = lessonTitle(lesson, language, layout);
  const nextTitle = nextLesson ? lessonTitle(nextLesson, language, layout) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={t.close}
        className="max-w-sm"
        onOpenAutoFocus={(e) => {
          if (!nextLesson) return;
          e.preventDefault();
          nextButtonRef.current?.focus();
        }}
      >
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <PartyPopper className="size-5" />
          </div>
          <DialogTitle>{t.lessonComplete}</DialogTitle>
          <DialogDescription>{t.lessonCompleteDesc(title, accuracy, !!nextLesson)}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {nextLesson ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t.stayHere}
              </Button>
              <Button ref={nextButtonRef} onClick={onNextLesson}>
                {t.nextLesson(nextTitle ?? "")}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>{t.nice}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
