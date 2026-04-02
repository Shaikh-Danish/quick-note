import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { PrismaClient } from "@/data-access/prisma-client";
import { env } from "@/lib/env";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
    ],
});
