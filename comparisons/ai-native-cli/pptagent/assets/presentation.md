# AI-Native CLI: Give AI Its Own Manual

Products now serve two users: **people** and the **agents** acting for them.

---

# One command starts three lookups away
## The long path to a single command

![Azure CLI help levels 1-3 showing deep navigation tree, 545:158](/mnt/c/Users/zelinwang/.copilot/session-state/0ef7738a-a63f-4a05-a6b4-0f3e3fc3e182/files/pptagent-workspaces/92f03a82/assets/help-levels-1-3.png "Azure CLI help levels 1-3")

**Real Azure CLI help requires inspecting the top level, network, then application-gateway.**

---

# And it is still three more lookups down
## Six round trips to discover one valid path

![Azure CLI help levels 4-6 showing WAF policy details, 545:158](/mnt/c/Users/zelinwang/.copilot/session-state/0ef7738a-a63f-4a05-a6b4-0f3e3fc3e182/files/pptagent-workspaces/92f03a82/assets/help-levels-4-6.png "Azure CLI help levels 4-6")

**WAF policy, managed rule, and exclusion must still be inspected before the add command appears.**

---

# People optimize for accuracy. AI optimizes for relevance.
## Different needs, different journeys

- **Person:** I know the command. Give me the exact page.
- **AI:** Give me enough related context to plan and recover from a wrong guess.

---

# The model reaches for familiar syntax
## When classic flags meet a new contract

![CLI syntax recovery showing failed flag attempts, 135:43](/mnt/c/Users/zelinwang/.copilot/session-state/0ef7738a-a63f-4a05-a6b4-0f3e3fc3e182/files/pptagent-workspaces/92f03a82/assets/syntax-recovery.png "CLI syntax recovery")

**Familiar classic CLI flags fail against a different command contract, forcing the agent to inspect the real contract and rebuild the plan.**

---

# Collapse the tree into two machine-friendly moves
## Streamlining discovery for agents

1. **List:** return a compact catalogue of every capability.
2. **Inspect:** return complete details for fuzzy, related matches.

---

# Expose what the product already knows
## Four tools for every AI path

- **Environment:** identity, version, runtime state.
- **Resources:** what already exists for this user.
- **Capabilities:** supported commands and parameters.
- **Availability:** live constraints the model cannot know.

---

# Build the tools once. Serve every AI path.
## Unified tooling reduces maintenance

Flow: Product tools branch to **Built-in agent** and **CLI + skill**.

**Same logic, same output, lower maintenance.**

---

# Live demo
## A model with no product knowledge can still succeed

Prompt: create a resource group using the prototype CLI.

Sequence: **cache** → **help** → **correct command**.

---

# Every product needs two front doors
## Dual interfaces for humans and agents

- **For people:** GUI, docs, human-readable help.
- **For AI:** structured tools, stable schemas, actionable errors.

---

# Ship the AI manual with the product
## A reliable interface for every agent

**Not another agent. A reliable interface for every agent.**