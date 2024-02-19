import { categories } from "@/utils/data";
import Link from "next/link";
import React from "react";

export default function CategoriesPanel() {
  return (
    <div className="sticky top-0 right-0 pt-4 -mt-4">
      <div className="border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-lg transition">
        <h3 className="text-lg text-neon font-medium">Categories</h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.id}
              className="text-[14px] border border-gray-300 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition py-1.5 px-4"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <Link href="/category/All">
          <button className="border border-gray-300 rounded-full text-primary hover:text-white font-light transition hover:bg-primary px-5 py-1.5 text-sm mt-5">
            See more topics
          </button>
        </Link>
      </div>
    </div>
  );
}
