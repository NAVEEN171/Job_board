import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import ConnectToDB from "@/utils/connections/mongoose";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Account {
    access_token?: string;
    provider: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    name?: string;
    email?: string;
    picture?: string;
    accessToken?: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        return false;
      }
      const dbConn = await ConnectToDB();
      if (!dbConn) {
        console.log("database is not connected");
        return false;
      }
      const userscollection = await dbConn.connection.collection("users");
      if (!userscollection) {
        return false;
      }
      let existinguser = await userscollection.findOne({
        email: profile.email,
      });
      if (!existinguser) {
        await userscollection.insertOne({
          username: profile.name,
          email: profile.email,
          password: null,
          provider: "google",
          profilephoto: profile.image,
        });
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.email = token.email!;
      session.user.image = token.picture!;
      session.user.accessToken = token.accessToken as string;
      session.user.name = token.name!;

      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60, // 1 hour in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
