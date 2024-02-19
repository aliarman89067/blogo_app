import Image from "next/image";
import React from "react";
import { Image as ImageIcon, User } from "lucide-react";

interface PeopleProfileCoverImageProps {
  name: string;
  image: string | null;
  coverImage: string | null;
}

export default function PeopleProfileCoverImage({
  name,
  image,
  coverImage,
}: PeopleProfileCoverImageProps) {
  return (
    <div className="group relative w-full h-[300px]">
      <div className="relative w-full h-full bg-gray-300 flex justify-center items-center z-10">
        {coverImage ? (
          <Image
            src={coverImage!}
            alt={`Cover image of ${name}`}
            layout="fill"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <ImageIcon className="text-gray-600 h-[100px] w-[100px]" />
          </div>
        )}
        <div className="absolute left-0 bottom-0 flex items-center gap-4 mx-10 my-5 z-10">
          <div className="group relative w-36 h-36 rounded-full flex justify-center items-center border-8 border-white bg-gray-400">
            {image ? (
              <Image
                src={image!}
                alt={`profile pic of ${name}`}
                width={144}
                height={144}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-[60px] h-[60px] text-white" />
            )}
          </div>
          <p
            style={{ textShadow: "0 0 10px #000" }}
            className="text-white text-lg font-medium"
          >
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
