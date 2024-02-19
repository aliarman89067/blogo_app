"use client";
import React, { useEffect, useState, Suspense } from "react";
import ProfileCoverImage from "@/components/profile-components/ProfileCoverImage";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { PostCreate } from "@/components/profile-components/PostCreate";
import { trpc } from "@/app/_trpc/client";
import { useUser } from "@/store/store";
import { UserPost } from "@/components/profile-components/UserPost";
import ActivityTypeContainer from "@/components/profile-components/ActivityTypeContainer";
import { Spinner } from "@/components/mini-components/Spinner";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [postImageUrl, setPostImageUrl] = useState<string>("");
  const [postCaption, setPostCaption] = useState<string>("");

  //API HANDLING HERE
  const context = trpc.useContext();
  const { mutate: createPostMutation } = trpc.createPost.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });

  // user store data
  const { user } = useUser();
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetch("/api/getUserData");
      const { rest } = await data.json();
      setUserData(rest);
    };
    fetchUserData();
  }, []);
  if (!userData) {
    return (
      <div className="w-full h-[calc(100vh-90px)] flex flex-col justify-center items-center gap-2">
        <Spinner />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  const activityQueryHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: "/profile",
        query: {
          page: "my-activity",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };
  const profileQueryHandler = () => {
    const url = qs.stringifyUrl(
      {
        url: "/profile",
        query: {
          "": "",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };
  const activeUrl = () => {
    // @ts-ignore
    return searchParams?.get("page");
  };

  //FUNTIONS HERE
  const createPostHandle = () => {
    setPostCaption("");
    setPostImageUrl("");
    if (!user || !user.id) {
      return;
    }
    createPostMutation({
      caption: postCaption,
      imageUrl: postImageUrl,
      authorId: user?.id,
    });
  };
  return (
    <Suspense>
      <section className="bg-gray-100 w-full min-h-screen flex justify-center">
        <div className="w-full max-w-4xl bg-white min-h-screen">
          <div className="flex flex-col">
            {/* Cover Image and Name */}
            <ProfileCoverImage
              name={userData?.name!}
              image={userData?.image!}
              coverImage={userData?.coverImage!}
            />
            {/* profile and my activity links */}
            <div className="flex justify-evenly my-2 gap-4 px-8">
              <div
                onClick={profileQueryHandler}
                className={cn(
                  "w-full p-2 text-center rounded-sm cursor-pointer",
                  activeUrl() === null ? "bg-neon text-white" : "bg-gray-200"
                )}
              >
                My profile
              </div>
              <div
                onClick={activityQueryHandler}
                className={cn(
                  "w-full p-2 text-center rounded-sm cursor-pointer",
                  activeUrl() === "my-activity"
                    ? "bg-neon text-white"
                    : "bg-gray-200"
                )}
              >
                My activity
              </div>
            </div>
            {/* Profile Body */}
            {activeUrl() === null ? (
              <>
                <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto px-8 mt-10">
                  <PostCreate
                    postImageUrl={postImageUrl}
                    setPostImageUrl={setPostImageUrl}
                    postCaption={postCaption}
                    setPostCaption={setPostCaption}
                    onClick={createPostHandle}
                  />
                </div>
                <UserPost authorId={user?.id!} />
              </>
            ) : activeUrl() === "my-activity" ? (
              <>
                <ActivityTypeContainer userId={userData.id} />
              </>
            ) : null}
          </div>
        </div>
      </section>
    </Suspense>
  );
}
