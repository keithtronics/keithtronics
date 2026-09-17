# CLAUDE.md - AI Assistant Guidelines for keithtronics

This document provides guidance for AI assistants working with this codebase.

## Project Overview

**Repository:** keithtronics
**Status:** Personal tools
**Last Updated:** 2026-09-17

Small personal utilities. The first one is a phone-friendly view of a Dropbox-hosted Markdown task list (see `app/README.md`). This repository is public and doubles as the GitHub profile repo: keep personal data, client names and anything from the task file itself out of it, and do not add a root README that isn't meant for the profile page.

## Codebase Structure

```
keithtronics/
├── CLAUDE.md                        # This file - AI assistant guidelines
└── app/                             # Runs on the phone inside Scriptable; never hosted
    ├── README.md                    # Setup and usage
    ├── index.html                   # The page: vanilla JS, also runs in a browser for development
    ├── scriptable/Tasks.template.js # Scriptable host: login, keychain, widget, page bridge
    ├── build.mjs                    # node app/build.mjs → inlines index.html into Tasks.js
    └── Tasks.js                     # Generated; committed so it can be copied to the phone
```

### Tasks app notes

- Talks to Dropbox directly (OAuth PKCE with Dropbox's no-redirect paste-a-code flow, `files/download`, `files/upload` with rev check). No server, no secret, no redirect URI.
- The page talks to its host through `window.__host` / `window.__hostState` (injected) and `window.__outbox` / `window.__waiter` (drained by the host's `evaluateJavaScript` loop). Everything the page stores goes through `store`, which mirrors to the host.
- The parser in `app/index.html` depends on the file's conventions: `## Section` headings, `- [ ] **[Tag] Title** - note` items, `~~...~~` for done items, two-space-indented subtasks. Tags are read from the file, never hardcoded. Keep edits line-surgical so the file never gets reformatted.
- After editing `index.html` or the template, run `node app/build.mjs` and commit `Tasks.js`. Test with Playwright: mock the Dropbox endpoints for the browser path, and run `Tasks.js` under stubbed Scriptable globals with a real page as the WebView.

### Recommended Directory Structure

When adding code, consider organizing with:

```
keithtronics/
├── src/               # Source code
│   ├── components/    # UI components (if applicable)
│   ├── lib/           # Core libraries/utilities
│   └── index.*        # Main entry point
├── tests/             # Test files
├── docs/              # Documentation
├── scripts/           # Build/utility scripts
├── .github/           # GitHub workflows (if using GitHub)
├── package.json       # (or equivalent dependency file)
├── README.md          # Project readme
└── CLAUDE.md          # AI assistant guidelines
```

## Development Workflow

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd keithtronics

# Install dependencies (update based on project type)
# npm install       # Node.js
# pip install -r requirements.txt  # Python
# cargo build       # Rust
```

### Common Commands

> **TODO:** Add project-specific commands as they are established:
> - Build commands
> - Test commands
> - Lint/format commands
> - Development server commands

## Code Conventions

### General Guidelines

1. **Code Style**
   - Follow language-specific conventions
   - Use consistent formatting (configure linter/formatter)
   - Write self-documenting code with clear naming

2. **Git Practices**
   - Write clear, descriptive commit messages
   - Keep commits focused and atomic
   - Use feature branches for new work

3. **Documentation**
   - Update README.md for user-facing changes
   - Update CLAUDE.md when project structure changes
   - Add inline comments for complex logic

### AI Assistant Instructions

When working on this codebase:

1. **Before Making Changes**
   - Read relevant files before modifying them
   - Understand the existing patterns and conventions
   - Check for tests that might be affected

2. **When Writing Code**
   - Follow existing code style and patterns
   - Keep changes minimal and focused
   - Avoid over-engineering or unnecessary abstractions

3. **After Making Changes**
   - Run tests if they exist
   - Run linting/formatting if configured
   - Verify changes work as expected

4. **Commit Practices**
   - Only commit when explicitly requested
   - Use clear commit messages describing the "why"
   - Don't commit sensitive files (.env, credentials, etc.)

## Testing

> **TODO:** Document testing approach once established:
> - Test framework used
> - How to run tests
> - Test file naming conventions
> - Coverage requirements

## Build & Deployment

> **TODO:** Document build/deployment process once established:
> - Build commands
> - Environment variables needed
> - Deployment targets
> - CI/CD pipeline details

## Dependencies

> **TODO:** List key dependencies and their purposes once added

## Troubleshooting

### Common Issues

> **TODO:** Document common issues and solutions as they arise

## Project-Specific Notes

> Add any unique aspects of this project that AI assistants should know about:
> - Domain-specific terminology
> - External APIs or services used
> - Performance considerations
> - Security requirements

---

## Updating This Document

This CLAUDE.md should be kept up-to-date as the project evolves:

1. **When to Update:**
   - New major features or modules added
   - Build/test processes change
   - New conventions established
   - Project structure changes significantly

2. **What to Include:**
   - Practical, actionable information
   - Commands that actually work
   - Patterns that are actually used
   - Context that helps AI assistants be effective

Keep this document concise and focused on what's needed to work effectively with the codebase.
