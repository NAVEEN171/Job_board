// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("Google Profile:", profile);
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.email = token.email!;
      session.user.image = token.picture!;
      session.user.name = token.name!;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
  }
}
