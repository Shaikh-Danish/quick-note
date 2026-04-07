import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

async function main() {
    try {
        const token = crypto.randomBytes(16).toString("hex");

        const resp = await prisma.inviteToken.create({
            data: { token },
        });

        console.log("New Invite Token Created:");
        console.log(resp);
        console.log("\nShare this token with the user for signup.");
    } catch (error) {
        console.error("Error seeding token:", error);
    } finally {
        process.exit(0);
    }
}

main();
