import { blogsData } from "@/utils/data";
import React from "react";
import LongBlogCard from "./LongBlogCard";
import CategoriesPanel from "./CategoriesPanel";
import { trpc } from "@/app/_trpc/client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

export default function BlogsContainer() {
  const { data, isLoading } = trpc.getAllBlogs.useQuery();

  const router = useRouter();
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-[2.5fr,1fr] gap-0 lg:gap-8">
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <Skeleton count={10} className="h-32 mb-3" />
        ) : (
          data?.map((item) => <LongBlogCard key={item.id} item={item} />)
        )}
      </div>
      <div className="relative max-lg:-order-1 max-lg:mb-4">
        <CategoriesPanel />
      </div>
    </section>
  );
}
