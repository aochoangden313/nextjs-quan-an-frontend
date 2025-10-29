import { LoginBodyType } from "@/src/schemaValidations/auth.schema";
import authApiRequest from "@/src/apiRequest/auth";
import { HttpError } from "@/src/lib/http";
import { decode as jwtDecode } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;

    const decodedAccessToken = jwtDecode(accessToken) as { exp: number };
    const decodedRefreshToken = jwtDecode(refreshToken) as { exp: number };

    (await cookieStore).set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    (await cookieStore).set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: "Có lỗi xảy ra" },
        {
          status: 500,
        }
      );
    }
  }
}
