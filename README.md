# Eleventy removed

Eleventy (static site generator) has been removed from this repository to avoid build conflicts on Vercel. The site now serves the repository root index.html directly.

What changed:
- Removed Eleventy build scripts and dependencies from package.json.
- Replaced .eleventy.js, layouts and includes with placeholders to avoid confusion.
- Vercel is configured to serve root index.html (vercel.json).

If you want Eleventy again:
- Reinstall @11ty/eleventy and restore your previous templates/layouts/includes and .eleventy.js configuration.
