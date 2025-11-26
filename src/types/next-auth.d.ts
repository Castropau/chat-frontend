// import NextAuth, { DefaultSession } from "next-auth";
import { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      firstname: string;
      lastname: string;
    } & DefaultSession["user"];
  }
}
// import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    email: string;
    image?: string | null;
    name?: string | null;
  }

  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    email: string;
  }
}
