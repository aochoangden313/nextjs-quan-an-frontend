import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ur } from "zod/v4/locales";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //Việc chỉ kiểm tra refreshToken đảm bảo rằng miễn là người dùng còn một phiên đăng nhập hợp lệ (còn refreshToken), họ sẽ luôn bị chặn truy cập vào các trang như /login hoặc /register, bất kể accessToken của họ còn hạn hay đã hết hạn.

  //chưa đăng nhập (không tồn tại refresh Token) thì ko cho vào private path và điều hướng về trang login
  if (privatePaths.some((path) => pathname.startsWith(path) && !refreshToken)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Đăng nhập rồi thì sẽ không cho vào login nữa và redirect vào trang chủ
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Đăng nhập rồi, nhưng access token lại hết hạn thì cho redirect về trang /logout để xóa refresh_token ở server và dọn dẹp local storage, sau đó mới đẩy người dùng về trang /login. Trong URL có đính kèm param là RefreshToken để tránh trường hợp bị hack click logout link (chỉ logout khi đúng là link trên máy người dùng)
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
