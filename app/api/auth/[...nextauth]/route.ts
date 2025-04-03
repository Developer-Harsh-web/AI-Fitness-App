import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_USER } from "../../../../lib/hooks/UserContext";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a simplified demo version
        // In a real app, you'd validate against a database
        if (credentials?.email && credentials?.password) {
          // Create a user object based on the email
          return {
            id: "1",
            name: credentials.email.split('@')[0],
            email: credentials.email,
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "1";
        // Add any custom user fields from your User type
        session.user.preferences = MOCK_USER.preferences;
        session.user.stats = MOCK_USER.stats;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 