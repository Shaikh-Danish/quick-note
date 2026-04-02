"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

import { authClient } from "@/features/auth/client";
import { useZodForm } from "@/hooks/use-zod-form";

import { type SignInValues, signInSchema } from "@/lib/schemas/auth";

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useZodForm<SignInValues>(signInSchema);

    const onSubmit = async (values: SignInValues) => {
        setLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                ...values,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password");
                return;
            }

            toast.success("Welcome back!");
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
        <div className="relative min-h-screen bg-background flex items-center justify-center p-3 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%]  bg-muted/30 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%]  bg-muted/30 blur-[120px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.05] brightness-100 contrast-150" />
            </div>

            <div className="relative w-full max-w-[420px] animate-in fade-in zoom-in duration-1000">
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary  mb-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] -rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer group-hover:scale-110">
                        <Icons.logo
                            weight="fill"
                            className="text-primary-foreground"
                            size={28}
                        />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Access your shortcuts
                    </p>
                </div>

                <div className="bg-background/80 backdrop-blur-2xl p-5  border border-border/50 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                                >
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-foreground dark:group-focus-within:text-primary-foreground transition-colors">
                                        <Icons.email size={18} weight="duotone" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="block w-full h-11 pl-11 pr-4 border border-border  bg-background/50 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-semibold text-destructive ml-1 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="group space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                                    >
                                        Password
                                    </Label>
                                    <Link
                                        href="#"
                                        className="text-xs font-bold text-muted-foreground hover:text-foreground dark:hover:text-primary-foreground transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-foreground dark:group-focus-within:text-primary-foreground transition-colors">
                                        <Icons.password size={18} weight="duotone" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="block w-full h-11 pl-11 pr-4 border border-border  bg-background/50 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-semibold text-destructive ml-1 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 flex items-center justify-center gap-3 bg-primary text-primary-foreground  text-base font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_15px_30px_rgba(0,0,0,0.1)] dark:shadow-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent  animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <Icons.arrowRight weight="bold" size={18} />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-10">
                    <p className="text-base text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-bold text-foreground underline-offset-4 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
