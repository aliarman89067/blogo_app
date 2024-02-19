"use client";
import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import TrendingCard from "@/components/TrendingCard";
import { Spinner } from "@/components/mini-components/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories } from "@/utils/data";
import Lottie from "lottie-react";
import blogNotFound from "../../../../public/lottie/blogNotFound.json";
import { ChevronDown } from "lucide-react";

export default function Page() {
  const [categoryName, setCategoryName] = useState<string>("All");
  const { data, isLoading } = trpc.getTredingBlogByCategory.useQuery({
    category: categoryName,
  });
  return (
    <MaxWidthWrapper>
      {isLoading ? (
        <div className="flex flex-col items-center gap-1 mt-5">
          <Spinner />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between my-5">
            <h1 className="text-3xl text-neon font-medium">Trending Blogs</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  {categoryName}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="h-[300px] overflow-scroll">
                <DropdownMenuItem
                  className="w-[200px]"
                  onClick={() => setCategoryName("All")}
                >
                  All
                </DropdownMenuItem>
                {categories.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setCategoryName(item.name)}
                    className="w-[200px]"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {!isLoading && data
              ? data?.map((item, index) => (
                  <TrendingCard key={index} item={item} />
                ))
              : null}
          </div>
          {!isLoading && data?.length === 0 ? (
            <div className="flex flex-col w-full mt-5 items-center">
              <Lottie
                animationData={blogNotFound}
                loop={true}
                autoPlay={true}
                className="w-[200px]"
              />
              <p className="text-gray-700 text-center">
                No blogs found for {categoryName}
              </p>
            </div>
          ) : null}
        </>
      )}
    </MaxWidthWrapper>
  );
}
