import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 20% 20%, rgba(230,212,184,0.18), transparent 28%), radial-gradient(circle at 82% 24%, rgba(17,197,198,0.12), transparent 24%), linear-gradient(180deg, #0b1715 0%, #071311 100%)",
          color: "#F4EFE6",
          fontFamily: "Georgia, serif"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "760px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 18, textTransform: "uppercase", letterSpacing: "0.24em", color: "#89A19A" }}>
            Betweener
          </div>
          <div style={{ fontSize: 74, lineHeight: 0.94 }}>
            Intentional dating with depth, trust, and momentum.
          </div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 28, lineHeight: 1.5, color: "#B7C7C1" }}>
            A premium dating product designed around context, chemistry, and real-world follow-through.
          </div>
        </div>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 40,
            border: "1px solid rgba(230,212,184,0.28)",
            background: "linear-gradient(180deg, rgba(230,212,184,0.16), rgba(17,197,198,0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E6D4B8",
            boxShadow: "0 16px 44px rgba(214,178,94,0.14)",
            fontSize: 104,
            fontWeight: 600
          }}
        >
          B
        </div>
      </div>
    ),
    size
  );
}