type KeyDef = {
  label: string;
  char?: string;
  weight?: number;
  sub?: string;
};

const FN_ROW: KeyDef[] = [
  { label: "esc" },
  { label: "F1" },
  { label: "F2" },
  { label: "F3" },
  { label: "F4" },
  { label: "F5" },
  { label: "F6" },
  { label: "F7" },
  { label: "F8" },
  { label: "F9" },
  { label: "F10" },
  { label: "F11" },
  { label: "F12" },
];

const NUMBER_ROW: KeyDef[] = [
  { label: "`", sub: "~" },
  { label: "1", char: "1" },
  { label: "2", char: "2" },
  { label: "3", char: "3" },
  { label: "4", char: "4" },
  { label: "5", char: "5" },
  { label: "6", char: "6" },
  { label: "7", char: "7" },
  { label: "8", char: "8" },
  { label: "9", char: "9" },
  { label: "0", char: "0" },
  { label: "-" },
  { label: "=" },
  { label: "delete", weight: 1.6 },
];

const QWERTY_ROW: KeyDef[] = [
  { label: "tab", weight: 1.5 },
  { label: "Q", char: "q" },
  { label: "W", char: "w" },
  { label: "E", char: "e" },
  { label: "R", char: "r" },
  { label: "T", char: "t" },
  { label: "Y", char: "y" },
  { label: "U", char: "u" },
  { label: "I", char: "i" },
  { label: "O", char: "o" },
  { label: "P", char: "p" },
  { label: "[" },
  { label: "]" },
  { label: "\\", weight: 1.4 },
];

const HOME_ROW: KeyDef[] = [
  { label: "caps lock", weight: 1.75 },
  { label: "A", char: "a" },
  { label: "S", char: "s" },
  { label: "D", char: "d" },
  { label: "F", char: "f" },
  { label: "G", char: "g" },
  { label: "H", char: "h" },
  { label: "J", char: "j" },
  { label: "K", char: "k" },
  { label: "L", char: "l" },
  { label: ";", char: ";" },
  { label: "'" },
  { label: "return", weight: 2.2 },
];

const BOTTOM_LETTER_ROW: KeyDef[] = [
  { label: "shift", weight: 2.3 },
  { label: "Z", char: "z" },
  { label: "X", char: "x" },
  { label: "C", char: "c" },
  { label: "V", char: "v" },
  { label: "B", char: "b" },
  { label: "N", char: "n" },
  { label: "M", char: "m" },
  { label: ",", char: "," },
  { label: ".", char: "." },
  { label: "/", char: "/" },
  { label: "shift", weight: 2.3 },
];

const KEY_BASE =
  "flex min-w-0 select-none items-center justify-center gap-0.5 rounded-[7px] border font-sans transition-all duration-150";
const KEY_INACTIVE = "border-border bg-background text-foreground shadow-sm";
const KEY_ACTIVE = "scale-[1.04] border-emerald-400 bg-emerald-500 text-white dark:bg-emerald-400 dark:text-neutral-900";

function Key({ def, active }: { def: KeyDef; active: boolean }) {
  return (
    <div
      style={{ flexGrow: def.weight ?? 1, flexBasis: 0 }}
      className={`${KEY_BASE} h-9 text-sm font-medium ${active ? KEY_ACTIVE : KEY_INACTIVE}`}
    >
      {def.sub && <span className="text-[10px] leading-none opacity-70">{def.sub}</span>}
      <span className="leading-none">{def.label}</span>
    </div>
  );
}

function Row({
  keys,
  nextKey,
  activeKeys,
}: {
  keys: KeyDef[];
  nextKey: string | null;
  activeKeys?: Set<string>;
}) {
  return (
    <div className="flex w-full gap-1">
      {keys.map((k, i) => (
        <Key
          key={`${k.label}-${i}`}
          def={k}
          active={!!k.char && (k.char === nextKey || !!activeKeys?.has(k.char))}
        />
      ))}
    </div>
  );
}

function ModKey({ label, weight = 1 }: { label: string; weight?: number }) {
  return (
    <div
      style={{ flexGrow: weight, flexBasis: 0 }}
      className={`${KEY_BASE} h-9 text-xs font-medium ${KEY_INACTIVE}`}
    >
      {label}
    </div>
  );
}

type Props = {
  nextKey: string | null;
  activeKeys?: Set<string>;
};

export function VirtualKeyboard({ nextKey, activeKeys }: Props) {
  const spaceActive = nextKey === " " || !!activeKeys?.has(" ");

  return (
    <div className="w-full rounded-2xl border bg-muted/40 p-3 shadow-inner sm:p-4">
      <div className="flex flex-col gap-1">
        <div className="flex w-full gap-1">
          {FN_ROW.map((k, i) => (
            <div
              key={i}
              style={{ flexGrow: 1, flexBasis: 0 }}
              className="flex h-7 min-w-0 select-none items-center justify-center rounded-[6px] border border-border bg-background/60 font-sans text-[11px] font-medium text-muted-foreground"
            >
              {k.label}
            </div>
          ))}
        </div>

        <Row keys={NUMBER_ROW} nextKey={nextKey} activeKeys={activeKeys} />
        <Row keys={QWERTY_ROW} nextKey={nextKey} activeKeys={activeKeys} />
        <Row keys={HOME_ROW} nextKey={nextKey} activeKeys={activeKeys} />
        <Row keys={BOTTOM_LETTER_ROW} nextKey={nextKey} activeKeys={activeKeys} />

        <div className="flex w-full gap-1">
          <ModKey label="fn" />
          <ModKey label="control" weight={1.15} />
          <ModKey label="option" weight={1.15} />
          <ModKey label="⌘ command" weight={1.4} />
          <div
            style={{ flexGrow: 5.5, flexBasis: 0 }}
            className={`${KEY_BASE} h-9 ${spaceActive ? KEY_ACTIVE : KEY_INACTIVE}`}
          />
          <ModKey label="⌘ command" weight={1.4} />
          <ModKey label="option" weight={1.15} />
          <div style={{ flexGrow: 1, flexBasis: 0 }} className={`${KEY_BASE} h-9 text-sm ${KEY_INACTIVE}`}>
            ←
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0 }} className="flex h-9 flex-col gap-0.5">
            <div className={`flex h-1/2 items-center justify-center rounded-t-[7px] border text-[11px] ${KEY_INACTIVE}`}>
              ↑
            </div>
            <div className={`flex h-1/2 items-center justify-center rounded-b-[7px] border text-[11px] ${KEY_INACTIVE}`}>
              ↓
            </div>
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0 }} className={`${KEY_BASE} h-9 text-sm ${KEY_INACTIVE}`}>
            →
          </div>
        </div>
      </div>
    </div>
  );
}
