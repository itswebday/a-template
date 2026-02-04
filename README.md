This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tenant library (itswebday)

Shared pages and components are imported from the **itswebday** package (deployed on Vercel). In `package.json`, replace `your-org/itswebday` with your GitHub org/repo. Use a tag instead of `#main` for a pinned version (e.g. `#v1.0.0`). To publish via npm instead, set the dependency to `"itswebday": "^0.1.0"` and run `npm publish` from the itswebday repo when releasing updates.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Private itswebday repo (GitHub)

If **itswebday** is a private GitHub repo, add a **GitHub Personal Access Token** in Vercel so the build can install it:

1. In GitHub: **Settings → Developer settings → Personal access tokens** → create a token with `repo` (read) scope.
2. In Vercel: open your project → **Settings → Environment Variables** → add `GITHUB_TOKEN` with that token (mark as **Sensitive**).

The project uses a custom install command so `npm install` uses HTTPS with this token instead of SSH. Redeploy after saving the variable.
