# Presentation design system

## Principles

1. **Clarity over decoration.** Every element must support the slide's claim.
2. **One message per slide.** Split content before shrinking type.
3. **Fluent hierarchy.** Use official Fluent theme tokens exposed as CSS custom
   properties by `setTheme`; do not introduce arbitrary color palettes.
4. **Calm motion.** Keep transitions short and respect reduced-motion settings.
5. **Accessible by default.** Preserve semantic order, keyboard navigation,
   readable contrast, and descriptive alternatives.
6. **Evidence before abstraction.** Use available screenshots, outputs, and
   data before inventing summary cards.
7. **Purpose before polish.** A visual without an explanatory job is removed.

## Supported layouts

| Class | Use |
| --- | --- |
| `slide slide--title` | Opening or section divider with a strong visual field |
| `slide` | Standard assertion plus supporting content |
| `slide slide--columns` | Two related ideas or claim/evidence comparison |
| `slide slide--center` | Closing statement or single focal message |
| `panel-grid` + `panel` | Exactly three parallel concepts |

Use `slide__content` to constrain long lines. Use `eyebrow` only as a small
navigation label; it is never the slide title. Use `metric` for one prominent
number.

## Typography hierarchy

- Opening topic (`h1`) is the largest text on the opening slide.
- Opening thesis (`title-thesis`) is smaller than `h1` but larger than body.
- Every content slide uses an assertion-style `h2` larger than all prose.
- `eyebrow` is metadata, not a heading.
- Never shrink a heading to make dense content fit; split the slide.

## Content limits

- Heading: preferably 3-10 words.
- Body: preferably no more than 40 words per slide.
- List: no more than five items.
- Panel grid: exactly three items with comparable information density.
- Minimum viewport for review: 1600x900.

If content does not fit these limits, create another slide instead of reducing
font size.

## Images and data

- Keep source images in the deck directory under `assets/`.
- Open and inspect all source images before choosing the slide structure.
- Prefer SVG for diagrams and PNG/WebP for screenshots.
- Never stretch an image beyond its natural aspect ratio.
- Crop screenshots around the evidence so text remains readable at 1600x900.
- Give charts a sentence-style takeaway heading; do not rely on a legend alone.
- Cite external data in a compact source line on the same slide.

## Custom layout changes

Change `src/theme.css` only when the new pattern will benefit multiple decks.
When a one-off visual is necessary, scope its CSS to the deck and preserve the
shared typography, token colors, spacing rhythm, and presentation controls.

## Required visual review

Run `npm run review` after the production build. Inspect every generated slide
PNG at `artifacts/visual-review/<slug>/`. Automated overflow and typography
checks are necessary but cannot approve composition or visual meaning.
