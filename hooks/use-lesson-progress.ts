"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "typing-app:completed-lessons";
const CHANGE_EVENT = "typing-app:progress-changed";

function readRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getServerSnapshot() {
  return "[]";
}

/** Synchronous read for lazy useState initializers (this app has no server-rendered routes). */
export function getCompletedLessons(): Set<string> {
  try {
    return new Set(JSON.parse(readRaw()) as string[]);
  } catch {
    return new Set<string>();
  }
}

export function useLessonProgress() {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  const completed = useMemo(() => {
    try {
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const complete = useCallback((id: string) => {
    const current = new Set(JSON.parse(readRaw()) as string[]);
    if (current.has(id)) return;
    current.add(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const resetProgress = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { completed, complete, resetProgress, loaded: true };
}
