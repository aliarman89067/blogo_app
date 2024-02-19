import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function middleware(req: Request) {
  // let isLoggedIn = false;
  const token = cookies().get("userToken")?.value;
  if (token) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/", req.url));
  // if (!token) {
  //   isLoggedIn = false;
  // } else {
  //   isLoggedIn = true;
  // }
  // if (!isLoggedIn && req.url === "http://localhost:3000/create-blog") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // if (!isLoggedIn && req.url === "http://localhost:3000/profile") {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // if (isLoggedIn) {
  //   return NextResponse.next();
  // }
}

export const config = {
  matcher: ["/create-blog", "/profile", "/message"],
};
