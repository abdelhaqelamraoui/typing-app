import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Readex_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["arabic"],
});

const description =
  "A progressive touch-typing trainer. Practice keyboard-row lessons with a realistic on-screen keyboard and mechanical keystroke sounds - reach the target accuracy on each lesson to unlock the next.";

// Next doesn't prefix metadata icon hrefs with `basePath` on its own, so this
// mirrors the same GitHub Pages base path computed in next.config.ts.
const basePath = process.env.GITHUB_ACTIONS === "true" ? "/typing-app" : "";

export const metadata: Metadata = {
  title: {
    default: "Type Trainer - Learn Touch Typing",
    template: "%s · Type Trainer",
  },
  description,
  applicationName: "Type Trainer",
  keywords: [
    "typing trainer",
    "touch typing",
    "learn to type",
    "typing practice",
    "typing lessons",
    "keyboard practice",
    "WPM",
    "typing speed",
  ],
  authors: [{ name: "Type Trainer" }],
  creator: "Type Trainer",
  formatDetection: { telephone: false },
  icons: {
    icon: `${basePath}/icon.png`,
    apple: `${basePath}/apple-icon.png`,
  },
  openGraph: {
    type: "website",
    title: "Type Trainer - Learn Touch Typing",
    description,
    siteName: "Type Trainer",
  },
  twitter: {
    card: "summary",
    title: "Type Trainer - Learn Touch Typing",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${readexPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
