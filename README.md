# agent-scrum-master

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/agent-scrum-master)](https://www.npmjs.com/package/agent-scrum-master)

**One command to auto-configure agent-tasks pipeline for any project.**

Bootstraps [agent-tasks](https://github.com/keshrath/agent-tasks) — a pipeline task manager for AI agents — with a single `npx` call. Sets up MCP integration, project structure, and gitignore automatically. Works with Claude Code, Cursor, Windsurf, and any MCP client.

---

## Features

- ✨ **One-command setup** — `npx agent-scrum-master`
- 📁 **Project-scoped** — isolated task database per project (not global)
- 🤖 **Agent-agnostic** — works with Claude Code, Cursor, Windsurf, any MCP client
- 🔗 **Ticket system ready** — optional Jira integration flags
- 🧹 **Automatic cleanup** — handles .gitignore and directory structure
- 📊 **Dashboard included** — real-time kanban at `localhost:3422`

---

## Quick Start

### Option 1: npx (one-liner, no install)

```bash
cd /path/to/your/project
npx agent-scrum-master
```

### Option 2: npm install (global)

```bash
npm install -g agent-scrum-master
cd /path/to/your/project
agent-scrum-master
```

---

## What It Does

Runs in your project root and:

1. ✓ Creates `.claude/settings.json` with MCP server config
2. ✓ Creates `.agent-tasks/` directory for local task database
3. ✓ Adds `.agent-tasks/` to `.gitignore`
4. ✓ Ready for Claude Code, Cursor, or any MCP client

**Result:** Open the project in your agent and the task pipeline is live.

---

## Commands

```bash
# Initialize (default)
npx agent-scrum-master

# With Jira integration
npx agent-scrum-master --jira-url=https://jira.company.com --jira-project=GROWTH

# Check status
npx agent-scrum-master status

# Remove setup
npx agent-scrum-master reset

# Verbose output
npx agent-scrum-master --verbose

# Overwrite existing config
npx agent-scrum-master --force
```

---

## Usage in Your Agent

Once initialized, open the project in Claude Code or Cursor:

### Create a task
```
Use the MCP tool: task_create(title: "Build login flow", description: "...", project: "MyProject")
```

### View dashboard
```
http://localhost:3422
```

### Advance stages
```
Use task_stage(id: "task-123", stage: "implement")
```

See [agent-tasks API docs](https://github.com/keshrath/agent-tasks/blob/main/docs/API.md) for full tool reference.

---

## Project Structure

After running `agent-scrum-master`:

```
your-project/
├── .claude/
│   └── settings.json          # MCP config (auto-created)
├── .agent-tasks/              # Task database (git-ignored)
│   └── tasks.db
├── .gitignore                 # Updated with .agent-tasks/
└── ... (your code)
```

`.claude/settings.json` is **committed to git** — other team members inherit the setup automatically.

---

## Jira Integration (Optional)

Add Jira sync to your project:

```bash
npx agent-scrum-master \
  --jira-url=https://jira.company.com \
  --jira-project=GROWTH
```

This sets environment variables in `.claude/settings.json`. Agent-tasks can then sync task completions to Jira.

---

## Multi-Project Setup

Each project gets its own isolated database:

```
project-a/
└── .agent-tasks/tasks.db       # Isolated to project-a

project-b/
└── .agent-tasks/tasks.db       # Isolated to project-b
```

No cross-project bleed — dashboards run on the same port but serve different DBs by project.

---

## Requirements

- Node.js >= 18
- Agent supporting MCP (Claude Code, Cursor, Windsurf, etc.)

---

## Troubleshooting

### Dashboard doesn't start

```bash
# Check if agent-tasks is installed
npx agent-tasks --help

# Manually start dashboard
cd your-project
npx agent-tasks
```

### Reset and reinitialize

```bash
npx agent-scrum-master reset
npx agent-scrum-master --force
```

### Check status

```bash
npx agent-scrum-master status
```

---

## Development

```bash
# Clone
git clone https://github.com/ashishdogra/agent-scrum-master.git
cd agent-scrum-master

# Test locally
node bin/cli.js --verbose

# Publish to npm
npm publish
```

---

## License

MIT — see [LICENSE](LICENSE)

---

## See Also

- [agent-tasks](https://github.com/keshrath/agent-tasks) — The pipeline engine this bootstraps
- [agent-comm](https://github.com/keshrath/agent-comm) — Agent heartbeat & messaging
- [agent-knowledge](https://github.com/keshrath/agent-knowledge) — Knowledge persistence
