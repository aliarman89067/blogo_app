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
import { RegisterSchema, TRegisterSchema } from "@/schema/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { trpc } from "@/app/_trpc/client";
import ErrorMessage from "../ErrorMessage";
import { useRegisterModal, useUser } from "@/store/store";
import { usePathname } from "next/navigation";

export default function RegisterForm() {
  const pathName = usePathname();

  const closeRegisterModal = useRegisterModal(
    (state) => state.closeRegisterModal
  );

  const { user, userRegistration } = useUser();

  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate, data } = trpc.createUser.useMutation({
    onSuccess: ({ id, name, email, image }) => {
      setPending(false);
      userRegistration(id, name, email, image);
      closeRegisterModal();
      if (pathName === "/profile" || pathName === "/search") {
        window.location.reload();
      }
    },
    onError: ({ message, data }) => {
      setPending(false);
      if (data?.code === "CONFLICT") {
        setError(message);
        return;
      }
      setError("Something went wrong");
    },
  });
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onsubmit(values: TRegisterSchema) {
    setError(null);
    setPending(true);
    mutate({
      email: values.email,
      name: values.name,
      password: values.password,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Name</FormLabel>
              <FormControl>
                <Input
                  className="border-gray-300"
                  {...field}
                  type="text"
                  placeholder="John Doe"
                  disabled={pending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Email</FormLabel>
              <FormControl>
                <Input
                  className="border-gray-300"
                  {...field}
                  type="text"
                  placeholder="johndoe@gmail.com"
                  disabled={pending}
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
                  className="border-gray-300"
                  {...field}
                  type="password"
                  placeholder="*******"
                  disabled={pending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ErrorMessage message={error} />
        <Button disabled={pending} className="w-full mt-2">
          Register
        </Button>
      </form>
    </Form>
  );
}
