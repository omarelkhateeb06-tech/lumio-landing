import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { runPromptRunner, type PromptRunnerResponse } from "@/lib/supabase";

const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";
const EASE = [0.16, 1, 0.3, 1] as const;

const EXAMPLE_PROMPTS = [
  "Write me a quarterly review email.",
  "Summarize this meeting transcript.",
  "Help me with my onboarding deck.",
  "Draft a follow up to a client who went quiet.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; original: string; data: PromptRunnerResponse }
  | { kind: "error"; message: string };

export default function PromptRunner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || trimmed.length < 5) return;
    setState({ kind: "loading" });
    const res = await runPromptRunner(trimmed);
    if (res.ok) {
      setState({ kind: "result", original: trimmed, data: res.data });
    } else {
      setState({ kind: "error", message: res.error });
    }
  }

  function tryAnother() {
    setState({ kind: "idle" });
    setInput("");
  }

  function tryExample(p: string) {
    setInput(p);
    // give the textarea a focus ring
    setTimeout(() => {
      const el = document.getElementById("prompt-runner-input");
      el?.focus();
    }, 0);
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="container max-w-[1200px]">
        {/* Heading */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
          className="text-center max-w-2xl mx-auto mb-5"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1917] leading-tight">
            Paste a prompt. Watch Lumio fix it.
          </h2>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.1}
          className="text-center text-[#6B7280] text-lg mb-12 max-w-md mx-auto"
        >
          One of the 30 lessons, running live on this page.
        </motion.p>

        {/* Card */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.2}
          className="max-w-[900px] mx-auto"
        >
          <AnimatePresence mode="wait">
            {state.kind === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.04)] overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FAFAF7] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    Lesson 4 · Live
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Free. No signup needed.
                  </span>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <label
                    htmlFor="prompt-runner-input"
                    className="block text-sm font-medium text-[#1C1917] mb-2"
                  >
                    Paste a prompt you'd actually send to ChatGPT or Claude.
                  </label>
                  <textarea
                    id="prompt-runner-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Write me a quarterly review email."
                    rows={4}
                    maxLength={600}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#1C1917] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#FEF3C7] transition-colors resize-none"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-[#9CA3AF]">
                    <span>{input.length}/600</span>
                    <span>Powered by Llama 3.3 on Groq</span>
                  </div>

                  {/* Example chips */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="text-xs text-[#6B7280] self-center mr-1">
                      Try:
                    </span>
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => tryExample(p)}
                        className="text-xs text-[#1C1917] bg-[#F5F5F4] hover:bg-[#FEF3C7] px-3 py-1.5 rounded-full border border-[#E5E7EB] hover:border-[#F97316] transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!input.trim() || input.trim().length < 5}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-black disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Improve it with Lumio
                  </button>
                </form>
              </motion.div>
            )}

            {state.kind === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.04)] p-10 flex flex-col items-center gap-4"
              >
                <Loader2 className="w-7 h-7 text-[#F97316] animate-spin" />
                <p className="text-sm text-[#6B7280] font-medium">
                  Lumio is reading your prompt…
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  This usually takes about a second.
                </p>
              </motion.div>
            )}

            {state.kind === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.04)] p-8 text-center"
              >
                <p className="text-sm text-[#1C1917] font-medium mb-2">
                  Couldn't complete the request. Try again.
                </p>
                <p className="text-sm text-[#6B7280] mb-5">{state.message}</p>
                <button
                  onClick={tryAnother}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#F97316] hover:underline"
                >
                  <RefreshCw className="w-4 h-4" /> Try another prompt
                </button>
              </motion.div>
            )}

            {state.kind === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
              >
                {/* BEFORE: user's original */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.03)] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#E5E7EB] bg-[#FAFAF7]">
                    <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Your prompt
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-[#1C1917] leading-relaxed whitespace-pre-line">
                      {state.original}
                    </p>
                  </div>
                </div>

                {/* AFTER: Lumio improved */}
                <div className="bg-white rounded-2xl border border-[#166534]/20 shadow-[0_4px_20px_rgb(22,101,52,0.06),0_12px_40px_rgb(28,25,23,0.04)] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#166534]/10 bg-[#DCFCE7]/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#166534]" />
                    <span className="text-[11px] font-semibold text-[#166534] uppercase tracking-wider">
                      Lumio rewrite
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-[#1C1917] leading-relaxed whitespace-pre-line">
                      {state.data.improved_prompt}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t border-[#166534]/10 bg-[#DCFCE7]/20">
                    <p className="text-xs text-[#166534]/80 font-medium italic">
                      {state.data.why_better}
                    </p>
                  </div>
                </div>

                {/* Footer CTA spans both columns */}
                <div className="lg:col-span-2 mt-4 flex flex-col items-center text-center gap-3">
                  <p className="text-sm text-[#6B7280]">
                    That was one rewrite. Lumio teaches you to do it yourself in 30 lessons.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={SIGNUP_URL}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-medium transition-colors"
                    >
                      Get all 30 lessons <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={tryAnother}
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#1C1917]"
                    >
                      <RefreshCw className="w-4 h-4" /> Try another prompt
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
