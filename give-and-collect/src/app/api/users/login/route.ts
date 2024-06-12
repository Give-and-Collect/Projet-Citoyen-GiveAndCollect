import prisma from "@/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
        where: {
            email: email
          }
    });

    const role = await prisma.role.findUnique({
        where: {
            id: user?.roleId
          }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, userRole: role?.name }, JWT_SECRET, { expiresIn: "1h" });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
