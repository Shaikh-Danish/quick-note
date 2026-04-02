"use client";

import {
    ArrowRight,
    Folders,
    GithubLogo,
    Layout,
    Lightning,
    Notebook,
    Quotes,
    ShieldCheck,
    Sparkle,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground scroll-smooth">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-100 px-4 py-4 pointer-events-none">
                <nav className="max-w-4xl mx-auto flex items-center justify-between h-14 px-6  border border-border/50 bg-background/70 backdrop-blur-2xl pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-7 h-7 bg-primary  flex items-center justify-center transition-transform group-hover:rotate-6">
                            <Notebook
                                weight="fill"
                                className="text-primary-foreground"
                                size={16}
                            />
                        </div>
                        <span className="font-bold text-sm tracking-tight hidden sm:block">
                            Quick Note
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <a
                            href="#features"
                            className="hover:text-primary transition-colors"
                        >
                            Flow
                        </a>
                        <a
                            href="#community"
                            className="hover:text-primary transition-colors"
                        >
                            Shortcuts
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/sign-in"
                            className="text-xs font-bold px-3 py-1.5 hover:text-muted-foreground transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="px-4 py-2 bg-primary text-primary-foreground  text-xs font-black hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                        >
                            Join Now
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5  bg-card/50 border border-border/50 mb-6 animate-fade-in transition-all hover:border-border cursor-default shadow-sm text-muted-foreground">
                                <Sparkle weight="fill" className="text-accent-foreground" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Better productivity awaits
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.85] text-foreground">
                                Your useful data.
                                <br />
                                Always within{" "}
                                <span className="italic font-serif font-light text-muted-foreground">
                                    reach.
                                </span>
                            </h1>

                            <p className="max-w-xl mx-auto text-muted-foreground text-lg md:text-xl font-medium mb-12 leading-relaxed tracking-tight">
                                A simple way to keep your most important information at your fingertips.
                                Save what's useful once and find it instantly when you need it.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/sign-up"
                                    className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground  text-base font-black hover:shadow-2xl dark:hover:shadow-white/5 transition-all hover:-translate-y-1 active:translate-y-0 group"
                                >
                                    Get Started
                                    <ArrowRight
                                        weight="bold"
                                        className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                                <a
                                    href="https://github.com"
                                    className="w-full sm:w-auto px-6 py-3 bg-card border border-border text-foreground  text-base font-black hover:bg-accent transition-all flex items-center justify-center gap-3"
                                >
                                    <GithubLogo size={20} weight="fill" />
                                    The Code
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Hero Background Animation */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.03),transparent)]" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-200/50 dark:via-zinc-800/50 to-transparent -z-10" />
                    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] -z-20 pointer-events-none opacity-[0.02] dark:opacity-[0.05] grayscale">
                        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50" />
                    </div>
                </section>

                {/* Bento Grid / Features */}
                <section id="features" className="py-16 bg-background border-y border-border/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-full md:h-[600px]">
                            {/* Feature 1: Large Card */}
                            <div className="md:col-span-2 md:row-span-2 p-6 bg-muted/30 border border-border/50  group hover:border-foreground transition-all overflow-hidden flex flex-col justify-between relative">
                                <div>
                                    <div className="w-12 h-12 bg-card  flex items-center justify-center mb-6 shadow-sm border border-border">
                                        <Lightning
                                            weight="fill"
                                            size={24}
                                            className="text-foreground"
                                        />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tighter">
                                        Instant Access
                                    </h3>
                                    <p className="text-muted-foreground text-lg leading-snug">
                                        Find what you need in a split second. Your most important
                                        information is always right where you left it.
                                    </p>
                                </div>
                                <div className="mt-8 relative h-48 -mr-16 -mb-4 bg-muted rounded-tl-4xl border-t border-l border-border opacity-50 transition-all group-hover:opacity-100 group-hover:-translate-x-4">
                                    {/* Abstract UI representation */}
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 w-32 bg-muted-foreground/30 " />
                                        <div className="h-4 w-48 bg-muted-foreground/20 " />
                                        <div className="h-4 w-24 bg-muted-foreground/30 " />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Shield */}
                            <div className="md:col-span-2 p-6 bg-muted/30 border border-border/50  group hover:border-foreground transition-all flex items-end">
                                <div className="flex-1">
                                    <div className="w-10 h-10 bg-card  flex items-center justify-center mb-4 shadow-sm border border-border">
                                        <ShieldCheck
                                            weight="bold"
                                            size={20}
                                            className="text-foreground"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight mb-2">
                                        Immutable Security
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your notes are your business. Everything is encrypted at
                                        rest and in transit.
                                    </p>
                                </div>
                                <ShieldCheck
                                    size={120}
                                    weight="thin"
                                    className="text-muted-foreground -mr-4 -mb-4 opacity-50 transition-transform group-hover:scale-110"
                                />
                            </div>

                            {/* Feature 3: Folders */}
                            <div className="p-6 bg-card/30 border border-border/50  group hover:bg-accent transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                                <Folders
                                    size={140}
                                    weight="duotone"
                                    className="absolute -top-10 -right-10 opacity-20 transition-transform group-hover:rotate-12"
                                />
                                <div className="z-10">
                                    <h3 className="text-xl font-black leading-tight">
                                        Instant
                                        <br />
                                        Notes
                                    </h3>
                                </div>
                                <p className="text-xs font-medium z-10 opacity-70">
                                    A global clipboard for your most used data. Retrieve anything in milliseconds.
                                </p>
                            </div>

                            {/* Feature 4: Layout */}
                            <div className="p-8 bg-card/30 border border-border/50  group hover:bg-accent transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                                <Layout
                                    size={40}
                                    className="text-muted-foreground"
                                />
                                <div>
                                    <h3 className="text-lg font-black tracking-tight">
                                        Focus UI
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
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
                    className="py-20 bg-background overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
                        <div className="flex-1">
                            <Quotes
                                weight="fill"
                                size={60}
                                className="text-primary-foreground mb-8"
                            />
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-foreground">
                                Trusted by people who need their data now.
                            </h2>
                            <div className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-2xl">
                                <div className="w-12 h-12 bg-muted-foreground/30  shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">
                                        "Quick Note is the first tool that actually makes my
                                        useful information easy to find. Invaluable."
                                    </p>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1 block">
                                        Power User, Creative Hub
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Decorative visual representing the app */}
                            <div className="w-full aspect-square bg-secondary border border-border  flex items-center justify-center p-6 overflow-hidden group">
                                <div className="w-full h-full bg-background  shadow-xl transition-transform group-hover:scale-105 duration-700">
                                    {/* Placeholder for your generated image */}
                                    <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
                                        <span className="text-[8px] uppercase tracking-[0.5em] font-black opacity-20">
                                            Preview Interface
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-backgroundmber-400  blur-[100px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 leading-[0.9]">
                            Access your useful
                            <br />
                            data instantly.
                        </h2>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-4 px-8 py-4 bg-background text-foreground  text-lg font-black hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            Get Started
                            <ArrowRight weight="bold" size={20} />
                        </Link>
                        <p className="mt-12 text-sm font-bold opacity-40 uppercase tracking-widest leading-loose">
                            No credit card required • GDPR Compliant • Open Source
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-border/50 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                    <Notebook
                                        weight="fill"
                                        className="text-primary-foreground"
                                        size={14}
                                    />
                                </div>
                                <span className="font-black tracking-tighter text-sm uppercase">
                                    Quick Note / Suite
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium max-w-xs">
                                The ultimate shortcut for your daily boilerplate and recurring information.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
                            <ul className="space-y-4">
                                <li className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Product
                                </li>
                                <li className="text-sm font-bold hover:text-muted-foreground transition-colors cursor-pointer">
                                    Releases
                                </li>
                                <li className="text-sm font-bold hover:text-muted-foreground transition-colors cursor-pointer">
                                    Plugins
                                </li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Studio
                                </li>
                                <li className="text-sm font-bold hover:text-muted-foreground transition-colors cursor-pointer">
                                    About
                                </li>
                                <li className="text-sm font-bold hover:text-muted-foreground transition-colors cursor-pointer">
                                    Careers
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-24 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                            © 2026 Quick Note Inc. / All status checks green.
                        </p>
                        <div className="flex gap-8 text-muted-foreground">
                            <GithubLogo
                                size={20}
                                weight="fill"
                                className="hover:text-primary transition-colors cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Micro-animations Overlay */}
            <div className="fixed inset-0 pointer-events-none z-1000 border-20 border-foreground/5 opacity-50" />
        </div>
    );
}
