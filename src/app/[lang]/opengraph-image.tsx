import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = "ATHR — Free website audit: speed, security & SEO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

// صورة المشاركة بألوان الهوية. لاتينية فقط لأن مولّد الصور لا يشكّل الحروف العربية بدون خط مضمّن.
export default function OpengraphImage() {
  const host = siteConfig.url.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#1C2833",
          color: "#F4F6F7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 64, fontWeight: 800 }}>
          <span>ATHR</span>
          <span style={{ color: "#2ECC71" }}>.</span>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 36, lineHeight: 1.1, maxWidth: 960 }}>
          Free website audit
        </div>
        <div style={{ fontSize: 40, marginTop: 20, opacity: 0.85 }}>Speed · Security · SEO — graded A to F</div>
        <div style={{ display: "flex", marginTop: 56, gap: 20 }}>
          {["A", "B", "C", "D", "F"].map((g, i) => (
            <div
              key={g}
              style={{
                width: 84,
                height: 84,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 800,
                background: i === 0 ? "#2ECC71" : "rgba(255,255,255,0.08)",
                color: i === 0 ? "#1C2833" : "rgba(255,255,255,0.55)",
              }}
            >
              {g}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#2ECC71", fontWeight: 700 }}>{host}</div>
      </div>
    ),
    { ...size }
  );
}
