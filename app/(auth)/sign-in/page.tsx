'use client'

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Notebook, Envelope, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
            });
            setSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otp = (e.target as any).otp.value;
        setLoading(true);
        try {
            await authClient.signIn.emailOtp({
                email,
                otp,
            });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 dark:bg-zinc-100 rounded-2xl mb-6 shadow-xl">
                        <Notebook weight="fill" className="text-white dark:text-zinc-900" size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Enter your email to receive a sign-in code.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <Envelope size={20} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all text-lg"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Continue with Email"}
                                <ArrowRight weight="bold" />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                                    Verification Code
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="block w-full px-4 py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all text-center text-3xl tracking-[1em] font-mono"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-lg font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify & Sign In"}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setSent(false)}
                                className="w-full text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center mt-8 text-sm text-zinc-500">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="font-bold text-zinc-900 dark:text-white hover:underline">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
}
