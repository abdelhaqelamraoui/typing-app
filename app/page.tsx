"use client";

import dynamic from "next/dynamic";

const TypeTrainerApp = dynamic(
  () => import("@/components/type-trainer-app").then((m) => m.TypeTrainerApp),
  { ssr: false }
);

export default function Home() {
  return <TypeTrainerApp />;
}
