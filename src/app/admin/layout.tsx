import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة تحكم أثر",
  robots: { index: false, follow: false },
};

// لوحة التحكم خارج روابط اللغات، فلها تخطيط جذري خاص بها.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
