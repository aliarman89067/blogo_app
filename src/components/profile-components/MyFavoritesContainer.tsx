import { trpc } from "@/app/_trpc/client";
import React from "react";
import { Spinner } from "@/components/mini-components/Spinner";
import LongBlogCard from "../LongBlogCard";
import blogNotFound from "../../../public/lottie/blogNotFound.json";
import Lottie from "lottie-react";

export default function MyFavoritesContainer({ userId }: { userId: string }) {
  const { data, isLoading } = trpc.getUserFavoritesData.useQuery({ userId });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-start gap-2">
        <Spinner />
        <p>This won&apos;t take long</p>
      </div>
    );
  }
  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center mt-12">
        <div className="w-[200px]">
          <Lottie
            animationData={blogNotFound}
            loop={true}
            autoPlay={true}
            className="w-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center -mt-2">
          Your did&apos;t like any blog
        </h3>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-3">
      {data?.map((item) => (
        <LongBlogCard key={item.id} item={item} isFavorite />
      ))}
    </div>
  );
}
