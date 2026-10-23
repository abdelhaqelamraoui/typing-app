"use client";

import { KEYBOARD_LAYOUTS, KeyboardLayout, LanguageCode } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const MIN_PASS_THRESHOLD = 50;
export const DEFAULT_PASS_THRESHOLD = 90;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: LanguageCode;
  layout: KeyboardLayout;
  onLayoutChange: (layout: KeyboardLayout) => void;
  passThreshold: number;
  onPassThresholdChange: (threshold: number) => void;
};

export function SettingsDialog({
  open,
  onOpenChange,
  language,
  layout,
  onLayoutChange,
  passThreshold,
  onPassThresholdChange,
}: Props) {
  const t = STRINGS[language];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t.close} className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.settingsTitle}</DialogTitle>
          <DialogDescription>{t.settingsDesc}</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-2">
          <div>
            <h3 className="font-medium">{t.keyboardLayout}</h3>
            <p className="text-muted-foreground">{t.keyboardLayoutDesc}</p>
          </div>
          <div role="radiogroup" aria-label={t.keyboardLayout} className="grid grid-cols-2 gap-2">
            {KEYBOARD_LAYOUTS.map((option) => (
              <Button
                key={option.code}
                role="radio"
                aria-checked={layout === option.code}
                variant={layout === option.code ? "default" : "outline"}
                onClick={() => onLayoutChange(option.code)}
                className="font-mono"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-medium">{t.passThreshold}</h3>
            <span className="font-mono text-base font-semibold tabular-nums">{passThreshold}%</span>
          </div>
          <p className="text-muted-foreground">{t.passThresholdDesc}</p>
          <Slider
            value={[passThreshold]}
            min={MIN_PASS_THRESHOLD}
            max={100}
            step={1}
            onValueChange={([v]) => onPassThresholdChange(v)}
            aria-label={t.passThreshold}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{MIN_PASS_THRESHOLD}%</span>
            <span>100%</span>
          </div>
        </section>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t.done}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
