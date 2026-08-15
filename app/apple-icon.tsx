import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

function Key({ letter }: { letter: string }) {
  return (
    <div
      style={{
        width: 62,
        height: 62,
        borderRadius: 14,
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#18181b" }}>{letter}</div>
      <div style={{ width: 20, height: 4, borderRadius: 2, background: "#18181b", marginTop: 6 }} />
    </div>
  );
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "#18181b",
        }}
      >
        <Key letter="F" />
        <Key letter="J" />
      </div>
    ),
    { ...size }
  );
}
