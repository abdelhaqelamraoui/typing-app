"use client";

import { KEYBOARD_LAYOUTS, KeyboardLayout, LanguageCode, latinLegend } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PREVIEW_KEYS = ["q", "w", "e", "r", "t", "y"];

type Props = {
  open: boolean;
  language: LanguageCode;
  onChoose: (layout: KeyboardLayout) => void;
};

/** First-run prompt; it can only be closed by picking a layout, so the choice always gets saved. */
export function LayoutPickerDialog({ open, language, onChoose }: Props) {
  const t = STRINGS[language];

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{t.layoutPickerTitle}</DialogTitle>
          <DialogDescription>{t.layoutPickerDesc}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          {KEYBOARD_LAYOUTS.map((option) => (
            <button
              key={option.code}
              onClick={() => onChoose(option.code)}
              className="flex flex-col items-center gap-3 rounded-lg border bg-background p-4 transition-colors hover:border-primary hover:bg-muted/50 focus-visible:border-primary focus-visible:outline-none"
            >
              {/* The keys are a physical row, so they stay left-to-right in RTL locales. */}
              <div dir="ltr" className="flex gap-1">
                {PREVIEW_KEYS.map((key) => (
                  <span
                    key={key}
                    className="flex size-7 items-center justify-center rounded-[6px] border bg-muted/40 font-mono text-xs font-medium shadow-sm"
                  >
                    {latinLegend(key, option.code)}
                  </span>
                ))}
              </div>
              <span className="font-mono text-sm font-semibold">{option.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{t.layoutPickerHint}</p>
      </DialogContent>
    </Dialog>
  );
}
