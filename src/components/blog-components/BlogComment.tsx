"use client";
import React, {
  FormEvent,
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Heart,
  MessageCircle,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { useLoginModal, useUser } from "@/store/store";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@/components/mini-components/Spinner";
import Image from "next/image";
import { format } from "date-fns";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ref } from "firebase/storage";
import { log } from "console";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BlogCommentProps {
  postId: string;
  scrollRef: RefObject<HTMLDivElement>;
}

export default function BlogComment({ postId, scrollRef }: BlogCommentProps) {
  const { user } = useUser();
  const { openLoginModal } = useLoginModal();
  const [commentText, setCommentText] = useState<string>("");
  const [childCommentText, setChildCommentText] = useState<string>("");
  const [isChildComment, setIsChildComment] = useState<boolean>(false);
  const [childCommentId, setChildCommentId] = useState<string>("");
  const [commentsReplyShowLimit, setCommentsReplyShowLimit] =
    useState<number>(1);

  const commentMessageHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      openLoginModal();
      return;
    }
    mainCommentMutation({
      authorId: user?.id!,
      postId: postId,
      commentText: commentText,
    });
  };

  const commentLikeHandler = (commentId: string) => {
    if (!user || !user.id) {
      openLoginModal();
      return;
    }
    likeCommentMutation({ commentId: commentId, commentorId: user.id });
  };

  const deleteCommentHandler = (commentId: string) => {
    deleteCommentMutation({ commentId });
  };
  const childCommentHandler = (e: FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !user.id) {
      openLoginModal();
      return;
    }
    childCommentMutation({
      authorId: user?.id,
      postId: postId,
      commentText: childCommentText,
      parentId: parentId,
    });
  };

  //Context
  const context = trpc.useContext();
  //Query Here
  const { data: commentsData } = trpc.getAllComments.useQuery({ postId });

  //Mutation Here
  const { mutate: mainCommentMutation } = trpc.createMainComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      context.invalidate();
    },
  });

  const { mutate: likeCommentMutation } = trpc.likeComment.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  const { mutate: deleteCommentMutation } = trpc.deleteComment.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });

  const { mutate: childCommentMutation } = trpc.createChildComment.useMutation({
    onSuccess: () => {
      context.invalidate();
      setIsChildComment(false);
      setChildCommentText("");
    },
  });

  return (
    <section ref={scrollRef} className="flex flex-col gap-3">
      {/* Comment Count */}
      <h3 className="text-lg text-gray-700">{commentsData?.length} Comment</h3>
      {/* All Comments */}
      {commentsData && commentsData.length > 0 ? (
        commentsData.map((data: any) =>
          !data.parentId ? (
            <>
              <div className="flex flex-col gap-4">
                <div className="relative bg-gray-200 rounded-md w-full p-2 flex flex-col">
                  {/* Your comments delete button */}
                  <div className="absolute top-3 right-2 cursor-pointer opacity-100 transition">
                    {data.author.id === user?.id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <GripVertical className="w-5 h-5 text-gray-800" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="bg-red-200 cursor-pointer"
                            onClick={() => deleteCommentHandler(data.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                  {/* commentor profile */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${data.author.id}`}
                      className="relative w-10 h-10 rounded-full border border-gray-600 overflow-hidden bg-white flex justify-center items-center"
                    >
                      {data.author.image ? (
                        <Image
                          src={data.author.image}
                          alt={`Profile image of ${data.author.name}`}
                          fill
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="text-gray-600 w-6 h-6" />
                      )}
                    </Link>
                    <div className="flex flex-col">
                      <Link
                        href={`/profile/${data.author.id}`}
                        className="text-gray-700 text-sm"
                      >
                        {data.author.name}
                      </Link>
                      <p className="text-xs text-gray-600">
                        {format(data.createdAt, "MMM-dd-yyyy")}
                      </p>
                    </div>
                  </div>
                  {/* Comment data */}
                  <div className="p-2 rounded-md w-full mt-2">
                    <p className="text-gray-800">{data.commentText}</p>
                  </div>
                  {/* button here */}
                  <div className="flex items-center gap-6 px-2 ">
                    <div
                      className="flex justify-center items-center gap-1 cursor-pointer"
                      onClick={() => commentLikeHandler(data.id)}
                    >
                      {data.likes.includes(user?.id!) ? (
                        <FaHeart className="h-4 w-4 text-red-600" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 text-gray-800" />
                      )}
                      <p className="text-sm text-gray-700">
                        {data.likes.length}
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        setIsChildComment((prev) => !prev);
                        setChildCommentId(data.id);
                      }}
                      className="flex justify-center items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-gray-800" />
                      <p className="text-sm text-gray-700">0</p>
                    </div>
                  </div>
                  {isChildComment && childCommentId === data.id ? (
                    <>
                      {/* My Child Comment */}

                      <form
                        onSubmit={(e) => childCommentHandler(e, data.id)}
                        className="flex items-center gap-2 ml-10 mt-6"
                      >
                        <div className="p-3 border border-gray-400 rounded-sm w-full flex gap-2 items-center">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Enter your message..."
                            className="w-full border-none outline-none bg-transparent"
                            value={childCommentText}
                            onChange={(e) =>
                              setChildCommentText(e.target.value)
                            }
                          />
                        </div>
                        <Button
                          className="py-6 px-8"
                          onClick={(e) => childCommentHandler(e, data.id)}
                        >
                          Comment
                          <Send className="w-4 h-4 ml-1" />
                        </Button>
                      </form>
                    </>
                  ) : null}
                  {data.children && data.children.length > 0
                    ? data.children.map((childData: any, index: number) =>
                        index <= commentsReplyShowLimit ? (
                          <>
                            <div
                              className={cn(
                                "w-full h-[0.5px] bg-gray-400 rounded-full my-4",
                                index === 0
                                  ? "w-full"
                                  : "w-[calc(100%-40px)] ml-auto"
                              )}
                            />
                            <div className="relative ml-8 border-gray-600">
                              {/* Your comments delete button */}
                              <div className="absolute top-3 right-2 cursor-pointer opacity-100 transition">
                                {childData.author.id === user?.id ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <GripVertical className="w-5 h-5 text-gray-800" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        className="bg-red-200 cursor-pointer"
                                        onClick={() =>
                                          deleteCommentHandler(childData.id)
                                        }
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : null}
                              </div>
                              {/* commentor profile */}
                              <div className="flex items-center gap-2">
                                <div className="relative w-10 h-10 rounded-full border border-gray-600 overflow-hidden bg-white flex justify-center items-center">
                                  {childData.author.image ? (
                                    <Image
                                      src={childData.author.image}
                                      alt={`Profile image of ${childData.author.name}`}
                                      fill
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <User className="text-gray-600 w-6 h-6" />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-gray-700 text-sm">
                                    {childData.author.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {format(data.createdAt, "MMM-dd-yyyy")}
                                  </p>
                                </div>
                              </div>
                              {/* Comment data */}
                              <div className="p-2 rounded-md w-full mt-2">
                                <p className="text-gray-800">
                                  {childData.commentText}
                                </p>
                              </div>
                              {/* button here */}
                              <div className="flex items-center gap-6 px-2 ">
                                <div
                                  className="flex justify-center items-center gap-1 cursor-pointer"
                                  onClick={() =>
                                    commentLikeHandler(childData.id)
                                  }
                                >
                                  {childData.likes.includes(user?.id!) ? (
                                    <FaHeart className="h-4 w-4 text-red-600" />
                                  ) : (
                                    <FaRegHeart className="h-4 w-4 text-gray-800" />
                                  )}
                                  <p className="text-sm text-gray-700">
                                    {childData.likes.length}
                                  </p>
                                </div>
                              </div>
                              {isChildComment &&
                              childCommentId === childData.id ? (
                                <>
                                  {/* My Child Comment */}

                                  <form
                                    onSubmit={(e) =>
                                      childCommentHandler(e, childData.id)
                                    }
                                    className="flex items-center gap-2 ml-10 mt-6"
                                  >
                                    <div className="p-3 border border-gray-400 rounded-sm w-full flex gap-2 items-center">
                                      <MessageSquare className="h-5 w-5 text-gray-400" />
                                      <input
                                        type="text"
                                        placeholder="Enter your message..."
                                        className="w-full border-none outline-none bg-transparent"
                                        value={childCommentText}
                                        onChange={(e) =>
                                          setChildCommentText(e.target.value)
                                        }
                                      />
                                    </div>
                                    <Button
                                      className="py-6 px-8"
                                      onClick={(e) =>
                                        childCommentHandler(e, data.id)
                                      }
                                    >
                                      Comment
                                      <Send className="w-4 h-4 ml-1" />
                                    </Button>
                                  </form>
                                </>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <button
                            key={index}
                            onClick={() =>
                              setCommentsReplyShowLimit(data.children.length)
                            }
                            className="w-[150px] ml-8 mt-5 bg-neon text-white py-2 rounded-sm hover:bg-neon/90 transition text-sm font-light"
                          >
                            {data.children.length - 2} Reply more
                          </button>
                        )
                      )
                    : null}
                  {commentsReplyShowLimit > 1 ? (
                    <button
                      onClick={() => setCommentsReplyShowLimit(1)}
                      className="w-[150px] ml-8 mt-5 bg-neon text-white py-2 rounded-sm hover:bg-neon/90 transition text-sm font-light"
                    >
                      Show less
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null
        )
      ) : commentsData && commentsData.length === 0 ? (
        <>
          <p className="text-gray-800">
            No comment yet. Be the first to comment
          </p>
        </>
      ) : (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {/* My Comment */}
      <form
        onSubmit={commentMessageHandler}
        className="flex items-center gap-2"
      >
        <div className="p-3 border border-gray-400 rounded-sm w-full flex gap-2 items-center">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter your message..."
            className="w-full border-none outline-none"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </div>
        <Button className="py-6 px-8" onClick={commentMessageHandler}>
          Comment
          <Send className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </section>
  );
}
