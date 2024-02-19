"use client";
import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import TrendingCard from "@/components/TrendingCard";
import { trendingData } from "@/utils/data";
import { motion, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import BlogsContainer from "@/components/BlogsContainer";
import { trpc } from "../_trpc/client";
import { Spinner } from "@/components/mini-components/Spinner";
import Link from "next/link";

export default function HomePage() {
  const { data, isLoading } = trpc.trendingBlogs.useQuery();

  const ref = useRef(null);
  const isInView = useInView(ref);
  const animation = useAnimation();
  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        animation.start("visible");
      }, 300);
    }
  }, [isInView]);

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col w-full space-y-10">
        {/* Header Section */}
        <Header />
        {/* Trending Section */}
        {data && data.length > 0 && !isLoading ? (
          <div className="w-full flex flex-col items-center sm:items-start border-b border-gray-400 pb-8">
            <div className="mb-3">
              <h1 className="text-3xl text-neon font-medium">Trending Blogs</h1>
            </div>
            <section
              ref={ref}
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {data.map((item, index) => (
                <TrendingCard key={index} item={item} />
              ))}
            </section>
            <Link
              className="bg-neon mx-auto my-4 hover:bg-neon/90 px-4 py-2 rounded-sm text-white text-sm font-light"
              href={`/trendings`}
            >
              See all trendings
            </Link>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="mb-3">
              <h1 className="text-3xl text-neon font-medium">Trending Blogs</h1>
            </div>
            <div className="flex flex-col gap-2 items-center mt-2">
              <Spinner />
              <p>Loading...</p>
            </div>
          </div>
        ) : null}

        {!isLoading && data?.length === 0 ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="mb-3">
              <h1 className="text-3xl text-neon font-medium">Trending Blogs</h1>
            </div>
            <div className="flex flex-col gap-2 items-center mt-2">
              <h3>No trending blogs found!</h3>
            </div>
          </div>
        ) : null}

        <BlogsContainer />
      </section>
    </MaxWidthWrapper>
  );
}
