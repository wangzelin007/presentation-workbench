---
theme: seriph
title: 'AI-Native CLI: Give AI Its Own Manual'
info: |
  Why products need an interface designed for AI, not only help designed for humans.
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
fonts:
  sans: 'Inter'
  serif: 'Inter'
  mono: 'JetBrains Mono'
layout: cover
background: '#0f172a'
---

<div class="uppercase tracking-widest text-sm opacity-70 mb-6">Early design sharing</div>

# AI-Native CLI

<div class="text-2xl mt-6 mb-4 opacity-90">Give AI its own manual.</div>

<div class="text-lg opacity-70 max-w-2xl mx-auto">
Products now serve two users: people and the agents acting for them.
</div>

<!--
Hi everyone. I want to share one simple idea today.

The products we build now serve two users: the person at the keyboard, and the AI acting on that person's behalf.

We already write a manual for the first user. I think we should write one for the second.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">Real Azure CLI help · Levels 1–3</div>

## One command starts three lookups away.

<div class="flex justify-center mt-4">
  <img src="/help-levels-1-3.png" alt="Azure CLI help output progressing from the top-level command list through network to application-gateway." class="max-h-96 rounded shadow" />
</div>

<div class="text-center text-sm opacity-60 mt-3">
Actual <code>az --help</code> output, captured level by level.
</div>

<!--
This is real Azure CLI help. To find one application gateway command, the model must first inspect the top level, then network, then application gateway.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">Real Azure CLI help · Levels 4–6</div>

## And it is still three more lookups down.

<div class="flex justify-center mt-4">
  <img src="/help-levels-4-6.png" alt="Azure CLI help output progressing through waf-policy, managed-rule, and exclusion to finally reveal the add command." class="max-h-96 rounded shadow" />
</div>

<div class="text-center text-sm opacity-60 mt-3">
Six round trips to discover one valid command path.
</div>

<!--
From there it still has to inspect WAF policy, managed rule, and exclusion before the add command finally appears.

That is six round trips to discover one path. A small typo can stop the search before it gets there.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">The interface mismatch</div>

## People optimize for accuracy. AI optimizes for relevance.

<div class="grid grid-cols-2 gap-8 mt-10">
  <div class="p-6 rounded-lg border border-gray-500/30">
    <div class="text-4xl font-bold opacity-40 mb-3">01</div>
    <h3 class="text-xl font-semibold mb-2">A person navigates</h3>
    <p class="opacity-80">"I know the command. Give me the exact page."</p>
  </div>
  <div class="p-6 rounded-lg border border-teal-400/60 bg-teal-500/5">
    <div class="text-4xl font-bold text-teal-400 mb-3">02</div>
    <h3 class="text-xl font-semibold mb-2">An AI retrieves</h3>
    <p class="opacity-80">"Give me everything related enough to plan the next step."</p>
  </div>
</div>

<!--
A person usually knows where they want to go. They want the exact page.

An AI is planning its next step. It needs the nearby context too, so it can compare options and recover from a wrong guess.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">The cost of guessing</div>

## The model reaches for familiar syntax—and the product must recover.

<div class="flex justify-center mt-4">
  <img src="/syntax-recovery.png" alt="Terminal output showing a VM create command fail because classic Azure CLI parameters were used, followed by the agent identifying the correct contract." class="max-h-96 rounded shadow" />
</div>

<div class="text-center text-sm opacity-60 mt-3">
Real recovery: classic CLI flags fail against a different command contract.
</div>

<!--
Here is the failure mode in practice. The model used familiar Azure CLI flags against a different command contract, and the command failed immediately.

The agent then had to inspect the real contract, explain every mismatch, and rebuild the plan. Useful recovery, but avoidable work.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">A smaller contract</div>

## Collapse the tree into two machine-friendly moves.

<div class="mt-10 space-y-6 max-w-3xl">
  <div class="flex gap-6 items-start">
    <div class="text-5xl font-bold text-teal-400 leading-none">1</div>
    <div>
      <div class="text-xl font-semibold mb-1">List</div>
      <div class="opacity-80">Return a compact catalogue of every capability.</div>
    </div>
  </div>
  <div class="flex gap-6 items-start">
    <div class="text-5xl font-bold text-teal-400 leading-none">2</div>
    <div>
      <div class="text-xl font-semibold mb-1">Inspect</div>
      <div class="opacity-80">Return complete details for fuzzy, related matches.</div>
    </div>
  </div>
</div>

<!--
The first move is list: give the model a compact catalogue of every capability.

The second move is inspect: return complete details for fuzzy, related matches.

That gives the model enough context with far fewer round trips.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">The AI manual</div>

## Expose what the product already knows.

<div class="grid grid-cols-2 gap-6 mt-8">
  <div class="p-5 rounded-lg border border-gray-500/30">
    <div class="text-2xl font-bold opacity-40 mb-2">01</div>
    <h3 class="text-lg font-semibold mb-1">Environment</h3>
    <p class="opacity-80 text-sm">Identity, version, and runtime state</p>
  </div>
  <div class="p-5 rounded-lg border border-gray-500/30">
    <div class="text-2xl font-bold opacity-40 mb-2">02</div>
    <h3 class="text-lg font-semibold mb-1">Resources</h3>
    <p class="opacity-80 text-sm">What already exists for this user</p>
  </div>
  <div class="p-5 rounded-lg border border-gray-500/30">
    <div class="text-2xl font-bold opacity-40 mb-2">03</div>
    <h3 class="text-lg font-semibold mb-1">Capabilities</h3>
    <p class="opacity-80 text-sm">Supported commands and parameters</p>
  </div>
  <div class="p-5 rounded-lg border border-gray-500/30">
    <div class="text-2xl font-bold opacity-40 mb-2">04</div>
    <h3 class="text-lg font-semibold mb-1">Availability</h3>
    <p class="opacity-80 text-sm">Live constraints the model cannot know</p>
  </div>
</div>

<!--
The AI manual does not need to be a new documentation project.

Most products already know the environment, existing resources, supported capabilities, and live availability constraints.

The opportunity is to expose that knowledge through stable, structured tools.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">One source of truth</div>

## Build the tools once. Serve every AI path.

<div class="mt-10 flex flex-col items-center gap-6">
  <div class="px-6 py-3 rounded border border-teal-400/60 bg-teal-500/5 text-lg font-semibold">
    Product tools
  </div>
  <div class="w-px h-8 bg-gray-400/40"></div>
  <div class="grid grid-cols-2 gap-6 w-full max-w-3xl">
    <div class="p-5 rounded-lg border border-gray-500/30 text-center">
      <div class="text-xs uppercase tracking-widest opacity-60 mb-2">Direct</div>
      <div class="text-lg font-semibold">Built-in agent</div>
    </div>
    <div class="p-5 rounded-lg border border-gray-500/30 text-center">
      <div class="text-xs uppercase tracking-widest opacity-60 mb-2">Open</div>
      <div class="text-lg font-semibold">CLI + skill</div>
    </div>
  </div>
</div>

<div class="text-center mt-8 opacity-80 italic">
Same logic. Same output. Far less maintenance.
</div>

<!--
A built-in agent can call the tools directly. An external agent can reach the same tools through a CLI and a skill.

Both paths use the same logic and the same output contract. That keeps maintenance low.
-->

---
layout: center
class: text-center
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-4">Live demo</div>

## A model with no product knowledge can still succeed.

<div class="mt-10 max-w-2xl mx-auto">
  <div class="p-6 rounded-lg bg-gray-800/60 font-mono text-left border border-gray-500/30">
    <span class="text-teal-400">PS&gt;</span> create a resource group using the prototype CLI
    <div class="text-xs opacity-60 mt-3">cache → help → correct command</div>
  </div>
</div>

<!--
I have given the coding agent a small skill that points it to these product tools.

Watch the sequence. It checks what exists, reads the real command contract, and then builds the command from current facts instead of training data.
-->

---
layout: default
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-2">The product pattern</div>

## Every product needs two front doors.

<div class="mt-10 flex items-center justify-center gap-6">
  <div class="p-6 rounded-lg border border-gray-500/30 flex-1 max-w-sm text-center">
    <div class="text-xs uppercase tracking-widest opacity-60 mb-2">For people</div>
    <div class="text-lg font-semibold">GUI · docs · human help</div>
  </div>
  <div class="text-4xl opacity-60">+</div>
  <div class="p-6 rounded-lg border border-teal-400/60 bg-teal-500/5 flex-1 max-w-sm text-center">
    <div class="text-xs uppercase tracking-widest opacity-60 mb-2">For AI</div>
    <div class="text-lg font-semibold">Structured tools · stable contracts</div>
  </div>
</div>

<!--
Keep the interface for people: the graphical experience, documentation, and human-readable help.

Add an interface for AI: structured tools, stable schemas, and errors a model can act on.
-->

---
layout: center
class: text-center
---

<div class="uppercase tracking-widest text-xs opacity-60 mb-4">The ask</div>

## Ship the AI manual with the product.

<div class="mt-8 text-xl opacity-80 max-w-2xl mx-auto">
Not another agent. A reliable interface for every agent.
</div>

<!--
This is not a proposal to build another agent.

It is a proposal to give every agent a reliable way to understand and operate the product.

My ask is simple: when we ship a product interface for people, ship its AI manual too.
-->
