"use client";
import { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell, User } from "lucide-react";
import { Spinner } from "./Spinner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/store/store";
import Lottie from "lottie-react";
import empty from "../../../public/lottie/empty.json";

export const NotificationButton = ({ userId }: { userId: string }) => {
  const { user } = useUser();
  const context = trpc.useContext();
  const [requestData, setRequestData] = useState<any[]>([]);
  const [currentPeopleId, setCurrentPeopleId] = useState("");
  const [forMount, setForMount] = useState(1);
  const { data, isLoading, isFetched, refetch } =
    trpc.getUserNotifications.useQuery({
      userId,
    });
  useEffect(() => {
    if (isFetched && data) {
      setRequestData(data);
    }
  }, [isFetched, data, forMount]);

  // const [requestData, setRequestData] = useState<any[]>([]);
  const removeDuplicateId = (requestArray: any) => {
    let uniqueIds = new Set();
    let uniqueObject: any = [];
    requestData.forEach((arr) => {
      if (!uniqueIds.has(arr.id)) {
        uniqueIds.add(arr.id);
        uniqueObject.push(arr);
      }
    });
    return uniqueObject;
  };
  const removeDuplicateData = removeDuplicateId(requestData);

  const { mutate: cancelRequestMutation } = trpc.cancelRequest.useMutation({
    onSuccess: () => {
      context.invalidate();
      setRequestData([
        ...requestData.filter((item) => item.id !== currentPeopleId),
      ]);
    },
  });
  const { mutate: acceptRequestMutation } = trpc.acceptFriend.useMutation({
    onSuccess: () => {
      context.invalidate();
      setRequestData([
        ...requestData.filter((item) => item.id !== currentPeopleId),
      ]);
    },
  });
  if (isLoading) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <Bell className="text-gray-600 w-5 h-5" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Spinner />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  const cancelRequest = (peopleId: string) => {
    if (!user || !user.id) {
      return;
    }
    cancelRequestMutation({ userId: user?.id, peopleId: peopleId });
    setCurrentPeopleId(peopleId);
  };
  const acceptRequest = (peopleId: string) => {
    if (!user || !user.id) {
      return;
    }
    acceptRequestMutation({ peopleId: peopleId, userId: user?.id });
    setCurrentPeopleId(peopleId);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="text-gray-600 w-5 h-5" />
          {removeDuplicateData?.length! > 0 ? (
            <span className="absolute cursor-pointer text-xs -top-2 -right-2 bg-red-600 w-4 h-4 rounded-full flex justify-center items-center text-white">
              {removeDuplicateData?.length}
            </span>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {removeDuplicateData?.length! > 0 ? (
          removeDuplicateData?.map((people: any) => (
            <DropdownMenuItem key={people.id}>
              <Link
                href={`/profile/${people.id}`}
                className="w-full flex items-center justify-between flex-wrap"
              >
                <div className="flex items-center gap-2">
                  {people.image ? (
                    <div className="w-10 h-10 rounded-full">
                      <Image
                        src={people.image}
                        alt={`${people.name} profile image`}
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-gray-600 flex justify-center items-center">
                      <User className="w-7 h-7 text-gray-600" />
                    </div>
                  )}
                  <h3 className="text-neon">{people.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      cancelRequest(people.id);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      acceptRequest(people.id);
                    }}
                    size="sm"
                  >
                    Accept
                  </Button>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 text-center my-2">
              No notifications yet!
            </p>
            <Lottie
              className="w-[200px] h-[200px]"
              animationData={empty}
              loop={true}
              autoplay={true}
            />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
