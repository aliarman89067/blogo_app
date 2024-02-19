"use client";
import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navbarLinks } from "@/utils/data";
import Link from "next/link";

export default function MobileNavbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="text-gray-600 w-5 h-5 flex md:hidden" />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-3 ">
          {navbarLinks.map((link) => (
            <SheetClose asChild key={link.id}>
              <Link href={link.href} className="text-neon">
                {link.name}
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
