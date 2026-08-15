import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#18181b",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            background: "#fafafa",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 3,
          }}
        >
          <div style={{ width: 8, height: 2, borderRadius: 2, background: "#18181b" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
