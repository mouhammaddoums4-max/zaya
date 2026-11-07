import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, verifyDriverSession } from "@/lib/auth";
import { SESSION_COOKIE, DRIVER_COOKIE } from "@/lib/constants";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pages/API admin protégées
  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Pages/API livreur protégées
  const isDriverPage =
    pathname.startsWith("/livreur") && pathname !== "/livreur/login";
  const isDriverApi =
    pathname.startsWith("/api/livreur") && pathname !== "/api/livreur/login";

  if (isDriverPage || isDriverApi) {
    const token = req.cookies.get(DRIVER_COOKIE)?.value;
    const session = await verifyDriverSession(token);
    if (!session) {
      if (isDriverApi) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/livreur/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/livreur/:path*",
    "/api/livreur/:path*",
  ],
};
