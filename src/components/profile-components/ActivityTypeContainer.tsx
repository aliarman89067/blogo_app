"use client";
import { cn } from "@/lib/utils";
import React, { Suspense, useEffect } from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import MyBlogsContainer from "./MyBlogsContainer";
import MyFavoritesContainer from "./MyFavoritesContainer";
import MySavedContainer from "./MySavedContainer";
import MyFriendsContainer from "./MyFriendsContainer";

export default function ActivityTypeContainer({ userId }: { userId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleQueryCategory = (category: string) => {
    const query = qs.stringifyUrl(
      {
        url: "/profile?page=my-activity",
        query: {
          category: category,
        },
      },
      { skipEmptyString: false, skipNull: false }
    );
    router.push(query);
  };
  const activeUrl = () => {
    return searchParams?.get("category");
  };
  return (
    <Suspense>
      <div className="flex flex-col gap-8 w-full min-h-screen px-8">
        <section className="w-full mx-auto flex items-center justify-between mt-4 gap-2 sm:gap-4">
          <div
            onClick={() => handleQueryCategory("my-blogs")}
            className={cn(
              "w-full p-2 text-center rounded-sm cursor-pointer",
              activeUrl() === "my-blogs" || activeUrl() === null
                ? "bg-primary text-white"
                : "bg-gray-200"
            )}
          >
            My Blogs
          </div>
          <div
            onClick={() => handleQueryCategory("favorites")}
            className={cn(
              "w-full p-2 text-center rounded-sm cursor-pointer",
              activeUrl() === "favorites"
                ? "bg-primary text-white"
                : "bg-gray-200"
            )}
          >
            Favorites
          </div>
          <div
            onClick={() => handleQueryCategory("saved")}
            className={cn(
              "w-full p-2 text-center rounded-sm cursor-pointer",
              activeUrl() === "saved" ? "bg-primary text-white" : "bg-gray-200"
            )}
          >
            Saved
          </div>
          <div
            onClick={() => handleQueryCategory("friends")}
            className={cn(
              "w-full p-2 text-center rounded-sm cursor-pointer",
              activeUrl() === "friends"
                ? "bg-primary text-white"
                : "bg-gray-200"
            )}
          >
            Friends
          </div>
        </section>
        {activeUrl() === "my-blogs" || activeUrl() === null ? (
          <MyBlogsContainer userId={userId} />
        ) : activeUrl() === "favorites" ? (
          <MyFavoritesContainer userId={userId} />
        ) : activeUrl() === "saved" ? (
          <MySavedContainer userId={userId} />
        ) : activeUrl() === "friends" ? (
          <MyFriendsContainer userId={userId} />
        ) : null}
      </div>
    </Suspense>
  );
}
