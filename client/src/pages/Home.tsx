import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Sprout,
  Briefcase,
  Palette,
  Settings,
  Building2,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationLesson from "@/components/ConversationLesson";
import PromptRunner from "@/components/PromptRunner";
import { captureEmail } from "@/lib/supabase";

// Constants
const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";

export default function Home() {
  // Navigation State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Email capture state
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailSubmitted, setHeroEmailSubmitted] = useState(false);
  const [heroEmailError, setHeroEmailError] = useState<string | null>(null);
  const [heroEmailSubmitting, setHeroEmailSubmitting] = useState(false);

  const handleHeroEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroEmailError(null);
    if (!heroEmail || !heroEmail.includes("@")) {
      setHeroEmailError("That doesn't look like an email.");
      return;
    }
    setHeroEmailSubmitting(true);
    const res = await captureEmail(heroEmail, "landing_hero");
    setHeroEmailSubmitting(false);
    if (res.ok) {
      setHeroEmailSubmitted(true);
    } else {
      setHeroEmailError("Couldn't send the link. Check your connection and try again.");
    }
  };

  // Monitor Scroll for Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Framer Motion Variants - expo ease-out for editorial warmth
  const EASE = [0.16, 1, 0.3, 1] as const;

  const fadeInVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1917] selection:bg-[#FEF3C7] selection:text-[#F97316] overflow-x-clip font-sans">
      
      {/* 1. NAVBAR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E7EB] py-4 shadow-sm" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container flex items-center justify-between">
          {/* Wordmark */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#F97316]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#1C1917]">
              Lumio
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#1C1917] transition-colors">
              How it works
            </a>
            <a href="#lessons" className="text-sm font-medium text-[#6B7280] hover:text-[#1C1917] transition-colors">
              Lessons
            </a>
            <a href="mailto:omar@lumio.ai" className="text-sm font-medium text-[#6B7280] hover:text-[#1C1917] transition-colors">
              For Teams
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-6 font-medium border-0 transition-transform active:scale-97"
            >
              <a href={SIGNUP_URL}>Try a Free Lesson</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1C1917] hover:bg-[#F5F5F4] rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-[#FAFAF7] border-b border-[#E5E7EB] overflow-hidden"
            >
              <div className="container py-6 flex flex-col gap-4">
                <a 
                  href="#how-it-works" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[#1C1917] py-2 border-b border-[#E5E7EB]/50"
                >
                  How it works
                </a>
                <a 
                  href="#lessons" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[#1C1917] py-2 border-b border-[#E5E7EB]/50"
                >
                  Lessons
                </a>
                <a 
                  href="mailto:omar@lumio.ai" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[#1C1917] py-2 border-b border-[#E5E7EB]/50"
                >
                  For Teams
                </a>
                <Button 
                  asChild
                  className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white py-6 text-base font-medium w-full mt-2"
                >
                  <a href={SIGNUP_URL}>Try a Free Lesson</a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        <div className="container max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Content Column */}
            <div className="lg:col-span-9 flex flex-col text-left">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInVariant}
                className="font-serif text-[40px] leading-[1.1] md:text-[56px] font-semibold tracking-tight text-[#1C1917]"
              >
                While you're Googling "best ChatGPT prompts," <span className="font-serif italic font-normal text-[#F97316]">the person next to you</span> just automated their entire Monday.
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={{
                  ...fadeInVariant,
                  visible: { ...fadeInVariant.visible, transition: { ...fadeInVariant.visible.transition, delay: 0.15 } }
                }}
                className="mt-6 text-[#6B7280] text-lg md:text-xl leading-relaxed font-sans max-w-xl"
              >
                Catch up in 5 minutes a day. 30 lessons, one per workday. By lesson 10 you'll save an hour a week. By lesson 30 you'll be the person your team asks.
              </motion.p>

              {/* Primary CTA + soft text link + risk reversal */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  ...fadeInVariant,
                  visible: { ...fadeInVariant.visible, transition: { ...fadeInVariant.visible.transition, delay: 0.25 } }
                }}
                className="mt-8 flex flex-col items-start gap-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <Button
                    asChild
                    className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-base font-medium transition-transform active:scale-97"
                  >
                    <a href={SIGNUP_URL}>Try lesson 1, free</a>
                  </Button>

                  <a
                    href="#lessons"
                    className="text-sm font-medium text-[#6B7280] hover:text-[#1C1917] underline underline-offset-4 decoration-[#E5E7EB] hover:decoration-[#F97316] transition-colors"
                  >
                    or see the full curriculum
                  </a>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Free. No credit card. One lesson a day. Skip any one, unsubscribe in one click.
                </p>
              </motion.div>

              {/* Email capture + honest founder line */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  ...fadeInVariant,
                  visible: { ...fadeInVariant.visible, transition: { ...fadeInVariant.visible.transition, delay: 0.35 } }
                }}
                className="mt-12 pt-8 border-t border-[#E5E7EB] max-w-xl"
              >
                {heroEmailSubmitted ? (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#166534] mt-0.5 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1917]">
                        You're in. Monday morning, Lesson 1 lands in your inbox.
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Hit reply with what's still confusing. I read every one.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#1C1917] font-medium mb-3">
                      Or get Lesson 1 in your inbox: <span className="text-[#6B7280] font-normal italic">When to use ChatGPT vs. Google.</span>
                    </p>
                    <form onSubmit={handleHeroEmail} className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        value={heroEmail}
                        onChange={(e) => setHeroEmail(e.target.value)}
                        placeholder="you@work.com"
                        disabled={heroEmailSubmitting}
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-sm text-[#1C1917] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#FEF3C7] transition-colors disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={heroEmailSubmitting}
                        className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#000000] text-white text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
                      >
                        {heroEmailSubmitting ? "Sending…" : "Send me Lesson 1"}
                      </button>
                    </form>
                    {heroEmailError && (
                      <p className="text-xs text-[#B91C1C] mt-2">{heroEmailError}</p>
                    )}
                    <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
                      Reply and tell me what's confusing. I'll rewrite the lesson and send it back to you. <span className="text-[#9CA3AF]">/ Omar, building this solo.</span>
                    </p>
                  </>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE PROMPT RUNNER (live Groq-powered demo) */}
      <PromptRunner />

      {/* CONVERSATION LESSON */}
      <ConversationLesson />

      {/* 3. THE PROBLEM SECTION */}
      <section className="py-24 bg-[#F5F5F4]/40 border-y border-[#E5E7EB]">
        <div className="container max-w-[1200px]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight">
              Most AI tutorials fail you in one of two ways.
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Too Technical Card */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-[#F5F5F4] p-8 rounded-2xl border border-[#E5E7EB] transition-all duration-300"
            >
              <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">Scenario A</span>
              <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-3 mb-4">Too technical.</h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                Ten minutes in and they're explaining how the technology works under the hood. You just wanted to write a better email.
              </p>
            </motion.div>

            {/* Too Shallow Card */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-[#F5F5F4] p-8 rounded-2xl border border-[#E5E7EB] transition-all duration-300"
            >
              <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">Scenario B</span>
              <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-3 mb-4">Too shallow.</h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                A viral thread of "game-changing AI prompts" you bookmarked, tried once, and forgot by Friday.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="container max-w-[1200px]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight">
              Build AI fluency in 5 minutes a day.
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Step 1 */}
            <motion.div variants={fadeInVariant} className="flex flex-col text-left">
              <div className="w-12 h-12 rounded-full border-2 border-[#F97316] flex items-center justify-center font-serif text-lg font-semibold text-[#F97316] mb-6">
                1
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] mb-3">
                Take a 60-second quiz.
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                We learn what you already know and what you actually want to use AI for. At work, in writing, for research, whatever fits.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInVariant} className="flex flex-col text-left">
              <div className="w-12 h-12 rounded-full border-2 border-[#F97316] flex items-center justify-center font-serif text-lg font-semibold text-[#F97316] mb-6">
                2
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] mb-3">
                Get a custom learning path.
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                30 lessons across 6 modules, ordered for the way you work. Skip what you know. Spend time on what matters.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInVariant} className="flex flex-col text-left">
              <div className="w-12 h-12 rounded-full border-2 border-[#F97316] flex items-center justify-center font-serif text-lg font-semibold text-[#F97316] mb-6">
                3
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] mb-3">
                Practice with real tools.
              </h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                Every lesson ends with a "Try It Yourself" challenge in ChatGPT or Claude. You don't just read about AI. You use it.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="text-center mt-16"
          >
            <Button 
              asChild
              className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-base font-medium transition-transform active:scale-97"
            >
              <a href={SIGNUP_URL}>Start your path</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 5. COURSE PREVIEW */}
      <section id="lessons" className="py-24 bg-[#F5F5F4]/40 border-y border-[#E5E7EB]">
        <div className="container max-w-[1200px]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight">
              Six modules. Thirty lessons. From your first prompt to your daily workflow.
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Module 1 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="bg-[#DCFCE7] text-[#166534] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Beginner
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">1. AI Foundations</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "Understand what AI actually is, in plain English."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>

            {/* Module 2 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="bg-[#DCFCE7] text-[#166534] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Beginner
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">2. AI for Everyday Work</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "Email, docs, meetings, calendar. Your daily wins."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>

            {/* Module 3 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0369A1]">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="bg-[#FEF3C7] text-[#B45309] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Intermediate
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">3. AI for Creation</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "Writing, images, brainstorming. Make better, faster."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>

            {/* Module 4 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] flex items-center justify-center text-[#1C1917]">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="bg-[#FEF3C7] text-[#B45309] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Intermediate
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">4. AI for Business Workflows</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "Automate the boring parts of your job."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>

            {/* Module 5 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C]">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="bg-[#E5E7EB] text-[#1C1917] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Advanced
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">5. Industry Deep Dives</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "AI in marketing, finance, design, ops, and PM."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>

            {/* Module 6 */}
            <motion.div 
              variants={fadeInVariant}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.01)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#F97316]">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="bg-[#E5E7EB] text-[#1C1917] text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Advanced
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">6. Building with AI</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                "From power user to AI-native: tools, agents, automations."
              </p>
              <div className="text-xs text-[#6B7280] font-medium pt-3 border-t border-[#E5E7EB]">
                5 lessons
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 6. SAMPLE LESSON */}
      <section className="py-24 md:py-32">
        <div className="container max-w-[1200px]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight">
              Look inside a lesson.
            </h2>
          </motion.div>

          {/* Faux Lesson Card Mockup */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_12px_40px_rgba(28,25,23,0.04)] overflow-hidden relative"
          >
            {/* Read time chip (replaces +50 XP badge, adult-coded, not gamified) */}
            <div className="absolute top-6 right-6 bg-[#F5F5F4] text-[#6B7280] text-xs font-medium px-3 py-1 rounded-full">
              5 min read
            </div>

            <div className="p-8 md:p-10">
              {/* Breadcrumb */}
              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                AI Foundations · Lesson 2
              </div>

              {/* Lesson Title */}
              <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#1C1917] mb-6">
                When to use ChatGPT vs. Google
              </h3>

              {/* Bullet Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#166534] mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-base text-[#1C1917]">
                    The fundamental difference between searching a database and querying a neural network.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#166534] mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-base text-[#1C1917]">
                    Why AI is terrible at factual queries (and how to spot hallucinations instantly).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#166534] mt-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-base text-[#1C1917]">
                    The "Synthesis Rule": when to delegate synthesis to Claude instead of reading 10 blue links.
                  </p>
                </div>
              </div>

              {/* Try It Yourself Box */}
              <div className="bg-[#FEF3C7]/40 border border-[#FEF3C7] rounded-xl p-5 md:p-6">
                <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider block mb-2">
                  Try it yourself challenge
                </span>
                <p className="text-sm text-[#1C1917] font-medium mb-3">
                  Copy this prompt into Claude or ChatGPT to synthesize a complex report:
                </p>
                <div className="bg-white/80 border border-[#E5E7EB] rounded-lg p-3.5 font-mono text-xs text-[#1C1917] leading-relaxed select-all">
                  "I am going to paste a project brief. Analyze it for potential scheduling bottlenecks and list three high-risk items. Present them as bullet points with a brief mitigation strategy for each."
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="text-center mt-12"
          >
            <Button 
              asChild
              className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-base font-medium transition-transform active:scale-97"
            >
              <a href={SIGNUP_URL}>Try this lesson free</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 7. IDENTITY / OUTCOMES */}
      <section className="py-24 md:py-32 bg-[#F5F5F4]/40 border-y border-[#E5E7EB]">
        <div className="container max-w-[1200px]">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight italic">
              Become someone who's just good with AI.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariant}
            className="text-center mt-10"
          >
            <Button
              asChild
              className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-6 text-base font-medium transition-transform active:scale-97"
            >
              <a href={SIGNUP_URL}>Start lesson 1, free</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 bg-[#FEF3C7] border-t border-[#E5E7EB] text-center relative overflow-hidden">
        {/* Background decorative soft shapes (strictly warm tints, no cool gradients) */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FDE68A] blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F59E0B]/20 blur-3xl"></div>
        </div>

        <div className="container max-w-[1200px] relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInVariant}
            className="max-w-3xl mx-auto flex flex-col items-center"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight mb-10">
              Five minutes a day. Three Mondays from now, you're the one being asked.
            </h2>

            <Button 
              asChild
              className="rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white px-10 py-7 text-lg font-medium shadow-md transition-transform active:scale-97 border-0"
            >
              <a href={SIGNUP_URL}>Start your first lesson, free</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#FAFAF7] border-t border-[#E5E7EB] py-16">
        <div className="container max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Left Wordmark + Tagline */}
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#F97316]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-serif text-xl font-semibold tracking-tight text-[#1C1917]">
                  Lumio
                </span>
              </a>
              <p className="text-sm text-[#6B7280] font-medium">
                For people who feel behind.
              </p>
            </div>

            {/* Middle Links */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">Connect</span>
              <div className="flex flex-col gap-2">
                <a href="mailto:omar@lumio.ai" className="text-sm text-[#6B7280] hover:text-[#1C1917] transition-colors">
                  Contact (omar@lumio.ai)
                </a>
                <a href="mailto:omar@lumio.ai" className="text-sm text-[#6B7280] hover:text-[#1C1917] transition-colors">
                  For Teams
                </a>
              </div>
            </div>

            {/* Right Copyright */}
            <div className="text-left md:text-right text-sm text-[#6B7280] font-medium">
              <p>© 2026 Lumio.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
