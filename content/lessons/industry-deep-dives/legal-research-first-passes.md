---
slug: legal-research-first-passes
module: industry-deep-dives
title: "AI for Legal Research First Passes"
level: beginner
minutes: 7
order: 13
hook: Use AI to orient yourself on an unfamiliar legal area fast, then verify everything in a real source.
key_takeaway: AI is a strong starting point for understanding concepts and framing research questions, but every rule and citation must be confirmed in an authoritative legal database before you rely on it.
tags: [legal, research, hallucinations]
---

## reading

Legal research often starts with a topic you are not yet fluent in. AI can get you oriented quickly, helping you understand the landscape and frame better questions. What it cannot do is be your source of authority. Keep those two roles separate and AI becomes a genuine research accelerator.

Here is the safe and effective way to use it.

**Use it to understand concepts.** "Explain in plain language how adverse possession generally works, and the main elements courts look at." This builds your understanding fast so you know what you are looking for. You will still confirm the specifics, but you are no longer starting cold.

**Use it to frame your research.** "I am researching a landlord-tenant dispute about a withheld security deposit. What are the key issues I should investigate, and what questions should I be asking?" AI is excellent at producing a starting checklist of angles to pursue.

**Use it to translate language.** Turn dense statutory text you paste in into plain English, or rephrase a plain question into the legal terms you should search for.

Now the hard line. **Never treat AI output as legal authority.** It will invent statutes, fabricate case citations, and state rules that sound right but are wrong or outdated. It does not know the law in your jurisdiction, and it does not know what changed last month. Every rule, citation, deadline, and element you plan to rely on must be verified in an authoritative legal research database or the primary source itself.

The workflow in one line: AI helps you understand the territory and ask sharper questions, then real legal sources give you the verified answers. Orientation from the tool, authority from the law.

## try_it_live [personalizable]

```json
{
  "instructions": "Use AI to frame a research first pass without treating it as authority. Describe a legal topic you need to get oriented on, or use the sample, and ask for the key issues and questions to investigate. Sample: a small business owner asking whether a non-compete clause in an employee contract is enforceable.",
  "system_prompt": "You are a legal research orientation assistant for paralegals and legal professionals. Given an unfamiliar legal topic, explain the general concept in plain language and produce a structured list of issues to investigate and questions to research. Always state clearly that jurisdiction matters and that every rule and citation must be verified in an authoritative legal source. Never provide citations or claim to state the current law. No em dashes.",
  "ideal_output": "Here is a starting orientation, not legal authority. Non-compete enforceability varies heavily by jurisdiction, so the first thing to confirm is which state's law applies.\n\nKey issues to investigate:\n1. Whether this jurisdiction enforces non-competes at all, since some restrict or ban them.\n2. The reasonableness factors courts typically weigh: duration, geographic scope, and the legitimate business interest being protected.\n3. Whether the employee's role and access to sensitive information affect enforceability.\n4. Any required consideration the employee received in exchange for signing.\n\nQuestions to research in an authoritative source: What is the current statute or case law on non-competes in this jurisdiction? Have any recent changes affected it? Confirm every rule and citation in a real legal database before relying on it.",
  "input_placeholder": "Describe the legal topic you need to get oriented on..."
}
```
