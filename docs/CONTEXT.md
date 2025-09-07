# 📚 Documentation Context - `/docs/`

## Documentation Structure Overview

```
docs/
├── project-management/    # Sprint planning and backlog management
├── technical/            # Technical documentation and guides
└── analysis/            # Research and analysis documents
```

## 🎯 Documentation Philosophy

### Purpose & Audience
- **Primary**: AI assistants and developers working on the project
- **Secondary**: Project stakeholders and future team members
- **Focus**: Practical, actionable information over comprehensive documentation

### Documentation Types
1. **Project Management** - Sprint planning, backlogs, completed work
2. **Technical Guides** - Implementation details, integration plans
3. **Analysis Documents** - Research findings, data analysis
4. **Context Files** - AI-specific guidance at each hierarchy level

## 📋 Project Management Documentation

### Location: `/docs/project-management/`

#### BACKLOG.md Standards
```markdown
# 🎯 Product Backlog

## Epic: Feature Area Name
### 🐛 Critical Fixes / 🎨 UI/UX Enhancements / 🧹 Cleanup
- [ ] **Task Title**
  - Priority: High/Medium/Low
  - Description: Clear problem statement
  - Location: File paths and line numbers
  - Estimate: Time estimate in hours
```

#### SPRINT.md Standards
```markdown
# 📋 Current Sprint - Week of [Date]

## Sprint Goal
Clear, measurable objective for the sprint

## Sprint Backlog
### 🚧 In Progress
### ⏳ To Do (This Sprint)  
### 🔍 Ready for Review
### ✅ Done (This Sprint)
```

#### DONE.md Standards
```markdown
# ✅ Completed Items Archive

## Sprint - Week of [Date]
### Category Name
- [x] **Task Title** (Date completed)
  - Brief description of what was accomplished
  - Any notable outcomes or follow-ups
```

## 🔧 Technical Documentation

### Location: `/docs/technical/`

#### File Organization
- **`test-plans/`** - Testing strategies and results
- **`integration/`** - System integration documentation
- **`guides/`** - Step-by-step implementation guides

#### Documentation Standards
- **Clear headings** with consistent hierarchy
- **Code examples** with proper syntax highlighting
- **File paths** and line numbers for references
- **Before/after** comparisons for changes
- **Prerequisites** clearly stated

#### Example Technical Doc Structure
```markdown
# Feature Implementation Guide

## Overview
Brief description of the feature/change

## Prerequisites
- Required dependencies
- Environment setup
- Access requirements

## Implementation Steps
1. Step-by-step instructions
2. Code examples with explanations
3. Testing procedures
4. Deployment considerations

## Troubleshooting
Common issues and solutions

## References
Links to related documentation
```

## 📊 Analysis Documentation

### Location: `/docs/analysis/`

#### Content Types
- **Data analysis** - Research findings and insights
- **Style guides** - Design system documentation
- **Performance analysis** - Optimization research
- **Feature analysis** - Requirements and specifications

#### Analysis Document Standards
- **Executive summary** at the top
- **Data sources** clearly cited
- **Methodology** explained
- **Actionable conclusions** highlighted
- **Recommendations** with priority levels

## 🤖 AI Context Integration

### Context File Hierarchy
```
/CONTEXT.md              # Project overview
/src/CONTEXT.md          # Development standards
/docs/CONTEXT.md         # Documentation standards
/src/app/CONTEXT.md      # App-specific guidance
/src/app/api/CONTEXT.md  # API development patterns
```

### Context File Standards
- **Hierarchy-specific** - Each level addresses its scope
- **Actionable guidance** - Tell AI what to do, not just what exists
- **Pattern examples** - Show don't just tell
- **Common tasks** - Address frequent development scenarios
- **Standards enforcement** - Reinforce project conventions

## 📝 Writing Guidelines

### Tone & Style
- **Clear and concise** - Get to the point quickly
- **Action-oriented** - Use active voice and imperative mood
- **Consistent formatting** - Follow established patterns
- **Professional but approachable** - Avoid jargon without explanation

### Markdown Standards
```markdown
# H1 for document title only
## H2 for major sections
### H3 for subsections
#### H4 for detailed breakdowns

**Bold** for emphasis and important terms
*Italic* for file names and variables
`Code` for inline code and commands
```

### Code Documentation
- **Syntax highlighting** for all code blocks
- **Comments in examples** to explain complex logic
- **Complete examples** that can be copy-pasted
- **Error handling** included in examples

## 🔄 Maintenance Processes

### Regular Updates
- **Sprint completion** - Move items from SPRINT.md to DONE.md
- **Backlog grooming** - Review and prioritize BACKLOG.md weekly
- **Technical docs** - Update after major implementations
- **Context files** - Revise when patterns change

### Quality Checks
- **Link validation** - Ensure internal references work
- **Code example testing** - Verify examples still work
- **Consistency review** - Check formatting and style
- **Relevance audit** - Remove outdated information

### Archive Management
- **DONE.md** - Archive old sprint data to separate files quarterly
- **Technical docs** - Move outdated guides to archive folder
- **Analysis docs** - Mark with date ranges for relevance

## 🎯 Best Practices for AI Collaboration

### When Creating Documentation
1. **Consider the AI perspective** - What would an AI need to know?
2. **Include context** - Don't assume prior knowledge
3. **Provide examples** - Show patterns and conventions
4. **Be specific** - Include file paths, line numbers, exact commands
5. **Update context files** - When patterns change, update guidance

### When Reading Documentation
1. **Start with context files** - Understand the bigger picture first
2. **Check recency** - Look for dates and version information
3. **Follow the hierarchy** - Root → src → specific area
4. **Cross-reference** - Use multiple docs to understand complex topics
5. **Look for patterns** - Identify consistent approaches across docs

### Common Documentation Tasks
- **New feature docs** - Create in appropriate technical subfolder
- **Process updates** - Update project-management files
- **Architecture changes** - Update context files at relevant levels
- **Integration guides** - Place in technical/integration/
- **Analysis results** - Document in analysis/ with clear conclusions

---
*This context file establishes documentation standards and processes for effective project knowledge management and AI collaboration.*