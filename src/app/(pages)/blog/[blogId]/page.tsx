"use client";
import React, { useRef } from "react";
import { trpc } from "@/app/_trpc/client";
import Lottie from "lottie-react";
import blogNotFound from "../../../../../public/lottie/blogNotFound.json";
import { BlogCoverAndUser } from "@/components/blog-components/BlogCoverAndUser";
import { BlogContent } from "@/components/blog-components/BlogContent";
import BlogComment from "@/components/blog-components/BlogComment";
import { Spinner } from "@/components/mini-components/Spinner";

export default function Page({ params }: { params: { blogId: string } }) {
  const { data, error, isError, isLoading } = trpc.getBlog.useQuery({
    blogId: params.blogId,
  });
  const ref = useRef<HTMLDivElement>(null);
  if (error?.data?.code === "NOT_FOUND") {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-48px)]">
        <div className="w-[200px]">
          <Lottie
            animationData={blogNotFound}
            loop={true}
            autoPlay={true}
            className="w-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center -mt-2">
          Your desired blog not found!
        </h3>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-48px)]">
        <div className="w-[200px]">
          <Lottie
            animationData={blogNotFound}
            loop={true}
            autoPlay={true}
            className="w-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 text-center -mt-2">
          Something went wrong please try again!
        </h3>
      </div>
    );
  }
  return (
    <>
      {!isLoading && data?.imageUrl ? (
        <section className="bg-gray-100 min-h-screen w-full height-full flex flex-col justify-center items-center">
          <div className="min-h-screen w-full max-w-5xl bg-white px-4 py-10 lg:px-8 lg:py-14 flex flex-col gap-4">
            <BlogCoverAndUser
              authorId={data.author.id}
              blogId={data.id}
              title={data.title}
              imageUrl={data.imageUrl}
              authorImage={data.author.image}
              authorName={data.author.name}
              authorRequest={data.author.requests}
              authorFriendList={data.author.friendList}
              publishedDate={data.date}
              likes={data.likes}
              scrollRef={ref}
              saved={data.author.saved}
            />
            <BlogContent blog={data.blog_text} />
            <BlogComment postId={data.id} scrollRef={ref} />
          </div>
        </section>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 h-[calc(100vh-48px)] w-full">
          <Spinner />
          <p className="text-gray-800 text-center">Blog is loading</p>
        </div>
      )}
    </>
  );
}
