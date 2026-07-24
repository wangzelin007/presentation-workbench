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
2. Review `presentations/welcome/index.html` for the current supported layouts.
3. For a new deck, scaffold it with:

   ```bash
   npm run new -- <kebab-case-slug> "<Presentation title>"
   ```

4. Turn the source material into a story before styling:
   - one idea per slide;
   - a clear opening, evidence-led middle, and explicit close;
   - assertion-style headings rather than topic labels;
   - short body copy that can be read from the back of a room.
5. Use semantic HTML inside `<section class="slide">`. Reuse shared classes;
   do not add deck-local CSS unless the shared system cannot express a genuine
   content need.
6. Keep all presentation code self-contained in this repository. Do not load
   unpinned scripts, fonts, or UI libraries from a CDN.
7. Add meaningful alt text to informative images and empty alt text to purely
   decorative images.
8. Run `npm run check`.
9. Perform a visual pass at 1600x900. The preferred agent workflow is the
   official Microsoft Playwright CLI skill vendored in
   `.claude/skills/playwright-cli/`:

   ```bash
   npm install -g @playwright/cli@latest
   playwright-cli open http://127.0.0.1:4173/presentations/<slug>/
   playwright-cli resize 1600 900
   playwright-cli screenshot --hires
   ```

10. Fix overflow, weak hierarchy, low contrast, and console errors before
    considering the deck complete.

## Boundaries

- Do not imitate a specific Microsoft presentation or copy proprietary assets.
- Do not use Microsoft logos unless the presentation has explicit permission
  and a legitimate reason to do so.
- Describe the visual system as Fluent-inspired, not Microsoft-official.
- Do not bypass the shared runtime or quality checks.
