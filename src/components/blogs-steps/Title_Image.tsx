import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import DropZone, { DropzoneRootProps } from "react-dropzone";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/firebase";

interface Title_Image_Props {
  setImageUrlCollector: (url: string) => void;
  titleCollector: string;
  imageUrlCollector: string;
  setTitleCollector: (title: string) => void;
}

export default function Title_Image({
  imageUrlCollector,
  setImageUrlCollector,
  titleCollector,
  setTitleCollector,
}: Title_Image_Props) {
  const [loadingStart, setLoadingStart] = useState<boolean>(false);
  const [loadingPer, setLoadingPer] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");

  const coverImageHandler = async (file: DropzoneRootProps) => {
    if (file.length && file[0].name) {
      setLoadingStart(true);
      const storage = getStorage(app);
      const fileName = new Date() + file[0].name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file[0]);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          const progress =
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
          setLoadingPer(progress);
        },
        (err) => {
          setLoadingStart(false);
        },
        () => {
          getDownloadURL(storageRef)
            .then((url) => {
              setImageUrlCollector(url);
              setLoadingStart(false);
            })
            .catch((err) => {
              console.error(`Error getting download URL: ${err}`);
            });
        }
      );
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="font-medium text-gray-700 text-lg mb-1">Title</h1>
          <input
            type="text"
            placeholder="Enter your title"
            value={titleCollector}
            onChange={(e) => {
              setTitleCollector(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-md border border-gray-200 font-medium text-gray-900 text-lg focus-within:border-gray-400 outline-none"
          />
        </div>
        {/* Cover Image */}
        <div>
          <h1 className="font-medium text-gray-700 text-lg mb-1">
            Cover Image
          </h1>
          {imageUrlCollector ? (
            <DropZone
              onDrop={(acceptedFile) => coverImageHandler(acceptedFile)}
            >
              {({ getRootProps, getInputProps }) => (
                <label
                  {...getRootProps()}
                  className="group relative w-full h-[400px] bg-gray-200 rounded-lg flex justify-center items-center overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    {...getInputProps()}
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                  <img
                    src={imageUrlCollector}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="cursor-pointer opacity-0 group-hover:opacity-100 transition absolute top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center">
                    <div className="flex flex-col gap-2 items-center">
                      <ImageIcon className="h-6 w-6 text-white" />
                      <p className="text-white">Change Cover Image</p>
                    </div>
                  </div>
                </label>
              )}
            </DropZone>
          ) : (
            <label className="w-full h-[400px] bg-gray-200 rounded-lg flex justify-center items-center">
              <DropZone
                onDrop={(acceptedFile) => coverImageHandler(acceptedFile)}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`group w-[350px] h-[200px] bg-white rounded-md p-6 cursor-pointer hover:shadow-md transition ${
                      isDragActive ? "shadow-md" : ""
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`w-full h-full border-2 border-dashed border-gray-200 rounded-md flex justify-center items-center group-hover:bg-gray-100 transition ${
                        isDragActive ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <input
                          {...getInputProps()}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={loadingStart}
                        />
                        {loadingStart && (
                          <div>
                            <p className="text-sm text-center text-gray-600 mb-2">
                              This won&apos;t take long
                            </p>
                            <div className="relative w-[250px] h-2 overflow-hidden">
                              <div className="absolute top-0 left-0 h-2 w-full bg-gray-300 rounded-full"></div>
                              <div
                                className={`absolute top-0 left-[${loadingPer}%] transition -translate-x-[100%] h-2 w-full bg-blue-500 rounded-full`}
                              ></div>
                            </div>
                          </div>
                        )}
                        {loadingStart === false && (
                          <>
                            <ImageIcon className="h-6 w-6 text-neon" />
                            {isDragActive ? (
                              <p className="text-base text-neon">
                                Drop yor file here
                              </p>
                            ) : (
                              <p className="text-base text-neon">
                                Click here or Drag & Drop
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </DropZone>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
