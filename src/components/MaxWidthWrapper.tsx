import { cn } from "@/lib/utils";
import React from "react";

interface MaxWidthWrapperProps {
  children: React.ReactNode;
  classNames?: string;
}

export default function MaxWidthWrapper({
  children,
  classNames,
}: MaxWidthWrapperProps) {
  return (
    <section
      className={cn(
        "max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8",
        classNames
      )}
    >
      {children}
    </section>
  );
}
