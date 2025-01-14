import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { client } from "@/sanity/lib/client"; // Import the Sanity client

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        try {
          const user = await client.fetch(
            `*[_type == "user" && email == $email][0]`,
            {
              email: credentials.username, // Use 'username' instead of 'email'
            }
          );

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          return {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof AuthError) {
            switch (error.type) {
              case "CallbackRouteError":
                if (
                  error.cause &&
                  typeof error.cause === "object" &&
                  "err" in error.cause
                ) {
                  const cause = error.cause as { err: { code?: string } };
                  if (cause.err && cause.err.code === "credentials") {
                    return { error: "Invalid credentials" };
                  }
                }
              default:
                return { error: "An authentication error occurred" };
            }
          }

          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
