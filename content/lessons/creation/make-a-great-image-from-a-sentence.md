---
slug: make-a-great-image-from-a-sentence
module: creation
title: Make a great image from a sentence
level: growing
minutes: 9
order: 3
hook: The difference between a mediocre AI image and a stunning one is entirely in the prompt. Here's the structure that works.
key_takeaway: Subject + setting + lighting + style anchor + technical parameters: stack these five and you'll get a usable image in 2–3 iterations instead of 15.
tags: [general, image-gen]
---

## reading

Midjourney (and DALL-E, and Stable Diffusion) responds to prompts very differently from text models. Text models reward conversational clarity. Image models reward stacking of specific descriptors.

**The image prompt formula:**
[Subject] + [Context/setting] + [Lighting] + [Style/medium] + [Technical parameters]

Example: "Product designer at a wooden desk, morning light from a large window, warm ambient, cinematic editorial photography, 35mm, shallow depth of field --ar 16:9 --v 6"

**The five levers:**

**Subject:** Be specific. "A woman" vs. "a 30s product manager looking frustrated at a laptop" produces different results.

**Lighting:** This is the highest-leverage descriptor. "Golden hour," "overcast flat light," "dramatic rim lighting". Lighting changes the entire emotional register.

**Style anchor:** Reference a known aesthetic. "Shot in the style of Magnum Photos," "Bauhaus design poster," "1970s editorial magazine spread."

**Camera language:** "35mm lens," "f/1.4," "medium format," "bird's-eye view". These cue the model on composition.

**Negative prompts:** Explicitly exclude things. "--no text, watermarks, extra limbs, oversaturated" clears the most common artifacts.

Start with the formula, run it, then iterate on whichever lever produced the wrong output.

## multiple_choice

```json
{
  "stem": "Of the five levers in the image prompt formula, this lesson calls one the highest-leverage descriptor. Which is it, and why?",
  "options": [
    {
      "id": "a",
      "label": "Lighting, because it changes the entire emotional register of the image. 'Golden hour' versus 'overcast flat light' produces a completely different feel.",
      "is_correct": true,
      "explanation": "Correct. The lesson singles out lighting as the highest-leverage descriptor precisely because it shifts the whole emotional register, not just one detail of the scene."
    },
    {
      "id": "b",
      "label": "The technical parameters like aspect ratio and version flags, since they control the final file the most.",
      "is_correct": false,
      "explanation": "Technical parameters cue composition and format, but the lesson names lighting, not the flags, as the descriptor that most changes how the image lands."
    },
    {
      "id": "c",
      "label": "The negative prompt, because excluding artifacts is what makes an image usable at all.",
      "is_correct": false,
      "explanation": "Negative prompts clear common artifacts, which is useful cleanup, but they do not set the mood. Lighting is the lever that drives the emotional register."
    }
  ]
}
```

## mini_project

Your 5-minute exercise: Think of an image you need for work. Build a prompt using the formula above. Run it in DALL-E (free in ChatGPT). What do you need to change in round 2?
