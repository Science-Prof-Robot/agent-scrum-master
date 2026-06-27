# agents-scrum-master

Auto-setup and management for agent-tasks pipeline.

## Commands

```bash
# Open dashboard in browser
agents-scrum-master dashboard

# Check project status
agents-scrum-master status

# Reinitialize configuration
agents-scrum-master init --force

# Remove agent-scrum-master setup
agents-scrum-master reset
``
## Usage

Use these CLI commands to manage your agent-tasks workflow:

### View Dashboard
```bash
npx agents-scrum-master dashboard
```
Opens the real-time kanban dashboard at http://localhost:3422

### Check Status
```bash
npx agents-scrum-master status
```
Shows initialization status of this project.

### Reinitialize
```bash
npx agents-scrum-master init --force
```
Rerun initialization (useful if configuration changed).

### Reset
```bash
npx agents-scrum-master reset
```
Remove all agent-scrum-master setup from this project.

## MCP Tools

This project has agent-tasks MCP server configured. Use these tools:

- `task_create` - Create new task
- `task_get` - Retrieve task details
- `task_list` - List tasks (with filtering)
- `task_update` - Update task metadata
- `task_stage` - Advance/regress task stages
- `task_artifact` - Add artifacts, decisions, learnings
- `task_config` - View pipeline configuration

## Workflow

1. Create tasks: `task_create(title: "...", description: "...", project: "...")`
2. View dashboard: `npx agents-scrum-master dashboard`
3. Advance stages: `task_stage(id: "task-123", stage: "implement")`
4. Add artifacts: `task_artifact(task_id: "task-123", type: "decision", content: "...")`

## Learn More

- [agent-tasks docs](https://github.com/keshrath/agent-tasks)
- [agents-scrum-master repo](https://github.com/Science-Prof-Robot/agent-scrum-master)
