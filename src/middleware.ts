import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";
import { blogViToEnSlug, blogEnToViSlug } from "@/content/blogSlugRedirects";

function getLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language");
  if (accept) {
    const preferred = accept.split(",").map((p) => p.split(";")[0].trim().slice(0, 2).toLowerCase());
    for (const p of preferred) {
      if ((locales as readonly string[]).includes(p)) return p;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore public files, API and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files: favicon, images, robots, sitemap, etc.
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (hasLocale) {
    // Canonicalize blog post URLs so each locale always serves its own slug
    // (e.g. /en/blog/<vi-slug> -> /en/blog/<en-slug>). Done here instead of
    // via next/navigation's redirect() inside the page component because
    // that API returns HTTP 200 instead of a real redirect on Edge Runtime
    // routes (a known Next.js limitation, https://github.com/vercel/next.js/issues/46437) -
    // middleware-level NextResponse.redirect() is unaffected by that bug.
    const enBlogMatch = pathname.match(/^\/en\/blog\/([^/]+)\/?$/);
    if (enBlogMatch) {
      const correctEnSlug = blogViToEnSlug[enBlogMatch[1]];
      if (correctEnSlug) {
        const url = request.nextUrl.clone();
        url.pathname = `/en/blog/${correctEnSlug}`;
        return NextResponse.redirect(url, 308);
      }
    }
    const viBlogMatch = pathname.match(/^\/vi\/blog\/([^/]+)\/?$/);
    if (viBlogMatch) {
      const correctViSlug = blogEnToViSlug[viBlogMatch[1]];
      if (correctViSlug) {
        const url = request.nextUrl.clone();
        url.pathname = `/vi/blog/${correctViSlug}`;
        return NextResponse.redirect(url, 308);
      }
    }
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
