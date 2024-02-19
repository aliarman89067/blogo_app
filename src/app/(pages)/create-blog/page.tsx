"use client";
import { trpc } from "@/app/_trpc/client";
import Blog_Category from "@/components/blogs-steps/Blog_Category";
import Blog_Text from "@/components/blogs-steps/Blog_Text";
import Title_Image from "@/components/blogs-steps/Title_Image";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [blogCreatingLoading, setBlogCreatingLoading] =
    useState<boolean>(false);
  const [stepNumber, setStepNumber] = useState<number>(1);
  const [titleCollector, setTitleCollector] = useState<string>("");
  const [imageUrlCollector, setImageUrlCollector] = useState<string>("");
  const [blogText, setBlogText] = useState<string>("");
  const [category, setCategory] = useState<{
    id: number;
    name: string;
    description: string;
    nameForDatabase: string;
  } | null>(null);

  enum BLOG_STEPS {
    TITLE_IMAGE,
    BLOG_TEXT,
    CATEGORY,
  }

  if (titleCollector || imageUrlCollector || blogText || category) {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
  }
  const { mutate } = trpc.createBlog.useMutation({
    onSuccess: ({ id }) => {
      //TODO: Navigate user to main blog page
      setBlogCreatingLoading(false);
      router.push("/");
    },
  });

  const createBlogHandler = () => {
    setBlogCreatingLoading(true);
    if (!titleCollector) {
      toast({
        description: "Please give your blog a name",
        variant: "destructive",
      });
      setBlogCreatingLoading(false);
      return;
    }
    if (!imageUrlCollector) {
      toast({
        description: "Please add a cover image",
        variant: "destructive",
      });
      setBlogCreatingLoading(false);
      return;
    }
    if (!blogText) {
      toast({
        description: "Please write your blog",
        variant: "destructive",
      });
      setBlogCreatingLoading(false);
      return;
    }
    if (!category?.name || !category) {
      toast({
        description: "You need to select 1 category please",
        variant: "destructive",
      });
      setBlogCreatingLoading(false);
      return;
    }
    if (!user || !user.id || !user.email) {
      setBlogCreatingLoading(false);
      return;
    }
    mutate({
      userId: user?.id,
      userEmail: user?.email,
      title: titleCollector,
      imageUrl: imageUrlCollector,
      blog_text: blogText,
      category: category?.name,
      databaseCategory: category?.nameForDatabase,
    });
  };

  return (
    <section className="min-h-screen bg-gray-200 py-4">
      <div className="min-h-screen max-w-4xl bg-white mx-auto rounded-md px-8 py-4 ">
        {BLOG_STEPS[stepNumber - 1] === "TITLE_IMAGE" ? (
          <Title_Image
            imageUrlCollector={imageUrlCollector}
            setImageUrlCollector={setImageUrlCollector}
            titleCollector={titleCollector}
            setTitleCollector={setTitleCollector}
          />
        ) : null}
        {BLOG_STEPS[stepNumber - 1] === "BLOG_TEXT" ? (
          <Blog_Text blogText={blogText} setBlogText={setBlogText} />
        ) : null}
        {BLOG_STEPS[stepNumber - 1] === "CATEGORY" ? (
          <Blog_Category categoryItem={category} setCategory={setCategory} />
        ) : null}
        <div className="flex items-center justify-center gap-8 mt-6">
          {stepNumber > 1 && !blogCreatingLoading ? (
            <Button
              onClick={() => setStepNumber(stepNumber - 1)}
              className={`bg-neon hover:bg-neon/90 w-[100px]`}
            >
              Previous
            </Button>
          ) : null}
          {stepNumber < 3 ? (
            <Button
              onClick={() => setStepNumber(stepNumber + 1)}
              className="bg-neon hover:bg-neon/90 w-[100px]"
            >
              Next
            </Button>
          ) : null}
          {stepNumber === 3 && !blogCreatingLoading ? (
            <Button
              onClick={createBlogHandler}
              className="bg-neon hover:bg-neon/90 w-[100px]"
            >
              Create
            </Button>
          ) : stepNumber === 3 && blogCreatingLoading ? (
            <Button
              disabled={true}
              className="bg-neon hover:bg-neon/90 w-[140px]"
            >
              Creating...
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
