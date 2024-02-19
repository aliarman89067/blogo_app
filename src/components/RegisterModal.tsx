"use client";
import React from "react";
import { X } from "lucide-react";
import OAuth from "./OAuth";
import RegisterForm from "./Forms/RegisterForm";
import { useLoginModal, useRegisterModal } from "@/store/store";

interface RegisterModalProps {
  isRegisterOpen?: boolean;
}

export default function RegisterModal({ isRegisterOpen }: RegisterModalProps) {
  const closeRegisterModal = useRegisterModal(
    (state) => state.closeRegisterModal
  );
  const openLoginModal = useLoginModal((state) => state.openLoginModal);
  const openLoginModalHandle = () => {
    closeRegisterModal();
    openLoginModal();
  };
  return (
    <div
      className={`
          transition-all duration-200 ease-linear z-50 fixed inset-0 w-full h-screen bg-gray-400/40 flex justify-center items-center backdrop-blur-sm ${
            isRegisterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
    >
      <div
        className={`transition-all duration-200 delay-200 relative w-full sm:w-[500px] lg:w-[600px] max-sm:h-full bg-white p-8 rounded-md hover:shadow-lg ${
          isRegisterOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-64 pointer-events-none"
        }`}
      >
        <h1 className="text-center text-neon text-xl font-medium mb-1">
          Register
        </h1>
        <div
          onClick={closeRegisterModal}
          className="absolute right-8 top-8 h-7 w-7 rounded-full bg-gray-200 hover:bg-gray-300 transition flex justify-center items-center cursor-pointer"
        >
          <X className="w-4 h-4 text-neon" />
        </div>
        <div className="mx-auto max-w-fit py-1 border-b-[1px] border-neon/70">
          <p className="text-neon/90 text-[15px]">
            Hey Dear enter your information!
          </p>
        </div>
        {/* Form */}
        <RegisterForm />
        <h1 className="text-center text-gray-700 text-sm py-4">Or</h1>
        <OAuth />
        <div className="flex justify-center items-center mt-3">
          <p className="text-gray-700 text-sm">
            Already have an account?{" "}
            <span
              onClick={openLoginModalHandle}
              className="text-gray-800 hover:underline hover:underline-offset-4 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
