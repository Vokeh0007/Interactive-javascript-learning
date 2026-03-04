# ⚡ JavaScript Mastery Simulator

> **Learn JavaScript through interactive gameplay — no lectures, just action.**

A browser-based educational RPG that teaches the complete JavaScript ecosystem through progressive, concept-driven battles and mini-exercises.

---

## 🎯 What Is This?

The **JavaScript Mastery Simulator** is a turn-based RPG where every gameplay mechanic directly maps to a JavaScript concept. Instead of reading about arrays, you *use* them to slash all enemies at once. Instead of being told about async/await, you *watch* a charged attack resolve on a timer while the event loop visualization updates live.

---

## 🚀 Quick Start

```bash
# Option 1 — Node.js (recommended)
npx serve .
# Then open http://localhost:3000

# Option 2 — Python
python -m http.server 8080
# Then open http://localhost:8080

# Option 3 — VS Code
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

> ⚠️ **ES Modules require HTTP** — open via a local server, not `file://`.

---

## 🗺️ System Architecture

```
JavaScript Mastery Simulator
├── index.html              ← Single-page app shell (all screens & modals)
│
├── css/
│   ├── main.css            ← Base styles, design tokens, typography, modals
│   ├── game.css            ← Battlefield, entity cards, action buttons, log
│   └── panel.css           ← Teaching panel: tabs, object/array/stack/async views
│
└── js/
    ├── main.js             ← Bootstrap entry point (DOMContentLoaded + init)
    │
    ├── state/
    │   └── gameState.js    ← Central state (observer pattern, spread updates)
    │
    ├── data/
    │   └── levels.js       ← 10 levels, each mapping a JS concept to gameplay
    │
    ├── entities/
    │   ├── player.js       ← Player factory, pure state-transform functions
    │   ├── enemy.js        ← Enemy templates + factory + array helpers
    │   └── inventory.js    ← Array-based inventory (CRUD with HOFs)
    │
    ├── engine/
    │   ├── gameEngine.js   ← Main game loop, phase transitions, turn flow
    │   ├── combatEngine.js ← Damage/heal pipeline, HOF modifier chain
    │   └── asyncEngine.js  ← Promise-based turn delays, Async Blast mechanic
    │
    └── ui/
        ├── renderer.js      ← All DOM updates, event wiring, screen management
        ├── teachingPanel.js ← Live objects/arrays/call-stack/async visualization
        └── notifications.js ← Toast notifications (createElement + setTimeout)
```

---

## 📚 JavaScript Concepts Taught

| Level | Concept                  | Game Mechanic                                  |
|-------|--------------------------|------------------------------------------------|
| 1     | Variables & Data Types   | HP, MP, name as typed variables                |
| 2     | Functions                | Each attack button calls a function            |
| 3     | Arrays                   | Enemy waves; `forEach` multi-target slash       |
| 4     | Objects                  | Player/enemy as objects; spread for immutability |
| 5     | Higher-Order Functions   | `filter`, `map`, `reduce` on enemy arrays      |
| 6     | Closures & Scope         | Damage-over-time capturing values across turns |
| 7     | DOM Manipulation         | Live HP bars, log entries, class toggling      |
| 8     | Async JavaScript         | `Promise`-based Async Blast + Event Loop view  |
| 9     | Modern ES6+ Features     | Destructuring, spread, optional chaining       |
| 10    | Debugging & Clean Code   | Fix-the-bug final boss battle                  |

---

## 🧠 Teaching Mode

The right-hand **Teaching Panel** updates in real time as you play:

| Tab          | Shows                                                     |
|--------------|-----------------------------------------------------------|
| **Objects**  | Live `player {}` and `enemies []` properties with types   |
| **Arrays**   | Visual index-based view of inventory, enemies, log       |
| **Stack**    | Simulated call stack frames + execution log               |
| **Async**    | Event loop: Call Stack → Web APIs → Callback Queue flow   |

---

## 🏗️ Engineering Principles Demonstrated

- **Separation of concerns** — engine, renderer, and state are independent modules
- **Pure functions** — `applyDamage`, `applyHeal`, `addXP` never mutate input
- **Immutable state updates** — spread operator used everywhere for state changes
- **Observer pattern** — `GameState.subscribe()` wires state changes to UI updates
- **Factory functions** — `createPlayer()`, `createEnemy()`, `createItem()`
- **HOF pipelines** — damage modifier chain uses `Array.reduce()`
- **ES Modules** — `import / export` across 17 files, no global pollution
- **Async/await** — turn flow, level loading, and Async Blast are genuinely async

---

## 🎮 Controls

| Action               | How                                       |
|----------------------|-------------------------------------------|
| Select ability       | Click an ability button in the action bar |
| Target specific enemy | Click an enemy card first                |
| Use item             | Click inventory item in player zone       |
| Learn concept        | Click **Learn More** in the concept banner |
| Try exercise         | Click **Try Exercise** in the concept modal |
| Toggle panel         | Click 📚 in the header                   |
| Main menu            | Click 🏠 in the header                   |

---

## 📁 Development Phases Implemented

- [x] Phase 1 — Static UI Layout
- [x] Phase 2 — Core Data Structures (Player, Enemy, Inventory)
- [x] Phase 3 — Functions & Actions (combat engine, ability system)
- [x] Phase 4 — Higher-Order Function Mechanics (filter/map/reduce pipelines)
- [x] Phase 5 — DOM Integration (renderer, live updates)
- [x] Phase 6 — Async System (Promise-based turns, Async Blast, event loop viz)
- [x] Phase 7 — Advanced ES6+ Features (destructuring, spread, arrow functions, modules)
- [x] Phase 8 — Refactoring & Modularization (17 focused modules)
- [x] Phase 9 — Debugging Mode (Level 10 fix-the-bug exercises)
- [x] Phase 10 — Student Challenge Engine (10 interactive coding exercises)
