import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { client } from "./sanity/lib/client";
import { route } from "sanity/router";

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
              email: credentials.username,
            }
          );

          if (!user) {
            const err = "No user found with this email";
            localStorage.setItem("loginError", JSON.stringify(err));
            throw new CredentialsSignin("No user found with this email");
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (!isValid) {
            throw new CredentialsSignin("Invalid password");
          }

          return {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          if (error instanceof CredentialsSignin) {
            throw error;
          } else {
            throw new CredentialsSignin("Authentication failed");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
