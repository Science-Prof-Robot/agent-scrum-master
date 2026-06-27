# Deployment Guide: agent-scrum-master

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create public repo: `agent-scrum-master`
3. Initialize with no README (we have one)

## Step 2: Push to GitHub

```bash
cd /path/to/agent-scrum-master
git init
git add .
git commit -m "chore: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/agent-scrum-master.git
git branch -M main
git push -u origin main
```

## Step 3: Setup npm (one-time only)

1. Create npm account: https://www.npmjs.com/signup
2. Verify email
3. Login locally:
   ```bash
   npm login
   ```
   - Username: your npm username
   - Password: your npm password
   - Email: your email

## Step 4: Publish to npm

```bash
# Ensure package.json has correct name (agent-scrum-master)
# Ensure version bumped: 1.0.0
npm publish

# Verify it's published
npm view agent-scrum-master
```

## Step 5: Test Installation

In a fresh project:

```bash
cd /tmp/test-project
mkdir -p /tmp/test-project
cd /tmp/test-project
git init
npx agent-scrum-master
```

Should see:
```
✅ agent-scrum-master initialized!
```

## Step 6: Add GitHub Release

```bash
git tag v1.0.0
git push origin v1.0.0

# Then create release on GitHub:
# https://github.com/YOUR_USERNAME/agent-scrum-master/releases/new
```

## Future Updates

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Commit and tag:
   ```bash
   git add package.json
   git commit -m "chore: bump to 1.0.1"
   git tag v1.0.1
   git push origin main && git push origin v1.0.1
   ```

3. Publish:
   ```bash
   npm publish
   ```

## Troubleshooting

### Package name taken
- Choose alternative: `agent-tasks-setup`, `agent-workspace-init`, etc.
- Update in `package.json` and `.npmrc`

### npm login issues
- Clear cache: `npm cache clean --force`
- Re-login: `npm logout && npm login`

### Publish failed
- Check version is higher than previous: `npm view agent-scrum-master versions`
- Ensure `.npmrc` is configured or logged in

## Verification Commands

```bash
# Check if published
npm search agent-scrum-master

# Install globally
npm install -g agent-scrum-master
agent-scrum-master --help

# Install from npx
npx agent-scrum-master --help
```

---

That's it! Your npm package is live and ready for anyone to use.
