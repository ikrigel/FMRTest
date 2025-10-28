# GitHub Pages Deployment Guide

## Live Application

**URL:** [https://ikrigel.github.io/FMRTest/](https://ikrigel.github.io/FMRTest/)
**Alternative (Vercel):** [https://fmr-test.vercel.app/](https://fmr-test.vercel.app/)

This guide covers deploying the NGRX User Management application to GitHub Pages.

***

## Deployment Configuration

- Production build with optimizations
- Bundle size: ~405 KB raw (~95 KB transferred)
- Deployed to `gh-pages` branch
- Base path: `/FMRTest/`
- Angular Material UI components included  

***

## Setup Instructions

The project already includes the necessary deployment configuration in `package.json`:

```json
"scripts": {
  "build:prod": "ng build --configuration production --base-href /FMRTest/",
  "deploy": "npx angular-cli-ghpages --dir=dist/fmr-ngrx-test",
  "build-deploy": "npm run build:prod && npm run deploy"
}
```

The `angular-cli-ghpages` package handles the deployment process automatically  

***

## How It Works

When you run `npm run build-deploy`, here's what happens:

1. Angular CLI builds an optimized production bundle
2. The `angular-cli-ghpages` tool creates/updates the `gh-pages` branch
3. Build artifacts are copied to the branch root
4. A `.nojekyll` file is added (tells GitHub not to process with Jekyll)
5. A `404.html` is generated for client-side routing support
6. Changes are pushed to the remote `gh-pages` branch

The deployed files include:
- `index.html` - Application entry point
- JavaScript bundles (main, polyfills, runtime)
- CSS stylesheets (including Material Design styles)
- Lazy-loaded chunks for animations  

***

## Deployment Commands

**Quick deploy** (recommended):
```bash
npm run build-deploy
```

**Step-by-step**:
```bash
npm run build:prod    # Build only
npm run deploy        # Deploy existing build
```

**Manual deployment**:
```bash
ng build --configuration production --base-href /FMRTest/
npx angular-cli-ghpages --dir=dist/fmr-ngrx-test --no-silent
```

***

## Making Updates

To update the live site after code changes:

```bash
# Test locally first
npm start

# Then build and deploy
npm run build-deploy

# Give GitHub Pages 1-2 minutes to update
```

***

## GitHub Pages Configuration

To enable GitHub Pages for the first time:

1. Go to: https://github.com/ikrigel/FMRTest/settings/pages
2. Under "Source":
   - Select branch: `gh-pages`
   - Select folder: `/ (root)`
3. Click Save
4. Wait a few minutes for the site to become available

***

## Troubleshooting

**Site shows 404**
- Verify GitHub Pages is enabled in repository settings
- Check that the `gh-pages` branch exists and has content
- Confirm the base-href matches your repository name

**Blank page or errors**
- Open browser console (F12) to check for errors
- Verify the base-href is correct: `/FMRTest/`
- Try the deployed site in incognito mode

**Changes not showing up**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache completely
- Wait 2-3 minutes for GitHub's CDN to update
- Check deployment succeeded: `git log origin/gh-pages -1`

**Deployment fails**
- Ensure you have push access to the repository
- Check git credentials are configured
- Run with verbose output: `npm run deploy -- --no-silent`

***

## Build Performance

Current production build metrics:

| File | Raw Size | Transferred |
|------|----------|-------------|
| main.js | 284.46 KB | 74.47 KB |
| styles.css | 84.50 KB | 7.88 KB |
| polyfills.js | 34.00 KB | 11.10 KB |
| runtime.js | 2.64 KB | 1.24 KB |
| **Total** | **405.60 KB** | **94.69 KB** |

The application includes Angular Material components, which accounts for the larger bundle size compared to a vanilla CSS implementation.

***

## Deployed Features

The live application includes:
- NGRX state management with Entity Adapter
- Reactive components using RxJS
- Angular Material UI components (toolbar, cards, buttons)
- User selection and order display
- Local state persistence
- Redux DevTools support

***

## Quick Reference

```bash
# Development
npm start                      # Run locally on :4200
npm run build:prod             # Build for production

# Deployment
npm run deploy                 # Deploy existing build
npm run build-deploy           # Build and deploy in one step

# Git operations
git status                     # Check current changes
git log origin/gh-pages -1     # View last deployment
```