import React, { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useLoginModal, useUser } from "@/store/store";

interface PeopleRequestButtonProps {
  peopleId: string;
  requests: string[];
  friendList: string[];
}

export default function PeopleRequestButton({
  peopleId,
  requests,
  friendList,
}: PeopleRequestButtonProps) {
  const context = trpc.useContext();
  const [requestChecker, setRequestChecker] = useState<null | string[]>(null);
  const [isUnFriend, setIsUnFriend] = useState(false);

  const { mutate: requestMutation } = trpc.sendRequest.useMutation({
    onSuccess: ({ requests, id, image, name }) => {
      // context.invalidate();
      setRequestChecker(requests);
    },
  });
  const { mutate: unFriendMutation } = trpc.unFriend.useMutation({
    onSuccess: () => {
      setIsUnFriend(true);
      context.invalidate();
    },
  });
  const { user } = useUser();
  const { openLoginModal } = useLoginModal();

  const peopleButton = (request: string[]) => {
    const requestButtonName = requestChecker?.includes(user?.id!)
      ? "Cancel Request"
      : request.includes(user?.id!)
      ? "Cancel Request"
      : "Send Request";

    return requestButtonName;
  };
  const requestHandler = (peopleId: string) => {
    if (!user || !user.id) {
      openLoginModal();
      return;
    }
    setIsUnFriend(true);
    requestMutation({ peopleId: peopleId, userId: user?.id });
  };
  return (
    <>
      {!isUnFriend && friendList.includes(user?.id!) ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            unFriendMutation({ userId: user?.id!, friendId: peopleId });
          }}
          className="px-4 py-2 rounded-sm bg-red-600 text-white hover:opacity-90 font-light transition text-sm"
        >
          Unfriend
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            requestHandler(peopleId);
          }}
          className="px-4 py-2 rounded-sm bg-neon text-white hover:opacity-90 font-light transition text-sm"
        >
          {peopleButton(requests)}
        </button>
      )}
    </>
  );
}
