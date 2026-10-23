import type { Finger } from "@/lib/fingers";
import type { LanguageCode } from "@/lib/languages";

type Strings = {
  appTitle: string;
  appTagline: string;
  lessonsProgress: (done: number, total: number) => string;
  changeLanguage: string;
  muteSound: string;
  unmuteSound: string;
  toggleDarkMode: string;
  openSettings: string;

  justStart: string;
  perfectRun: string;
  passedBadge: (accuracy: number) => string;
  failedBadge: (accuracy: number, threshold: number) => string;
  newDrill: string;
  retry: string;
  lessonLocked: string;
  lessonLockedDesc: (threshold: number) => string;
  wpm: string;
  acc: string;
  errors: string;
  fontSizeSmall: string;
  fontSizeLarge: string;
  fontSize: string;
  showHandGuide: string;
  toggleKeyboard: string;

  handGuideTitle: (lessonTitle: string) => string;
  handGuideDesc: (homeRowGlyphs: string) => string;
  gotIt: string;
  fingerLabel: Record<Finger, string>;
  reachDescription: (offset: number, isSpace: boolean) => string;

  lessonComplete: string;
  lessonCompleteDesc: (lessonTitle: string, accuracy: number, hasNext: boolean) => string;
  stayHere: string;
  nextLesson: (lessonTitle: string) => string;
  nice: string;

  settingsTitle: string;
  settingsDesc: string;
  keyboardLayout: string;
  keyboardLayoutDesc: string;
  passThreshold: string;
  passThresholdDesc: string;
  done: string;
  close: string;
};

export const STRINGS: Record<LanguageCode, Strings> = {
  en: {
    appTitle: "Type Trainer",
    appTagline: "Learn to touch-type, one lesson at a time.",
    lessonsProgress: (done, total) => `${done}/${total} lessons`,
    changeLanguage: "Change practice language",
    muteSound: "Mute typing sound",
    unmuteSound: "Unmute typing sound",
    toggleDarkMode: "Toggle dark mode",
    openSettings: "Settings",

    justStart: "Just start typing - no need to click anything.",
    perfectRun: "Perfect run - next lesson unlocked",
    passedBadge: (accuracy) => `${accuracy}% accuracy - next lesson unlocked`,
    failedBadge: (accuracy, threshold) =>
      `${accuracy}% accuracy - reach ${threshold}% to unlock the next lesson. Press Enter to retry.`,
    newDrill: "New drill",
    retry: "Retry",
    lessonLocked: "Lesson locked",
    lessonLockedDesc: (threshold) =>
      `Finish the previous lesson with at least ${threshold}% accuracy to unlock this one.`,
    wpm: "wpm",
    acc: "acc",
    errors: "errors",
    fontSizeSmall: "A",
    fontSizeLarge: "A",
    fontSize: "Text size",
    showHandGuide: "Show finger position guide",
    toggleKeyboard: "Toggle on-screen keyboard",

    handGuideTitle: (title) => `Finger positions - ${title}`,
    handGuideDesc: (glyphs) =>
      `Rest your fingers on the home row (${glyphs}) and reach out only for the highlighted keys below.`,
    gotIt: "Got it",
    fingerLabel: {
      "l-pinky": "left pinky",
      "l-ring": "left ring finger",
      "l-middle": "left middle finger",
      "l-index": "left index finger",
      "r-index": "right index finger",
      "r-middle": "right middle finger",
      "r-ring": "right ring finger",
      "r-pinky": "right pinky",
      thumb: "thumb",
    },
    reachDescription: (offset, isSpace) => {
      if (isSpace) return "thumb taps the space bar";
      if (offset === 0) return "home key - no reach needed";
      if (offset === -1) return "reach up one row";
      if (offset === -2) return "reach up two rows";
      if (offset === 1) return "reach down one row";
      return "reach";
    },

    lessonComplete: "Lesson complete!",
    lessonCompleteDesc: (title, accuracy, hasNext) =>
      hasNext
        ? `You typed "${title}" with ${accuracy}% accuracy. Ready for the next lesson?`
        : `You typed "${title}" with ${accuracy}% accuracy. You've finished every lesson!`,
    stayHere: "Stay here",
    nextLesson: (title) => `Next lesson: ${title}`,
    nice: "Nice!",

    settingsTitle: "Settings",
    settingsDesc: "These settings apply to every language.",
    keyboardLayout: "Keyboard layout",
    keyboardLayoutDesc: "Match the layout of your physical keyboard.",
    passThreshold: "Passing accuracy",
    passThresholdDesc: "Minimum accuracy needed to pass a lesson and unlock the next one.",
    done: "Done",
    close: "Close",
  },
  ar: {
    appTitle: "مدرّب الكتابة",
    appTagline: "تعلّم الكتابة باللمس، درسًا تلو الآخر.",
    lessonsProgress: (done, total) => `${done}/${total} دروس`,
    changeLanguage: "تغيير لغة التدريب",
    muteSound: "كتم صوت الكتابة",
    unmuteSound: "تشغيل صوت الكتابة",
    toggleDarkMode: "تبديل الوضع الداكن",
    openSettings: "الإعدادات",

    justStart: "ابدأ الكتابة مباشرة - لا حاجة للنقر على أي شيء.",
    perfectRun: "أداء مثالي - تم فتح الدرس التالي",
    passedBadge: (accuracy) => `دقة ${accuracy}% - تم فتح الدرس التالي`,
    failedBadge: (accuracy, threshold) =>
      `دقة ${accuracy}% - يجب بلوغ ${threshold}% لفتح الدرس التالي. اضغط Enter لإعادة المحاولة.`,
    newDrill: "تمرين جديد",
    retry: "إعادة المحاولة",
    lessonLocked: "الدرس مقفل",
    lessonLockedDesc: (threshold) => `أنهِ الدرس السابق بدقة لا تقل عن ${threshold}% لفتح هذا الدرس.`,
    wpm: "كلمة/د",
    acc: "الدقة",
    errors: "أخطاء",
    fontSizeSmall: "أ",
    fontSizeLarge: "أ",
    fontSize: "حجم النص",
    showHandGuide: "عرض دليل وضعية الأصابع",
    toggleKeyboard: "إظهار/إخفاء لوحة المفاتيح",

    handGuideTitle: (title) => `وضعية الأصابع - ${title}`,
    handGuideDesc: (glyphs) =>
      `ضع أصابعك على الصف الأوسط (${glyphs}) ولا تمدّها إلا إلى المفاتيح المميّزة أدناه.`,
    gotIt: "فهمت",
    fingerLabel: {
      "l-pinky": "الخنصر الأيسر",
      "l-ring": "البنصر الأيسر",
      "l-middle": "الوسطى اليسرى",
      "l-index": "السبابة اليسرى",
      "r-index": "السبابة اليمنى",
      "r-middle": "الوسطى اليمنى",
      "r-ring": "البنصر الأيمن",
      "r-pinky": "الخنصر الأيمن",
      thumb: "الإبهام",
    },
    reachDescription: (offset, isSpace) => {
      if (isSpace) return "الإبهام يضغط على مفتاح المسافة";
      if (offset === 0) return "مفتاح أساسي - لا حاجة للتمدد";
      if (offset === -1) return "تمدّد صفًا واحدًا للأعلى";
      if (offset === -2) return "تمدّد صفّين للأعلى";
      if (offset === 1) return "تمدّد صفًا واحدًا للأسفل";
      return "تمدّد";
    },

    lessonComplete: "اكتمل الدرس!",
    lessonCompleteDesc: (title, accuracy, hasNext) =>
      hasNext
        ? `لقد كتبت «${title}» بدقة ${accuracy}%. هل أنت مستعد للدرس التالي؟`
        : `لقد كتبت «${title}» بدقة ${accuracy}%. لقد أنهيت جميع الدروس!`,
    stayHere: "البقاء هنا",
    nextLesson: (title) => `الدرس التالي: ${title}`,
    nice: "رائع!",

    settingsTitle: "الإعدادات",
    settingsDesc: "تنطبق هذه الإعدادات على جميع اللغات.",
    keyboardLayout: "تخطيط لوحة المفاتيح",
    keyboardLayoutDesc: "اختر التخطيط المطابق للوحة مفاتيحك.",
    passThreshold: "نسبة الدقة المطلوبة للنجاح",
    passThresholdDesc: "الحد الأدنى من الدقة لاجتياز الدرس وفتح الدرس التالي.",
    done: "تم",
    close: "إغلاق",
  },
};
