import { NextRequest, NextResponse } from "next/server";
import path from "path";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // pathname: /manage/dashboard
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);
  //chưa đăng nhập thì ko cho vào private path
  if (privatePaths.some((path) => pathname.startsWith(path) && !isAuth)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Đăng nhập rồi thì sẽ không cho vào login nữa và redirect vào trang chủ
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
