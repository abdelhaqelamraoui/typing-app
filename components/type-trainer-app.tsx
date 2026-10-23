"use client";

import { useEffect, useMemo, useState } from "react";
import { Keyboard, Settings } from "lucide-react";
import { Direction } from "radix-ui";

import { LESSONS } from "@/lib/lessons";
import { KeyboardLayout, LanguageCode, isRtl } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { getCompletedLessons, useLessonProgress } from "@/hooks/use-lesson-progress";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { LessonList } from "@/components/lesson-list";
import { TypingTrainer } from "@/components/typing-trainer";
import { ThemeToggle } from "@/components/theme-toggle";
import { SoundToggle } from "@/components/sound-toggle";
import { LanguageSelect } from "@/components/language-select";
import { HandGuideModal } from "@/components/hand-guide-modal";
import { CongratsModal } from "@/components/congrats-modal";
import { DEFAULT_PASS_THRESHOLD, SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function initialLessonId(language: LanguageCode): string {
  const completed = getCompletedLessons(language);
  const firstIncomplete = LESSONS.find((l) => !completed.has(l.id));
  return firstIncomplete ? firstIncomplete.id : LESSONS[LESSONS.length - 1].id;
}

export function TypeTrainerApp() {
  const [language, setLanguage] = usePersistentState<LanguageCode>("typing-app:language", "en");
  const [selectedId, setSelectedId] = useState(() => initialLessonId(language));
  const [showKeyboard, setShowKeyboard] = usePersistentState("typing-app:show-keyboard", true);
  const [fontSize, setFontSize] = usePersistentState("typing-app:font-size", 20);
  const [layout, setLayout] = usePersistentState<KeyboardLayout>("typing-app:keyboard-layout", "qwerty");
  const [passThreshold, setPassThreshold] = usePersistentState(
    "typing-app:pass-threshold",
    DEFAULT_PASS_THRESHOLD
  );
  const [handGuideOpen, setHandGuideOpen] = useState(true);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lastAccuracy, setLastAccuracy] = useState(100);
  const { completed, complete } = useLessonProgress(language);
  const t = STRINGS[language];
  const dir = isRtl(language) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const selectedIndex = LESSONS.findIndex((l) => l.id === selectedId);
  const lesson = LESSONS[selectedIndex];
  const nextLesson = LESSONS[selectedIndex + 1] ?? null;
  const isLocked = selectedIndex > 0 && !completed.has(LESSONS[selectedIndex - 1].id);
  const isModalOpen = (handGuideOpen && !isLocked) || congratsOpen || settingsOpen;

  const handleSelectLesson = (id: string) => {
    setSelectedId(id);
    setHandGuideOpen(true);
  };

  const handleLanguageChange = (next: LanguageCode) => {
    setLanguage(next);
    setSelectedId(initialLessonId(next));
    setHandGuideOpen(true);
  };

  const handleNextLesson = () => {
    if (!nextLesson) return;
    setCongratsOpen(false);
    handleSelectLesson(nextLesson.id);
  };

  const handlePass = (accuracy: number) => {
    setLastAccuracy(accuracy);
    setCongratsOpen(true);
  };

  const progressPct = useMemo(
    () => Math.round((completed.size / LESSONS.length) * 100),
    [completed]
  );

  return (
    <Direction.Provider dir={dir}>
      <div dir={dir} className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 md:h-dvh md:flex-none md:overflow-hidden">
        <header className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Keyboard className="size-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold">{t.appTitle}</h1>
            <p className="text-base text-muted-foreground">{t.appTagline}</p>
          </div>
          <div className="ms-auto flex items-center gap-4">
            <div className="w-40">
              <div className="mb-1 text-end text-xs text-muted-foreground">
                {t.lessonsProgress(completed.size, LESSONS.length)}
              </div>
              <Progress value={progressPct} />
            </div>
            <LanguageSelect value={language} onChange={handleLanguageChange} />
            <Button variant="outline" size="icon" aria-label={t.openSettings} onClick={() => setSettingsOpen(true)}>
              <Settings />
            </Button>
            <SoundToggle language={language} />
            <ThemeToggle language={language} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:min-h-0 md:flex-1 md:grid-cols-[240px_1fr] md:grid-rows-[minmax(0,1fr)]">
          <aside className="md:min-h-0 md:overflow-y-auto md:pe-1">
            <LessonList
              lessons={LESSONS}
              selectedId={selectedId}
              completed={completed}
              onSelect={handleSelectLesson}
              language={language}
              layout={layout}
            />
          </aside>

          <main className="md:min-h-0 md:overflow-y-auto">
            <TypingTrainer
              key={`${lesson.id}-${language}-${layout}`}
              lesson={lesson}
              locked={isLocked}
              listening={!isModalOpen}
              onComplete={complete}
              onPass={handlePass}
              showKeyboard={showKeyboard}
              onToggleKeyboard={() => setShowKeyboard((v) => !v)}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              onShowHandGuide={() => setHandGuideOpen(true)}
              language={language}
              layout={layout}
              passThreshold={passThreshold}
            />
          </main>
        </div>

        <HandGuideModal
          lesson={lesson}
          open={handGuideOpen && !isLocked}
          onOpenChange={setHandGuideOpen}
          language={language}
          layout={layout}
        />
        <CongratsModal
          lesson={lesson}
          nextLesson={nextLesson}
          open={congratsOpen}
          onOpenChange={setCongratsOpen}
          onNextLesson={handleNextLesson}
          accuracy={lastAccuracy}
          language={language}
          layout={layout}
        />
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          language={language}
          layout={layout}
          onLayoutChange={setLayout}
          passThreshold={passThreshold}
          onPassThresholdChange={setPassThreshold}
        />
      </div>
    </Direction.Provider>
  );
}
