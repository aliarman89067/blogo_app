"use client";
import React from "react";
import { X } from "lucide-react";
import LoginForm from "./Forms/LoginForm";
import OAuth from "./OAuth";
import { useLoginModal, useRegisterModal } from "@/store/store";

interface LoginModalProps {
  isLoginOpen?: boolean;
}

export default function LoginModal({ isLoginOpen }: LoginModalProps) {
  const closeLoginModal = useLoginModal((state) => state.closeLoginModal);
  const openRegisterModal = useRegisterModal(
    (state) => state.openRegisterModal
  );
  const openRegisterModalHandle = () => {
    closeLoginModal();
    openRegisterModal();
  };
  return (
    <div
      className={`
          transition-all duration-200 ease-linear z-50 fixed inset-0 w-full h-screen bg-gray-400/40 flex justify-center items-center backdrop-blur-sm ${
            isLoginOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
    >
      <div
        className={`transition-all duration-200 delay-200 relative w-full sm:w-[500px] lg:w-[600px] max-sm:h-full bg-white p-8 rounded-md hover:shadow-lg ${
          isLoginOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-64 pointer-events-none"
        }`}
      >
        <h1 className="text-center text-neon text-xl font-medium mb-1">
          Login
        </h1>
        <div
          onClick={closeLoginModal}
          className="absolute right-8 top-8 h-7 w-7 rounded-full bg-gray-200 hover:bg-gray-300 transition flex justify-center items-center cursor-pointer"
        >
          <X className="w-4 h-4 text-neon" />
        </div>
        <div className="mx-auto max-w-fit py-1 border-b-[1px] border-neon/70">
          <p className="text-neon/90 text-[15px]">
            Welcome back nice to see you!
          </p>
        </div>
        {/* Form */}
        <LoginForm />
        <h1 className="text-center text-gray-700 text-sm py-4">Or</h1>
        <OAuth />
        <div className="flex justify-center items-center mt-3">
          <p className="text-gray-700 text-sm">
            Don&apos;t have an account yet?{" "}
            <span
              onClick={openRegisterModalHandle}
              className="text-gray-800 hover:underline hover:underline-offset-4 cursor-pointer"
            >
              Create Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
