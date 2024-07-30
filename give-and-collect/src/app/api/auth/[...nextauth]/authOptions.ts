import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/lib/auth";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "jsmith@example.com"},
                password: {label: "Mot de passe", type: "password"},
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await login(credentials.email, credentials.password);
                    return user;
                } catch (error) {
                    console.error("Error during login:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60, // 12 hours
    },

    callbacks: {
        async jwt({token, user}) {
            const now = Math.floor(Date.now() / 1000);
            const exp = now + (12 * 60 * 60); // 12 hours from now

            if (user) {
                token = {
                    ...token,
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    roleId: user.roleId,
                    exp: exp,
                };
            } else if (token.exp && (token.exp as number) < now) {
                throw new Error("Token expired");
            }
            
            return token;
        },

        async session({session, token}) {
            session.user = {
                ...session.user,
                id: token.id as number,
                firstname: token.firstname as string,
                lastname: token.lastname as string,
                email: token.email as string,
                roleId: token.roleId as number,
            };

            session.expires = new Date(token.exp as number * 1000).toISOString();
            return session;
        },
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 12 * 60 * 60, // 12 hours
    },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
