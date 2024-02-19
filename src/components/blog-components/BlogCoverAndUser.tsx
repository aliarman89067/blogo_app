"use client";
import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import { BookmarkCheck, Heart, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useLoginModal, useUser } from "@/store/store";
import { Playfair } from "next/font/google";
import { cn } from "@/lib/utils";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { RefObject } from "react";
import Link from "next/link";
// fill bookmark
import { FaBookmark } from "react-icons/fa6";
// empty bookmark
import { FaRegBookmark } from "react-icons/fa6";

interface BlogCoverAndUserProps {
  blogId: string;
  title: string;
  imageUrl: string;
  authorImage: string | null | undefined;
  authorName: string;
  publishedDate: string;
  likes: string[];
  authorId: string;
  scrollRef: RefObject<HTMLDivElement>;
  saved: string[];
  authorRequest: string[];
  authorFriendList: string[];
}

const fonts = Playfair({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const BlogCoverAndUser = ({
  blogId,
  title,
  imageUrl,
  authorImage,
  authorName,
  publishedDate,
  likes,
  authorId,
  scrollRef,
  saved,
  authorRequest,
  authorFriendList,
}: BlogCoverAndUserProps) => {
  const context = trpc.useContext();

  //Get all Comment to get Comment Count
  const { data: allComments } = trpc.countCommentsNumber.useQuery({
    postId: blogId,
  });

  const { mutate: likeMutation } = trpc.likeblog.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: saveMutation } = trpc.saveBlog.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { user } = useUser();
  const { openLoginModal } = useLoginModal();

  const likeHandler = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    likeMutation({ userId: user?.id, blogId: blogId });
  };
  const { mutate: requestMutation, data } = trpc.sendRequest.useMutation({
    onSuccess: ({ id, image, name, friendList }) => {
      context.invalidate();
    },
  });
  const { mutate: unfriendMutation } = trpc.unFriend.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const scrollToCommentsHandler = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const saveHandler = () => {
    if (!user || !user?.id) {
      openLoginModal();
      return;
    }
    saveMutation({ userId: user?.id, blogId: blogId });
  };
  const addFriendHandle = () => {
    if (!user || !user?.id) {
      openLoginModal();
      return;
    }
    requestMutation({ userId: user?.id, peopleId: authorId });
  };

  return (
    <>
      {/* Title */}
      <h3
        className={cn(
          "text-5xl font-semibold text-neon leading-[50px]",
          fonts.className
        )}
      >
        {title}
      </h3>
      {/* User Table */}
      <div className="w-full flex flex-col justify-center px-4 py-2 rounded-md">
        <div className="flex items-center gap-12">
          <Link
            href={`/profile/${authorId}`}
            className="flex items-center gap-3"
          >
            {authorImage ? (
              <div className="relative h-12 w-12 rounded-full bg-white flex justify-center items-center">
                <Image
                  src={authorImage}
                  alt={`Profile photo of ${authorName}`}
                  fill
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-12 w-12 rounded-full bg-white border border-gray-400 flex justify-center items-center">
                <User className="text-gray-600" />
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-sm text-gray-800">{authorName}</p>
              {authorFriendList.includes(user?.id!) ? (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    unfriendMutation({ userId: user?.id!, friendId: authorId });
                  }}
                  className="text-sm text-red-700 cursor-pointer"
                >
                  Unfriend
                </p>
              ) : (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    addFriendHandle();
                  }}
                  className="text-sm text-blue-700 cursor-pointer"
                >
                  {user ? (
                    <>
                      {authorRequest.includes(user?.id)
                        ? "Cancel request"
                        : "Add friend"}
                    </>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openLoginModal();
                      }}
                    >
                      Add friend
                    </div>
                  )}
                </p>
              )}
            </div>
          </Link>
          <div className="w-[1px] h-[40px] bg-gray-400 rounded-md" />
          {/* Published Date */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">Published Date</p>
            {publishedDate && (
              <p className="text-sm text-gray-800">
                {format(publishedDate, "MMM-dd-yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Blog Cover Image */}
      <div className="relative w-full h-[300px] lg:h-[400px]">
        <Image
          src={imageUrl!}
          alt={`Cover image of ${title}`}
          fill
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      {/* Functional buttons */}
      <div className="flex items-end justify-center gap-10">
        <span
          className="flex flex-col justify-center items-center cursor-pointer"
          onClick={likeHandler}
        >
          {likes.includes(user?.id!) ? (
            <>
              <FaHeart className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">Like {likes.length}</p>
            </>
          ) : (
            <>
              <FaRegHeart className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Like {likes.length}</p>
            </>
          )}
        </span>
        <span
          onClick={scrollToCommentsHandler}
          className="flex flex-col justify-center items-center cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <p className="text-gray-600 text-sm">Comment {allComments?.length}</p>
        </span>
        <span
          onClick={saveHandler}
          className="flex flex-col justify-center items-center cursor-pointer"
        >
          {saved.includes(blogId) ? (
            <>
              <FaBookmark className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Saved</p>
            </>
          ) : (
            <>
              <FaRegBookmark className="w-5 h-5 text-gray-600" />
              <p className="text-gray-600 text-sm">Save</p>
            </>
          )}
        </span>
      </div>
    </>
  );
};
