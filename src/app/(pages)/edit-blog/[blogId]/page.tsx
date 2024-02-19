"use client";
import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import Blog_Category_Update from "@/components/blogs-steps/Blog_Category_Update";
import Blog_Text_Update from "@/components/blogs-steps/Blog_Text_Update";
import Title_Image_Update from "@/components/blogs-steps/Title_Image_Update";
import { Spinner } from "@/components/mini-components/Spinner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Page({ params }: { params: { blogId: string } }) {
  // Hooks
  const router = useRouter();
  const { blogId } = params;
  const { user } = useUser();
  const { toast } = useToast();
  // Error Handling
  if (!user || !user.id) {
    router.push("/");
  }
  // TRPC
  const { data, isLoading, isError, error } = trpc.getBlogByIdAndEmail.useQuery(
    {
      blogId: blogId,
      authorId: user?.id!,
    }
  );
  const { mutate: updateBlogMutation } = trpc.updateBlog.useMutation({
    onSuccess: ({ id }) => {
      //TODO: Navigate user to main blog page
      setBlogCreatingLoading(false);
      router.push("/profile?category=my-blogs&page=my-activity");
    },
  });
  // Error Handling
  if (isError && error.data?.code === "FORBIDDEN") {
    router.push("/");
  }
  // States
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

  // Enums
  enum BLOG_STEPS {
    TITLE_IMAGE,
    BLOG_TEXT,
    CATEGORY,
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-48px)] gap-2">
        <Spinner />
        <p className="text-center text-gray-800">
          This won&apos;t take long...
        </p>
      </div>
    );
  }
  if (titleCollector || imageUrlCollector || blogText || category) {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
  }
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
    updateBlogMutation({
      userId: user?.id!,
      blogId: data?.id!,
      title: titleCollector,
      imageUrl: imageUrlCollector,
      blog_text: blogText,
      category: category.name,
      databaseCategory: category.nameForDatabase,
    });
  };
  return (
    <section className="min-h-screen bg-gray-200 py-4">
      <div className="min-h-screen max-w-4xl bg-white mx-auto rounded-md px-8 py-4 ">
        {BLOG_STEPS[stepNumber - 1] === "TITLE_IMAGE" ? (
          <Title_Image_Update
            setImageUrlCollector={setImageUrlCollector}
            imageUrlCollector={imageUrlCollector}
            setTitleCollector={setTitleCollector}
            titleCollector={titleCollector}
            initialValue={data?.title!}
            initialUrl={data?.imageUrl!}
          />
        ) : null}
        {BLOG_STEPS[stepNumber - 1] === "BLOG_TEXT" ? (
          <Blog_Text_Update
            blogText={blogText}
            setBlogText={setBlogText}
            initialValue={data?.blog_text!}
          />
        ) : null}
        {BLOG_STEPS[stepNumber - 1] === "CATEGORY" ? (
          <Blog_Category_Update
            categoryItem={category}
            setCategory={setCategory}
            initialCategory={data?.categoryDatabase!}
          />
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
              Update
            </Button>
          ) : stepNumber === 3 && blogCreatingLoading ? (
            <Button
              disabled={true}
              className="bg-neon hover:bg-neon/90 w-[140px]"
            >
              Updating...
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
