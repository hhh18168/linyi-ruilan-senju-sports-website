# Linyi Ruilan Senju Sporting Goods Website

Multilingual export-oriented sporting goods showcase website built with Vite, React, TypeScript and Tailwind CSS.

## Features

- Brand: `临沂瑞澜森炬 / Linyi Ruilan Senju`
- 15 languages with browser-language detection and a persistent language switcher
- Product categories: football, volleyball, basketball, tennis, cricket, badminton, sports bags and sports T-shirts
- Local product/category visual assets under `public/assets`
- Product category filtering
- Frontend inquiry form with validation and success feedback
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

## Notes

- The first version is a static showcase website. It does not include payment, cart, login, CMS or backend email delivery.
- Replace `sales@example.com` with the real sales email before production launch.
- The site does not depend on remote image CDNs for core visuals, improving overseas reliability.
