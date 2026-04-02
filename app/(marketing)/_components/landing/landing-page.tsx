"use client";

import {
    ArrowRight,
    CaretDown,
    Folders,
    GithubLogo,
    Layout,
    Lightning,
    Note,
    Notebook,
    Quotes,
    ShieldCheck,
    Sparkle,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#070708] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black scroll-smooth">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 pointer-events-none">
                <nav className="max-w-4xl mx-auto flex items-center justify-between h-14 px-6  border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-7 h-7 bg-zinc-950 dark:bg-white  flex items-center justify-center transition-transform group-hover:rotate-6">
                            <Notebook
                                weight="fill"
                                className="text-white dark:text-zinc-950"
                                size={16}
                            />
                        </div>
                        <span className="font-bold text-sm tracking-tight hidden sm:block">
                            Quick Note
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                        <a
                            href="#features"
                            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                            Experience
                        </a>
                        <a
                            href="#community"
                            className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                            Vault
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/sign-in"
                            className="text-xs font-bold px-3 py-1.5 hover:text-zinc-500 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950  text-xs font-black hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                        >
                            Join Now
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-44 pb-32 md:pt-60 md:pb-52">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5  bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 mb-10 animate-fade-in transition-all hover:border-zinc-300 dark:hover:border-zinc-600 cursor-default">
                                <Sparkle weight="fill" className="text-amber-500" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                                    Better productivity awaits
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-zinc-950 dark:text-white">
                                Organize{" "}
                                <span className="text-zinc-400 dark:text-zinc-600">Ideas</span>
                                <br />
                                at light{" "}
                                <span className="italic font-serif font-light text-zinc-300 dark:text-zinc-700">
                                    speed.
                                </span>
                            </h1>

                            <p className="max-w-xl mx-auto text-zinc-400 dark:text-zinc-500 text-lg md:text-xl font-medium mb-12 leading-relaxed tracking-tight">
                                A high-performance spatial note taking engine built for the
                                modern thinker. Zero friction, total control.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/sign-up"
                                    className="w-full sm:w-auto px-10 py-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950  text-lg font-black hover:shadow-2xl dark:hover:shadow-white/5 transition-all hover:-translate-y-1 active:translate-y-0 group"
                                >
                                    Start Writing
                                    <ArrowRight
                                        weight="bold"
                                        className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                                <a
                                    href="https://github.com"
                                    className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white  text-lg font-black hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                                >
                                    <GithubLogo size={24} weight="fill" />
                                    The Code
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Hero Background Animation */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.03),transparent)]" />
                    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] -z-20 pointer-events-none opacity-[0.03] dark:opacity-[0.05] grayscale">
                        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50" />
                    </div>
                </section>

                {/* Bento Grid / Features */}
                <section id="features" className="py-24 bg-white dark:bg-[#070708]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-full md:h-[600px]">
                            {/* Feature 1: Large Card */}
                            <div className="md:col-span-2 md:row-span-2 p-10 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50  group hover:border-zinc-900 dark:hover:border-zinc-100 transition-all overflow-hidden flex flex-col justify-between relative">
                                <div>
                                    <div className="w-12 h-12 bg-white dark:bg-zinc-900  flex items-center justify-center mb-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                        <Lightning
                                            weight="fill"
                                            size={24}
                                            className="text-zinc-950 dark:text-white"
                                        />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tighter">
                                        Spatial Engine
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-snug">
                                        Experience the fastest note loading in the industry. Powered
                                        by a custom database engine that puts your thoughts first.
                                    </p>
                                </div>
                                <div className="mt-8 relative h-48 -mr-16 -mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-tl-[2rem] border-t border-l border-zinc-200 dark:border-zinc-700 opacity-50 transition-all group-hover:opacity-100 group-hover:-translate-x-4">
                                    {/* Abstract UI representation */}
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 " />
                                        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-600 " />
                                        <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 " />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Shield */}
                            <div className="md:col-span-2 p-10 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50  group hover:border-zinc-900 dark:hover:border-zinc-100 transition-all flex items-end">
                                <div className="flex-1">
                                    <div className="w-10 h-10 bg-white dark:bg-zinc-900  flex items-center justify-center mb-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                        <ShieldCheck
                                            weight="bold"
                                            size={20}
                                            className="text-zinc-950 dark:text-white"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight mb-2">
                                        Immutable Security
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Your notes are your business. Everything is encrypted at
                                        rest and in transit.
                                    </p>
                                </div>
                                <ShieldCheck
                                    size={120}
                                    weight="thin"
                                    className="text-zinc-200 dark:text-zinc-800 -mr-4 -mb-4 opacity-50 transition-transform group-hover:scale-110"
                                />
                            </div>

                            {/* Feature 3: Folders */}
                            <div className="p-8 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950  group transition-all relative overflow-hidden flex flex-col justify-between">
                                <Folders
                                    size={140}
                                    weight="duotone"
                                    className="absolute -top-10 -right-10 opacity-20 transition-transform group-hover:rotate-12"
                                />
                                <div className="z-10">
                                    <h3 className="text-xl font-black leading-tight">
                                        Organized
                                        <br />
                                        Stacks
                                    </h3>
                                </div>
                                <p className="text-xs font-medium z-10 opacity-70">
                                    Multi-level nesting and metadata tagging for the super-users.
                                </p>
                            </div>

                            {/* Feature 4: Layout */}
                            <div className="p-8 bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/50  group hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex flex-col justify-between">
                                <Layout
                                    size={40}
                                    className="text-zinc-400 dark:text-zinc-600"
                                />
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">
                                        Focus UI
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                                        Minimalist interface that gets out of your way.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial / Community */}
                <section
                    id="community"
                    className="py-32 bg-white dark:bg-[#070708] overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
                        <div className="flex-1">
                            <Quotes
                                weight="fill"
                                size={60}
                                className="text-zinc-100 dark:text-zinc-800 mb-8"
                            />
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-zinc-950 dark:text-white">
                                Trusted by thinkers at world-class teams.
                            </h2>
                            <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                                <div className="w-12 h-12 bg-zinc-300 dark:bg-zinc-700  shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">
                                        "Quick Note is the first tool that actually matches the
                                        speed of my thoughts. Invaluable."
                                    </p>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1 block">
                                        Senior Lead, Apex Design
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Decorative visual representing the app */}
                            <div className="w-full aspect-square bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800  flex items-center justify-center p-8 overflow-hidden group">
                                <div className="w-full h-full bg-white dark:bg-zinc-950  shadow-xl transition-transform group-hover:scale-105 duration-700">
                                    {/* Placeholder for your generated image */}
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700">
                                        <span className="text-[8px] uppercase tracking-[0.5em] font-black opacity-20">
                                            Preview Interface
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-400  blur-[100px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-40 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 leading-[0.9]">
                            Upgrade your
                            <br />
                            brain today.
                        </h2>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-4 px-12 py-6 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white  text-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            Sign Up Free
                            <ArrowRight weight="bold" size={24} />
                        </Link>
                        <p className="mt-12 text-sm font-bold opacity-40 uppercase tracking-widest leading-loose">
                            No credit card required • GDPR Compliant • Open Source
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#070708]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-zinc-950 dark:bg-white rounded flex items-center justify-center">
                                    <Notebook
                                        weight="fill"
                                        className="text-white dark:text-zinc-950"
                                        size={14}
                                    />
                                </div>
                                <span className="font-black tracking-tighter text-sm uppercase">
                                    Quick Note / Suite
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400 font-medium max-w-xs">
                                Redefining the standard for personal knowledge management
                                systems. Built with precision for the modern web.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
                            <ul className="space-y-4">
                                <li className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                                    Product
                                </li>
                                <li className="text-sm font-bold hover:text-zinc-400 transition-colors cursor-pointer">
                                    Releases
                                </li>
                                <li className="text-sm font-bold hover:text-zinc-400 transition-colors cursor-pointer">
                                    Plugins
                                </li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                                    Studio
                                </li>
                                <li className="text-sm font-bold hover:text-zinc-400 transition-colors cursor-pointer">
                                    About
                                </li>
                                <li className="text-sm font-bold hover:text-zinc-400 transition-colors cursor-pointer">
                                    Careers
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-24 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                            © 2026 Quick Note Inc. / All status checks green.
                        </p>
                        <div className="flex gap-8 text-zinc-400">
                            <GithubLogo
                                size={20}
                                weight="fill"
                                className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Micro-animations Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[1000] border-[20px] border-white/5 dark:border-black/5 opacity-50" />
        </div>
    );
}
