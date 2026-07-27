# Presentation Workbench

A focused workflow for producing a Frontend Slides HTML presentation and its
paired karaoke rehearsal page.

## One workflow

- **Audience view:** [Frontend Slides](https://github.com/zarazhangrui/frontend-slides)
  fixed-stage HTML with inline editing and PDF export.
- **Speaker view:** `karaoke-prompter` self-contained HTML with browser TTS,
  word highlighting, auto-scroll, mute/live modes, and looping.
- **Validation:** Playwright captures every slide and checks navigation,
  overflow, browser errors, and generated rehearsal output.
- **Publishing:** GitHub Actions deploys the reviewed files to GitHub Pages.

The project-level orchestration is in
`.github/skills/create-presentation/SKILL.md`. A pinned MIT snapshot of the
upstream Frontend Slides skill is stored in `.github/skills/frontend-slides/`.

## Final AI-Native CLI deck

```text
presentations/ai-native-cli/
├── index.html         audience presentation
├── script.json        editable bilingual rehearsal source
├── karaoke.html       generated speaker page
├── presentation.pdf  reviewed static export
└── assets/            original evidence screenshots
```

Online catalogue:
https://wangzelin007.github.io/presentation-workbench/

## Local review

Requirements: Node.js 22 or newer and Python 3.

```bash
npm install
npx playwright install chromium
npm run karaoke -- ai-native-cli
npm run check
npm run review
npm run dev
```

Open `index.html` for the audience. Open `karaoke.html` in a separate browser
window for rehearsal or live prompting. In Teams or Zoom, share only the
audience browser window.

## Karaoke controls

| Key | Action |
| --- | --- |
| `Space` | Pause/resume |
| `S` | Mute TTS for live delivery or recording |
| `M` | Manual/live mode |
| `R` | Restart |
| `F` | Fullscreen |

## Trademark notice

This independent open-source project is not affiliated with, sponsored by, or
endorsed by Microsoft.

## License

[MIT](LICENSE)
