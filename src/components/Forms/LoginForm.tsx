"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormMessage,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { LoginSchema, TLoginSchema } from "@/schema/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { trpc } from "@/app/_trpc/client";
import { useLoginModal, useUser } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";

export default function LoginForm() {
  const pathName = usePathname();
  const { userLogin } = useUser();
  const { closeLoginModal } = useLoginModal();
  const [errorText, setErrorText] = useState<null | string>(null);
  const context = trpc.useContext();
  const mutation = trpc.loginUser.useMutation({
    onSuccess: ({ id, name, email, image }) => {
      setIsLoading(false);
      userLogin(id, name, email, image);
      context.invalidate();
      closeLoginModal();
      if (pathName === "/profile" || pathName === "/search") {
        window.location.reload();
      }
    },
    onError: ({ message, data }) => {
      setIsLoading(false);
      if (
        data?.code === "UNAUTHORIZED" &&
        message === "Wrong email or password"
      ) {
        setErrorText(message);
      } else {
        setErrorText("Something went wrong please try again");
      }
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onsubmit(values: TLoginSchema) {
    setIsLoading(true);
    setErrorText(null);
    mutation.mutate({
      email: values.email,
      password: values.password,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  className="border-gray-300"
                  {...field}
                  type="text"
                  placeholder="johndoe@gmail.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  className="border-gray-300"
                  {...field}
                  type="password"
                  placeholder="*******"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorText ? (
          <p className="text-destructive bg-red-100 p-2 rounded-md text-sm font-light">
            {errorText}*
          </p>
        ) : null}
        <Button disabled={isLoading} className="w-full mt-2">
          Login
        </Button>
      </form>
    </Form>
  );
}
