import crypto from "node:crypto";
import { betterAuth, APIError } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    {
      id: "invite-token",
      hooks: {
        before: [
          {
            matcher: (ctx) => ctx.path === "/sign-up/email",
            handler: async (ctx) => {
              const inviteToken = (ctx.body as any)?.inviteToken;

              const tokenData = await (prisma as any).inviteToken.findUnique({
                where: { token: inviteToken, used: false },
              });

              if (!tokenData) {
                throw new APIError("BAD_REQUEST", {
                  message: "Invalid or already used invite token",
                });
              }
            },
          },
        ],
        after: [
          {
            matcher: (ctx) => ctx.path === "/sign-up/email",
            handler: async (ctx) => {
              const inviteToken = (ctx.body as any)?.inviteToken;

              if (inviteToken) {
                // Mark token as used
                await (prisma as any).inviteToken.update({
                  where: { token: inviteToken },
                  data: { used: true },
                });

                // Generate a new one-time token
                const newToken = crypto.randomBytes(16).toString("hex");
                await (prisma as any).inviteToken.create({
                  data: { token: newToken },
                });

                console.log(`[AUTH] Invite rotated. New token ready in DB: ${newToken}`);
              }
              
              return { response: (ctx as any).response };
            },
          },
        ],
      },
    },
  ],
});
