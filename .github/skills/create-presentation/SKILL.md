---
name: create-presentation
description: Create or revise an HTML presentation in this repository using the shared Fluent-inspired design system, semantic slide layouts, and required browser validation.
license: MIT
---

# Create Presentation

Use this skill whenever a user asks to create, import, restyle, or revise a
presentation in this repository.

## Workflow

1. Read `references/design-system.md` before changing slide markup.
2. Inventory every source asset before outlining. Open screenshots, diagrams,
   videos, and prior decks; record which claims have real evidence. Never
   replace available evidence with a generic card or decorative shape.
3. Review `presentations/welcome/index.html` for the current supported layouts.
4. For a new deck, scaffold it with:

   ```bash
   npm run new -- <kebab-case-slug> "<Presentation title>"
   ```

5. Turn the source material into a story before styling:
   - one idea per slide;
   - a clear opening, evidence-led middle, and explicit close;
   - assertion-style headings rather than topic labels;
   - short body copy that can be read from the back of a room.
6. Use semantic HTML inside `<section class="slide">`. Reuse shared classes;
   do not add deck-local CSS unless the shared system cannot express a genuine
   content need.
7. Keep all presentation code self-contained in this repository. Do not load
   unpinned scripts, fonts, or UI libraries from a CDN.
8. Add meaningful alt text to informative images and empty alt text to purely
   decorative images.
9. Write the full spoken script in the deck's `script.json`. Use one `ask`
   segment as the silent slide cue, followed by one or more `say` segments.
   English practice scripts may include Chinese in `secondary`; secondary text
   is shown but never read.
10. Invoke the installed `karaoke-prompter` skill, then build the paired
   self-contained rehearsal page:

   ```bash
   npm run karaoke -- <slug>
   ```

   Never hand-edit `karaoke.html`; change `script.json` and regenerate it.
11. Run `npm run check`, then `npm run review`.
12. Open and inspect every PNG in `artifacts/visual-review/<slug>/`; checking a
    few representative slides is not sufficient. Verify visual purpose,
    hierarchy, evidence readability, alignment, and pacing—not only overflow.
13. Perform a visual pass of `karaoke.html` at 1600x900.
    The preferred agent workflow is the
   official Microsoft Playwright CLI skill vendored in
   `.claude/skills/playwright-cli/`:

   ```bash
   npm install -g @playwright/cli@latest
   playwright-cli open http://127.0.0.1:4173/presentations/<slug>/
   playwright-cli resize 1600 900
   playwright-cli screenshot --hires
   ```

14. Fix overflow, weak hierarchy, low contrast, pacing problems, and console errors before
    considering the deck complete.

## Boundaries

- Do not imitate a specific Microsoft presentation or copy proprietary assets.
- Do not use Microsoft logos unless the presentation has explicit permission
  and a legitimate reason to do so.
- Describe the visual system as Fluent-inspired, not Microsoft-official.
- Do not add decorative filler. Every image, shape, color field, and animation
  must communicate evidence, structure, emphasis, or navigation.
- The topic title must be the largest text on the opening slide. On every other
  slide, the `h2` assertion must be larger than all supporting prose.
- Every presentation must ship with its rehearsal script and generated karaoke
  page.
- Do not bypass the shared runtime or quality checks.
