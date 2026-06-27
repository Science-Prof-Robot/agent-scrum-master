#!/usr/bin/env node

import { setup, openDashboard } from '../src/setup.js';

const args = process.argv.slice(2);
const command = args[0] || 'init';
const options = {
  projectRoot: process.cwd(),
  verbose: args.includes('--verbose') || args.includes('-v'),
  force: args.includes('--force') || args.includes('-f'),
  jiraUrl: args.find(a => a.startsWith('--jira-url='))?.split('=')[1],
  jiraProject: args.find(a => a.startsWith('--jira-project='))?.split('=')[1],
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
agent-scrum-master - Setup agent-tasks pipeline for your project

Usage:
  npx agent-scrum-master [command] [options]

Commands:
  init              Initialize agent-tasks (default)
  reset             Remove agent-tasks setup from project
  status            Check if agent-tasks is initialized
  dashboard         Open the task dashboard in browser

Options:
  --verbose, -v           Show detailed output
  --force, -f             Overwrite existing configuration
  --jira-url=<url>        Jira instance URL (optional)
  --jira-project=<key>    Jira project key (optional)
  --help, -h              Show this help

Examples:
  npx agent-scrum-master
  npx agent-scrum-master --verbose
  npx agent-scrum-master init --jira-url=https://jira.company.com --jira-project=GROWTH
  npx agent-scrum-master reset
  npx agent-scrum-master status
  npx agent-scrum-master dashboard
  `);
  process.exit(0);
}

try {
  if (command === 'init') {
    await setup(options);
  } else if (command === 'reset') {
    await setup({ ...options, reset: true });
  } else if (command === 'status') {
    await setup({ ...options, statusOnly: true });
  } else if (command === 'dashboard') {
    await openDashboard(options);
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Error:', error.message);
  if (options.verbose) {
    console.error(error);
  }
  process.exit(1);
}
