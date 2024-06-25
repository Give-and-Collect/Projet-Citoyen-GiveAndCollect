import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/lib/auth";

export const authOptions = {
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
        jwt: true
    },

    callbacks: {
        async jwt({token, user}) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                };
            }
            return token;
        },

        async session({session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    firstname: token.firstname,
                    lastname: token.lastname,
                    email: token.email,
                    role: token.role
                },
            };
        },
    }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};