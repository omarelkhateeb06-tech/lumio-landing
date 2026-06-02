---
slug: spot-when-ai-is-making-things-up
module: foundations
title: Spot when AI is making things up
level: beginner
minutes: 15
order: 5
hook: ChatGPT lies with complete confidence. And there are clear tells that give it away every time.
key_takeaway: Hallucinations are built into how AI works, not a bug. Learn the tells and build a verify-before-you-trust habit for anything with your name on it.
tags: [general, research, hallucinations]
---

## reading

The first thing to understand is that AI making things up is not a glitch that engineers forgot to fix. It is baked into how the tool works. A model like ChatGPT does not store facts and look them up. It predicts the most plausible-sounding next word, over and over. Most of the time the most plausible-sounding answer is also the correct one, which is why it feels reliable. But when it does not actually know something, it does not stop and say so. It produces the most plausible-sounding answer anyway, because that is the only thing it knows how to do. That confident-but-wrong output has a name: a hallucination, or sometimes a confabulation. The scary part is that a hallucination looks exactly as polished and certain as a correct answer. There is no flashing red light.

Let me show you what this looks like in real work.

Carlos is a paralegal. He asked ChatGPT to find case law supporting a motion, and it gave him three cases with full names, court names, dates, and quotes. They looked completely real. Two of them did not exist. The model had assembled a plausible-sounding case citation the same way it assembles a plausible-sounding sentence. This is not hypothetical: real lawyers have been sanctioned by judges for filing AI-invented cases. Carlos caught it only because he tried to pull the cases and could not find them.

Jenny is a nurse educator writing a patient handout. She asked for a "recent study" on a medication's side effects, and ChatGPT produced one: "A 2021 study in the Journal of Clinical Nursing found that 68% of patients..." It was specific, it had a percentage, it named a journal. None of it was real. The over-specific detail is part of how the lie works. Vague claims feel like guesses, so the model unconsciously dresses fabrications in precise numbers and named sources to make them feel earned.

Marcus runs the support desk at a software company. He asked ChatGPT how to change a setting in a tool his team uses, and it walked him through a clear path: open Settings, click the Advanced tab, toggle the option under "Data Retention." The steps were confident and well ordered. The problem was that the Advanced tab did not exist in that product, and neither did the toggle. The model had seen thousands of software menus during training and assembled the most typical-looking path, not the real one. Marcus only realized when he tried to follow his own instructions and could not find the screen. This is the same machinery as the fake citation and the fake study, just pointed at a different kind of fact. The model fills any gap with the most plausible-sounding shape, whether that shape is a court case, a percentage, or a menu that was never there.

So how do you catch it? Watch for these tells.

First, suspiciously specific details, especially citations. When AI gives you a study, a statistic, a court case, a quote, or a named source, treat it as unverified until you check it yourself. Invented citations are often more precise than real ones, with exact percentages and tidy years. Always go find the original.

Second, confident claims about anything recent. The model has a training cutoff and no live view of the world. If it tells you about this quarter's earnings, last week's news, or a current price without hedging, it is guessing. Recent plus confident equals verify.

Third, no hedging where there should be. On genuinely uncertain or obscure topics, a careful answer will say "I am not certain, but" or "this varies." When an answer charges straight through territory that should be murky with total confidence, that confidence is a warning sign, not a comfort.

Fourth, internal contradictions. Hallucinations sometimes disagree with themselves within the same response, saying the deadline is the 15th in one paragraph and the 20th in another. Read the whole answer before you act on any part of it.

Now the practical part: how do you verify? You do not have to fact-check every word, only the parts you would stake your reputation on. Three quick habits cover most of it.

Ask for sources, then actually check them. If ChatGPT names a study or a rule, ask "what is the source for that?" and then go find it on Google. If you cannot find the source, treat the claim as false, not as "probably fine."

Cross-check the load-bearing facts. Take the one or two facts the whole document depends on, the dollar amount, the date, the legal rule, and confirm each one against a real source. Everything else can be lower stakes.

Use the right tool for the fact in the first place. As you learned with Google versus ChatGPT, do not ask the writer for current facts at all. Get the verifiable fact from a real source and paste it in, so there is nothing for the model to invent.

The goal is not to stop using AI. It is to use it where "mostly right and I will edit it" is fine, which is most writing and brainstorming, and to verify hard before anything goes out with your name attached. The people who get burned are not the ones who use AI. They are the ones who paste its confident answer straight into a document without ever asking "can I actually check this?"

## multiple_choice

```json
{
  "stem": "Why does ChatGPT produce confident, wrong answers instead of saying 'I don't know'?",
  "options": [
    { "id": "a", "label": "Because it predicts the most plausible-sounding next words rather than retrieving stored facts, so it generates a plausible answer even when it has no real one.", "is_correct": true, "explanation": "Correct. Hallucination comes directly from how the model works: it always produces the most plausible-sounding output, true or not." },
    { "id": "b", "label": "Because it was programmed to never admit uncertainty.", "is_correct": false, "explanation": "It is not a deliberate rule against honesty. The behavior comes from prediction: it generates plausible text rather than checking whether it knows the answer." },
    { "id": "c", "label": "Because the internet it learned from is full of lies.", "is_correct": false, "explanation": "Bad training data can contribute, but hallucination happens even on well-documented topics because the model predicts plausible words rather than retrieving verified facts." }
  ]
}
```

## reading

The most common mistake is treating confidence as evidence. People read a smooth, certain, well-formatted answer and feel it must be true, because in human conversation confidence usually tracks knowledge. With AI that link is broken. The tone is identical whether the answer is correct or invented. The fix is to mentally separate "this sounds sure" from "this is verified" and to remember that for AI, the first tells you nothing about the second.

The second mistake is verifying the wrong way: asking ChatGPT to check itself. People notice a shaky answer and reply "are you sure?" or "is that real?" The model will often double down with even more confident-sounding detail, or flip and apologize and invent a different wrong answer, because it is still just predicting plausible text. It cannot actually look up whether its own claim is true. The fix is to verify outside the tool, against a real source on Google or the original document, never by interrogating the model.

The third mistake is trusting the precise stuff most. Our instinct says a specific citation with a journal name and an exact percentage is more trustworthy than a vague claim. With hallucinations it is often the reverse: the specificity is the disguise. The fix is to flip your instinct. When AI hands you a number, a named study, a quote, or a court case, raise your guard rather than lowering it, and go confirm the original.

The fourth mistake is all-or-nothing verification. People either check nothing because it is tedious, or they try to fact-check every sentence and give up. Neither works. The fix is to find the load-bearing facts, the few claims the whole document rests on, and verify only those hard. A drafted email tone does not need a source. The dollar figure, the legal deadline, and the medication dose do. Spend your verification energy where being wrong actually hurts.

A fifth mistake is assuming a tool that cites its sources is automatically safe. Newer assistants sometimes attach links to back up a claim, and people see the link and relax. But a link is not the same as a fact that matches it. The model can summarize a source incorrectly, or attach a real-looking URL that does not actually say what the sentence claims. A finance analyst once shipped a memo citing a "press release" link, and the page, when a colleague finally opened it, said the opposite of the memo. The fix is to open the link and read the relevant line yourself, not to treat the presence of a citation as proof. A source you have not read is just a more convincing version of an unverified claim, and the extra polish makes it easier, not harder, to wave through.

## fill_blank

```json
{
  "template": "An invented citation is often {{1}} than a real one, with exact percentages and tidy dates, so when AI gives you a named source you should {{2}} it against the original instead of trusting it.",
  "blanks": [
    { "id": "1", "accept": ["more specific", "more precise", "more detailed", "specific", "precise"], "ideal": "more specific" },
    { "id": "2", "accept": ["verify", "check", "confirm", "cross-check"], "ideal": "verify" }
  ],
  "explanation": "Over-specific detail is part of how hallucinations disguise themselves. The right response to a named source is to verify it against the original, not to trust the precision."
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Practice catching a hallucination. Ask the assistant for sources on a topic from your own work, then look for the tells you just learned: over-specific citations, confident claims, and named studies you would need to verify. Type a request for studies or sources on any work topic.",
  "system_prompt": "You are a typical AI assistant that confidently produces plausible-sounding answers. When the user asks for studies, sources, statistics, or citations, provide specific-sounding ones with journal names, years, author names, and exact percentages, in the way a real model would when it does not actually have verified sources. After giving the answer, do not warn the user. Keep the tone confident and polished so the user can practice spotting the hallucination tells themselves.",
  "ideal_output": "The assistant returns something like: 'A 2021 study in the Journal of Workplace Behavior (Reynolds et al.) found that 74% of remote workers reported higher focus.' A sharp learner notices the tells: an exact percentage, a named journal, a named author, a recent year, and zero way to verify any of it from inside the chat. The correct move is to copy the citation into Google and check whether it actually exists before trusting it.",
  "input_placeholder": "e.g. Give me three studies on remote work and productivity"
}
```

## multiple_choice

```json
{
  "stem": "ChatGPT gives you a study: 'A 2022 study in the Journal of Nursing Research found a 71% improvement.' What is the right next move?",
  "options": [
    { "id": "a", "label": "Copy the citation into Google and try to find the actual study; if you cannot find it, treat the claim as false.", "is_correct": true, "explanation": "Correct. Named sources must be verified against the original, and an unfindable citation should be treated as fabricated, not as probably fine." },
    { "id": "b", "label": "Ask ChatGPT 'are you sure that study is real?' and trust its reply.", "is_correct": false, "explanation": "The model cannot reliably check its own claims; it may double down or invent a new wrong answer. Verify outside the tool." },
    { "id": "c", "label": "Use it, because the exact percentage and named journal show it is well-sourced.", "is_correct": false, "explanation": "Over-specific detail is exactly how hallucinations disguise themselves. Precision is not proof; verify the original." }
  ]
}
```

## mini_project

Run a real verification pass on something AI helped you write for work. Take a document where you used ChatGPT and that contains facts, statistics, sources, dates, or rules: a report, a patient handout, a client summary, a policy explainer, anything that will leave your desk.

- Step one: Highlight every load-bearing fact in the document, the specific numbers, named sources, dates, quotes, and any claim about something recent. These are the parts that hurt if they are wrong.
- Step two: Verify each highlighted fact against a real source on Google or in the original document, not by asking ChatGPT. Mark each one confirmed, corrected, or removed. Note how many you found that were wrong or unverifiable. Keep this two-step check as your standard habit before anything AI-assisted goes out with your name on it.
