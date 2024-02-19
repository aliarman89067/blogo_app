import { format } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TrendingCardProp {
  item: {
    title: string;
    imageUrl: string;
    blog_text: string;
    category: string;
    authorId: string;
    id: string;
    categoryDatabase: string;
    likes: string[];
    date: string;
    rating: number | null;
    author: {
      name: string;
      id: string;
      image: string | null;
    };
  };
}

export default function TrendingCard({ item }: TrendingCardProp) {
  const {
    title,
    imageUrl,
    blog_text,
    category,
    id,
    id: blogId,
    categoryDatabase,
    likes,
    date,
    rating,
    author: { id: userId, name, image },
  } = item;

  const router = useRouter();

  return (
    <Link
      href={`/blog/${blogId}`}
      className="w-full flex flex-col p-3 rounded-md border border-gray-300 shadow-sm hover:shadow-lg transition bg-gray-100"
    >
      <div className="relative w-full h-[180px]">
        <Image
          src={imageUrl}
          alt={`${item.title} image`}
          fill
          className="w-full h-full rounded-md object-cover"
        />
      </div>
      <div className="w-full flex flex-col mt-2 gap-1">
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            router.push(`/profile/${userId}`);
          }}
          className="flex items-center gap-2"
        >
          {image ? (
            <div className="relative w-7 h-7 rounded-full">
              <Image
                src={image}
                alt={`${name} Image`}
                fill
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className=" w-7 h-7 border border-gray-600 flex justify-center items-center rounded-full">
              <User className=" w-5 h-5 text-gray-600" />
            </div>
          )}
          <p className="text-xs text-gray-700">{name}</p>
        </div>
        <p className="text-neon text-sm truncate">{title}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-700">{format(date, "MMM,dd,yyyy")}</p>
          <p className="text-xs text-neon/90">{rating! / 10} Ratings</p>
        </div>
      </div>
    </Link>
  );
}
