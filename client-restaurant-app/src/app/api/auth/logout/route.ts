import authApiRequest from "@/src/apiRequest/auth";
import { cookies } from "next/headers";

export async function POST(_request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Instead of delete, set cookies with expired date using Headers so we can append multiple Set-Cookie
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({
        message: "Không nhận được access token hoặc refresh token",
      }),
      {
        status: 200,
        headers,
      }
    );
  }

  try {
    const result = await authApiRequest.sLogout({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    return new Response(JSON.stringify(result.payload), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(
      JSON.stringify({ message: "Lỗi khi gọi API đến backend Server" }),
      {
        status: 200,
        headers,
      }
    );
  }
}
