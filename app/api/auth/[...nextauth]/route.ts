import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MOCK_USER } from "../../../../lib/hooks/UserContext";

// Configure next-auth
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is a mock authorization for demo purposes
        // In a real app, you would validate against your database
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            email: MOCK_USER.email,
            preferences: MOCK_USER.preferences,
            stats: MOCK_USER.stats,
          };
        }
        
        // For demo, allow any login
        return {
          id: "1",
          name: credentials?.email?.split('@')[0] || "User",
          email: credentials?.email || "user@example.com",
          preferences: MOCK_USER.preferences,
          stats: MOCK_USER.stats,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret"
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.preferences = user.preferences;
        token.stats = user.stats;
        // Add provider information when signing in
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.preferences = token.preferences as typeof MOCK_USER.preferences;
        session.user.stats = token.stats as typeof MOCK_USER.stats;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  debug: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as POST }; 