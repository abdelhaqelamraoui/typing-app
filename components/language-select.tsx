"use client";

import { Languages } from "lucide-react";

import { LANGUAGES, LanguageCode } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
};

export function LanguageSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LanguageCode)}>
      <SelectTrigger aria-label={STRINGS[value].changeLanguage}>
        <Languages className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
