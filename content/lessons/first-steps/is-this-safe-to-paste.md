---
slug: is-this-safe-to-paste
module: first-steps
title: "Is This Safe to Paste? The 10-Second Check"
level: beginner
minutes: 15
order: 11
hook: AI gets dramatically more useful the second you paste in real material. That is also the exact second you can hand over something you were never supposed to share.
key_takeaway: Before you paste, ask one question: would I be comfortable posting this on a public bulletin board? If the answer is no, strip the names and specifics, or use your work-approved tool, or do that part yourself.
tags: [general, fundamentals]
---

## reading

AI is most helpful when you give it the real thing. Real emails, real drafts, real numbers, real situations produce far better answers than a vague description. This lesson is the guardrail on that advice, because "real" sometimes means "sensitive," and the chat box is not the private vault people assume it is.

Start with the honest truth about where your text goes. When you paste something into a free, public AI tool, assume it may be stored, may be used to help train future models, and may be seen by a human reviewer checking quality or safety. That is not paranoia; it is how many consumer tools work by default. The right mental picture is not a sealed envelope. It is a postcard. Most postcards are completely fine to send. You just would not write your bank PIN on one.

So here is the test that does all the work. Before you hit enter, ask yourself: would I be comfortable posting this exact text on a public bulletin board in the office lobby, where any coworker, client, or stranger could read it? If yes, paste away. If something in you flinches, that flinch is the signal. You do not need to memorize privacy law. You need that one half-second pause.

## multiple_choice

```json
{
  "stem": "According to the reading, when you paste text into a free, public AI tool, what is the safest assumption to make about where that text goes?",
  "options": [
    { "id": "a", "label": "It stays private between you and the AI, like a sealed envelope no one else opens", "is_correct": false, "explanation": "That is exactly the wrong mental picture. The reading says it is a postcard, not a sealed envelope, because the text may be stored or read by others." },
    { "id": "b", "label": "It may be stored, used to help train future models, and seen by a human reviewer", "is_correct": true, "explanation": "Right. The reading says to assume all three by default, which is why the postcard picture fits: fine to send most things, but not your bank PIN." },
    { "id": "c", "label": "It is deleted instantly the moment you close the chat window", "is_correct": false, "explanation": "Nothing in the reading suggests this. The honest truth is the opposite: assume it may be stored and reviewed, which is how many consumer tools work by default." }
  ]
}
```

## reading

To make the flinch reliable, run a quick three-part check on the text in front of you.

Could it identify a real person? Names, email addresses, phone numbers, home addresses, account numbers, dates of birth, medical details, or HR records. A patient's name next to their diagnosis is identifying. So is an employee's name next to a complaint about them.

Is it confidential or under an agreement? Unreleased financial figures, anything stamped "internal" or "privileged," client material covered by an NDA, contract terms, or proprietary work your company would not want public.

Would it cause harm if it leaked? Passwords, security details, private medical or legal records, an employee's salary, or anything embarrassing or damaging if read out of context.

If all three are clearly "no," you are safe; paste the real material and get a great answer. If any one is "yes," do not just paste and hope. You have three good moves instead.

## multiple_choice

```json
{
  "stem": "You are about to paste a paragraph into a free, public AI tool to get help rewording it. Which of these, if left in the text, is the unsafe one that goes wrong?",
  "options": [
    { "id": "a", "label": "A patient's full name sitting right next to their diagnosis and medical record number", "is_correct": true, "explanation": "Right. A real person's name tied to a diagnosis and MRN is exactly the identifying, harmful-if-leaked material the bulletin-board test is built to catch. Strip it to a role before pasting." },
    { "id": "b", "label": "A general description like 'an older adult being discharged after a heart failure flare-up'", "is_correct": false, "explanation": "This is the substance with no identifiers attached. It points to no specific person, so it is safe to paste and is exactly what you keep after stripping." },
    { "id": "c", "label": "A request for 'clear home-care instructions at a sixth-grade reading level'", "is_correct": false, "explanation": "This is just an instruction about format and audience. It carries no names, numbers, or secrets, so there is nothing here that can go wrong." }
  ]
}
```

## reading

Move one, and the one you will use most: strip and generalize. The AI almost never needs the identifying specifics to help you. Take a real example. A nurse wants help wording a discharge instruction. The note says "Maria Gonzalez, DOB 4/2/1958, MRN 88214, discharged after CHF exacerbation." She does not paste that. She pastes: "Patient is an older adult being discharged after a flare-up of heart failure. Help me write clear home-care instructions at a sixth-grade reading level." The AI writes an excellent set of instructions, and no patient identifier ever left the building. The real name added nothing useful anyway.

Same move for a paralegal. Instead of pasting a settlement agreement with both parties' names, the firm's name, and the dollar figure, paste: "I have a settlement agreement between two parties for a personal injury claim. Help me draft a plain-English summary letter explaining the key terms to a client. Here are the terms with names and the amount replaced by placeholders." Swap "Henderson" for "the plaintiff" and "$47,500" for "[settlement amount]." You get the same quality draft and hand over nothing identifying.

Move two: use your work-approved tool. Many employers now provide an enterprise version of ChatGPT, Claude, or Copilot with a contract that says your data will not be used for training and will not be retained the way the free consumer version is. If your workplace offers one, that is where sensitive-but-permitted work belongs. Check with IT about what your specific tool is allowed to handle, because the rules differ. The free personal account on your phone is the postcard; the approved enterprise tool is closer to the sealed envelope, but only if your IT team confirms it.

Move three: just do not paste it. Some things never belong in any chat box, approved or not. Passwords and login credentials. Full Social Security numbers. Bank account and routing numbers. A client's confidential legal records when you are not certain of the rules. When something is clearly in this category, do that piece yourself and let AI help with everything around it. You can still ask "how should I structure a password-reset email" without ever typing the password, and you can ask "what should a wire-transfer confirmation note include" without pasting the account number. The tool helps with the shape of the work while the secret stays with you.

Notice the goal is not fear. The goal is one small reflex that costs you half a second and protects you automatically. Build it now, while the stakes are low and you are practicing, so it is already a habit the day you are rushing and the document in front of you actually matters.

## multiple_choice

```json
{
  "stem": "A colleague forwards you an angry email from a named client and asks you to draft a calm reply using AI. What is the safest move that still gets you the help?",
  "options": [
    { "id": "a", "label": "Replace the client's name and account number with placeholders like 'the client' and '[account]', then paste and ask for the draft", "is_correct": true, "explanation": "Right. Stripping the identifiers keeps them in your hands while the AI still gets everything it needs to write a great calm reply. The specifics added nothing." },
    { "id": "b", "label": "Paste the whole email, name and account number included, so the AI has full context", "is_correct": false, "explanation": "That hands a real person's identifying details to a tool that may store or review them. The AI does not need the name or account number to help you sound calm." },
    { "id": "c", "label": "Refuse to use AI at all because the email involves a real person", "is_correct": false, "explanation": "That is overcautious and costs you the speed. Once you strip the identifiers, the task is perfectly safe. The skill is stripping, not avoiding." }
  ]
}
```

## reading

The most common mistake is treating the chat box like a private, secure document instead of a postcard. People reason "it is just me typing to an AI, no one else is here," and paste a full patient record or a contract with everyone's name on it. The fix is the mental switch: assume anything in a free tool could be stored, used for training, or read by a reviewer, and act accordingly. You do not have to stop using the tool. You just have to pause before sensitive text.

The second mistake is the opposite overcorrection, deciding AI is too risky and refusing to paste anything real at all. These people describe their task so vaguely that the answers are useless, then conclude AI does not work for their job. It works fine; they skipped the actual skill, which is generalizing. You strip the names and specifics and keep the substance. "Maria Gonzalez, MRN 88214, CHF" becomes "an older patient discharged after a heart failure flare-up," and the AI helps just as well. Avoidance is not safety; it is just throwing away the benefit out of fear.

## fill_blank

```json
{
  "template": "The most common mistake is treating the chat box like a private, secure document instead of a {{1}}. The opposite overcorrection is refusing to paste anything real at all, which throws away the benefit; the real skill you skipped is {{2}}.",
  "blanks": [
    { "id": 1, "accept": ["postcard", "a postcard"], "ideal": "postcard" },
    { "id": 2, "accept": ["generalizing", "generalising", "stripping and generalizing", "stripping"], "ideal": "generalizing" }
  ],
  "explanation": "The reading names both mistakes: treating the box as a secure document instead of a postcard, and refusing to paste anything real instead of generalizing. The fix in both cases is to keep the substance and strip the identifiers."
}
```

## reading

The third mistake is half-redacting. People remove the obvious name at the top but leave a dozen other identifiers buried in the text: the account number in paragraph three, the home address in the signature, the rare diagnosis that points to one specific person, the deal size only one client could have. Redaction has to cover the whole document, not just the headline. Before you paste, reread the text hunting for every name, number, and detail that could point back to a real person or a real secret.

A subtler misconception is assuming all AI tools have the same rules. They do not. A free personal account and a company-paid enterprise account can have completely different data agreements. People who learn "AI is safe at work" on the enterprise tool sometimes paste the same sensitive material into their personal phone app at home, where the protections do not exist. Match the material to the tool, and when in doubt about what your work tool is actually cleared to handle, ask IT rather than guessing.

The last mistake is thinking this requires legal expertise. It does not. You are not memorizing regulations. You are building one reflex: the half-second pause and the bulletin-board question before pasting anything that involves a real person or a real secret. That pause is the whole skill. Everything else is just three simple responses to it: strip it, move it to the approved tool, or leave it out.

## multiple_choice

```json
{
  "stem": "The reading describes 'half-redacting.' What does that mistake actually look like?",
  "options": [
    { "id": "a", "label": "Removing the obvious name at the top but leaving buried identifiers like an account number, a home address, or a tell-tale deal size", "is_correct": true, "explanation": "Right. Half-redacting is catching the headline name but missing the dozen other details buried in the text. Redaction has to cover the whole document, not just the top." },
    { "id": "b", "label": "Believing a free personal account and an enterprise account follow the exact same data rules", "is_correct": false, "explanation": "That is a different mistake in the reading, the assumption that all AI tools have the same rules. Half-redacting is specifically about missing buried identifiers in the text itself." },
    { "id": "c", "label": "Thinking you need legal expertise before you can safely paste anything", "is_correct": false, "explanation": "That is the last mistake the reading names, not half-redacting. Half-redacting is about leaving identifiers buried in the document after removing the obvious name." }
  ]
}
```

## before_after [personalizable]

```json
{
  "question": "A paralegal wants AI help summarizing a settlement for a client. Here is the unsafe paste versus the safe one that gets the same quality.",
  "before_prompt": "Summarize this settlement for our client in plain English: Henderson v. Brightway Logistics, plaintiff Maria Henderson (SSN 555-12-9988), settled for $47,500, payable by Brightway Logistics within 30 days, releasing all claims related to the warehouse injury on 8/3/2024.",
  "after_prompt": "I have a personal injury settlement agreement and need a plain-English summary letter for the client. Here are the terms with identifiers replaced: the plaintiff settled with the defendant company for [settlement amount], payable within 30 days, releasing all claims related to a workplace injury. Write a warm, clear summary letter at about an eighth-grade reading level.",
  "changes": ["Removed the real names, the SSN, and the exact dollar figure, so no identifying or sensitive data leaves the firm", "Replaced the specifics with placeholders ('the plaintiff', '[settlement amount]') that the paralegal can swap back in privately after the AI drafts the letter", "Kept the substance the AI actually needs (personal injury, 30-day payment, release of claims) so the summary is just as accurate", "Added audience and tone (warm, eighth-grade reading level) so the draft fits a stressed, non-lawyer client"]
}
```

## multiple_choice

```json
{
  "stem": "After stripping the names and the SSN, the paralegal kept 'personal injury, settled, payable within 30 days, releasing all claims.' Why keep those details?",
  "options": [
    { "id": "a", "label": "They are the substance the AI needs to write an accurate summary, and none of them identify a real person", "is_correct": true, "explanation": "Exactly. The goal is to remove identifiers and secrets, not the substance. These terms describe the deal without pointing to anyone, so the draft stays accurate and safe." },
    { "id": "b", "label": "You should actually remove those too, to be as cautious as possible", "is_correct": false, "explanation": "Stripping the substance would leave the AI nothing to work with, and the summary would be useless. The skill is removing identifiers, not removing everything." },
    { "id": "c", "label": "It does not matter what you keep once the name is gone", "is_correct": false, "explanation": "It does matter. Half-redacting is a real risk, but here the kept details carry no identifiers, so they are safe and necessary. You have to judge each detail, not stop at the name." }
  ]
}
```

## mini_project

Take one real document from your actual work this week that you genuinely want AI's help with, and turn it into a safe-to-paste version.

- Run the three-part check on it: could it identify a real person, is it confidential or under an agreement, would a leak cause harm? Write down each yes.
- For every yes, create a stripped version: swap names for roles ("the client," "the patient," "the employee"), swap numbers for placeholders ("[amount]," "[account]"), and reread the whole thing to catch the buried identifiers most people miss.
- Decide your move for this specific document: paste the stripped version into a public tool, use your work-approved tool, or keep one piece out and do it yourself.

Then actually use the stripped version to get the help you wanted, and notice that the answer is just as good without any of the sensitive details. Doing this once on real material is what turns the bulletin-board question into an automatic reflex.
