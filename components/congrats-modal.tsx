"use client";

import { useRef } from "react";
import { PartyPopper } from "lucide-react";

import { Lesson } from "@/lib/lessons";
import { LanguageCode, lessonTitle } from "@/lib/languages";
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
  language?: LanguageCode;
};

export function CongratsModal({ lesson, nextLesson, open, onOpenChange, onNextLesson, language = "en" }: Props) {
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const title = lessonTitle(lesson.id, lesson.title, language);
  const nextTitle = nextLesson ? lessonTitle(nextLesson.id, nextLesson.title, language) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
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
          <DialogTitle>Lesson complete!</DialogTitle>
          <DialogDescription>
            {nextLesson
              ? `You typed "${title}" with zero errors. Ready for the next lesson?`
              : `You typed "${title}" with zero errors. You've finished every lesson!`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {nextLesson ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Stay here
              </Button>
              <Button ref={nextButtonRef} onClick={onNextLesson}>
                Next lesson: {nextTitle}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Nice!</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
