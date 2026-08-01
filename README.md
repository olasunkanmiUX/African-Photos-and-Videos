# African Photos and Videos

This repo now includes a Decap/Netlify CMS configuration and content files so you can visually edit pages at /admin (once configured with GitHub auth). The hero headline was updated to "Premium African Stock Photos & Videos" and the navbar brand is the text "African Photos and Videos" in Georgia bold.

Next steps to deploy on Vercel:

- Option A (recommended): Add a static site generator (Eleventy) and templates that read the Markdown files in content/ and output HTML to _site/ or dist/. Then configure Vercel to run the build command (e.g., `npm run build`) and set the output directory. I can scaffold Eleventy for you if you want.

- Option B: Use a serverless function or client-side JS to fetch the Markdown files and render them. This is less common and more work for dynamic content.

For Page/Decap CMS to work with Vercel, the CMS admin UI will commit directly to GitHub using the GitHub backend in admin/config.yml. You need to register an OAuth app or Personal Access Token for GitHub if prompted.
