---
slug: connect-ai-to-your-other-tools-no-code
module: building-with-ai
title: Connect AI to your other tools (no code)
level: confident
minutes: 12
order: 1
hook: You don't need to be a developer to call an API: you just need to understand what an API call actually is.
key_takeaway: An API call is just a structured message to a model. Once you understand that, the whole world of automation opens up without requiring coding skills.
tags: [general, automation]
---

## reading

An API (Application Programming Interface) is a way for one piece of software to talk to another. An LLM API is a way to send text to a model and get text back programmatically, without a web interface, in a way you control and can automate.

**The mental model:** Think of an API call as a very formal version of opening ChatGPT and typing a message. You send: a system prompt (permanent instructions), a user message (the actual input), and some parameters (how creative/focused the response should be). You receive: the model's response as text your code can use.

**Why this matters for non-coders:** Once you can make an API call, you can: automate repetitive prompting tasks, connect AI to your own data, build simple tools for your team, and stop being dependent on whoever manages the ChatGPT account.

**Getting started (no coding required):**
1. Get an API key from OpenAI or Anthropic (takes 2 minutes, costs a few cents per call)
2. Use Make.com, Zapier, or n8n, visual interfaces that let you make API calls without writing code
3. Start with one simple automation: "whenever I receive an email with [trigger], send it to the API with this prompt, and [do something with the output]"

**The one concept to understand:** Tokens. API calls are priced by tokens (roughly 4 characters = 1 token). A short email costs $0.001. This is not expensive.

## mini_project

Your 5-minute exercise: Go to platform.openai.com or console.anthropic.com and create an API key. Open the API playground and make one test call using the visual interface. What did the call cost?
