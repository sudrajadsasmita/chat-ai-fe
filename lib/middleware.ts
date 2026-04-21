import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get("user_profile")?.value;

  const isLoginPage = url.pathname.startsWith("/login");
  const isRootPage = url.pathname === "/";

  // Belum login & mencoba akses rute selain login
  if (!token && !isLoginPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Sudah login & mencoba akses login atau root
  if (token && (isLoginPage || isRootPage)) {
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
