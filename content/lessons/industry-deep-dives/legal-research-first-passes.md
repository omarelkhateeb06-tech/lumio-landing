---
slug: legal-research-first-passes
module: industry-deep-dives
title: "AI for Legal Research First Passes"
level: beginner
minutes: 15
order: 13
hook: Use AI to orient yourself on an unfamiliar legal area fast, then verify every rule and citation in a real source before you rely on it.
key_takeaway: AI is a strong starting point for understanding concepts and framing research questions, but every rule, citation, deadline, and element must be confirmed in an authoritative legal database before you act on it. Orientation from the tool, authority from the law.
tags: [legal, research, hallucinations]
---

## reading

Most legal research starts the same uncomfortable way. A matter lands on your desk in an area you are not yet fluent in, and you need to get up to speed fast enough to ask the attorney a smart question or pull the right materials. This is exactly where AI earns its place, and exactly where it can quietly sink you if you ask it to do the wrong job. The whole skill is keeping two roles separate. AI is for orientation. The law is for authority. Hold that line and the tool becomes a genuine research accelerator. Blur it and you end up citing a statute that does not exist.

Here is the safe and effective way to use it, with the kind of work you actually do.

## multiple_choice

```json
{
  "stem": "AI explains a legal concept clearly and gives you a tidy list of the 'elements courts look at,' including a specific statute number. How should you use this?",
  "options": [
    {
      "id": "a",
      "label": "As orientation to understand the territory and frame sharper questions, then confirm every element, rule, and the statute itself in an authoritative source.",
      "is_correct": true,
      "explanation": "Correct. Orientation from the tool, authority from the law. The explanation helps you stop starting cold, but the statute number and the elements are exactly the kind of thing AI fabricates or gets outdated, so they get verified in a real source."
    },
    {
      "id": "b",
      "label": "Cite the statute in your memo, since the AI gave a specific number.",
      "is_correct": false,
      "explanation": "A specific-looking statute number is not evidence it is real or current. AI invents and misstates citations, so none of it is authority until confirmed in the primary source."
    },
    {
      "id": "c",
      "label": "Rely on the elements list because the explanation was clearly written and internally consistent.",
      "is_correct": false,
      "explanation": "Fluent and consistent is not the same as correct or jurisdiction-specific. The list is a starting map to verify, not a finding."
    },
    {
      "id": "d",
      "label": "Ask the AI which jurisdiction the statute applies to and trust that answer.",
      "is_correct": false,
      "explanation": "The model does not reliably know your jurisdiction's current law or what changed recently. Jurisdiction and currency are precisely what you confirm in an authoritative database."
    }
  ]
}
```

## reading

Use it to understand an unfamiliar concept in plain language. Say a tenant walks in upset that a neighbor has been mowing and fencing off a strip of their backyard for years and now claims it. You have heard the phrase adverse possession but you do not work in property disputes. A good first prompt is, "Explain in plain language how adverse possession generally works, and the main elements courts usually look at." In seconds you learn that courts typically weigh things like open and notorious use, continuous possession over a statutory period, and use that is hostile to the owner's rights. Now you know the shape of the problem. You know the words to search and the questions to ask. You are no longer starting from a blank page, and that is the entire point of a first pass.

Use it to frame research questions and build a checklist of angles. Imagine a client whose landlord kept the full security deposit after they moved out of an apartment, claiming vague "cleaning and damages." You can prompt, "I am researching a landlord-tenant dispute about a withheld security deposit. What are the key issues I should investigate, and what questions should I be asking?" AI is genuinely good at this. It will surface angles you might want to check, such as whether the state requires the landlord to send an itemized list of deductions within a set number of days, whether failure to do so triggers penalties, whether there are limits on what counts as normal wear and tear, and whether the deposit had to be held in a separate account. That is a useful map of where to dig. It is not a finding. Every one of those angles still has to be confirmed against your state's actual statute and deadlines.

## multiple_choice

```json
{
  "stem": "You ask AI to surface the key issues in a withheld security deposit dispute and it returns a clean checklist of angles, like itemized-deduction deadlines and limits on normal wear and tear. What have you actually obtained?",
  "options": [
    {
      "id": "a",
      "label": "A set of verified findings you can state as the law in your memo.",
      "is_correct": false,
      "explanation": "The checklist is not a finding. Each angle still has to be confirmed against your state's actual statute and deadlines before it counts as law."
    },
    {
      "id": "b",
      "label": "Confirmation that your state requires an itemized list within a set number of days.",
      "is_correct": false,
      "explanation": "AI raising that angle does not confirm it applies in your state. Whether the deadline exists and what it is must be checked against the actual statute."
    },
    {
      "id": "c",
      "label": "A useful map of where to dig, with every angle still needing confirmation against your state's actual statute and deadlines.",
      "is_correct": true,
      "explanation": "Correct. Framing research questions is exactly what AI is good at. The output is a map of angles to investigate, not findings, so each one gets verified in the real statute."
    },
    {
      "id": "d",
      "label": "Nothing useful, since AI cannot help frame research questions.",
      "is_correct": false,
      "explanation": "AI is genuinely good at framing research questions and surfacing angles you might miss. The value is real; it is just orientation rather than authority."
    }
  ]
}
```

## reading

Use it to translate dense statutory text into plain English. Paste in a paragraph of a building code or a tax provision written in the usual run-on legal style and ask for a plain-language restatement of what it requires and who it applies to. Picture a provision that reads, "No lessor shall withhold any portion of a security deposit except for amounts reasonably necessary to remedy tenant defaults in the payment of rent or to repair damages to the premises exclusive of ordinary wear and tear." You can ask the tool to restate that in plain words and it will tell you, in effect, the landlord can only keep money for unpaid rent or real damage, not for normal aging of the apartment. This is one of the safer uses because you are giving the tool the authoritative text and asking it only to rephrase what you supplied, not to recall law from memory. You still read the original yourself, but the plain version helps you understand it faster, and it helps you spot the words that matter, like "reasonably necessary" and "ordinary wear and tear," which are often where the dispute actually lives.

Now the hard line, and it is not optional. Never treat AI output as legal authority. The tool invents statute numbers that look completely real. It fabricates case names and citations, complete with plausible volume and page numbers, for cases that were never decided. It states rules that sound right but are outdated, or that are correct in one state and flatly wrong in yours, and it does all of this with total confidence and no warning. It does not know what changed last month, and it does not know which jurisdiction governs your matter unless you tell it, and even then you should not trust its answer. A fluent, well-organized, internally consistent response is not evidence that anything in it is true. Consider a paralegal who asks for the filing deadline to answer a complaint and gets a clean, specific number of days. If that number is wrong, a missed deadline can end the case. That risk does not go away because the answer was confident.

So every rule, citation, deadline, and element you plan to rely on gets verified in an authoritative legal research database or the primary source itself. The workflow fits in one line. AI helps you understand the territory and ask sharper questions, then real legal sources give you the verified answers. Orientation from the tool, authority from the law.

## multiple_choice

```json
{
  "stem": "Which use of AI in this lesson is described as one of the safer ones, and why?",
  "options": [
    {
      "id": "a",
      "label": "Asking it to recall the filing deadline for answering a complaint, because deadlines are simple facts.",
      "is_correct": false,
      "explanation": "That is one of the riskier uses. A confident but wrong deadline can end the case, and the number must be verified in an authoritative source."
    },
    {
      "id": "b",
      "label": "Pasting in a statutory paragraph and asking it to restate that text in plain words, because you supply the authoritative text and ask it only to rephrase, not to recall law from memory.",
      "is_correct": true,
      "explanation": "Correct. Giving the tool the authoritative text and asking only for a plain-language restatement keeps it from inventing law, which is why this is one of the safer uses. You still read the original yourself."
    },
    {
      "id": "c",
      "label": "Asking it to supply the controlling case names and citations, because it provides volume and page numbers.",
      "is_correct": false,
      "explanation": "AI fabricates case names and citations with plausible-looking volume and page numbers for cases that were never decided. This is exactly what you must never treat as authority."
    },
    {
      "id": "d",
      "label": "Asking it to confirm which state's law governs, because it answers with confidence.",
      "is_correct": false,
      "explanation": "Confidence is not evidence. The tool does not reliably know which jurisdiction governs your matter, so this is not a safe use."
    }
  ]
}
```

## reading

The failures in this kind of research are predictable, which is good news, because predictable mistakes are easy to guard against once you can name them. Here are the ones that catch legal professionals most often.

Citing a statute number the AI handed you without confirming it exists and is current. The number will look perfectly formatted and authoritative. That formatting tells you nothing. AI produces citations that point to nothing, or that point to a provision that was repealed or renumbered. Pull it up in your database before it goes anywhere near a memo or a filing.

Trusting a fluent, internally consistent explanation as if it were a finding. When a paragraph reads smoothly and every part agrees with every other part, your brain wants to accept it. But coherence is not accuracy. A confident, tidy answer about the elements of a fraud claim can still be the wrong jurisdiction's version, or simply made up. Treat the explanation as a map of what to verify, never as the verified result.

Assuming the AI knows your jurisdiction's current law. Non-compete rules, security deposit deadlines, and statutes of limitations vary sharply from state to state and change over time. The tool does not know which state governs your matter unless you tell it, and even then it may give you another state's rule or a version that was amended last year. Currency and jurisdiction are exactly the two things you confirm yourself.

## multiple_choice

```json
{
  "stem": "An AI explanation of the elements of a fraud claim reads smoothly, and every part agrees with every other part. Why is that not a reason to treat it as a finding?",
  "options": [
    {
      "id": "a",
      "label": "Because long explanations are always less accurate than short ones.",
      "is_correct": false,
      "explanation": "Length is not the issue. The point is that coherence, at any length, does not establish accuracy."
    },
    {
      "id": "b",
      "label": "Because a smooth explanation means the AI is guessing and a choppy one means it is confident.",
      "is_correct": false,
      "explanation": "Writing style does not signal reliability either way. Fluent text can be wrong and is produced with the same confidence as correct text."
    },
    {
      "id": "c",
      "label": "Because internally consistent answers are always fabricated.",
      "is_correct": false,
      "explanation": "They are not always fabricated. The problem is that you cannot tell from coherence alone, so the explanation must be verified rather than assumed false or true."
    },
    {
      "id": "d",
      "label": "Because coherence is not accuracy; a confident, tidy answer can still be the wrong jurisdiction's version or simply made up, so it is a map of what to verify, not the verified result.",
      "is_correct": true,
      "explanation": "Correct. Your brain wants to accept smooth, self-consistent text, but coherence does not make it true or jurisdiction-correct. Treat it as a map of what to verify, never as the result."
    }
  ]
}
```

## reading

Pasting confidential matter facts into a public tool while researching. It is tempting to drop in real client names, addresses, and case specifics to get a sharper answer. On a public consumer tool, that can breach client confidentiality and your duty to protect it. Research the general legal concept with the details stripped out, or use a tool your firm has approved for confidential work.

Asking the AI which jurisdiction applies and trusting the answer. Choice of law is itself a legal question, sometimes a hard one. The tool can give you a guess that sounds definite, but where to file or which state's law governs is something you confirm through the actual rules and, when it matters, the supervising attorney. A confident guess on jurisdiction is still a guess.

The thread running through all five is the same. Confidence is not evidence. The tool's job ends when you have your bearings, and the law's job begins the moment anything needs to be true.

## multiple_choice

```json
{
  "stem": "While researching a client's security deposit dispute, you want a sharper answer, so you consider pasting the client's name, address, and the landlord's letter into a public AI chatbot. What is the problem?",
  "options": [
    {
      "id": "a",
      "label": "Nothing, since the details just help the AI give a more accurate legal answer.",
      "is_correct": false,
      "explanation": "More detail does not make AI authoritative, and the bigger issue is that putting real client facts into a public tool can breach confidentiality."
    },
    {
      "id": "b",
      "label": "Putting confidential client facts into a public tool can breach client confidentiality, so research the general concept with identifying details stripped out or use a firm-approved tool.",
      "is_correct": true,
      "explanation": "Correct. You can get oriented on the general legal question without exposing client information. Protect confidentiality first, and reserve real matter facts for tools your firm has approved."
    },
    {
      "id": "c",
      "label": "The only risk is that the AI might be slow with a long letter.",
      "is_correct": false,
      "explanation": "Speed is not the concern. The real risk is exposing protected client information on a public service."
    },
    {
      "id": "d",
      "label": "It is fine as long as you delete the chat afterward.",
      "is_correct": false,
      "explanation": "Deleting the chat does not undo the exposure or guarantee the data was not retained or used. Keep confidential facts out of public tools in the first place."
    }
  ]
}
```

## try_it_live [personalizable]

```json
{
  "instructions": "Use AI to frame a research first pass without treating it as authority. Describe a legal topic you need to get oriented on, or use the sample, and ask for the key issues and questions to investigate. Keep client-identifying details out. Sample: a small business owner asking whether a non-compete clause in an employee's contract is enforceable.",
  "system_prompt": "You are a legal research orientation assistant for paralegals and legal professionals. Given an unfamiliar legal topic, explain the general concept in plain language and produce a structured list of issues to investigate and questions to research. Always state clearly that jurisdiction matters and that every rule and citation must be verified in an authoritative legal source. Never provide citations or claim to state the current law. No em dashes.",
  "ideal_output": "Here is a starting orientation, not legal authority. Non-compete enforceability varies heavily by jurisdiction, so the first thing to confirm is which state's law applies.\n\nKey issues to investigate:\n1. Whether this jurisdiction enforces non-competes at all, since some states restrict or ban them.\n2. The reasonableness factors courts typically weigh, such as duration, geographic scope, and the legitimate business interest being protected.\n3. Whether the employee's role and access to sensitive information affect enforceability.\n4. Any required consideration the employee received in exchange for signing.\n\nQuestions to research in an authoritative source: What is the current statute or case law on non-competes in this jurisdiction? Have any recent changes affected it? Confirm every rule and citation in a real legal database before relying on it.",
  "input_placeholder": "Describe the legal topic you need to get oriented on..."
}
```

## multiple_choice

```json
{
  "stem": "You run the orientation prompt and the AI returns a clean four-point list of non-compete factors plus a confident statement that your state 'fully enforces' them. What is the right next move?",
  "options": [
    {
      "id": "a",
      "label": "Drop the four factors and the 'fully enforces' conclusion straight into your memo, since the answer was specific and organized.",
      "is_correct": false,
      "explanation": "Specific and organized is not the same as verified or current. Non-compete law varies by state and changes, so none of this is authority yet."
    },
    {
      "id": "b",
      "label": "Treat the factors as a map of what to verify, then confirm in an authoritative source whether your jurisdiction enforces non-competes and what the current rules are.",
      "is_correct": true,
      "explanation": "Correct. The list tells you what to go check. Whether your state enforces non-competes and on what terms is exactly the jurisdiction-and-currency question you confirm in a real legal source."
    },
    {
      "id": "c",
      "label": "Ask the AI to cite the specific state statute it relied on and use that citation.",
      "is_correct": false,
      "explanation": "Asking for a citation invites a fabricated one. AI invents real-looking statute numbers, so any citation it offers still has to be confirmed in the primary source before use."
    }
  ]
}
```

## mini_project

Pick a legal topic you are not yet fluent in, with any client-identifying details stripped out, and produce a short orientation-and-verification note like one you would hand a supervising attorney. Run the orientation prompt to get the concept in plain language and a list of issues and questions to investigate. Then choose one specific factual claim the tool made, such as a rule, an element, or a filing deadline, and verify that single claim in an authoritative legal source. Your note should make clear what came from orientation and what you actually confirmed.

- Run the orientation prompt on your topic and capture the plain-language concept plus the list of issues and questions to investigate.
- Pick one concrete claim it made, a rule, element, or deadline, and verify it in an authoritative legal database or the primary source, recording where you confirmed it.
- Write two or three sentences noting where the orientation held up and where relying on it as authority would have led you wrong.
