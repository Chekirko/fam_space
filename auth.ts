import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { IUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import logger from "./lib/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        if (!profile?.email) {
          logger.error("Email is missing from the profile");
          return token;
        }
        const { data: existingUser, success } = (await api.users.getByEmail(
          profile?.email
        )) as ActionResponse<IUserDoc>;

        if (!success || !existingUser) return token;

        const userId = existingUser._id;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, account }) {
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: user.name?.toLowerCase() as string,
      };

      const { success, data: createdUser } = (await api.auth.oAuthSignIn({
        user: userInfo,
      })) as ActionResponse<IUserDoc>;

      logger.warn(success);
      logger.warn(createdUser);

      if (!success || !createdUser) {
        logger.error(`Failed to create user: ${user.email}`);
        return false;
      }

      return true;
    },
  },
});
