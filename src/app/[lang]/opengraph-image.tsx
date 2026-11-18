import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = "ATHR — Websites, business systems and mobile apps";
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
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 36, lineHeight: 1.1, maxWidth: 1000 }}>
          We build your software
        </div>
        <div style={{ fontSize: 38, marginTop: 20, opacity: 0.85 }}>Fixed price · The code is yours</div>
        <div style={{ display: "flex", marginTop: 52, gap: 16 }}>
          {["Websites", "Web apps", "Mobile apps", "AI automation"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "14px 24px",
                borderRadius: 16,
                fontSize: 30,
                fontWeight: 700,
                background: i === 0 ? "#2ECC71" : "rgba(255,255,255,0.08)",
                color: i === 0 ? "#1C2833" : "rgba(255,255,255,0.8)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#2ECC71", fontWeight: 700 }}>{host}</div>
      </div>
    ),
    { ...size }
  );
}
