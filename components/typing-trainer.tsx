"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hand, Keyboard, Lock, RotateCcw } from "lucide-react";

import { Lesson, generateDrillText } from "@/lib/lessons";
import { typewriterSound } from "@/lib/typewriter-sound";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { VirtualKeyboard } from "@/components/virtual-keyboard";

type Props = {
  lesson: Lesson;
  locked: boolean;
  onComplete: (lessonId: string) => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onShowHandGuide: () => void;
};

export function TypingTrainer({
  lesson,
  locked,
  onComplete,
  showKeyboard,
  onToggleKeyboard,
  fontSize,
  onFontSizeChange,
  onShowHandGuide,
}: Props) {
  const [text, setText] = useState(() => generateDrillText(lesson.keys));
  const [typedIndex, setTypedIndex] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorCountRef = useRef(0);

  const reset = useCallback(() => {
    setText(generateDrillText(lesson.keys));
    setTypedIndex(0);
    setErrorCount(0);
    setKeystrokes(0);
    setStartTime(null);
    setFinished(false);
    setElapsedMs(0);
    errorCountRef.current = 0;
  }, [lesson]);

  useEffect(() => {
    if (!locked) containerRef.current?.focus();
  }, [locked, lesson]);

  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => setElapsedMs(Date.now() - startTime), 200);
    return () => clearInterval(id);
  }, [startTime, finished]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (locked || finished) return;
      if (e.key.length !== 1) return;
      e.preventDefault();

      if (startTime === null) setStartTime(Date.now());
      setKeystrokes((k) => k + 1);

      const expected = text[typedIndex];
      if (e.key === expected) {
        if (expected === " ") typewriterSound.space();
        else typewriterSound.key();

        const nextIndex = typedIndex + 1;
        setTypedIndex(nextIndex);

        if (nextIndex === text.length) {
          setFinished(true);
          typewriterSound.bell();
          if (errorCountRef.current === 0) onComplete(lesson.id);
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
    [locked, finished, startTime, text, typedIndex, onComplete, lesson.id]
  );

  const stats = useMemo(() => {
    const minutes = elapsedMs / 60000;
    const wpm = minutes > 0 ? Math.round(typedIndex / 5 / minutes) : 0;
    const accuracy = keystrokes > 0 ? Math.round(((keystrokes - errorCount) / keystrokes) * 100) : 100;
    return { wpm, accuracy };
  }, [elapsedMs, typedIndex, keystrokes, errorCount]);

  const progressPct = Math.round((typedIndex / text.length) * 100);
  const perfect = finished && errorCount === 0;

  if (locked) {
    return (
      <Card className="flex min-h-80 items-center justify-center">
        <CardContent className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <Lock className="size-8" />
          <p className="font-heading text-base text-foreground">Lesson locked</p>
          <p className="text-sm">Finish the previous lesson with zero errors to unlock this one.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.hint}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{stats.wpm} wpm</span>
              <span>{stats.accuracy}% acc</span>
              <span>{errorCount} errors</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">A</span>
              <Slider
                value={[fontSize]}
                min={16}
                max={36}
                step={2}
                onValueChange={([v]) => onFontSizeChange(v)}
                className="w-24"
              />
              <span className="text-base text-muted-foreground">A</span>
            </div>
            <Button size="icon-sm" variant="outline" aria-label="Show finger position guide" onClick={onShowHandGuide}>
              <Hand />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Toggle on-screen keyboard" onClick={onToggleKeyboard}>
              <Keyboard />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progressPct} />

        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{ fontSize: `${fontSize}px` }}
          className="break-all rounded-lg border bg-muted/30 p-5 font-mono leading-relaxed tracking-wide outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
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

        {!finished && (
          <p className="text-sm text-muted-foreground">Click the box above and start typing.</p>
        )}

        {finished && (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              {perfect ? (
                <Badge>Perfect run — next lesson unlocked</Badge>
              ) : (
                <Badge variant="destructive">
                  {errorCount} error{errorCount === 1 ? "" : "s"} — type with zero errors to unlock the next lesson
                </Badge>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw />
              Retry
            </Button>
          </div>
        )}

        {!finished && (
          <div>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw />
              New drill
            </Button>
          </div>
        )}

        {showKeyboard && <VirtualKeyboard nextKey={finished ? null : text[typedIndex]} />}
      </CardContent>
    </Card>
  );
}
