"use client";
import { trpc } from "@/app/_trpc/client";
import { format } from "date-fns";
import {
  GripVertical,
  MessageSquare,
  SendHorizonal,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoginModal, useUser } from "@/store/store";
// fill heart
import { FaHeart } from "react-icons/fa6";
// empty heart
import { FaRegHeart } from "react-icons/fa6";

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  likes: string[];
  authorId: string;
  date: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  comments: {
    id: string;
    author: {
      id: string;
      image: string | null;
      name: string;
    };
    commentText: string;
    date: string;
    likes: string[];
  }[];
}

export default function PeoplePost({ authorId }: { authorId: string }) {
  // API HANDLING
  const context = trpc.useContext();
  const { data: postsData } = trpc.getAllPost.useQuery({ authorId });
  const { mutate: deletePostMutation } = trpc.deletePost.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: postLikeMutation } = trpc.likePost.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: postDeleteMutation } = trpc.postCommentDelete.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: postCommentLikeMutation } = trpc.postCommentLikes.useMutation(
    {
      onSuccess: () => {
        context.invalidate();
      },
    }
  );
  const { mutate: postCommentMutation } = trpc.createPostComment.useMutation({
    onSuccess: () => {
      setPostCommentText("");
      context.invalidate();
    },
  });
  // hooks
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);
  const [isCommentOpenId, setIsCommentOpenId] = useState<string>("");
  const [postCommentText, setPostCommentText] = useState<string>("");
  // user from store
  const { user } = useUser();
  const { openLoginModal } = useLoginModal();
  //   functions
  const deletePostHandler = (postId: string) => {
    deletePostMutation({ postId });
  };
  const likePostHandler = (postId: string, userId: string) => {
    postLikeMutation({ postId, userId });
  };
  const commentPanelOpen = (postId: string) => {
    setPostCommentText("");
    setIsCommentOpenId(postId);
    setIsCommentOpen((prev) =>
      !isCommentOpenId
        ? true
        : isCommentOpenId !== postId
        ? true
        : isCommentOpenId === postId
        ? !prev
        : true
    );
  };
  const deletePostCommentHandle = (postCommentId: string) => {
    postDeleteMutation({ commentId: postCommentId });
  };
  const postCommentLikesHandle = (commentId: string, authorId: string) => {
    postCommentLikeMutation({ commentId, authorId });
  };
  const postCommentHandler = (
    e: FormEvent,
    commentText: string,
    postId: string,
    userId: string
  ) => {
    e.preventDefault();
    if (!user || !user.id) {
      openLoginModal();
      return;
    }
    postCommentMutation({ commentText, postId, userId });
  };
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4 items-center justify-start my-10">
      {postsData && postsData.length > 0
        ? postsData.map((post: Post) => (
            <div
              key={post.id}
              className="w-full bg-gray-100 rounded-md py-4 px-8 border border-gray-200"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {post.author.image ? (
                      <div className="h-12 w-12 rounded-full">
                        <Image
                          src={post.author.image}
                          alt={`profile image of ${post.author.name}`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-white rounded-full border border-gray-400 flex justify-center items-center">
                        <User className="h-8 w-8 text-gray-400 " />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-700">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-gray-400 font-light">
                        {format(post.date, "MMM-dd-yyyy")}
                      </p>
                    </div>
                  </div>
                  {user?.id === post.author.id ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <GripVertical className="w-5 h-5 text-gray-800 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="bg-red-200 cursor-pointer"
                          onClick={() => deletePostHandler(post.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
                <div className="w-full flex wordwrap">
                  <p className="text-gray-800 w-full">{post.caption}</p>
                </div>
                <div className="relative w-full h-[400px] rounded-md">
                  <Image
                    src={post.imageUrl}
                    alt={`${post.author.name} post`}
                    fill
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => likePostHandler(post.id, user?.id!)}
                    className="flex items-center justify-center p-1 rounded-sm gap-1 w-full text-center hover:bg-gray-200 transition"
                  >
                    {post.likes.includes(user?.id!) ? (
                      <>
                        <FaHeart className="h-5 w-5 text-red-600" />
                        <p className="text-red-600">{post.likes.length}</p>
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="h-5 w-5 text-gray-500" />
                        <p className="text-gray-500">{post.likes.length}</p>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => commentPanelOpen(post.id)}
                    className="flex items-center justify-center p-1 rounded-sm gap-1 w-full text-center hover:bg-gray-200 transition"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-500">{post.comments.length}</p>
                  </button>
                  <button className="flex items-center justify-center p-1 rounded-sm gap-1 w-full text-center hover:bg-gray-200 transition">
                    <Upload className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              {isCommentOpen && isCommentOpenId === post.id ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full flex flex-col gap-3">
                    {post.comments.length > 0 &&
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex flex-col gap-1 bg-white py-2 px-4 rounded-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {comment.author.image ? (
                                <div className="w-10 h-10 rounded-full">
                                  <Image
                                    src={comment.author.image}
                                    alt={`Profile image of ${comment.author.name}`}
                                    width={40}
                                    height={40}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-400 flex justify-center items-center">
                                  <User className="h-7 w-7 text-gray-400" />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <p className="text-gray-800 text-sm font-light">
                                  {comment.author.name}
                                </p>
                                <p className="text-xs text-gray-600 font-light">
                                  {format(comment.date, "MMM-dd-yyyy")}
                                </p>
                              </div>
                            </div>
                            {comment.author.id === user?.id! ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <GripVertical className="h-4 w-4 text-gray-600 cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      deletePostCommentHandle(comment.id)
                                    }
                                    className="bg-red-200 cursor-pointer"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
                          <div className="mt-1">
                            <p className="text-neon">{comment.commentText}</p>
                          </div>
                          <div
                            onClick={() =>
                              postCommentLikesHandle(comment.id, user?.id!)
                            }
                            className="mt-1 flex items-center gap-1"
                          >
                            {comment.likes.includes(user?.id!) ? (
                              <>
                                <FaHeart className="h-4 w-4 text-red-600 cursor-pointer" />
                                <p className="text-sm text-red-600">
                                  {comment.likes.length}
                                </p>
                              </>
                            ) : (
                              <>
                                <FaRegHeart className="h-4 w-4 text-gray-600 cursor-pointer" />
                                <p className="text-sm text-gray-600">
                                  {comment.likes.length}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* your comment */}
                  <form
                    onSubmit={(e) =>
                      postCommentHandler(e, postCommentText, post.id, user?.id!)
                    }
                    className="flex items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      value={postCommentText}
                      onChange={(e) => setPostCommentText(e.target.value)}
                      placeholder="Enter your comment..."
                      className="w-full p-2 rounded-sm border border-gray-300 bg-white outline-none text-gray-800 text-sm"
                    />
                    <button
                      onClick={(e) =>
                        postCommentHandler(
                          e,
                          postCommentText,
                          post.id,
                          user?.id!
                        )
                      }
                      disabled={postCommentText.length > 0 ? false : true}
                      className="py-3 px-5 rounded-sm bg-neon hover:bg-neon/90 disabled:bg-neon/90 transition disabled:cursor-not-allowed"
                    >
                      <SendHorizonal className="text-white h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))
        : null}
    </div>
  );
}
