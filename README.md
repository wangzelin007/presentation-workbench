# Presentation Workbench

Build, review, and publish consistent HTML presentations with a reusable
Fluent-inspired design system.

This repository combines:

- a shared presentation runtime and theme built with Microsoft's
  [Fluent UI Web Components](https://github.com/microsoft/fluentui);
- a project-level GitHub Copilot Agent Skill for repeatable deck creation;
- Microsoft's official Playwright CLI Skill for agent-driven browser review;
- a paired karaoke-style rehearsal page for every presentation;
- Playwright tests for navigation, layout, and browser-console errors; and
- GitHub Actions that validate every change and deploy `main` to GitHub Pages.

Microsoft does not currently publish an official HTML presentation generator or
presentation Agent Skill. This repository composes Microsoft's official Fluent
UI and Playwright projects into an opinionated workflow instead.

## Quick start

Requirements: Node.js 22 or newer.

```bash
npm install
npx playwright install chromium
npm run dev
```

Open the URL printed by Vite. The catalogue links to every deck in
`presentations/`.

## Create a presentation

```bash
npm run new -- my-talk "My talk title"
```

Then edit `presentations/my-talk/index.html` and `script.json`. Keep content in semantic
`<section class="slide">` elements and reuse the layouts documented in
[the design reference](.github/skills/create-presentation/references/design-system.md).

Generate the self-contained rehearsal page with the installed
`karaoke-prompter` skill:

```bash
npm run karaoke -- my-talk
```

The catalogue publishes both **Present** and **Rehearse** links. Edit
`script.json`, never the generated `karaoke.html`.

Keyboard controls:

| Key | Action |
| --- | --- |
| `ArrowRight`, `ArrowDown`, `PageDown`, `Space` | Next slide |
| `ArrowLeft`, `ArrowUp`, `PageUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `F` | Toggle fullscreen |

## Quality checks

```bash
npm run check
```

This command type-checks the source, builds every HTML entry point, and runs the
Playwright suite against the production output.

## Repository layout

```text
.claude/skills/playwright-cli/       Microsoft Playwright CLI Skill
.github/skills/create-presentation/  Project-level presentation Agent Skill
.github/workflows/                   CI and GitHub Pages deployment
presentations/                       Deck, script source, and generated karaoke
scripts/                             Scaffolding, karaoke, and catalogue tooling
src/                                 Shared theme and runtime
tests/                               Browser-level quality gates
```

## Official building blocks

- [Microsoft Fluent UI](https://github.com/microsoft/fluentui) — MIT
- [Microsoft Playwright](https://github.com/microsoft/playwright) — Apache-2.0
- [Microsoft Playwright CLI Skills](https://github.com/microsoft/playwright-cli)
  — optional agent-driven visual review
- [GitHub Pages deployment actions](https://github.com/actions/deploy-pages)

## Trademark notice

This is an independent open-source project. It is not affiliated with,
sponsored by, or endorsed by Microsoft. Microsoft, Fluent, and related marks
are trademarks of the Microsoft group of companies.

## License

[MIT](LICENSE)
