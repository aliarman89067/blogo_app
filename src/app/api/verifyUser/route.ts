import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "../../../../db/prismaClient";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { userData } = await req.json();
  const { id, email, name } = userData;
  const token = cookies().get("userToken")?.value;
  if (!id || !name || !email) {
    cookies().set("userToken", "");
    return NextResponse.json({ result: false });
  }
  if (token) {
    return NextResponse.json({ result: true });
  }
  const userDocFromDb = await db.user.findUnique({
    where: {
      id,
      email,
    },
  });
  if (!userDocFromDb || !userDocFromDb.email) {
    cookies().set("userToken", "");
    return NextResponse.json({ result: false });
  }
  const newToken = jwt.sign(
    {
      userId: userDocFromDb.id,
      userEmail: userDocFromDb.email,
      name: userDocFromDb.name,
      image: userDocFromDb.image,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  cookies().set("userToken", newToken);

  return NextResponse.json({ result: true });
}
