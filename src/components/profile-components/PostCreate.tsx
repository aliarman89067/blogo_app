"use client";
import { Image as ImageIcon } from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";
import { useState } from "react";
import { Spinner } from "../mini-components/Spinner";
import Image from "next/image";
import { useUser } from "@/store/store";
import { cn } from "@/lib/utils";

interface PostCreateProps {
  postImageUrl: string;
  setPostImageUrl: (url: string) => void;
  postCaption: string;
  setPostCaption: (url: string) => void;
  onClick: () => void;
}

export const PostCreate = ({
  postImageUrl,
  setPostImageUrl,
  postCaption,
  setPostCaption,
  onClick,
}: PostCreateProps) => {
  const { user } = useUser();

  const [postImageLoading, setPostImageLoading] = useState<boolean>(false);
  const postImageHandler = (files: any) => {
    if (files.target.files[0] && files.target.files[0].name) {
      setPostImageUrl("");
      setPostImageLoading(true);
      const storage = getStorage(app);
      const fileName = new Date() + files.target.files[0].name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(
        storageRef,
        files.target.files[0]
      );
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          const progress =
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        },
        (error: any) => {
          setPostImageLoading(false);
        },
        () => {
          getDownloadURL(storageRef).then((url) => {
            setPostImageLoading(false);
            setPostImageUrl(url);
          });
        }
      );
    }
  };
  return (
    <div className="w-full bg-gray-200 rounded-md p-4">
      <div className="flex flex-col gap-2">
        <p className="text-gray-700 text-lg font-medium mb-2">
          Create something awesome
        </p>
        <textarea
          value={postCaption}
          onChange={(e) => setPostCaption(e.target.value)}
          placeholder={`What's in your mind ${user?.name}...`}
          className="resize-none w-full h-[90px] outline-none border border-gray-400 rounded-md p-2 text-sm text-neon"
        ></textarea>
        <label className="w-full p-2 rounded-sm flex flex-col justify-center items-center bg-white border border-gray-400 hover:bg-gray-200 transition cursor-pointer">
          {postImageLoading ? (
            <div className="flex flex-col gap-2 justify-center items-center">
              <Spinner />
              <p>This won&apos;t take long</p>
            </div>
          ) : !postImageLoading && postImageUrl ? (
            <div className="group relative w-full h-[400px] bg-gray-400 rounded-lg">
              <div className="absolute z-50 top-0 left-0 w-full h-full flex flex-col gap-2 justify-center items-center opacity-0 hover:opacity-100 transition hover:bg-black/80">
                <p className="text-white text-center">Change post image</p>
                <ImageIcon className="text-white h-8 w-8" />
              </div>
              <Image
                src={postImageUrl}
                alt="post image"
                fill
                className="w-full h-full object-cover rounded-lg"
              />
              <input
                disabled={postImageLoading}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={postImageHandler}
              />
            </div>
          ) : (
            <>
              <ImageIcon className="w-5 h-5 text-gray-700" />
              <p className="text-gray-700">Select your image</p>
              <input
                disabled={postImageLoading}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={postImageHandler}
              />
            </>
          )}
        </label>
        <button
          disabled={postImageUrl && postCaption ? false : true}
          onClick={onClick}
          className={cn(
            "max-w-[140px] py-2 rounded-sm bg-primary text-white text-sm",
            postImageUrl && postCaption
              ? "cursor-pointer opacity-100"
              : "opacity-60 cursor-not-allowed"
          )}
        >
          Create Post
        </button>
      </div>
    </div>
  );
};
