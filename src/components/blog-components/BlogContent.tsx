"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogContentProps {
  blog: string;
}

export const BlogContent = ({ blog }: BlogContentProps) => {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className={cn(isShowMore ? "" : "max-h-[400px] overflow-hidden")}>
        {/* <div
          className={cn("text-gray-800 mt-2 text-justify")}
          dangerouslySetInnerHTML={{ __html: blog }}
        ></div> */}
        <ReactQuill value={blog} readOnly={true} theme="bubble" />
      </div>
      <Button
        asChild
        variant="outline"
        className="text-center mt-7 text-gray-700 cursor-pointer"
        onClick={() => setIsShowMore((prev) => !prev)}
      >
        {isShowMore ? (
          <div>
            Show less
            <ArrowUp className="h-5 w-5" />
          </div>
        ) : (
          <div>
            Show more
            <ArrowDown className="h-5 w-5" />
          </div>
        )}
      </Button>
    </div>
  );
};
