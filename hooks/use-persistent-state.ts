"use client";

import { useCallback, useState } from "react";

/**
 * Client-only localStorage-backed state. Safe to lazy-init from localStorage
 * directly since callers of this hook only ever render on the client
 * (this app has no server-rendered routes).
 */
export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update] as const;
}
