"use client";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@/components/mini-components/Spinner";
import Lottie from "lottie-react";
import blogNotFound from "../../../public/lottie/blogNotFound.json";
import { User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyFriendsContainer({ userId }: { userId: string }) {
  const context = trpc.useContext();
  const { data, isLoading } = trpc.gettingMyFriends.useQuery({ userId });
  const { mutate } = trpc.unFriend.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  if (!data && isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <Spinner />
        <p>Loading...</p>
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
          Your have no friends let&apos;s make some friends
        </h3>
      </div>
    );
  }
  return (
    <section className="flex flex-col gap-3 w-full">
      {data?.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center justify-between px-3 py-5 border border-gray-300 rounded-md"
        >
          <div className="flex items-center gap-2">
            {friend.image ? (
              <div className="relative h-12 w-12 rounded-full">
                <Image
                  src={friend.image!}
                  alt={`${friend.name} profile image`}
                  fill
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="h-12 w-12 flex justify-center items-center rounded-full border border-gray-600">
                <User className="text-gray-600 w-8 h-8" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-700">{friend.name}</p>
              <p className="text-sm text-gray-600">
                {friend.friendList.length}{" "}
                {friend.friendList.length > 1 ? "Friends" : "Friend"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate({ userId: userId, friendId: friend.id })}
            >
              Unfriend
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
