"use client";

import { Check, Lock } from "lucide-react";

import { Lesson } from "@/lib/lessons";
import { KeyboardLayout, LanguageCode, lessonTitle } from "@/lib/languages";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  lessons: Lesson[];
  selectedId: string;
  completed: Set<string>;
  onSelect: (id: string) => void;
  language?: LanguageCode;
  layout?: KeyboardLayout;
};

export function LessonList({ lessons, selectedId, completed, onSelect, language = "en", layout = "qwerty" }: Props) {
  return (
    <nav className="flex flex-col gap-1">
      {lessons.map((lesson, i) => {
        const isDone = completed.has(lesson.id);
        const isLocked = i > 0 && !completed.has(lessons[i - 1].id);
        const isSelected = lesson.id === selectedId;

        return (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson.id)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2 text-start text-sm transition-colors",
              isSelected ? "border-border bg-muted" : "hover:bg-muted/50",
              isLocked && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 text-xs text-muted-foreground">{i + 1}</span>
              <span>{lessonTitle(lesson, language, layout)}</span>
            </span>
            {isDone ? (
              <Badge className="bg-emerald-600 text-white dark:bg-emerald-500">
                <Check />
              </Badge>
            ) : isLocked ? (
              <Lock className="size-3.5 text-muted-foreground" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
