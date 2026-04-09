"use client";

import {
  ArrowRight,
  CaretDown,
  Copy,
  EnvelopeSimple,
  Folders,
  GithubLogo,
  Layout,
  Lightbulb,
  Lightning,
  MagnifyingGlass,
  Notebook,
  Plus,
  Printer,
  ShieldCheck,
  SignOut,
  Sparkle,
  Sun,
  Tag,
  TextT,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
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
            <a href="#preview" className="hover:text-primary transition-colors">
              Interface
            </a>
            <a href="#about" className="hover:text-primary transition-colors">
              About
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
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md bg-card/60 border border-border/50 mb-6 transition-all hover:border-border cursor-default shadow-sm text-muted-foreground">
                <Sparkle
                  weight="fill"
                  className="text-accent-foreground"
                  size={14}
                />
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
                A simple way to keep your most important information at your
                fingertips. Save what's useful once and find it instantly when
                you need it.
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
                  href="https://github.com/Shaikh-Danish/quick-note.git"
                  className="w-full sm:w-auto px-6 py-3 bg-card border border-border text-foreground  text-base font-black hover:bg-accent transition-all flex items-center justify-center gap-3"
                >
                  <GithubLogo size={20} weight="fill" />
                  The Code
                </a>
              </div>
            </motion.div>

            {/* MOCK DASHBOARD INSERTED HERE */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95, rotateX: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-20 mx-auto max-w-5xl relative z-20 group"
              style={{ perspective: "2000px" }}
            >
              <div className="relative rounded-xl border border-border/50 bg-background/30 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10 transition-transform duration-700 ease-out hover:rotate-x-2 hover:scale-[1.01] text-zinc-900 dark:text-zinc-100">

                {/* Mock Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-background/50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-[#3c3855]">
                      <Notebook
                        weight="fill"
                        className="text-white"
                        size={16}
                      />
                    </div>
                    <span className="font-black tracking-widest uppercase text-sm text-[#3c3855] dark:text-white">
                      Quick Note
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold leading-none text-[#3c3855] dark:text-white">
                        Danish Shaikh
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        danish.quick.note@gmail.com
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground border-l border-border/50 pl-6">
                      <Sun
                        size={20}
                        className="hover:text-[#3c3855] dark:hover:text-white cursor-pointer transition-colors"
                      />
                      <SignOut
                        size={20}
                        className="hover:text-[#3c3855] dark:hover:text-white cursor-pointer transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Mock Main Content */}
                <div className="p-4 sm:p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl h-[500px] overflow-hidden text-left relative">
                  <div className="flex items-end gap-3 mb-8">
                    <h2 className="text-2xl font-black text-[#3c3855] dark:text-white tracking-tight uppercase">
                      Notes
                    </h2>
                    <span className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">
                      5 items
                    </span>
                  </div>

                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1 flex items-center w-full">
                      <MagnifyingGlass
                        size={16}
                        className="absolute left-3 text-muted-foreground"
                      />
                      <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-border/50 text-sm outline-none focus:border-[#3c3855] transition-colors rounded-none"
                        disabled
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-border/50 text-xs font-bold text-muted-foreground uppercase cursor-pointer shrink-0 rounded-none transform transition hover:bg-muted/50">
                        <Tag size={14} /> All Categories <CaretDown size={14} />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-border/50 text-xs font-bold text-muted-foreground uppercase cursor-pointer shrink-0 rounded-none transform transition hover:bg-muted/50">
                        <Folders size={14} /> All Types <CaretDown size={14} />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#3c3855] dark:bg-[#5b5480] backdrop-blur-md text-white text-sm font-bold uppercase cursor-pointer hover:bg-[#2a273c] transition-colors shrink-0 rounded-none">
                        <Plus size={16} weight="bold" /> Add Note
                      </div>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5 shadow-sm border border-border/50 flex flex-col hover:border-[#3c3855] transition-colors relative group/card rounded-none">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <TextT size={12} /> Text
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <Tag size={12} /> Database
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#3c3855] dark:text-white mb-2">
                        Prod DB URI
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1 mb-6 font-mono break-all line-clamp-2">
                        postgresql://admin:secr3t@db.example.com/main
                      </p>
                      <div className="flex items-center justify-between text-muted-foreground text-xs font-bold border-t border-border/20 pt-4">
                        <span>about 2 hours ago</span>
                        <div className="flex items-center gap-3 opacity-50 group-hover/card:opacity-100 transition-opacity">
                          <Printer
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855] dark:hover:text-white transition-colors"
                          />
                          <Copy
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855] dark:hover:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 2 - Active */}
                    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 shadow-md border-l-4 border-[#3c3855] border-y border-r flex flex-col relative rounded-none">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <TextT size={12} /> Text
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <Tag size={12} /> API Key
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#3c3855] dark:text-white mb-2">
                        Stripe Test Key
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1 mb-6 font-mono truncate">
                        sk_test_51Nx...8zK
                      </p>
                      <div className="flex items-center justify-between text-muted-foreground text-xs font-bold border-t border-border/20 pt-4">
                        <span>12 hours ago</span>
                        <div className="flex items-center gap-3">
                          <Printer
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855]"
                          />
                          <Copy
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-5 shadow-sm border border-border/50 flex flex-col hover:border-[#3c3855] transition-colors group/card rounded-none">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <TextT size={12} /> Text
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 border border-border/50 rounded-none">
                          <GithubLogo size={12} /> Github
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#3c3855] dark:text-white mb-2">
                        Workflow PAT
                      </h3>
                      <p className="text-muted-foreground flex-1 mb-6 font-mono text-xs truncate">
                        ghp_aB3x9YqL1mZ...
                      </p>
                      <div className="flex items-center justify-between text-muted-foreground text-xs font-bold border-t border-border/20 pt-4">
                        <span>1 day ago</span>
                        <div className="flex items-center gap-3 opacity-50 group-hover/card:opacity-100 transition-opacity">
                          <Printer
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855] dark:hover:text-white transition-colors"
                          />
                          <Copy
                            size={16}
                            className="cursor-pointer hover:text-[#3c3855] dark:hover:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gradient to fade out the bottom seamlessly */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Background Animation */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.02),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.03),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-200/50 dark:via-zinc-800/50 to-transparent -z-10" />
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] -z-20 pointer-events-none opacity-[0.02] dark:opacity-[0.05] grayscale">
            <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50" />
          </div>
        </section>

        {/* Bento Grid / Features */}
        <section
          id="features"
          className="py-16 bg-background border-y border-border/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-full md:h-[600px]">
              {/* Feature 1: Large Card */}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-2 md:row-span-2 p-6 bg-muted/30 backdrop-blur-md border border-border/50  group hover:border-foreground transition-all overflow-hidden flex flex-col justify-between relative"
              >
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
              </motion.div>

              {/* Feature 2: Shield */}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-2 p-6 bg-muted/30 backdrop-blur-md border border-border/50  group hover:border-foreground transition-all flex items-end"
              >
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
              </motion.div>

              {/* Feature 3: Folders */}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 bg-card/30 backdrop-blur-md border border-border/50  group hover:bg-accent transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
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
                  A global clipboard for your most used data. Retrieve anything
                  in milliseconds.
                </p>
              </motion.div>

              {/* Feature 4: Layout */}
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 bg-card/30 backdrop-blur-md border border-border/50  group hover:bg-accent transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <Layout size={40} className="text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    Focus UI
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Minimalist interface that gets out of your way.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About / Vision Section */}
        <section
          id="about"
          className="py-24 bg-muted/10 border-t border-border/50"
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start gap-12 md:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 mb-2 cursor-default shadow-sm">
                  <Lightbulb weight="fill" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    The Vision
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
                  Why we built
                  <br /> Quick Note.
                </h2>

                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    Quick Note was born out of a simple frustration: endlessly
                    losing track of valuable snippets, helpful links, and
                    recurring information that didn't belong in heavy, cluttered
                    documentation.
                  </p>
                  <p>
                    Our vision is to provide a lightning-fast, frictionless
                    repository for your "boilerplate" knowledge—the data you
                    need constantly but can never seem to grab quickly enough.
                    We're keeping it minimalist, highly targeted, and beautiful.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-[400px] shrink-0 bg-card border border-border p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />

                <h3 className="text-2xl font-black tracking-tight mb-8">
                  Let's Connect
                </h3>

                <div className="space-y-4">
                  <a
                    href="mailto:danish.quick.note@gmail.com"
                    className="flex items-center gap-4 p-4 border border-border bg-background hover:bg-accent transition-all group/link"
                  >
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center group-hover/link:scale-110 transition-transform">
                      <EnvelopeSimple
                        weight="fill"
                        className="text-primary"
                        size={20}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-foreground">
                        Email Me
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        danish.quick.note@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/Shaikh-Danish/quick-note.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border border-border bg-background hover:bg-accent transition-all group/link"
                  >
                    <div className="w-10 h-10 bg-foreground/5 flex items-center justify-center group-hover/link:scale-110 transition-transform">
                      <GithubLogo
                        weight="fill"
                        className="text-foreground"
                        size={20}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-foreground">
                        GitHub Repo
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Shaikh-Danish/quick-note.git
                      </p>
                    </div>
                  </a>
                </div>
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
                The ultimate shortcut for your daily boilerplate and recurring
                information.
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
