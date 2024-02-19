"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { trpc } from "@/app/_trpc/client";
import { useUser } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomDropDown({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const { userLogout, user } = useUser();
  const { mutate } = trpc.logout.useMutation({
    onSuccess: () => {
      userLogout();
      if (pathName === "/profile") {
        window.location.reload();
      }
    },
  });
  const handleLogout = () => {
    mutate();
  };
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="border-none outline-none border border-gray-200 shadow-md w-36">
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/search">Search</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
