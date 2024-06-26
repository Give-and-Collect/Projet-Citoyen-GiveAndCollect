import { User as UserModel } from '@prisma/client';
import "next-auth";

declare module "next-auth" {
    interface User extends UserModel {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
    }
    interface Session {
        user: User;
    }
}