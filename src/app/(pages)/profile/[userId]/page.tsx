"use client";
import React, { useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import PeoplePost from "@/components/profile-components/PeoplePost";
import PeopleProfileCoverImage from "@/components/profile-components/PeopleProfileCoverImage";
import { Spinner } from "@/components/mini-components/Spinner";

export default function Page({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const { mutate: userDataMutation, data } = trpc.getUserById.useMutation({
    onSuccess: () => {},
  });
  useEffect(() => {
    userDataMutation({ userId });
  }, []);
  if (!data) {
    return (
      <div className="w-full h-[calc(100vh-90px)] flex flex-col justify-center items-center gap-2">
        <Spinner />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <section className="bg-gray-100 w-full min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white min-h-screen">
        <div className="flex flex-col">
          <PeopleProfileCoverImage
            name={data?.name}
            coverImage={data?.coverImage}
            image={data?.image}
          />
          <PeoplePost authorId={userId} />
        </div>
      </div>
    </section>
  );
}
