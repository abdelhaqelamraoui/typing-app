"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hand, Keyboard, Lock, RotateCcw } from "lucide-react";

import { Lesson, generateDrillText } from "@/lib/lessons";
import { KeyboardLayout, LAM_ALEF_LIGATURE, LanguageCode, isRtl, lessonHint, lessonTitle } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { typewriterSound } from "@/lib/typewriter-sound";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { VirtualKeyboard } from "@/components/virtual-keyboard";

type Props = {
  lesson: Lesson;
  locked: boolean;
  listening: boolean;
  onComplete: (lessonId: string) => void;
  onPass: (accuracy: number) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onShowHandGuide: () => void;
  language: LanguageCode;
  layout: KeyboardLayout;
  /** Minimum accuracy (%) a finished drill needs to count as passed. */
  passThreshold: number;
};

const INTERACTIVE_SELECTOR = 'button, a[href], input, textarea, select, [role="slider"]';
const TEXT_INPUT_SELECTOR = 'input, textarea, select, [role="slider"]';

function accuracyPct(keystrokes: number, errors: number): number {
  return keystrokes > 0 ? Math.round(((keystrokes - errors) / keystrokes) * 100) : 100;
}

export function TypingTrainer({
  lesson,
  locked,
  listening,
  onComplete,
  onPass,
  showKeyboard,
  onToggleKeyboard,
  fontSize,
  onFontSizeChange,
  onShowHandGuide,
  language,
  layout,
  passThreshold,
}: Props) {
  const t = STRINGS[language];
  const [text, setText] = useState(() => generateDrillText(lesson.keys, language, layout));
  const [typedIndex, setTypedIndex] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [flash, setFlash] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorCountRef = useRef(0);
  const keystrokesRef = useRef(0);

  const reset = useCallback(() => {
    setText(generateDrillText(lesson.keys, language, layout));
    setTypedIndex(0);
    setErrorCount(0);
    setKeystrokes(0);
    setStartTime(null);
    setFinished(false);
    setPassed(false);
    setElapsedMs(0);
    errorCountRef.current = 0;
    keystrokesRef.current = 0;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [lesson, language, layout]);

  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => setElapsedMs(Date.now() - startTime), 200);
    return () => clearInterval(id);
  }, [startTime, finished]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (locked || finished || !listening) return;
      if (e.key.length !== 1 && e.key !== LAM_ALEF_LIGATURE) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest(TEXT_INPUT_SELECTOR)) return;
      if (e.target instanceof HTMLElement) e.target.blur();
      e.preventDefault();

      if (startTime === null) setStartTime(Date.now());
      keystrokesRef.current += 1;
      setKeystrokes(keystrokesRef.current);

      if (text.startsWith(e.key, typedIndex)) {
        if (e.key === " ") typewriterSound.space();
        else typewriterSound.key();

        const nextIndex = typedIndex + e.key.length;
        setTypedIndex(nextIndex);

        if (nextIndex === text.length) {
          setFinished(true);
          const accuracy = accuracyPct(keystrokesRef.current, errorCountRef.current);
          if (accuracy >= passThreshold) {
            setPassed(true);
            typewriterSound.success();
            onComplete(lesson.id);
            onPass(accuracy);
          } else {
            typewriterSound.bell();
          }
        }
      } else {
        typewriterSound.error();
        errorCountRef.current += 1;
        setErrorCount((n) => n + 1);
        setFlash(true);
        if (flashTimeout.current) clearTimeout(flashTimeout.current);
        flashTimeout.current = setTimeout(() => setFlash(false), 300);
      }
    },
    [locked, finished, listening, startTime, text, typedIndex, passThreshold, onComplete, onPass, lesson.id]
  );

  useEffect(() => {
    if (locked || finished || !listening) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [locked, finished, listening, handleKey]);

  useEffect(() => {
    if (locked || !finished || passed || !listening) return;
    const handleRetryKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (e.target instanceof HTMLElement && e.target.closest(INTERACTIVE_SELECTOR)) return;
      e.preventDefault();
      reset();
    };
    window.addEventListener("keydown", handleRetryKey);
    return () => window.removeEventListener("keydown", handleRetryKey);
  }, [locked, finished, passed, listening, reset]);

  const stats = useMemo(() => {
    const minutes = elapsedMs / 60000;
    const wpm = minutes > 0 ? Math.round(typedIndex / 5 / minutes) : 0;
    return { wpm, accuracy: accuracyPct(keystrokes, errorCount) };
  }, [elapsedMs, typedIndex, keystrokes, errorCount]);

  const progressPct = Math.round((typedIndex / text.length) * 100);

  if (locked) {
    return (
      <Card className="flex min-h-80 items-center justify-center">
        <CardContent className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <Lock className="size-8" />
          <p className="font-heading text-base text-foreground">{t.lessonLocked}</p>
          <p className="text-sm">{t.lessonLockedDesc(passThreshold)}</p>
        </CardContent>
      </Card>
    );
  }

  const nextGlyph = finished
    ? null
    : text.startsWith(LAM_ALEF_LIGATURE, typedIndex)
      ? LAM_ALEF_LIGATURE
      : (text[typedIndex] ?? null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{lessonTitle(lesson, language, layout)}</CardTitle>
            <CardDescription>{lessonHint(lesson, language, layout)}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>
                {stats.wpm} {t.wpm}
              </span>
              <span>
                {stats.accuracy}% {t.acc}
              </span>
              <span>
                {errorCount} {t.errors}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t.fontSizeSmall}</span>
              <Slider
                value={[fontSize]}
                min={16}
                max={36}
                step={2}
                onValueChange={([v]) => onFontSizeChange(v)}
                aria-label={t.fontSize}
                className="w-24"
              />
              <span className="text-base text-muted-foreground">{t.fontSizeLarge}</span>
            </div>
            <Button size="icon-sm" variant="outline" aria-label={t.showHandGuide} onClick={onShowHandGuide}>
              <Hand />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label={t.toggleKeyboard} onClick={onToggleKeyboard}>
              <Keyboard />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progressPct} />

        <div
          ref={containerRef}
          dir={isRtl(language) ? "rtl" : "ltr"}
          style={{ fontSize: `${fontSize}px` }}
          className={cn(
            "break-all rounded-lg border bg-muted/30 p-5 leading-relaxed transition-colors",
            language === "ar" ? "font-sans" : "font-mono tracking-wide"
          )}
        >
          {text.split("").map((char, i) => {
            let cls = "text-muted-foreground";
            if (i < typedIndex) cls = "text-emerald-600 dark:text-emerald-400";
            else if (i === typedIndex) {
              cls = flash
                ? "bg-destructive/20 text-destructive dark:text-red-400"
                : "bg-primary/20 text-foreground";
            }
            return (
              <span key={i} className={cls}>
                {char}
              </span>
            );
          })}
        </div>

        {!finished && typedIndex === 0 && <p className="text-sm text-muted-foreground">{t.justStart}</p>}

        {finished && (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              {passed ? (
                <Badge>{errorCount === 0 ? t.perfectRun : t.passedBadge(stats.accuracy)}</Badge>
              ) : (
                <Badge variant="destructive">{t.failedBadge(stats.accuracy, passThreshold)}</Badge>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw />
              {t.retry}
            </Button>
          </div>
        )}

        {!finished && (
          <div>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw />
              {t.newDrill}
            </Button>
          </div>
        )}

        {showKeyboard && <VirtualKeyboard nextKey={nextGlyph} language={language} layout={layout} />}
      </CardContent>
    </Card>
  );
}
