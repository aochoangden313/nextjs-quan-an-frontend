"use client";

import { useAppContext } from "@/src/components/app-provider";
import { getAccessTokenFromLocalStorage } from "@/src/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired == undefined nghĩa là luôn hiển thị dù có đăng nhập hay không
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true, // authRequired == true, đăng nhập thì mới hiển thị
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // authRequired == false, chưa đăng nhập thì mới hiển thị, còn đăng nhập rồi thì bị ẩn đi
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // authRequired == true, đăng nhập thì mới hiển thị
  },
];

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// CLient: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đó thì client render ra là Món ăn, Đơn hàng, Quản lý do đã check được trạng thái đăng nhập

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext();

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
