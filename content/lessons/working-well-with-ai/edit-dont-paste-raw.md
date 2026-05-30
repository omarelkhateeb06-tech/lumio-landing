---
slug: edit-dont-paste-raw
module: working-well-with-ai
title: "Edit, Don't Paste Raw: Finishing AI's Work"
level: growing
minutes: 6
order: 13
hook: The single habit that separates people who use AI well from people who get caught: they never send the first draft as-is.
key_takeaway: AI gives you a strong draft, not a finished product, so always do a short editing pass to cut filler, fix what's wrong, and make it sound like you before anything leaves your hands.
tags: [general, editing, writing]
---

## reading

Almost every AI embarrassment, the invented fact in a report, the email that sounds like a robot, the proposal with a placeholder nobody removed, traces back to one habit: someone pasted raw AI output straight into the real world without reading it properly. The fix is not a better prompt. It is a five-minute editing pass that you never skip.

Think of AI output as a strong first draft from a fast but careless assistant. It got you 80 percent of the way in seconds, which is the whole point. But the last 20 percent, the part that makes it correct, appropriate, and yours, is your job. That last stretch is where the value and the safety live.

Here is the editing pass, and it takes minutes.

**Cut what does not earn its place.** AI over-writes. It pads with filler intros, restates the obvious, and inflates simple points. Read once with a delete key in hand. Almost everything reads better shorter.

**Check the facts and the fit.** Confirm any specific claim, number, or name. Then ask the question only you can answer: is this appropriate for this person, this moment, this relationship? The AI does not know the history; you do.

**Make it sound like you.** Remove the generic AI tells and adjust the wording so it matches how you actually communicate. A few sentence changes reclaim authorship and kill the robotic flatness.

**Scan for the obvious slip.** Placeholders left in, a wrong name, a tone that does not fit, a promise you cannot keep. Thirty seconds of scanning catches the mistake that would have been mortifying.

This is not about distrusting AI. It is about understanding the deal: AI does the heavy lifting fast, you do the finishing. People who honor that deal look sharp and move quickly. People who skip the edit eventually paste something they regret. Be the first kind.

## before_after [personalizable]

```json
{
  "question": "A raw AI draft of a customer reply versus the same draft after a two-minute edit. Notice what the editing pass removes and fixes.",
  "before_prompt": "Dear Valued Customer, Thank you so much for reaching out to us regarding your recent inquiry. We sincerely appreciate your patience and understanding. I am writing to inform you that we have received your request and are diligently working to address it. Please rest assured that your satisfaction is our utmost priority. We will endeavor to provide a resolution in a timely manner. [Insert resolution details here]. Should you have any further questions, please do not hesitate to reach out.",
  "after_prompt": "Hi Dana, thanks for flagging this. I looked into the double charge on your March invoice, and you're right, it was billed twice. I've refunded the duplicate today, so you'll see it back on your card within three business days. Really sorry for the hassle, and thanks for catching it. If anything still looks off, just reply here and I'll sort it out.",
  "changes": [
    "Cuts the wall of filler ('valued customer,' 'rest assured,' 'utmost priority') down to a direct, warm reply a person would actually send.",
    "Catches and fills the leftover placeholder, the unaddressed '[insert resolution details here],' which is exactly the slip that escapes when you paste raw.",
    "Adds the specific facts only the human knew, the double charge, the refund, the timeline, turning a hollow template into a real answer to a real problem."
  ]
}
```
