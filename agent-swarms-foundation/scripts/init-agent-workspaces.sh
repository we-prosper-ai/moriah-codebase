#!/bin/bash

# Initialize Agent Workspaces
# Creates directory structure and template files for all agents
# Run AFTER 002_seed_agents_and_prompts.sql

set -e

echo "🏔️ Initializing Agent Swarms Workspaces..."

WORKSPACE_BASE="/home/moriahkeeper/.openclaw/workspace/agent-swarms-foundation/agent-workspaces"

# Create CONTENT TEAM workspaces
echo "📝 Creating Content Team workspaces..."

AGENTS=(
  "content/video_production:Video Production Agent"
  "content/graphics_design:Graphics Design Agent"
  "content/copywriting:Copywriting Agent"
  "content/course_structure:Course Structure Agent"
)

for agent_path in "${AGENTS[@]}"; do
  IFS=':' read -r path name <<< "$agent_path"
  AGENT_DIR="$WORKSPACE_BASE/$path"
  
  echo "  Creating: $AGENT_DIR"
  
  # Create directories
  mkdir -p "$AGENT_DIR/past_work"
  mkdir -p "$AGENT_DIR/templates"
  mkdir -p "$AGENT_DIR/outputs"
  mkdir -p "$AGENT_DIR/examples"
  
  # Create memory.md template
  cat > "$AGENT_DIR/memory.md" << 'EOF'
# Agent Memory — {{ AGENT_NAME }}

This file stores what this agent has learned over time.

## About This Agent

**Role:** {{ ROLE }}
**Team:** {{ TEAM }}
**Created:** {{ DATE }}

## What I Know

### Tina's Preferences
- (Will be filled as feedback comes in)

### Lessons Learned
- (Will be filled as I complete jobs)

### Patterns That Work
- (Will be filled as I discover them)

### Quality Standards
- (Will evolve based on feedback)

## Past Jobs
- (Links to completed work)

## Examples of Excellent Work
- (Tina's feedback on what she loves)

## Current Blockers
- (What's preventing forward progress)

## Tools Available
- (What this agent can use)

---

Updated: {{ LAST_UPDATE }}
EOF

  # Create system_prompt.txt (copy from database system prompt)
  cat > "$AGENT_DIR/system_prompt.txt" << 'EOF'
[System prompt will be populated from database]
EOF

  echo "  ✅ Created: $AGENT_DIR"
done

# Create TECHNICAL TEAM placeholder
echo "🔧 Creating Technical Team workspace placeholders..."
TECH_AGENTS=(
  "technical/fullstack"
  "technical/mobile"
  "technical/devops"
  "technical/integration"
)

for agent_dir in "${TECH_AGENTS[@]}"; do
  AGENT_DIR="$WORKSPACE_BASE/$agent_dir"
  mkdir -p "$AGENT_DIR/past_work"
  mkdir -p "$AGENT_DIR/templates"
  mkdir -p "$AGENT_DIR/outputs"
  echo "  ✅ Placeholder: $AGENT_DIR"
done

# Create SALES TEAM placeholder
echo "💰 Creating Sales Team workspace placeholders..."
SALES_AGENTS=(
  "sales/copywriting"
  "sales/marketing"
  "sales/customer_success"
  "sales/revenue"
)

for agent_dir in "${SALES_AGENTS[@]}"; do
  AGENT_DIR="$WORKSPACE_BASE/$agent_dir"
  mkdir -p "$AGENT_DIR/past_work"
  mkdir -p "$AGENT_DIR/templates"
  mkdir -p "$AGENT_DIR/outputs"
  echo "  ✅ Placeholder: $AGENT_DIR"
done

# Create shared resources
echo "📚 Creating shared resources..."
SHARED_DIR="$WORKSPACE_BASE/shared"
mkdir -p "$SHARED_DIR/brand_guidelines"
mkdir -p "$SHARED_DIR/competitive_analysis"
mkdir -p "$SHARED_DIR/tina_examples"
mkdir -p "$SHARED_DIR/templates"

echo "  ✅ Created shared resources"

# Summary
echo ""
echo "✅ Agent Swarms Workspaces Initialized"
echo ""
echo "Workspace structure:"
tree -L 2 "$WORKSPACE_BASE" 2>/dev/null || find "$WORKSPACE_BASE" -maxdepth 2 -type d | sort

echo ""
echo "Next steps:"
echo "1. Populate agent memory files with initial data"
echo "2. Copy system prompts from database to text files"
echo "3. Add Tina's example work to agent/examples/"
echo "4. Run the database seed script: npm run db:seed"
echo "5. Start the API server: npm run dev"
echo "6. Test with sample job"
echo ""
