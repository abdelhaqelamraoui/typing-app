"use client";

import { useMemo, useState } from "react";
import { Keyboard } from "lucide-react";

import { LESSONS } from "@/lib/lessons";
import { getCompletedLessons, useLessonProgress } from "@/hooks/use-lesson-progress";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { LessonList } from "@/components/lesson-list";
import { TypingTrainer } from "@/components/typing-trainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { SoundToggle } from "@/components/sound-toggle";
import { HandGuideModal } from "@/components/hand-guide-modal";
import { CongratsModal } from "@/components/congrats-modal";
import { Progress } from "@/components/ui/progress";

function initialLessonId(): string {
  const completed = getCompletedLessons();
  const firstIncomplete = LESSONS.find((l) => !completed.has(l.id));
  return firstIncomplete ? firstIncomplete.id : LESSONS[LESSONS.length - 1].id;
}

export function TypeTrainerApp() {
  const [selectedId, setSelectedId] = useState(initialLessonId);
  const [showKeyboard, setShowKeyboard] = usePersistentState("typing-app:show-keyboard", true);
  const [fontSize, setFontSize] = usePersistentState("typing-app:font-size", 20);
  const [handGuideOpen, setHandGuideOpen] = useState(true);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const { completed, complete } = useLessonProgress();

  const selectedIndex = LESSONS.findIndex((l) => l.id === selectedId);
  const lesson = LESSONS[selectedIndex];
  const nextLesson = LESSONS[selectedIndex + 1] ?? null;
  const isLocked = selectedIndex > 0 && !completed.has(LESSONS[selectedIndex - 1].id);
  const isModalOpen = (handGuideOpen && !isLocked) || congratsOpen;

  const handleSelectLesson = (id: string) => {
    setSelectedId(id);
    setHandGuideOpen(true);
  };

  const handleNextLesson = () => {
    if (!nextLesson) return;
    setCongratsOpen(false);
    handleSelectLesson(nextLesson.id);
  };

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
          <SoundToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside className="md:sticky md:top-6 md:self-start">
          <LessonList
            lessons={LESSONS}
            selectedId={selectedId}
            completed={completed}
            onSelect={handleSelectLesson}
          />
        </aside>

        <main>
          <TypingTrainer
            key={lesson.id}
            lesson={lesson}
            locked={isLocked}
            listening={!isModalOpen}
            onComplete={complete}
            onPerfectFinish={() => setCongratsOpen(true)}
            showKeyboard={showKeyboard}
            onToggleKeyboard={() => setShowKeyboard((v) => !v)}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            onShowHandGuide={() => setHandGuideOpen(true)}
          />
        </main>
      </div>

      <HandGuideModal lesson={lesson} open={handGuideOpen && !isLocked} onOpenChange={setHandGuideOpen} />
      <CongratsModal
        lesson={lesson}
        nextLesson={nextLesson}
        open={congratsOpen}
        onOpenChange={setCongratsOpen}
        onNextLesson={handleNextLesson}
      />
    </div>
  );
}
