"use client";
import Image from "next/image";
import React, { useState } from "react";
import { format } from "date-fns";
import "react-quill/dist/quill.snow.css";
import { Edit, Trash, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/store/store";
// fill heart
import { FaHeart } from "react-icons/fa6";
// empty heart
import { FaRegHeart } from "react-icons/fa6";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
// fill bookmark
import { FaBookmark } from "react-icons/fa6";
// empty bookmark
import { FaRegBookmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface LongBlogCardProps {
  item: {
    title: string;
    imageUrl: string;
    blog_text: string;
    category: string;
    id: string;
    authorId: string;
    likes?: string[];
    date: string;
    categoryDatabase: string;
    rating: number | null;
    author: {
      name: string;
      email: string;
      id: string;
      favorites?: string[];
      saved?: string[];
      image: string | null;
    };
  };
  isFavorite?: boolean;
  isMyBlog?: boolean;
  isSaved?: boolean;
}

export default function LongBlogCard({
  item: {
    title,
    likes,
    imageUrl,
    blog_text,
    category,
    id,
    date,
    author,
    categoryDatabase,
    rating,
  },
  isFavorite,
  isMyBlog,
  isSaved,
}: LongBlogCardProps) {
  const context = trpc.useContext();
  const { mutate: likeMutation } = trpc.likeblog.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: deleteMutation } = trpc.deleteBlog.useMutation({
    onSuccess: () => {
      context.invalidate();
      setConfirmDelete(false);
    },
  });
  const { mutate: saveMutation } = trpc.saveBlog.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  // states
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  // stores
  const { user } = useUser();
  // functions
  const favoriteLikeHandle = () => {
    if (!user?.id) {
      return;
    }
    likeMutation({ userId: user.id, blogId: id });
  };
  const deleteBlogHandle = (blogId: string) => {
    deleteMutation({ blogId });
  };
  const saveHandler = () => {
    if (!user || !user?.id) {
      return;
    }
    saveMutation({ blogId: id, userId: user?.id });
  };
  const router = useRouter();
  return (
    <>
      {confirmDelete ? (
        <div className="fixed top-0 left-0 w-[100vw] z-50 min-h-screen h-full bg-black/50 flex justify-center items-center p-4">
          <div className="max-w-[350px] md:max-w-[450px] w-full px-4 py-6 rounded-md flex flex-col items-center gap-4 bg-white">
            <p className="font-medium text-neon text-center">
              Are you absolutely sure you want to delete this blog?
            </p>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => deleteBlogHandle(id)}
                variant="destructive"
              >
                Delete
              </Button>
              <Button
                onClick={() => setConfirmDelete(false)}
                variant="ghost"
                className="bg-gray-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <Link
        href={`/blog/${id}`}
        className="relative w-full cursor-pointer flex items-center gap-4 bg-gray-100 rounded-md border border-gray-300 p-3 shadow-sm hover:shadow-lg transition overflow-hidden"
      >
        {/* favorite start */}
        {isFavorite ? (
          <div
            className="absolute top-2 right-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              favoriteLikeHandle();
            }}
          >
            <div className="group w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
              {likes?.includes(user?.id!) ? (
                <FaHeart className="h-4 w-4 text-red-600 group-hover:h-5 group-hover:w-5 transition-all duration-200" />
              ) : (
                <FaRegHeart className="h-4 w-4 text-gray-800 group-hover:h-5 group-hover:w-5 transition duration-200" />
              )}
            </div>
          </div>
        ) : null}
        {/* favorite end */}
        {/* saved start */}
        {isSaved ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              favoriteLikeHandle();
            }}
            className="absolute top-2 right-4 cursor-pointer"
          >
            <div className="group w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
              <span
                onClick={saveHandler}
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                {author?.saved?.includes(id) ? (
                  <>
                    <FaBookmark className="w-4 h-4 text-gray-600 group-hover:w-5 group-hover:h-5 transition duration-200" />
                  </>
                ) : (
                  <>
                    <FaRegBookmark className="w-4 h-4 text-gray-600 group-hover:w-5 group-hover:h-5 transition duration-200" />
                  </>
                )}
              </span>
            </div>
          </div>
        ) : null}
        {/* saved end */}
        {/* my blog start */}
        {isMyBlog ? (
          <div className="absolute top-2 right-4 flex gap-3 items-center">
            <div
              className="group w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmDelete(true);
              }}
            >
              <Trash className="h-4 w-4 text-gray-800 group-hover:h-5 group-hover:w-5 group-hover:text-red-600 transition" />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/edit-blog/${id}`);
              }}
              className="group w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center"
            >
              <Edit className="h-4 w-4 text-gray-800 group-hover:h-5 group-hover:w-5 group-hover:text-green-600 transition" />
            </div>
          </div>
        ) : null}
        {/* my blog end */}
        <div className="w-52 h-30 flex shrink-0">
          <img
            src={imageUrl}
            alt={`${title} image`}
            className="w-52 h-[190px] object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-2 items-center">
            {author.image ? (
              <div className="h-8 w-8 rounded-full">
                <Image
                  src={author.image}
                  alt={`${author.name} image`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full border border-gray-600 bg-white flex justify-center items-center">
                <User className="text-gray-600" />
              </div>
            )}
            <p className="text-sm text-gray-700">{author.name}</p>
          </div>
          <h3 className="text-base text-neon truncate font-medium wordwrap line-clamp-1">
            {title}
          </h3>
          <div
            className="line-clamp-3 text-sm text-gray-700 font-light leading-5 wordwrap"
            dangerouslySetInnerHTML={{ __html: blog_text }}
          ></div>

          <div
            onClick={() => router.push(`category/${categoryDatabase}`)}
            className="text-xs border border-gray-300 rounded-lg bg-transparent outline-none hover:bg-primary transition text-gray-700 hover:text-white px-4 py-2 self-start"
          >
            {category}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[13px] text-gray-700">
              {format(new Date(date), "MMM-dd-yyyy")}
            </p>
            <div className="w-[1px] h-[16px] rounded-full bg-neon" />
            <p className="text-[13px] text-gray-700">{rating! / 10} Ratings</p>
          </div>
        </div>
      </Link>
    </>
  );
}
