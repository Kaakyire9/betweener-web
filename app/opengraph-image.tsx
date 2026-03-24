import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #0b1715 0%, #071311 48%, #081513 100%)",
          color: "#F4EFE6",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(230,212,184,0.22), transparent 28%), radial-gradient(circle at 82% 16%, rgba(17,197,198,0.16), transparent 24%), radial-gradient(circle at 78% 84%, rgba(167,139,250,0.12), transparent 24%)"
          }}
        />

        <div
          style={{
            margin: "48px",
            width: "100%",
            borderRadius: "36px",
            border: "1px solid rgba(126,214,209,0.18)",
            background: "linear-gradient(180deg, rgba(23,49,44,0.84), rgba(18,38,34,0.94))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.32)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "24px",
                border: "1px solid rgba(230,212,184,0.28)",
                background: "linear-gradient(180deg, rgba(230,212,184,0.16), rgba(17,197,198,0.08))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E6D4B8",
                fontSize: 48,
                fontWeight: 600
              }}
            >
              B
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.28em",
                  color: "#89A19A"
                }}
              >
                Premium Intentional Dating
              </div>
              <div style={{ fontSize: 58, lineHeight: 1, marginTop: 10 }}>Betweener</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "860px" }}>
            <div style={{ fontSize: 78, lineHeight: 0.95 }}>
              Dating with more context, more chemistry, and more composure.
            </div>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                lineHeight: 1.6,
                color: "#B7C7C1",
                maxWidth: "820px"
              }}
            >
              Betweener is a premium dating product built around trust, chemistry, context, and
              real-world momentum.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                fontFamily: "Arial, sans-serif",
                fontSize: 18,
                color: "#B7C7C1"
              }}
            >
              <div
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(230,212,184,0.2)",
                  background: "rgba(230,212,184,0.08)",
                  color: "#E6D4B8",
                  padding: "12px 18px",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: 14
                }}
              >
                Trust-led
              </div>
              <div
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(126,214,209,0.2)",
                  background: "rgba(17,197,198,0.08)",
                  color: "#7ED6D1",
                  padding: "12px 18px",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  fontSize: 14
                }}
              >
                Calm premium brand
              </div>
            </div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 18, color: "#89A19A" }}>
              getbetweener.com
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}