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
| `package.json` | Add `build:static` script to skip tests during deployment build |

---

## Architecture Notes
- **Static Export**: The application will be pre-rendered into HTML/CSS/JS files in the `out/` directory.
- **Image Optimization**: Next.js default image optimization api requires a server, so we must switch to unoptimized images (`images: { unoptimized: true }`).
- **Routing**: `trailingSlash: true` is used to ensure consistent routing behavior on static hosts.

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
- [ ] **Workflow Run**: The GitHub Action itself acts as a test. It runs `npm run test` and `npm run build:static` and will fail if either errors.

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
- [ ] **Manual Step**: Configure Repository Settings -> Pages (Source: GitHub Actions)
- [ ] **Manual Step**: Configure DNS Records (A Records & CNAME) as detailed below

### DNS Configuration Details
**A Records** (@):
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**CNAME Record** (www):
- Target: `thinkgibson.github.io`
