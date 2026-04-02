"use client";

import {
    MagnifyingGlass,
    Notebook,
    Plus,
    SignOut,
    UserCircle,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage({ user }: { user: any }) {
    const router = useRouter();

    const signout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.refresh();
                },
            },
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans">
            {/* Dashboard Header */}
            <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center">
                                <Notebook
                                    weight="fill"
                                    className="text-white dark:text-zinc-900"
                                    size={18}
                                />
                            </div>
                            <h1 className="font-bold text-lg hidden sm:block tracking-tight text-black dark:text-white">
                                Quick Note
                            </h1>
                        </div>

                        <div className="flex-1 max-w-md mx-8 group hidden md:block">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                    <MagnifyingGlass size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl leading-5 bg-zinc-50 dark:bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 dark:placeholder-zinc-600 sm:text-sm transition-all focus:bg-white dark:focus:bg-black"
                                    placeholder="Search notes..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end text-sm mr-2">
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    {user?.name || "User"}
                                </span>
                                <span className="text-xs text-zinc-500 truncate w-32 text-right">
                                    {user?.email}
                                </span>
                            </div>
                            <button
                                onClick={signout}
                                className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl hover:text-zinc-900 dark:hover:text-white transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 active:scale-95"
                                title="Sign out"
                            >
                                <SignOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                Your Notes
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Capture your thoughts, ideas, and tasks.
                            </p>
                        </div>
                        <button className="flex items-center gap-2.5 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-base font-bold hover:shadow-xl dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-0.5 active:translate-y-0">
                            <Plus weight="bold" size={20} />
                            <span>New Note</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] bg-white dark:bg-[#09090b] shadow-sm animate-pulse-slow">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                            <Notebook
                                size={40}
                                className="text-zinc-300 dark:text-zinc-700"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            No notes found
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs text-center mb-8">
                            Looks empty here! Start your creative journey by creating your
                            first note today.
                        </p>
                        <button className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                            Explore Templates
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
