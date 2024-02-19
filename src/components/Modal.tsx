"use client";
import React from "react";
import LoginModal from "./LoginModal";
import { useLoginModal, useRegisterModal } from "@/store/store";
import RegisterModal from "./RegisterModal";

export default function Modal() {
  const isLoginOpen = useLoginModal((state) => state.isLoginOpen);
  const isRegisterOpen = useRegisterModal((state) => state.isRegisterOpen);
  return (
    <>
      <LoginModal isLoginOpen={isLoginOpen} />
      <RegisterModal isRegisterOpen={isRegisterOpen} />
    </>
  );
}
