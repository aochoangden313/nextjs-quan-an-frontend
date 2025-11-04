"use client";

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/src/lib/utils";
import { useLogoutMutation } from "@/src/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

/**
 * Đây là trang xử lý logout tự động.
 * Người dùng được redirect đến đây từ middleware khi access token hết hạn.
 */
function LogoutPageContent() {
  // Hook để gọi API logout
  const { mutateAsync } = useLogoutMutation();
  // Hook để điều hướng
  const router = useRouter();
  // Hook để đọc tham số (query params) từ URL
  const searchParams = useSearchParams();
  // Lấy access/ refresh token từ URL (được middleware đính kèm)
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  // Dùng useRef làm "cờ" (flag) để ngăn useEffect chạy 2 lần (do React StrictMode)
  const ref = useRef<any>(null);

  // Logic logout sẽ chạy ngay khi component được tải
  useEffect(() => {
    // --- KIỂM TRA BẢO VỆ ---
    if (
      // 1. Nếu 'cờ' đã được đặt (đang chạy rồi), thì dừng lại
      ref.current ||
      // 2. (Bảo mật) Nếu access/refresh token trên URL không khớp với token trong Local Storage,
      //    đây là truy cập không hợp lệ (ví dụ: gõ thẳng /logout) => dừng lại.
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage()) ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage())
    ) {
      return;
    }

    // --- THỰC THI LOGOUT ---

    // 1. Đặt 'cờ' để đánh dấu là request đang được thực thi
    ref.current = mutateAsync;

    // 2. Gọi API logout
    mutateAsync().then((res) => {
      // 3. Reset 'cờ' sau 1 giây (để dọn dẹp)
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      // 4. Sau khi logout thành công, đẩy người dùng về trang login
      router.push("/login");
    });

    // Các dependencies của useEffect
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);

  // Hiển thị nội dung giữ chỗ trong khi xử lý
  return <div>Log out....</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Log out....</div>}>
      <LogoutPageContent />
    </Suspense>
  );
}
