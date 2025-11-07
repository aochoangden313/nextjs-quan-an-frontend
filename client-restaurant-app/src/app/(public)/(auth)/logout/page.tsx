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
    // code logic cũ
    // // --- KIỂM TRA BẢO VỆ ---
    // if (
    //   // 1. Nếu 'cờ' đã được đặt (đang chạy rồi), thì dừng lại
    //   ref.current ||
    //   // 2. (Bảo mật) Nếu access/refresh token trên URL không khớp với token trong Local Storage,
    //   //    đây là truy cập không hợp lệ (ví dụ: gõ thẳng /logout) => dừng lại.
    //   (accessTokenFromUrl &&
    //     accessTokenFromUrl !== getAccessTokenFromLocalStorage()) ||
    //   (refreshTokenFromUrl &&
    //     refreshTokenFromUrl !== getRefreshTokenFromLocalStorage())
    // ) {
    //   return;
    // }

    if (
      // Chỉ thực hiện khi ref.current chưa được gán (tức là chưa có mutation đang chạy)
      !ref.current &&
      // Có access token trong URL và token đó khớp với token đang lưu trong localStorage
      accessTokenFromUrl &&
      accessTokenFromUrl === getAccessTokenFromLocalStorage() &&
      // Có refresh token trong URL và token đó khớp với token đang lưu trong localStorage
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      // Đánh dấu rằng mutation đang được gọi (dùng ref để tránh gọi trùng lặp)
      ref.current = mutateAsync;

      // Thực thi mutation (ví dụ gọi API để xác thực / đồng bộ trạng thái)
      mutateAsync().then((res) => {
        // Sau khi mutation hoàn tất, chờ 1s trước khi xóa dấu hiệu đang chạy.
        // Việc này giúp tránh race condition nếu có nhiều lần trigger liên tiếp.
        setTimeout(() => {
          ref.current = null;
        }, 1000);

        // Điều hướng người dùng tới trang /login sau khi mutation thành công
        router.push("/login");
      });
    } else {
      // Nếu điều kiện không thỏa (ví dụ token không khớp hoặc đã có mutation chạy),
      // điều hướng người dùng về trang chủ
      router.push("/");
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
