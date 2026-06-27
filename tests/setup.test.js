import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setup } from '../src/setup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, '../tmp-test-project');

// Cleanup helper
function cleanupTest() {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

// Ensure test directory exists
function setupTest() {
  cleanupTest();
  fs.mkdirSync(testDir, { recursive: true });
}

test('creates .claude directory', async () => {
  setupTest();
  await setup({ projectRoot: testDir });
  const claudeDir = path.join(testDir, '.claude');
  assert.ok(fs.existsSync(claudeDir), '.claude directory should exist');
  cleanupTest();
});

test('creates .claude/settings.json with MCP config', async () => {
  setupTest();
  await setup({ projectRoot: testDir });
  const settingsPath = path.join(testDir, '.claude', 'settings.json');
  assert.ok(fs.existsSync(settingsPath), 'settings.json should exist');

  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  assert.ok(settings.mcpServers, 'mcpServers should exist');
  assert.ok(settings.mcpServers['agent-tasks'], 'agent-tasks MCP server should be configured');
  assert.equal(settings.environmentVariables.AGENT_TASKS_DB, '.agent-tasks/tasks.db');
  cleanupTest();
});

test('creates .agent-tasks directory', async () => {
  setupTest();
  await setup({ projectRoot: testDir });
  const agentTasksDir = path.join(testDir, '.agent-tasks');
  assert.ok(fs.existsSync(agentTasksDir), '.agent-tasks directory should exist');
  cleanupTest();
});

test('adds .agent-tasks to .gitignore', async () => {
  setupTest();
  await setup({ projectRoot: testDir });
  const gitignorePath = path.join(testDir, '.gitignore');
  assert.ok(fs.existsSync(gitignorePath), '.gitignore should exist');
  const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
  assert.ok(gitignore.includes('.agent-tasks/'), '.agent-tasks should be in .gitignore');
  cleanupTest();
});

test('respects --force flag to overwrite settings', async () => {
  setupTest();
  const settingsPath = path.join(testDir, '.claude', 'settings.json');

  // First setup
  await setup({ projectRoot: testDir });
  const firstSettings = fs.readFileSync(settingsPath, 'utf-8');

  // Second setup without force (should not overwrite)
  await setup({ projectRoot: testDir, force: false });
  const secondSettings = fs.readFileSync(settingsPath, 'utf-8');
  assert.equal(firstSettings, secondSettings, 'settings should not change without --force');

  // Third setup with force (should update)
  await setup({ projectRoot: testDir, force: true, jiraUrl: 'https://jira.example.com' });
  const thirdSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  assert.ok(
    thirdSettings.environmentVariables.AGENT_TASKS_JIRA_URL,
    'Jira URL should be added with --force'
  );
  cleanupTest();
});

test('includes Jira config when flags provided', async () => {
  setupTest();
  await setup({
    projectRoot: testDir,
    jiraUrl: 'https://jira.company.com',
    jiraProject: 'GROWTH',
  });
  const settingsPath = path.join(testDir, '.claude', 'settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  assert.equal(settings.environmentVariables.AGENT_TASKS_JIRA_URL, 'https://jira.company.com');
  assert.equal(settings.environmentVariables.AGENT_TASKS_JIRA_PROJECT, 'GROWTH');
  cleanupTest();
});
