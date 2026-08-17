"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { LanguageCode } from "@/lib/languages";

const STORAGE_PREFIX = "typing-app:completed-lessons";
const CHANGE_EVENT_PREFIX = "typing-app:progress-changed";

function storageKey(language: LanguageCode): string {
  return `${STORAGE_PREFIX}:${language}`;
}

function changeEvent(language: LanguageCode): string {
  return `${CHANGE_EVENT_PREFIX}:${language}`;
}

function readRaw(language: LanguageCode): string {
  try {
    return window.localStorage.getItem(storageKey(language)) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

/** Synchronous read for lazy useState initializers (this app has no server-rendered routes). */
export function getCompletedLessons(language: LanguageCode = "en"): Set<string> {
  try {
    return new Set(JSON.parse(readRaw(language)) as string[]);
  } catch {
    return new Set<string>();
  }
}

export function useLessonProgress(language: LanguageCode = "en") {
  const subscribe = useCallback(
    (callback: () => void) => {
      window.addEventListener("storage", callback);
      window.addEventListener(changeEvent(language), callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(changeEvent(language), callback);
      };
    },
    [language]
  );
  const getSnapshot = useCallback(() => readRaw(language), [language]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completed = useMemo(() => {
    try {
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const complete = useCallback(
    (id: string) => {
      const current = new Set(JSON.parse(readRaw(language)) as string[]);
      if (current.has(id)) return;
      current.add(id);
      try {
        window.localStorage.setItem(storageKey(language), JSON.stringify([...current]));
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event(changeEvent(language)));
    },
    [language]
  );

  const resetProgress = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey(language));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(changeEvent(language)));
  }, [language]);

  return { completed, complete, resetProgress, loaded: true };
}
