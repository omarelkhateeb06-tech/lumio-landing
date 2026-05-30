---
slug: chain-ai-steps-to-finish-a-whole-task
module: building-with-ai
title: Chain AI steps to finish a whole task
level: confident
minutes: 15
order: 2
hook: The most powerful AI workflows don't involve one model doing one thing: they involve models checking each other's work.
key_takeaway: Specialist agents checking each other's work consistently outperform one generalist agent doing everything. The critique loop is the most powerful pattern in practical AI.
tags: [general, automation]
---

## reading

A multi-agent loop is a workflow where the output of one AI call becomes the input to another. Instead of asking one model to write, edit, and fact-check in one pass, you have three separate passes that specialize.

**A simple multi-agent loop: research → draft → critique**

**Agent 1: Researcher:** *"Your job is to research and outline, not to write prose. Given [topic], produce: key facts, 3 competing viewpoints, and a recommended structure."*

**Agent 2: Writer:** Feed Agent 1's output as context: *"You are a writer. Using only the research provided, write [piece]. Focus entirely on clarity and voice."*

**Agent 3: Critic:** Feed Agent 2's output: *"You are an editor. Read the draft critically. Where is the logic weak? What would make a skeptical reader object? Suggest 3 specific improvements."*

**Loop back:** Take the critique back to Agent 2: *"Given this critique, rewrite sections 2 and 3."*

**No-code tools for this:** Make.com and n8n both support chained AI calls with variable passing. You can build this loop visually in 30 minutes.

The quality improvement over single-pass generation is substantial, and the critique step especially surfaces things even skilled human reviewers often miss.

## before_after [personalizable]

```json
{
  "question": "Same article, two approaches. One asks a single agent to do everything; the other runs a research, draft, critique loop. Notice where the quality comes from.",
  "before_prompt": "Write a well-researched, well-edited, fact-checked 1,200-word article on the benefits of strength training for older adults.",
  "after_prompt": "Step 1 (Researcher): Research and outline only, do not write prose. For 'strength training for older adults,' give me key facts, three competing viewpoints, and a recommended structure. Then I'll pass your output to a Writer agent for the draft, and pass that draft to a Critic agent ('You are a skeptical editor: find the three weakest claims and what a doubtful reader would object to') before a final rewrite.",
  "changes": [
    "Splits one overloaded pass into specialist roles, so each agent does one job well instead of juggling research, writing, and checking at once.",
    "Adds an explicit critic step that hunts for weak logic and likely objections, surfacing problems even a careful single pass would miss.",
    "Feeds the output of each step into the next, the critique loop that consistently beats one generalist agent doing everything."
  ]
}
```

## mini_project

Your 5-minute exercise: Run the 3-agent loop above manually using ChatGPT tabs (one per agent). Use a piece of content you're working on. How does Agent 3's critique compare to what you would have caught yourself?
