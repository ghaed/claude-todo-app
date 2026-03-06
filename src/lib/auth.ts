import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.email) {
        (session.user as { email: string }).email = token.email;
      }
      return session;
    },
  },
};
