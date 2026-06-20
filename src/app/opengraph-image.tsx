import { ImageResponse } from "next/og";

export const alt = "أثر (ATHR) — وكالة تصميم وتطوير المواقع والمتاجر الإلكترونية";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// صورة مشاركة اجتماعية مولّدة ديناميكياً بألوان هوية أثر (الكحلي الحبري + النعناع الرقمي).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C2833",
          color: "#F4F6F7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 150, fontWeight: 800 }}>
          <span>ATHR</span>
          <span style={{ color: "#2ECC71", marginLeft: 6 }}>.</span>
        </div>
        <div style={{ fontSize: 34, marginTop: 24, opacity: 0.9, maxWidth: 860, textAlign: "center" }}>
          Premium Web & E-commerce Design — Built to leave an impression
        </div>
        <div style={{ fontSize: 26, marginTop: 16, color: "#2ECC71", fontWeight: 700 }}>
          athr.agency
        </div>
      </div>
    ),
    { ...size }
  );
}
