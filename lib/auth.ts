import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"

import { PrismaClient } from "./prisma-client";
import { transporter } from "./email";
import { getSignInEmailTemplate } from "./email-templates/sign-in";
import { getEmailVerificationTemplate } from "./email-templates/email-verification";
import { getForgetPasswordTemplate } from "./email-templates/forget-password";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                let subject = "Your OTP Code";
                let text = `Your OTP code is: ${otp}`;
                let html = "";

                if (type === "sign-in") {
                    subject = "Sign in to Quick Note";
                    text = `Your sign-in OTP is: ${otp}. It will expire in 5 minutes.`;
                    html = getSignInEmailTemplate(otp);
                } else if (type === "email-verification") {
                    subject = "Verify your email address";
                    text = `Your email verification OTP is: ${otp}. It will expire in 5 minutes.`;
                    html = getEmailVerificationTemplate(otp);
                } else if (type === "forget-password") {
                    subject = "Reset your password";
                    text = `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`;
                    html = getForgetPasswordTemplate(otp);
                }

                try {
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject,
                        text,
                        html,
                    });
                } catch (error) {
                    console.error("Failed to send OTP email:", error);
                }
            },
        })
    ]
});