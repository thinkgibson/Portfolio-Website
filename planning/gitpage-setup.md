# GitHub Pages Setup

## Overview
Set up automated deployment of the Next.js portfolio website to GitHub Pages using the custom domain `thinkgibson.com`. This involves configuring Next.js for static export, creating a GitHub Actions workflow, and setting up the necessary DNS records.

### Features
- Next.js configured for static HTML export (`output: 'export'`)
- Custom domain configuration (`thinkgibson.com`) via CNAME
- Automated deployment workflow on push to `main`
- Jekyll bypass for `_next` directory support

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions workflow to build and deploy the site |
| `public/CNAME` | Verifies custom domain ownership for GitHub Pages |
| `public/.nojekyll` | Prevents GitHub Page's Jekyll processing to allow `_next` assets |

### Modified Files
| File | Changes |
|------|---------|
| `next.config.js` | Enable static export, disable image optimization, ensure trailing slashes |
| `package.json` | Add `build:static` script: `"build:static": "next build"` |

---

## Architecture Notes
- **Static Export**: The application will be pre-rendered into HTML/CSS/JS files in the `out/` directory.
- **Image Optimization**: Next.js default image optimization api requires a server, so we must switch to unoptimized images (`images: { unoptimized: true }`).
- **Routing**: `trailingSlash: true` is used to ensure consistent routing behavior on static hosts.
- **Dual Domain Support**: Both `thinkgibson.com` and `www.thinkgibson.com` will work. GitHub Pages handles the redirect automatically based on your DNS configuration.

---

## Deploy Workflow (`deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:static
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> [!NOTE]
> This workflow is separate from `ci-flow`. It only builds and deploys—no tests are run.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b feature/gitpage-setup`
2. **Commit Format**: `git commit -m "feat: setup github pages deployment"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **DNS Propagation Delay** | Changes to DNS records can take up to 48 hours. Users may see old site or errors temporarily. |
| **Dynamic Routes** | Any `getServerSideProps` or dynamic API routes will fail at build time. Site must be fully static. |
| **Client-Side Navigation** | Ensure `trailingSlash` matches deployment config to prevent hydration mismatches. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Manual Verification
- [ ] Run `npm run build:static` locally and ensure `out/` directory is generated without errors.
- [ ] Verify `out/CNAME` contains "thinkgibson.com".
- [ ] Verify `out/.nojekyll` exists.
- [ ] Navigate to `https://thinkgibson.com` after deployment to confirm availability.

### Automated Tests
- [ ] **Workflow Run**: The GitHub Action will fail if `npm run build:static` errors.

### Test Commands
```bash
npm run build:static
```

---

## Implementation Checklist
- [ ] Modify `next.config.js` for static export
- [ ] Update `package.json` with `build:static` script
- [ ] Create `public/CNAME` with content "thinkgibson.com"
- [ ] Create empty `public/.nojekyll`
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Verify local static build
- [ ] Push changes to create PR
- [ ] **Manual Step**: Configure Repository Settings → Pages (Source: GitHub Actions)
- [ ] **Manual Step**: Enable "Enforce HTTPS" in Repository Settings → Pages
- [ ] **Manual Step**: Configure DNS Records (A Records & CNAME) as detailed below

### DNS Configuration (Squarespace)

> [!IMPORTANT]
> DNS changes can take up to 48-72 hours to propagate. Your site may be temporarily unavailable during this period.

#### Step-by-Step Instructions

1. **Log in to Squarespace**
   - Go to [account.squarespace.com](https://account.squarespace.com)
   - Navigate to **Domains** in the left sidebar

2. **Select Your Domain**
   - Click on `thinkgibson.com`
   - Click **DNS Settings** or **Edit DNS**

3. **Add A Records** (for apex domain `thinkgibson.com`)
   - Click **Add Record** → Select **A Record**
   - For each IP below, create a separate A record:

   | Host | Type | Data |
   |------|------|------|
   | `@` | A | `185.199.108.153` |
   | `@` | A | `185.199.109.153` |
   | `@` | A | `185.199.110.153` |
   | `@` | A | `185.199.111.153` |

4. **Add CNAME Record** (for `www.thinkgibson.com`)
   - Click **Add Record** → Select **CNAME Record**

   | Host | Type | Data |
   |------|------|------|
   | `www` | CNAME | `thinkgibson.github.io` |

5. **Remove Conflicting Records** (if any)
   - Delete any existing A records pointing to Squarespace servers
   - Delete any existing CNAME records for `@` or `www` that conflict

6. **Save Changes**
   - Click **Save** to apply all DNS changes

#### Verification

- **Check propagation**: Use [whatsmydns.net](https://whatsmydns.net) to verify DNS propagation
- **Terminal check**: Run `dig thinkgibson.com +short` to see if GitHub IPs are returned
- **GitHub check**: In repo Settings → Pages, the DNS check should show a green checkmark
