# Contributing to agent-scrum-master

Thank you for your interest in contributing! This is an open-source project and we welcome all contributions.

## Setup

```bash
git clone https://github.com/ashishdogra/agent-scrum-master.git
cd agent-scrum-master
npm install
```

## Development

```bash
# Test locally in watch mode
node bin/cli.js --verbose

# Test in a real project
cd /path/to/test-project
node /path/to/agent-scrum-master/bin/cli.js --verbose
```

## Publishing to npm

1. Update version in `package.json`
2. Create a git tag: `git tag v1.0.0`
3. Push: `git push origin main && git push origin --tags`
4. Publish: `npm publish`

## Areas for Contribution

- Additional ticket system integrations (Linear, GitHub Projects, etc.)
- Enhanced error messages
- Test coverage
- Documentation improvements
- Feature suggestions (via issues)

## Code Style

- ESM modules only
- No external dependencies (keep it lightweight)
- Node.js 18+ compatibility

## Reporting Issues

Please open an issue with:
- Node version
- OS
- Steps to reproduce
- Expected vs actual behavior
