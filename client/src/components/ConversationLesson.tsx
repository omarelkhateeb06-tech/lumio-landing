import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, X, ArrowRight } from "lucide-react";

const SIGNUP_URL = "https://lumio-ai-learning-pl-fdup.bolt.host/signup";

const BAD_PROMPT = "Write me a quarterly review email.";

const BAD_RESPONSE = `Hi [Manager],

I wanted to share my quarterly review. This quarter was productive and I made good progress on several initiatives. I'm looking forward to next quarter.

Let me know if you need anything else.

Thanks`;

const GOOD_PROMPT =
  "Write me a quarterly review email for my manager Sarah. Focus on the Q3 onboarding launch I led. Tone: confident but humble. Include the 23% conversion lift over our 15% target. End with three specific Q4 goals.";

const GOOD_RESPONSE = `Hi Sarah,

Quick Q3 recap, the headline: the onboarding launch I led drove a 23% conversion lift, exceeding our 15% target.

A few things I'm proud of:
- Shipped the redesign two weeks ahead of schedule
- Instrumented the funnel end-to-end with growth
- Built the playbook the team is reusing for Q4

For Q4, I want to focus on:
1. Extending the onboarding wins to enterprise
2. Owning retention from day 30 to day 90
3. Mentoring the new APM on launch planning

Happy to go deeper on any of this in our 1:1.

Best,
Omar`;

// Expo ease-out: editorial, smooth, never bouncy
const EASE = [0.16, 1, 0.3, 1] as const;

const cardReveal = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

export default function ConversationLesson() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

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
            What one lesson looks like.
          </h2>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.1}
          className="text-center text-[#6B7280] text-lg mb-16 max-w-md mx-auto"
        >
          Same model. Same question. Different skill level.
        </motion.p>

        {/* Before / After cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-[1040px] mx-auto items-start">
          {/* ---- LEFT: Without Lumio ---- */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardReveal}
            custom={0.2}
            className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgb(28,25,23,0.03)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAFAF7]">
              <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Without Lumio
              </span>
              <span className="text-[11px] font-medium text-[#6B7280] bg-[#F5F5F4] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <X className="w-3 h-3" /> Generic
              </span>
            </div>

            {/* Chat */}
            <div className="px-5 py-5 space-y-4">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-[#F5F5F4] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[90%]">
                  <p className="text-sm text-[#1C1917] leading-relaxed">
                    {BAD_PROMPT}
                  </p>
                </div>
              </div>

              {/* AI response */}
              <div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E5E7EB] max-w-[90%]">
                  <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                    {BAD_RESPONSE}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#E5E7EB] bg-[#FAFAF7]/60">
              <p className="text-xs text-[#9CA3AF] italic">
                You'd never send this.
              </p>
            </div>
          </motion.div>

          {/* ---- RIGHT: With Lumio ---- */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardReveal}
            custom={0.45}
            className="bg-white rounded-2xl border border-[#166534]/20 shadow-[0_4px_20px_rgb(22,101,52,0.06),0_12px_40px_rgb(28,25,23,0.04)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#166534]/10 flex items-center justify-between bg-[#DCFCE7]/30">
              <span className="text-[11px] font-semibold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> With Lumio
              </span>
              <motion.span
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeUp}
                custom={1.4}
                className="text-[11px] font-medium text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Specific
              </motion.span>
            </div>

            {/* Chat */}
            <div className="px-5 py-5 space-y-4">
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-[#FEF3C7] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[90%]">
                  <p className="text-sm text-[#1C1917] leading-relaxed">
                    {GOOD_PROMPT}
                  </p>
                </div>
              </div>

              {/* AI response */}
              <div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-[#166534]/20 max-w-[90%]">
                  <p className="text-sm text-[#1C1917] leading-relaxed whitespace-pre-line">
                    {GOOD_RESPONSE}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer note: adult, editorial, not a reward strip */}
            <div className="px-5 py-3 border-t border-[#166534]/10 bg-[#DCFCE7]/20">
              <p className="text-xs text-[#166534]/80 font-medium italic">
                The only difference is what was in your head before you started typing.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.8}
          className="text-center mt-14"
        >
          <p className="text-[#6B7280] text-sm mb-4">
            That's one lesson. There are 29 more.
          </p>
          <a
            href={SIGNUP_URL}
            className="inline-flex items-center gap-2 text-[#F97316] font-semibold text-base hover:gap-3 transition-all"
          >
            Start with Lesson 1 <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
