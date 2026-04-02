import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { env } from "@/lib/env";

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BASE_APP_URL,
    plugins: [
        usernameClient()
    ]
})