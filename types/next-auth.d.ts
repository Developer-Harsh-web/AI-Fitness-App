import { DefaultSession } from "next-auth";
import { User } from "../lib/hooks/UserContext";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      preferences?: User["preferences"];
      stats?: User["stats"];
    } & DefaultSession["user"];
  }
} 