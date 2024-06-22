import prisma from "@/utils/db";
import { User } from "next-auth";
import bcrypt from "bcrypt";

type LoginFn = (email: string, password: string) => Promise<User>;

export const login: LoginFn = async (email, password) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            role: true,
        }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
        user.password = "";
        return user;
    } else throw new Error("User not found");
};