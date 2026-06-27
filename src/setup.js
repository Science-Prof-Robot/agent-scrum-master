import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setup(options = {}) {
  const {
    projectRoot = process.cwd(),
    verbose = false,
    force = false,
    reset = false,
    statusOnly = false,
    jiraUrl = null,
    jiraProject = null,
  } = options;

  const log = (msg) => verbose && console.log(msg);
  const claudeDir = path.join(projectRoot, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');
  const agentTasksDir = path.join(projectRoot, '.agent-tasks');
  const gitignorePath = path.join(projectRoot, '.gitignore');

  // Status check
  if (statusOnly) {
    const hasSettings = fs.existsSync(settingsPath);
    const hasDir = fs.existsSync(agentTasksDir);
    console.log(`\n📊 agent-scrum-master status in ${projectRoot}\n`);
    console.log(`  .claude/settings.json: ${hasSettings ? '✓' : '✗'}`);
    console.log(`  .agent-tasks/:        ${hasDir ? '✓' : '✗'}`);
    console.log(
      `\n  Status: ${hasSettings && hasDir ? '✅ Initialized' : '⚠️  Not initialized'}\n`
    );
    return;
  }

  // Reset
  if (reset) {
    log('Removing agent-scrum-master setup...');
    if (fs.existsSync(settingsPath)) {
      fs.unlinkSync(settingsPath);
      console.log('✓ Removed .claude/settings.json');
    }
    if (fs.existsSync(agentTasksDir)) {
      fs.rmSync(agentTasksDir, { recursive: true, force: true });
      console.log('✓ Removed .agent-tasks/');
    }
    console.log('✅ agent-scrum-master reset complete');
    return;
  }

  // Init
  console.log('\n🚀 Initializing agent-scrum-master...\n');

  // Ensure .claude directory exists
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    log('Created .claude/');
  }

  // Create settings.json
  if (!fs.existsSync(settingsPath) || force) {
    const settings = buildSettings(jiraUrl, jiraProject);
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    console.log('✓ Created .claude/settings.json');
    log(`  → MCP server: agent-tasks`);
    log(`  → Database: .agent-tasks/tasks.db`);
    if (jiraUrl) log(`  → Jira integration: ${jiraUrl}`);
  } else {
    console.log('✓ .claude/settings.json already exists');
    if (!force) {
      log('  (use --force to overwrite)');
    }
  }

  // Ensure .agent-tasks directory exists
  if (!fs.existsSync(agentTasksDir)) {
    fs.mkdirSync(agentTasksDir, { recursive: true });
    console.log('✓ Created .agent-tasks/');
  } else {
    log('✓ .agent-tasks/ already exists');
  }

  // Add to .gitignore
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('.agent-tasks/')) {
      fs.appendFileSync(gitignorePath, '\n.agent-tasks/\n');
      console.log('✓ Added .agent-tasks/ to .gitignore');
    } else {
      log('✓ .agent-tasks/ already in .gitignore');
    }
  } else {
    fs.writeFileSync(gitignorePath, '.agent-tasks/\n');
    console.log('✓ Created .gitignore and added .agent-tasks/');
  }

  // Create .claude/.gitignore
  const claudeGitignore = path.join(claudeDir, '.gitignore');
  if (!fs.existsSync(claudeGitignore)) {
    fs.writeFileSync(claudeGitignore, '');
    log('Created .claude/.gitignore');
  }

  // Create .claude/skills/ directory and skill file
  const skillsDir = path.join(claudeDir, 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
    log('Created .claude/skills/');
  }

  const skillPath = path.join(skillsDir, 'agents-scrum-master.md');
  if (!fs.existsSync(skillPath) || force) {
    const skillContent = `# agents-scrum-master

Auto-setup and management for agent-tasks pipeline.

## Commands

\`\`\`bash
# Open dashboard in browser
agents-scrum-master dashboard

# Check project status
agents-scrum-master status

# Reinitialize configuration
agents-scrum-master init --force

# Remove agent-scrum-master setup
agents-scrum-master reset
\`\`\

## Usage

Use these CLI commands to manage your agent-tasks workflow:

### View Dashboard
\`\`\`bash
npx agents-scrum-master dashboard
\`\`\`
Opens the real-time kanban dashboard at http://localhost:3422

### Check Status
\`\`\`bash
npx agents-scrum-master status
\`\`\`
Shows initialization status of this project.

### Reinitialize
\`\`\`bash
npx agents-scrum-master init --force
\`\`\`
Rerun initialization (useful if configuration changed).

### Reset
\`\`\`bash
npx agents-scrum-master reset
\`\`\`
Remove all agent-scrum-master setup from this project.

## MCP Tools

This project has agent-tasks MCP server configured. Use these tools:

- \`task_create\` - Create new task
- \`task_get\` - Retrieve task details
- \`task_list\` - List tasks (with filtering)
- \`task_update\` - Update task metadata
- \`task_stage\` - Advance/regress task stages
- \`task_artifact\` - Add artifacts, decisions, learnings
- \`task_config\` - View pipeline configuration

## Workflow

1. Create tasks: \`task_create(title: "...", description: "...", project: "...")\`
2. View dashboard: \`npx agents-scrum-master dashboard\`
3. Advance stages: \`task_stage(id: "task-123", stage: "implement")\`
4. Add artifacts: \`task_artifact(task_id: "task-123", type: "decision", content: "...")\`

## Learn More

- [agent-tasks docs](https://github.com/keshrath/agent-tasks)
- [agents-scrum-master repo](https://github.com/Science-Prof-Robot/agent-scrum-master)
`;
    fs.writeFileSync(skillPath, skillContent);
    console.log('✓ Created .claude/skills/agents-scrum-master.md');
  } else {
    log('✓ .claude/skills/agents-scrum-master.md already exists');
  }

  console.log(`
✅ agent-scrum-master initialized!

Next steps:
  1. Commit: git add .claude/ && git commit -m "chore: enable agent-scrum-master"
  2. Start: Open this project in Claude Code or Cursor
  3. Dashboard: npx agents-scrum-master dashboard
  4. Create tasks: Use MCP 'task_create' tool

Skill available to agents: /agents-scrum-master
Learn more: https://github.com/keshrath/agent-tasks
`);
}

export async function openDashboard(options = {}) {
  const { projectRoot = process.cwd(), verbose = false } = options;

  const log = (msg) => verbose && console.log(msg);
  const claudeDir = path.join(projectRoot, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.json');

  // Check if project is initialized
  if (!fs.existsSync(settingsPath)) {
    console.error('\n❌ Project not initialized');
    console.error('   Run: npx agent-scrum-master init\n');
    process.exit(1);
  }

  // Read settings to get port
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  const port = settings.environmentVariables?.AGENT_TASKS_PORT || 3422;
  const url = `http://localhost:${port}`;

  console.log(`\n🌐 Opening dashboard at ${url}...\n`);

  try {
    // Open URL in default browser (cross-platform)
    const platform = os.platform();
    const openCommand =
      platform === 'darwin'
        ? 'open'
        : platform === 'win32'
          ? 'start'
          : 'xdg-open';

    spawn(openCommand, [url], {
      stdio: 'ignore',
      detached: true,
    }).unref();

    log(`✓ Dashboard should open shortly`);
    console.log(`💡 Make sure agent-tasks is running. Open your project in Claude Code or Cursor.`);
  } catch (error) {
    console.error(`\n⚠️  Could not open browser automatically`);
    console.error(`   Please visit: ${url}\n`);
  }
}

function buildSettings(jiraUrl, jiraProject) {
  const env = {
    AGENT_TASKS_DB: '.agent-tasks/tasks.db',
    AGENT_TASKS_PORT: '3422',
  };

  if (jiraUrl) {
    env.AGENT_TASKS_JIRA_URL = jiraUrl;
  }
  if (jiraProject) {
    env.AGENT_TASKS_JIRA_PROJECT = jiraProject;
  }

  return {
    mcpServers: {
      'agent-tasks': {
        command: 'npx',
        args: ['agent-tasks'],
      },
    },
    environmentVariables: env,
  };
}
