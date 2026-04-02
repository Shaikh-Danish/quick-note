"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/features/auth/client";
import { useZodForm } from "@/hooks/use-zod-form";
import { type SignUpValues, signUpSchema } from "@/lib/schemas/auth";

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useZodForm<SignUpValues>(signUpSchema);

    const onSubmit = async (values: SignUpValues) => {
        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                ...values,
            });

            if (error) {
                toast.error(error.message || "Failed to create account");
                return;
            }

            toast.success("Account created successfully!");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%]  bg-zinc-200/40 dark:bg-zinc-800/20 blur-[130px] animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%]  bg-zinc-200/40 dark:bg-zinc-800/20 blur-[130px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] brightness-100 contrast-150" />
            </div>

            <div className="relative w-full max-w-[460px] animate-in fade-in zoom-in duration-1000">
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-zinc-900 dark:bg-zinc-100  mb-4 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer">
                        <Icons.logo
                            weight="fill"
                            className="text-white dark:text-zinc-900"
                            size={28}
                        />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Join Quick Note
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                        Capture your thoughts, beautifully.
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl p-8 md:p-10  border border-white dark:border-zinc-800 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="group space-y-1">
                                <label
                                    htmlFor="name"
                                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 ml-1"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        <Icons.user size={18} weight="duotone" />
                                    </div>
                                    <input
                                        id="name"
                                        {...register("name")}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-800  bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs font-semibold text-red-500 ml-1 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="group space-y-1">
                                <label
                                    htmlFor="username"
                                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 ml-1"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        <Icons.idCard size={18} weight="duotone" />
                                    </div>
                                    <input
                                        id="username"
                                        {...register("username")}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-800  bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 transition-all font-mono"
                                        placeholder="johndoe"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-xs font-semibold text-red-500 ml-1 mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="group space-y-1">
                                <label
                                    htmlFor="email"
                                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 ml-1"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        <Icons.email size={18} weight="duotone" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-800  bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-semibold text-red-500 ml-1 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="group space-y-1">
                                <label
                                    htmlFor="password"
                                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 ml-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        <Icons.password size={18} weight="duotone" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="block w-full pl-11 pr-4 py-3.5 border border-zinc-200 dark:border-zinc-800  bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-semibold text-red-500 ml-1 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900  text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent  animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <Icons.arrowRight weight="bold" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-zinc-500">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-bold text-zinc-900 dark:text-white underline-offset-4 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
