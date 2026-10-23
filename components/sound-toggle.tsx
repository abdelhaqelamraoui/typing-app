"use client";

import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { usePersistentState } from "@/hooks/use-persistent-state";
import { typewriterSound } from "@/lib/typewriter-sound";
import { LanguageCode } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SoundToggle({ language = "en" }: { language?: LanguageCode }) {
  const t = STRINGS[language];
  const [soundEnabled, setSoundEnabled] = usePersistentState("typing-app:sound-enabled", true);

  useEffect(() => {
    typewriterSound.setMuted(!soundEnabled);
  }, [soundEnabled]);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={soundEnabled ? t.muteSound : t.unmuteSound}
      onClick={() => setSoundEnabled((v) => !v)}
    >
      {soundEnabled ? <Volume2 /> : <VolumeX />}
    </Button>
  );
}
