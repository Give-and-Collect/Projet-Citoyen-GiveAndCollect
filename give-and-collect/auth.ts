import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions);