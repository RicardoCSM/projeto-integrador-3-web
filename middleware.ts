import { type NextRequest } from "next/server";
import { getToken } from "./app/actions/auth";

export async function middleware(request: NextRequest) {
  const token = await getToken();

  if (token && request.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/sign-in") &&
    !request.nextUrl.pathname.startsWith("/images")
  ) {
    return Response.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
