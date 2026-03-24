import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

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
          background: "linear-gradient(180deg, #17312C 0%, #122622 100%)",
          borderRadius: "96px",
          border: "10px solid rgba(230,212,184,0.22)",
          color: "#E6D4B8",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          fontFamily: "Georgia, serif",
          fontSize: 290,
          fontWeight: 600
        }}
      >
        B
      </div>
    ),
    size
  );
}