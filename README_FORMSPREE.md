# Formspree and Vercel form handler

This project includes a serverless API endpoint at /api/book that receives the booking form POST and forwards submissions to Formspree. To enable this:

1. Create a form on Formspree (https://formspree.io). Copy the form ID (looks like `f/{your_id}` or just the short id).
2. Add the environment variable FORMSPREE_ID to your Vercel project settings with that ID (the part after `/f/`). Example: `abcdwxyz`.
3. Deploy to Vercel. The serverless function will forward submissions to Formspree and redirect the user back to /bookaservice/?success=1 on success.

Notes:
- The client form posts to `/api/book` (this was set in includes/book-form.njk).
- If you prefer direct Formspree client posts (no server function), change the form action to `https://formspree.io/f/{your_id}` and remove the serverless function.
