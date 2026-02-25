---
author: ["Tyler Sriver"]
title: "Building RecipeBox: A Self-Hosted Recipe Manager in Go"
date: "2026-02-25"
description: "How I built and deployed RecipeBox — a self-hosted web app for importing, storing, and searching recipes — using Go, SQLite, Templ, and Datastar."
tags: ["go", "sqlite", "docker", "railway", "side-project"]
ShowToc: true
---

## The Idea

I cook a lot, and my bookmarks folder was overflowing with recipe URLs from dozens of different sites. Half the links were buried under pop-ups and ads, and a few had already gone dead. I wanted a simple, self-hosted app where I could paste a URL, pull out the recipe data, and have it stored permanently in my own database. That's how RecipeBox was born.

## What It Does

RecipeBox lets you import recipes from any website that uses [JSON-LD](https://schema.org/Recipe) or WP Recipe Maker markup. You paste a URL, the app scrapes the structured data — title, ingredients, instructions, images — and saves it locally. From there you can browse your collection, search across all your recipes with full-text search, and share individual recipes via public links.

If a recipe isn't on a website, you can also create one from scratch with a manual entry form that lets you add ingredients and instructions dynamically.

## The Tech Stack

I chose Go for this project because I wanted a single binary I could deploy anywhere with no runtime dependencies. Here's what the stack looks like:

- **Go 1.24** — the backbone of the application
- **SQLite** (pure Go, no CGO) — lightweight embedded database, perfect for a self-hosted app
- **SQLite FTS5** — full-text search across recipe titles, ingredients, and descriptions
- **Echo** — HTTP routing and middleware
- **Templ** — type-safe HTML templating that compiles to Go code
- **Datastar** — hypermedia interactions and Server-Sent Events for live search
- **Cobra/Viper** — CLI framework and configuration management

No Node.js, no npm, no JavaScript build step. The frontend uses Templ for server-rendered HTML and Datastar for interactivity over SSE, which keeps the architecture simple and the bundle size at zero.

## Architecture

The codebase follows a Domain-Driven Design layout:

```
cmd/recipebox/       → CLI entry point (Cobra commands)
internal/domain/     → Core entities and interfaces
internal/application/→ Business logic and commands
internal/infrastructure/ → Data persistence and scraping
internal/interface/web/  → Web server and templates
```

This layered approach keeps the domain logic clean and independent from infrastructure concerns. The recipe scraper, the SQLite persistence layer, and the web handlers are all separate — which made it straightforward to add the CLI tools alongside the web interface.

## The Build Process

The whole project came together over about ten days. Here's roughly how it progressed:

### Week 1: Core Functionality

I started with the recipe scraper and SQLite storage layer. The scraper parses JSON-LD from recipe websites — most major cooking sites embed `schema.org/Recipe` structured data in their pages, so this covers the vast majority of recipes out there.

Next came the web interface with a card-based browse page, then full-text search using SQLite's FTS5 extension. I wired up live search with Datastar's SSE support so results update as you type with a 300ms debounce.

I also set up [Air](https://github.com/air-verse/air) for hot-reload during development, watching Go, Templ, and SQL files for changes and automatically restarting the server.

### Authentication and Multi-User Support

Once the basics worked, I added cookie-based session authentication with bcrypt password hashing. Each user's recipes are isolated — you only see your own collection. I added a migration tracking system with a `schema_migrations` table to manage database schema changes without re-running previous migrations.

### The UI Refresh

I started with Bulma CSS but it didn't feel right for the app. I migrated to a custom CSS design system I'm calling "Oxide," using Inter for body text and JetBrains Mono for code. Dark mode was a must — it detects your system preference and lets you toggle manually, persisting the choice to localStorage.

### Sharing, Deleting, and Polish

Then came the quality-of-life features: shareable recipe links using 12-character tokens so you can send a recipe to someone without them needing an account. A delete button with a custom styled confirmation modal (replacing the default browser `confirm()`). Custom notes on each recipe so you can jot down your own modifications. A print-friendly layout that collapses to a single column with a floating recipe image.

### Manual Recipe Creation

The latest feature is a full manual recipe creation form. Not every recipe lives on a website — some are family recipes or personal experiments. The form has dynamic rows for ingredients and instructions so you can build a recipe from scratch.

## Deployment

RecipeBox runs as a single binary, so deployment is flexible:

- **Local**: `make build && ./bin/recipebox serve`
- **Docker**: `docker-compose up recipebox` for containerized deployment
- **Railway**: I set up a GitHub Actions workflow that auto-deploys to [Railway](https://railway.app/) on every push to `main`, with a persistent volume for the SQLite database

The Railway setup was particularly smooth — push to main, the action triggers, and the new version is live in about a minute.

## What's Next

There are a few open items I want to tackle:

- **Edit recipe** — right now you can create and delete but not edit an existing recipe
- **Comprehensive testing** — unit tests and end-to-end tests for the core flows
- **Documentation updates** — the README needs to catch up with all the new features

## Takeaways

Building RecipeBox reinforced a few things for me:

1. **Go is great for self-hosted apps.** A single binary with an embedded SQLite database means zero deployment headaches. No runtime, no dependency management on the server.

2. **Server-rendered HTML still works.** Templ + Datastar gives you type-safe templates and real-time interactivity without shipping a JavaScript framework to the client.

3. **SQLite is underrated.** FTS5 gave me full-text search with almost no effort. For a single-user or small multi-user app, SQLite is more than enough.

4. **Ship early, iterate fast.** I had a working app in a few days and added features incrementally based on what I actually needed while using it.

The source code is up on [GitHub](https://github.com/tylersriver/recipebox) if you want to check it out or self-host your own instance.
