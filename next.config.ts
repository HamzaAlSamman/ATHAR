import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// سياسة أمان المحتوى: كل الموارد من نطاقنا فقط (الخطوط والتحليلات مستضافة ذاتياً).
// 'unsafe-inline' للسكربتات لازم لسكربتات Next المضمّنة في الصفحات الثابتة؛ البديل (nonce)
// يجعل كل صفحة ديناميكية ويخسر سرعة التخزين المؤقت. 'unsafe-eval' في التطوير فقط (لإعادة التحميل الفوري).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // لا نعلن عن التقنية المستخدمة في ترويسة X-Powered-By.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
