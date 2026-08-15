"use client";

import { useMemo, useState } from "react";
import { Keyboard } from "lucide-react";

import { LESSONS } from "@/lib/lessons";
import { useLessonProgress } from "@/hooks/use-lesson-progress";
import { LessonList } from "@/components/lesson-list";
import { TypingTrainer } from "@/components/typing-trainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";

export function TypeTrainerApp() {
  const [selectedId, setSelectedId] = useState(LESSONS[0].id);
  const { completed, complete } = useLessonProgress();

  const selectedIndex = LESSONS.findIndex((l) => l.id === selectedId);
  const lesson = LESSONS[selectedIndex];
  const isLocked = selectedIndex > 0 && !completed.has(LESSONS[selectedIndex - 1].id);

  const progressPct = useMemo(
    () => Math.round((completed.size / LESSONS.length) * 100),
    [completed]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
      <header className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Keyboard className="size-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold">Type Trainer</h1>
          <p className="text-base text-muted-foreground">Learn to touch-type, one lesson at a time.</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="w-40">
            <div className="mb-1 text-right text-xs text-muted-foreground">
              {completed.size}/{LESSONS.length} lessons
            </div>
            <Progress value={progressPct} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <LessonList
            lessons={LESSONS}
            selectedId={selectedId}
            completed={completed}
            onSelect={setSelectedId}
          />
        </aside>

        <main>
          <TypingTrainer key={lesson.id} lesson={lesson} locked={isLocked} onComplete={complete} />
        </main>
      </div>
    </div>
  );
}
