"use client";

import { useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { usePersistentState } from "@/hooks/use-persistent-state";
import { typewriterSound } from "@/lib/typewriter-sound";
import { Button } from "@/components/ui/button";

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = usePersistentState("typing-app:sound-enabled", true);

  useEffect(() => {
    typewriterSound.setMuted(!soundEnabled);
  }, [soundEnabled]);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={soundEnabled ? "Mute typing sound" : "Unmute typing sound"}
      onClick={() => setSoundEnabled((v) => !v)}
    >
      {soundEnabled ? <Volume2 /> : <VolumeX />}
    </Button>
  );
}
