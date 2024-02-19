"use client";

import React from "react";
import { Rocket, Search } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "linear" }}
      className="w-full h-[calc(100vh-80px)] bg-neon rounded-md mt-4 flex justify-center items-center p-4"
    >
      <div className="flex flex-col items-center justify-center gap-5 max-w-3xl text-center">
        <h1 className="text-6xl sm:text-7xl font-bold text-white leading-[70px] sm:leading-[90px]">
          <span className="custom-underline relative rotate-6">Blogo </span>
          Where Unique <span className="text-primary">Ideas</span> Find You!
        </h1>
        <Link href={`/category/All`}>
          <Button className="group gap-2 px-8 h-12">
            <span className="text-lg">Explore</span>
            <Rocket className="h-5 w-5 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
