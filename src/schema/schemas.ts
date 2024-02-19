import * as z from "zod";
//Login Schema
export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email required*" }).email(),
  password: z.string().min(1, { message: "Password required*" }),
});
export type TLoginSchema = z.infer<typeof LoginSchema>;

//Register Schema
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Username required*" })
    .max(20, { message: "You reach max limit of letters*" }),
  email: z.string().min(1, { message: "Email required*" }).email(),
  password: z.string().min(1, { message: "Password required*" }),
});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;
