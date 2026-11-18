import { NextResponse, type NextRequest } from "next/server";

// كل رابط بدون بادئة لغة (/pricing) يُحوَّل إلى /ar/pricing أو /en/pricing.
// الاختيار: اللغة المحفوظة في الكوكي، ثم لغة المتصفح، ثم العربية.
const LANG_COOKIE = "athar_lang";

function preferredLocale(request: NextRequest): "ar" | "en" {
  const saved = request.cookies.get(LANG_COOKIE)?.value;
  if (saved === "ar" || saved === "en") return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
  }
  return "ar";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(ar|en)(\/|$)/.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  // 307 للجذر لأن الوجهة تختلف حسب الزائر، و308 للروابط القديمة حتى تنتقل قيمتها في البحث.
  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}

export const config = {
  // نستثني الـ API ولوحة التحكم وملفات Next والملفات الثابتة (أي مسار فيه نقطة).
  matcher: ["/((?!api|admin|_next|_vercel|.*\\.).*)"],
};
