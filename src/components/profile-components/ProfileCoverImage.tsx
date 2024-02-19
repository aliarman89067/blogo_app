import { app } from "@/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Image as ImageIcon, Pencil, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { Spinner } from "../mini-components/Spinner";
import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import { useUser } from "@/store/store";

interface ProfileCoverImageProps {
  name: string | null;
  image: string | null;
  coverImage: string | null;
}

export default function ProfileCoverImage({
  name,
  image,
  coverImage,
}: ProfileCoverImageProps) {
  const { updateUser } = useUser();
  const { mutate: coverImageMutate } = trpc.changeCoverImage.useMutation({
    onSuccess: () => {
      // If i want something on upload i can do it here
    },
  });

  const { mutate: profileImageMutate } = trpc.changeProfileImage.useMutation({
    onSuccess: ({ id, name, email, image }) => {
      // If i want something on upload i can do it here
      updateUser(id, name, email, image);
    },
  });
  const { mutate: userNameMutate } = trpc.changeUserName.useMutation({
    onSuccess: ({ id, name, email, image }) => {
      setUserName(name);
      setNewNameUpdating(false);
      updateUser(id, name, email, image);
    },
  });

  const [coverImageUploading, setCoverImageUploading] =
    useState<boolean>(false);

  const [profileImageUploading, setProfileImageUploading] =
    useState<boolean>(false);

  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const [isNameChanging, setIsNameChanging] = useState<boolean>(false);

  const [userName, setUserName] = useState<string | null>(name);

  const [newName, setNewName] = useState<string | null>(name);

  const [newNameUpdating, setNewNameUpdating] = useState<boolean>(false);

  const coverImageHandler = (files: any) => {
    const file = files.target.files[0];
    if (file && file.name) {
      setCoverImageUploading(true);
      const storage = getStorage(app);
      const fileName = Date.now() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          const progress =
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100;

          if (progress === 100) {
            setCoverImageUploading(false);
          }
        },
        (error) => {
          setCoverImageUploading(false);
        },
        () => {
          getDownloadURL(storageRef).then((url) => {
            setCoverImageUrl(url);
            coverImageMutate({ url });
          });
        }
      );
    }
  };

  const profileImageHandler = (files: any) => {
    const file = files.target.files[0];
    if (file && file.name) {
      setProfileImageUploading(true);
      // reduce image size start
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.createElement("img");
        // @ts-ignore
        img.src = event.target?.result;
        img.onload = function (event) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > width) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (!blob) {
              console.error("Failed to create blob from canvas content");
              return;
            }
            const storage = getStorage(app);
            const fileName = Date.now() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, blob);
            uploadTask.on(
              "state_changed",
              (snapShot) => {
                const progress =
                  (snapShot.bytesTransferred / snapShot.totalBytes) * 100;

                if (progress === 100) {
                  setProfileImageUploading(false);
                }
              },
              (error) => {
                setProfileImageUploading(false);
              },
              () => {
                getDownloadURL(storageRef).then((url) => {
                  setProfileImageUrl(url);
                  profileImageMutate({ url });
                });
              }
            );
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };
  const nameChangeHandler = () => {
    setIsNameChanging(true);
  };
  const updateName = (e: FormEvent) => {
    e.preventDefault();
    if (!newName) {
      return;
    }
    setNewNameUpdating(true);
    userNameMutate({ newName });
    setIsNameChanging(false);
  };
  window.addEventListener("click", () => {
    setIsNameChanging(false);
  });
  return (
    <div className="group relative w-full h-[300px] cursor-pointer">
      {coverImageUrl ? (
        <label className="relative w-full h-full bg-gray-300 flex justify-center items-center z-10 cover-image-container cursor-pointer">
          <Image
            src={coverImageUrl}
            alt={`Cover image of ${name}`}
            layout="fill"
            className="object-cover"
          />
          <p className="absolute top-[70%] left-[50%] -translate-x-[50%] z-50 text-white text-center transition change-image-text">
            Change Cover Image
          </p>
          <ImageIcon className="z-50 h-[100px] w-[100px] text-white change-image-text" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => coverImageHandler(e)}
          />
        </label>
      ) : coverImage ? (
        <label className="relative w-full h-full bg-gray-300 flex justify-center items-center z-10 cover-image-container cursor-pointer">
          <Image
            src={coverImage}
            alt={`Cover image of ${name}`}
            layout="fill"
            className="object-cover"
          />
          {coverImageUploading ? (
            <Spinner />
          ) : (
            <>
              <ImageIcon className="z-50 h-[100px] w-[100px] text-white change-image-text" />
              <p className="absolute top-[70%] left-[50%] -translate-x-[50%] z-50 text-white text-center transition change-image-text">
                Change Cover Image
              </p>
            </>
          )}
          <input
            disabled={coverImageUploading}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => coverImageHandler(e)}
          />
        </label>
      ) : (
        <label className="relative w-full h-full bg-gray-300 flex justify-center items-center z-10 cover-image-container cursor-pointer">
          {coverImageUploading ? (
            <Spinner />
          ) : (
            <>
              <p className="absolute top-[70%] left-[50%] -translate-x-[50%] z-50 text-white text-center transition change-image-text">
                Change Cover Image
              </p>
              <ImageIcon className="z-50 h-[100px] w-[100px] text-white" />
            </>
          )}
          <input
            disabled={coverImageUploading}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => coverImageHandler(e)}
          />
        </label>
      )}
      <div className="absolute left-0 bottom-0 flex items-center gap-4 mx-10 my-5 z-10">
        {profileImageUrl ? (
          <label className="group relative cursor-pointer w-36 h-36 rounded-full flex justify-center items-center border-8 border-white bg-gray-400 user-profile-image">
            {profileImageUploading ? (
              <div className="absolute">
                <Spinner />
              </div>
            ) : (
              <div className="absolute top-5 right-0 bg-neon w-8 h-8 rounded-full flex justify-center items-center user-profile-edit-icon">
                <Pencil className="text-white w-4 h-4" />
              </div>
            )}
            <Image
              src={profileImageUrl}
              alt={`profile pic of ${name}`}
              width={144}
              height={144}
              className="w-full h-full object-cover rounded-full"
            />
            <input
              disabled={profileImageUploading}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => profileImageHandler(e)}
            />
          </label>
        ) : image ? (
          <label className="group relative cursor-pointer w-36 h-36 rounded-full flex justify-center items-center border-8 border-white bg-gray-400 user-profile-image">
            {profileImageUploading ? (
              <div className="absolute">
                <Spinner />
              </div>
            ) : (
              <div className="absolute top-5 right-0 bg-neon w-8 h-8 rounded-full flex justify-center items-center user-profile-edit-icon">
                <Pencil className="text-white w-4 h-4" />
              </div>
            )}
            <Image
              src={image}
              alt={`profile pic of ${name}`}
              width={144}
              height={144}
              className="w-full h-full object-cover rounded-full"
            />
            <input
              disabled={profileImageUploading}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => profileImageHandler(e)}
            />
          </label>
        ) : (
          <label className="group relative cursor-pointer w-36 h-36 rounded-full flex justify-center items-center border-8 border-white bg-gray-400 user-profile-image">
            {profileImageUploading ? (
              <div className="absolute">
                <Spinner />
              </div>
            ) : (
              <div className="absolute top-5 right-0 bg-neon w-8 h-8 rounded-full flex justify-center items-center user-profile-edit-icon">
                <Pencil className="text-white w-4 h-4" />
              </div>
            )}
            <User className="w-[60px] h-[60px] text-white" />
            <input
              disabled={profileImageUploading}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => profileImageHandler(e)}
            />
          </label>
        )}
        {isNameChanging ? (
          <form onClick={(e) => e.stopPropagation()} onSubmit={updateName}>
            <input
              type="text"
              className="font-medium h-10 px-2 w-52 outline-none border-none rounded-l-sm"
              defaultValue={userName!}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              className="h-10 px-2 bg-neon opacity-100 hover:opacity-[95%] transition text-white rounded-r-sm text-sm"
              onClick={updateName}
            >
              change
            </button>
          </form>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative user-profile-image"
          >
            {newNameUpdating ? (
              <>
                <Spinner />
              </>
            ) : (
              <div onClick={nameChangeHandler}>
                <p
                  style={{ textShadow: "0 0 10px #000" }}
                  className="text-white text-lg font-medium"
                >
                  {userName}
                </p>
                <div className="absolute -top-4 -right-5 h-6 w-6 rounded-full bg-neon flex justify-center items-center opacity-0 user-profile-edit-icon">
                  <Pencil className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
