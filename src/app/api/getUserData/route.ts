import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "../../../../db/prismaClient";

export async function GET(req: Request) {
  const token = cookies().get("userToken")?.value;
  if (!token) {
    return;
  }
  const userData: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userDoc = await db.user.findUnique({
    where: {
      id: userData.userId,
      email: userData.userEmail,
    },
  });
  if (!userDoc || !userDoc.email) {
    return;
  }
  //@ts-ignore
  const { password, ...rest } = userDoc;
  return NextResponse.json({ rest });
}
