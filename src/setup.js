import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

  console.log(`
✅ agent-scrum-master initialized!

Next steps:
  1. Commit: git add .claude/settings.json && git commit -m "chore: enable agent-scrum-master"
  2. Start: Open this project in Claude Code or Cursor
  3. Dashboard: http://localhost:3422 (auto-starts on first connection)
  4. Create tasks: Use 'task_create' MCP tool in your agent

Learn more: https://github.com/keshrath/agent-tasks
`);
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
