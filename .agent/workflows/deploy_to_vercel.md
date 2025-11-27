---
description: How to deploy Fizikhub to Vercel
---

# Deploying to Vercel

The easiest way to share your Next.js app with friends is to deploy it to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com) account.
2.  A [Vercel](https://vercel.com) account.

## Steps

1.  **Push your code to GitHub**:
    - Create a new repository on GitHub.
    - Run the following commands in your terminal:
      ```bash
      git add .
      git commit -m "Ready for deployment"
      git branch -M main
      git remote add origin <your-github-repo-url>
      git push -u origin main
      ```

2.  **Import to Vercel**:
    - Go to your Vercel dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Import your `fizikhub` repository.

3.  **Configure Environment Variables**:
    - In the Vercel project setup, look for **"Environment Variables"**.
    - Add the following variables (copy them from your `.env.local` file):
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      - `SUPABASE_SERVICE_ROLE_KEY` (if you use it)

4.  **Deploy**:
    - Click **"Deploy"**.
    - Wait for the build to finish.
    - Once done, Vercel will give you a live URL (e.g., `fizikhub.vercel.app`) that you can share with your friends!

## Troubleshooting

-   **Build Errors**: If the build fails, check the logs on Vercel. It usually means a type error or a missing environment variable.
-   **Database Issues**: Ensure your Supabase project is reachable and you've run all migrations.
