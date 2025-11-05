import authApiRequest from "@/src/apiRequest/auth";
import { decode as jwtDecode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { message: "Khong tim thay refresh token" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });

    const decodedAccessToken = jwtDecode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwtDecode(payload.data.refreshToken) as {
      exp: number;
    };

    const response = NextResponse.json(payload);

    response.cookies.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    response.cookies.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return response;
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Có lỗi xảy ra" },
      {
        status: 401,
      }
    );
  }
}
