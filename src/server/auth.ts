import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "../server/db";
import { env } from "@/lib/env";
import * as schema from "../server/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Provide the secret explicitly so NextAuth doesn't rely on implicit env lookups
  // and to ensure our env validation runs early in production.
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize: missing credentials");
          return null;
        }

        try {
          const usersFound = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, credentials.email))
            .limit(1);

          const user = usersFound[0];
          console.info(
            "[Auth] Lookup by email:",
            credentials.email,
            "found:",
            !!user,
          );

          if (!user) {
            console.warn("[Auth] No user found for:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.error("[Auth] User record has no password field:", user);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          console.info(
            "[Auth] Password validity for user",
            user.email,
            ":",
            isPasswordValid,
          );

          if (!isPasswordValid) {
            console.warn("[Auth] Invalid password attempt for:", user.email);
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: "user",
          };
        } catch (err) {
          console.error("[Auth] Exception during authorize:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
