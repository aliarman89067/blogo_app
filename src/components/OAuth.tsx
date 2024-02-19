"use client";
import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { trpc } from "@/app/_trpc/client";
import { useLoginModal, useRegisterModal, useUser } from "@/store/store";
import { usePathname } from "next/navigation";

export default function OAuth() {
  const pathName = usePathname();
  const { userLogin } = useUser();
  const { closeLoginModal } = useLoginModal();
  const { closeRegisterModal } = useRegisterModal();
  const context = trpc.useContext();
  const { mutate } = trpc.oAuth.useMutation({
    onSuccess: ({ id, name, email, image }) => {
      userLogin(id, name, email, image);
      context.invalidate();
      closeLoginModal();
      closeRegisterModal();
      if (pathName === "/profile" || pathName === "/search") {
        window.location.reload();
      }
    },
  });
  const oAuthHandler = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((data) => {
        const { user } = data;
        mutate({
          email: user.email!,
          name: user.displayName!,
          image: user.photoURL!,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      onClick={oAuthHandler}
      className="flex items-center justify-center w-full h-12 bg-white custom-shadow-md transition rounded-md cursor-pointer"
    >
      <div>
        <h1 className="text-neon font-medium">Google</h1>
      </div>
    </div>
  );
}
