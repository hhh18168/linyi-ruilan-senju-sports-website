# Linyi Ruilan Senju Sporting Goods Website

Multilingual export-oriented sporting goods showcase website built with Vite, React, TypeScript and Tailwind CSS.

## Features

- Brand: `临沂瑞澜森炬 / Linyi Ruilan Senju`
- 15 languages with browser-language detection and a persistent language switcher
- Product categories: football, volleyball, basketball, tennis, cricket, badminton, sports bags and sports T-shirts
- Local product/category visual assets under `public/assets`
- Product category filtering
- Frontend inquiry form with validation and admin-readable submission storage
- GitHub-file admin CMS at `/admin`
- Responsive layout for mobile, tablet and desktop

## Commands

```powershell
npm install
npm run dev
npm run build
```

## Vercel Deployment

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default Vite settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Buy or bind a domain in Vercel Domains.
5. Confirm HTTPS is active and the site is reachable from overseas networks.

## Admin CMS Setup

Admin URL: `https://ruilansenju.com/admin`

Required Vercel environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_PERMISSION_CODE_HASH`
- `SESSION_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_OWNER=hhh18168`
- `GITHUB_SITE_REPO=linyi-ruilan-senju-sports-website`
- `GITHUB_DATA_REPO=linyi-ruilan-senju-cms-data`
- `GITHUB_BRANCH=main`

Generate password and permission-code hashes locally:

```powershell
node scripts/hash-admin-secret.mjs "your-admin-password"
node scripts/hash-admin-secret.mjs "your-permission-code"
```

Create a private GitHub repository named `linyi-ruilan-senju-cms-data` for inquiry records. The GitHub token used in Vercel must have permission to read and write both the website repository and the private data repository.

Admin features:

- Product add, edit, delete, image upload, visibility, and sort order
- Customer inquiry viewing
- Website text, contact email, and WhatsApp editing
- Basic layout control: section visibility, section order, colors, and catalog columns

## Notes

- The first version is a showcase website with a lightweight GitHub-file admin CMS. It does not include payment, cart or backend email delivery.
- Public contact emails: `bayi35250@gmail.com`, `lyslsm8888@gmail.com`.
- Public WhatsApp contacts: `+86 152 6539 8250`, `+86 180 6316 9020`.
- The site does not depend on remote image CDNs for core visuals, improving overseas reliability.
