# CLAUDE.md

## Project Overview

This is a GitHub Pages personal portfolio website combining a hand-coded HTML landing page with a Hugo-powered blog. The site is deployed to https://tylersriver.github.io/.

## Repository Structure

- `index.html` — Main landing page (hand-written HTML/CSS/JS)
- `css/style.css` — Custom styles for the landing page (light/dark theme support)
- `scripts/index.js` — Dark mode toggle with localStorage persistence
- `blog/` — Static blog HTML output
- `projects/` — Projects page
- `website/` — Hugo site source (blog engine)
  - `website/hugo.yaml` — Hugo configuration
  - `website/content/posts/` — Blog post markdown files
  - `website/themes/PaperMod/` — Hugo theme (git submodule)

## Build & Deploy

- **Hugo version**: v0.121.0
- **Build command**: `hugo --gc --minify` (run from `website/` directory)
- **Deployment**: GitHub Actions (`.github/workflows/hugo.yaml`) triggers on push to `master`, builds the Hugo site, and deploys to GitHub Pages
- **Theme**: PaperMod, managed as a git submodule — checkout with `--recurse-submodules`

## Development Notes

- No package.json, linter, or test configuration exists in this repo
- The landing page (`index.html`, `css/`, `scripts/`) is plain HTML/CSS/JS with no build step
- Blog content is authored in Markdown under `website/content/posts/`
- Dark mode is toggled via `scripts/index.js` and persisted in localStorage
