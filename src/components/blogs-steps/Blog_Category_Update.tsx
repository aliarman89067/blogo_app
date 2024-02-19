"use client";
import { categories } from "@/utils/data";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface BlogCategoryProps {
  setCategory: (data: any) => void;
  categoryItem: { id: number; name: string; description: string } | null;
  initialCategory: string;
}

export default function Blog_Category_Update({
  categoryItem,
  setCategory,
  initialCategory,
}: BlogCategoryProps) {
  useEffect(() => {
    const findCategory = categories.find(
      (category) => category.nameForDatabase === initialCategory
    );
    if (!categoryItem) {
      setCategory({
        id: findCategory?.id,
        name: findCategory?.name,
        description: findCategory?.description,
        nameForDatabase: findCategory?.nameForDatabase,
      });
    }
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <label
          key={category.id}
          className={`flex gap-4 items-center justify-between py-3 px-5 rounded-md border border-gray-200 w-full hover:shadow-md transition cursor-pointer ${
            categoryItem?.id === category.id ? "bg-primary" : "bg-gray-100"
          }`}
          onClick={() =>
            setCategory({
              id: category.id,
              name: category.name,
              description: category.description,
              nameForDatabase: category.nameForDatabase,
            })
          }
        >
          <div className="flex items-center justify-start gap-4">
            <div>
              <category.icon
                className={` h-6 w-6 ${
                  categoryItem?.id === category.id
                    ? "text-white"
                    : "text-gray-800"
                }`}
              />
            </div>
            <div className="border-r border-gray-200 w-[1px] h-[100px]" />
            <div className="flex flex-col gap-1">
              <h1
                className={`text-lg font-medium ${
                  categoryItem?.id === category.id ? "text-white" : "text-neon"
                }`}
              >
                {category.name}
              </h1>
              <p
                className={`text-sm font-light ${
                  categoryItem?.id === category.id
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {category.description}
              </p>
            </div>
          </div>
          <div>
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={categoryItem?.id === category.id}
              onChange={() => {}}
            />
          </div>
        </label>
      ))}
    </div>
  );
}
