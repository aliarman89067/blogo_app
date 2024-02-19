"use client";
import { trpc } from "@/app/_trpc/client";
import { Spinner } from "@/components/mini-components/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoginModal, useUser } from "@/store/store";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { FormEvent, Suspense, useEffect, useState } from "react";
// fill heart
import { FaHeart } from "react-icons/fa6";
// empty heart
import { FaRegHeart } from "react-icons/fa6";
// fill save
import { FaBookmark } from "react-icons/fa6";
// empty save
import { FaRegBookmark } from "react-icons/fa6";
import PeopleRequestButton from "./PeopleRequestButton";

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingIndicator, setLoadingIndicator] = useState<boolean>(false);
  // const [requestChecker, setRequestChecker] = useState<string[] | null>(null);
  // API START
  const context = trpc.useContext();
  const {
    mutate: searchUserAndBlogsMutation,
    isPending,
    data,
  } = trpc.searchUserAndBlogs.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      setLoadingIndicator(false);
      context.invalidate();
    },
  });
  // API END
  const { user } = useUser();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          type: "peoples",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, []);
  const changeQueryToBlogs = () => {
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          type: "blogs",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };
  const changeQueryToPeoples = () => {
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: {
          type: "peoples",
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };
  const params = searchParams.get("type");

  const searchPeoplesAndBlogsHandle = (
    e: FormEvent,
    userName: string,
    blogTitle: string
  ) => {
    e.preventDefault();
    setSearchText("");
    searchUserAndBlogsMutation({ userName, blogTitle });
    setLoadingIndicator(true);
  };
  return (
    <Suspense>
      <section className="w-full min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-4xl bg-white min-h-screen mx-auto px-8 py-4">
          {/* Search */}
          <form
            onSubmit={(e) =>
              searchPeoplesAndBlogsHandle(e, searchText, searchText)
            }
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search peoples or blogs..."
              className="w-full p-2 px-4 rounded-md border border-gray-400 outline-none text-gray-800"
            />
            <Button
              disabled={
                !loadingIndicator && searchText.length > 0
                  ? false
                  : loadingIndicator
                  ? true
                  : true
              }
              onClick={(e) =>
                searchPeoplesAndBlogsHandle(e, searchText, searchText)
              }
              className="py-2 px-4 md:px-8"
            >
              {loadingIndicator ? <>Searching...</> : <>Search</>}
            </Button>
          </form>
          {!isLoading ? (
            <div className="flex items-center gap-4 mt-12">
              <button
                onClick={changeQueryToPeoples}
                className={cn(
                  "w-full p-2 rounded-sm text-center font-light hover:opacity-90 transition flex items-center gap-1 justify-center",
                  params === "peoples"
                    ? "bg-neon text-white"
                    : "bg-gray-300 text-neon"
                )}
              >
                <p>Peoples</p>
                <p>{data?.peoples?.length}</p>
              </button>
              <button
                onClick={changeQueryToBlogs}
                className={cn(
                  "w-full p-2 rounded-sm text-center font-light hover:opacity-90 transition flex items-center gap-1 justify-center",
                  params === "blogs"
                    ? "bg-neon text-white"
                    : "bg-gray-300 text-neon"
                )}
              >
                <p className="mr-1">Blogs</p>
                <p>{data?.blogs.length}</p>
              </button>
            </div>
          ) : null}
          {params === "peoples" &&
          data?.peoples &&
          data?.peoples?.length > 0 ? (
            <div className="flex w-full flex-col gap-2 mt-5">
              {data?.peoples.map((people) => (
                <Link
                  key={people.id}
                  href={`/profile/${people.id}`}
                  className="flex items-center justify-between px-6 py-3 rounded-md bg-gray-100 border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex gap-2 items-center">
                    {people.image ? (
                      <div className="h-12 w-12 rounded-full flex justify-center items-center">
                        <Image
                          src={people.image}
                          alt={`Profile image of ${people.name}`}
                          width={48}
                          height={48}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full flex justify-center items-center bg-white border border-gray-400">
                        <User className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                    <p className="text-gray-800">{people.name}</p>
                  </div>

                  <PeopleRequestButton
                    friendList={people.friendList}
                    peopleId={people.id}
                    requests={people.requests}
                  />
                </Link>
              ))}
            </div>
          ) : params === "blogs" && data && data.blogs.length > 0 ? (
            <div className="flex w-full flex-col gap-2 mt-5">
              {data.blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`blog/${blog.id}`}
                  className="group relative w-full flex flex-col md:flex-row gap-2 lg:gap-4 bg-gray-100 border border-gray-200 p-2 hover:shadow-md transition cursor-pointer"
                >
                  <div className="relative w-full md:w-48 h-[300px] md:h-40 rounded-md shrink-0 grow overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={`${blog.title} cover image`}
                      fill
                      className="w-full h-full object-cover rounded-md group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-gray-800">
                      {blog.title}
                    </h3>
                    <div
                      className="text-gray-600 text-sm font-light line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.blog_text }}
                    ></div>
                  </div>
                  <div className="hidden md:flex gap-2">
                    <div>
                      <FaRegHeart className="text-gray-800 w-5 h-5" />
                    </div>
                    <div>
                      <FaRegBookmark className="text-gray-800 w-5 h-5" />
                    </div>
                  </div>
                  <div className="md:hidden absolute top-2 right-2 flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-neon/20 flex justify-center items-center cursor-pointer">
                      <FaRegHeart className="text-white w-5 h-5" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-neon/20 flex justify-center items-center cursor-pointer">
                      <FaRegBookmark className="text-white w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </Suspense>
  );
}
