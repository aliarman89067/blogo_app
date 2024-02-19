"use client";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@/components/mini-components/Spinner";
import Lottie from "lottie-react";
import blogNotFound from "../../../../../public/lottie/blogNotFound.json";
// Import Swiper styles
import "swiper/css";
import { useRouter } from "next/navigation";
import { CategorySlider } from "@/components/mini-components/CategorySlider";
import Image from "next/image";
import { User } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function Page({ params }: { params: { categoryName: string } }) {
  const router = useRouter();
  const { categoryName } = params;

  const { data } = trpc.getBlogByCategory.useQuery({ category: categoryName });

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 h-[calc(100vh-48px)] w-full">
        <Spinner />
        <p className="text-gray-800 text-center">Loading...</p>
      </div>
    );
  }
  if (data && data.length === 0) {
    return (
      <section className="flex justify-center items-center w-full bg-gray-100 min-h-screen">
        <div className="flex flex-col bg-white max-w-5xl w-full mx-auto min-h-screen py-4 px-8">
          <div className="flex flex-col items-center gap-2">
            <CategorySlider categoryName={categoryName} />
            <div className="flex flex-col justify-center items-center w-full mt-20">
              <div className="w-[200px]">
                <Lottie
                  animationData={blogNotFound}
                  loop={true}
                  autoPlay={true}
                  className="w-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center -mt-2">
                No blog found for {categoryName} !
              </h3>
            </div>
          </div>
        </div>
      </section>
    );
  }
  const categoryLikeLength = data.reduce((acc, currVal) => {
    return acc + currVal.likes.length;
  }, 0);
  return (
    <section className="flex justify-center items-center w-full bg-gray-100 min-h-screen">
      <div className="flex flex-col bg-white max-w-5xl w-full mx-auto min-h-screen py-4 px-4 md:px-8">
        <div className="flex flex-col items-center gap-2">
          <CategorySlider categoryName={categoryName} />

          {/* Heading */}
          <h1 className="text-xl font-bold text-neon mt-4 text-center capitalize">
            {categoryName}
          </h1>
          {/* blogs and likes count */}
          <div className="flex gap-2 items-center">
            <p className="text-sm font-light text-gray-500">
              {data?.length} blogs
            </p>
            <div className="w-[0.5px] h-[15px] bg-gray-400 rounded-lg" />
            <p className="text-sm font-light text-gray-500">
              {categoryLikeLength} likes
            </p>
          </div>
          {/* body content */}
          <div className="flex flex-col gap-4 w-full mt-10">
            {data.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group w-full bg-gray-200 border border-gray-400 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex flex-col gap-2 py-2 lg:py-4 px-4 lg:px-8 w-full">
                  {/* user profile */}
                  <div className="flex items-center gap-2">
                    {blog.author.image ? (
                      <div className="w-12 h-12 rounded-full bg-gray-300">
                        <Image
                          src={blog.author.image!}
                          alt={`profile image of ${blog.author.name}`}
                          height={48}
                          width={48}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-500 flex justify-center items-center">
                        <User className="text-gray-800 h-7 w-7" />
                      </div>
                    )}
                    {/* author name and published date */}
                    <div className="flex flex-col">
                      {/* author name */}
                      <p className="text-gray-800">{blog.author.name}</p>
                      {/* published date */}
                      <p className="text-gray-600 text-sm font-light">
                        {format(blog.date, "MM-dd-yyyy")}
                      </p>
                    </div>
                    {/* vr */}
                    <div className="w-[0.5px] h-[40px] bg-gray-400 rounded-lg" />
                    {/* ratings */}
                    <p className="text-gray-600 text-sm font-light">
                      5.0 Ratings
                    </p>
                  </div>
                  {/* blog image */}
                  <div className="relative w-full flex justify-center items-center bg-gray-400 h-[300px] lg:h-[400px] rounded-md overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={`Cover image of ${blog.title}`}
                      fill
                      className="w-full h-full rounded-md object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  {/* title and description */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-neon">
                      {blog.title}
                    </h1>
                    <div
                      className="line-clamp-4 text-gray-700 font-light leading-5"
                      dangerouslySetInnerHTML={{ __html: blog.blog_text }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
