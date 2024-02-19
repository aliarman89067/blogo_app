"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { navbarLinks } from "@/utils/data";
import { useLoginModal, useRegisterModal, useUser } from "@/store/store";
import { User } from "lucide-react";
import CustomDropDown from "./mini-components/CustomDropDown";
import Image from "next/image";
import { NotificationButton } from "./mini-components/NotificationButton";
import MobileNavbar from "./mini-components/MobileNavbar";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [startRoutes, setStartRoutes] = useState<boolean>(false);
  const { user, userLogout } = useUser();

  if (user && !startRoutes) {
    setStartRoutes(true);
  }

  useEffect(() => {
    if (startRoutes) {
      const verifyUser = async () => {
        const userData = {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        };

        const data = await fetch("/api/verifyUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userData }),
        });
        const response = await data.json();
        if (!response.result) {
          userLogout();
        }
      };
      verifyUser();
    }
    setIsMounted(true);
  }, [startRoutes]);
  const openLoginModal = useLoginModal((state) => state.openLoginModal);
  const openRegisterModal = useRegisterModal(
    (state) => state.openRegisterModal
  );
  const params = usePathname();
  return (
    <nav className="w-full h-12 border-b border-gray-100 flex justify-center items-center hover:shadow-md transition">
      <div className="w-full max-w-7xl h-12 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="text-base text-gray-700 font-medium">
          Blogo.
        </Link>
        {user && (
          <ul className="max-md:hidden flex items-center justify-center gap-5 translate-x-9">
            {navbarLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`text-[14px] hover:text-gray-800 transition ${
                    item.href === params
                      ? "text-gray-800 underline underline-offset-4"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {user ? (
          <div className="flex items-center gap-5 md:gap-3">
            <CustomDropDown>
              <div className="px-2 py-1 rounded-full border border-gray-200 flex items-center justify-between gap-3 cursor-pointer hover:border-gray-300 transition">
                {user.image ? (
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex justify-center items-center">
                    <Image
                      src={user.image}
                      width={24}
                      height={24}
                      alt={`profile image of ${user.name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex justify-center items-center">
                    <User className="text-white" />
                  </div>
                )}
                <p className="text-gray-600 text-base font-light">
                  {user?.name.substring(0, 4)}..
                </p>
              </div>
            </CustomDropDown>
            <NotificationButton userId={user?.id} />
            <MobileNavbar />
          </div>
        ) : null}
        {!user && isMounted ? (
          <div className="flex items-center justify-end gap-3">
            <Button size="sm" variant="outline" onClick={openLoginModal}>
              Login
            </Button>
            <Button size="sm" onClick={openRegisterModal}>
              Get Started
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
