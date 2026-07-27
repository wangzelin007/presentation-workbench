---
name: create-presentation
description: Create or revise a presentation using the vendored Frontend Slides skill, then generate its paired karaoke rehearsal page.
license: MIT
---

# Create Presentation

This repository has one presentation workflow:

1. **Frontend Slides** creates the audience-facing HTML deck.
2. **karaoke-prompter** creates the speaker's rehearsal and live prompt page.

Do not introduce another slide engine, shared deck runtime, or presenter mode.

## Required workflow

1. Read `../frontend-slides/SKILL.md` and follow its fixed-stage, content,
   image, animation, accessibility, editing, and export requirements.
2. For the repository's consistent house style, use
   `../frontend-slides/bold-template-pack/templates/blue-professional/design.md`
   unless the user explicitly asks to explore another visual direction.
3. Inventory and inspect every source screenshot before outlining. Design the
   story around available evidence instead of replacing it with generic cards.
4. Generate the final deck as
   `presentations/<slug>/index.html`:
   - one self-contained Frontend Slides HTML file;
   - fixed 1920×1080 stage scaled uniformly to the viewport;
   - inline editing and HTML export enabled;
   - local images under `presentations/<slug>/assets/`;
   - no separate framework or repository-owned visual runtime.
5. Write the complete spoken script in
   `presentations/<slug>/script.json`. Use one silent `ask` segment as each
   slide cue followed by its spoken `say` segments. English practice scripts
   may include Chinese in `secondary`.
6. Invoke the installed `karaoke-prompter` skill and generate the paired page:

   ```bash
   npm run karaoke -- <slug>
   ```

   `script.json` is the source; never hand-edit generated `karaoke.html`.
7. Run:

   ```bash
   npm run check
   npm run review
   ```

8. Inspect every PNG in `artifacts/visual-review/<slug>/`. Automated overflow
   checks do not approve composition, evidence readability, or hierarchy.
9. Export the reviewed deck to
   `presentations/<slug>/presentation.pdf` with the vendored Frontend Slides
   export script when a PDF is requested.

## Delivery

Every completed presentation contains:

```text
presentations/<slug>/
├── index.html        Frontend Slides audience view
├── script.json       editable rehearsal source
├── karaoke.html      generated speaker view
├── presentation.pdf optional static export
└── assets/           screenshots and other evidence
```

The audience sees `index.html`. The speaker uses `karaoke.html` in a separate
window. Screen sharing targets only the audience browser window.

## Boundaries

- Do not recreate Frontend Slides behavior in repository CSS or TypeScript.
- Do not add another presentation engine without an explicit new decision from
  the user.
- Do not add decorative filler. Every visual communicates evidence, structure,
  emphasis, or navigation.
- Do not use Microsoft logos without permission or call the result an official
  Microsoft template.

## Upstream

The vendored Frontend Slides snapshot comes from
`zarazhangrui/frontend-slides` commit `9906a34` under the MIT license.
