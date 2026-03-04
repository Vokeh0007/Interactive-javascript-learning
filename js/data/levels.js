/**
 * TEACHING DATA: Level definitions
 *
 * Each level maps ONE JavaScript concept to gameplay mechanics.
 * Structure:
 *   id, title, concept{}, waves[], rewards[], exercise{}
 *
 * The concept object contains:
 *   - name, icon, tagline
 *   - explanation (what it is)
 *   - codeExample  (syntax-highlighted snippet as a string)
 *   - gameMapping  (how it maps to the current level's game mechanic)
 *
 * The exercise object contains:
 *   - title, description
 *   - starterCode (shown in the editor)
 *   - testFn      (a string that will be eval'd — validates student's answer)
 *   - hint
 *   - xpReward
 */

export const LEVELS = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'The Variable Dungeon',
    subtitle: 'Where values are born',
    backgroundClass: 'bg-dungeon',
    concept: {
      name: 'Variables & Data Types',
      icon: '📦',
      tagline: 'Store values, give them names.',
      explanation: `A variable is a named container for a value.
JavaScript has three ways to declare variables:
• <code>const</code> — cannot be reassigned (prefer this)
• <code>let</code>   — block-scoped, can be reassigned
• <code>var</code>   — function-scoped, avoid in modern JS

JavaScript is <em>dynamically typed</em>: the same variable
can hold a number, a string, a boolean, or even an object.`,
      codeExample: `// Declaring variables
const playerName = "Hero";   // string
let hp = 100;                // number
let isAlive = true;          // boolean
let loot = null;             // null (intentionally empty)

// Reassigning (only let/var)
hp = hp - 20;                // hp is now 80

// typeof operator reveals the data type
console.log(typeof playerName); // "string"
console.log(typeof hp);         // "number"`,
      gameMapping: 'Your player\'s HP, MP, and name are all variables. Watch them change in the Teaching Panel as you take damage!',
    },
    waves: [
      { enemies: ['undeclaredGhost', 'undeclaredGhost'] },
      { enemies: ['undeclaredGhost', 'nullCreature'] },
    ],
    unlocksAbility: null,
    rewards: [
      { type: 'item', itemId: 'healthPotion', quantity: 2 },
      { type: 'gold', amount: 20 },
      { type: 'badge', badgeId: 'variables_master', name: 'Variable Master', icon: '📦' },
    ],
    exercise: {
      title: 'Declare a Variable',
      description: 'Declare a variable called `enemyName` and assign it the string "Goblin". Then declare a variable called `enemyHp` and assign it the number 50.',
      context: '// Level 1 Exercise — Variables',
      prefix: '',
      starterCode: `// Declare enemyName as "Goblin"
// Declare enemyHp as 50
`,
      suffix: '',
      testFn: `
        try {
          const result = eval(code);
          const hasName = typeof enemyName !== 'undefined' && enemyName === 'Goblin';
          const hasHp   = typeof enemyHp   !== 'undefined' && enemyHp   === 50;
          if (hasName && hasHp) return { pass: true,  message: '✅ Correct! Both variables declared.' };
          if (!hasName) return { pass: false, message: '❌ enemyName should equal "Goblin".' };
          return { pass: false, message: '❌ enemyHp should equal 50.' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'Use: const enemyName = "Goblin"; and let enemyHp = 50;',
      xpReward: 50,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'The Function Forge',
    subtitle: 'Reusable actions',
    backgroundClass: 'bg-forge',
    concept: {
      name: 'Functions',
      icon: '⚙️',
      tagline: 'Package code into reusable actions.',
      explanation: `A function is a reusable block of code that:
1. Takes <strong>parameters</strong> (inputs)
2. Executes statements
3. Returns a <strong>value</strong> (output)

Functions are <em>first-class citizens</em> in JavaScript —
they can be stored in variables, passed as arguments, and returned from other functions.`,
      codeExample: `// Function declaration
function attack(attacker, target) {
  const damage = attacker.power - target.defense;
  return Math.max(1, damage); // always deal at least 1
}

// Arrow function (ES6+)
const heal = (player, amount) =>
  ({ ...player, hp: player.hp + amount });

// Calling functions
const dmg  = attack(hero, goblin);  // returns a number
const hero2 = heal(hero, 30);       // returns a new object`,
      gameMapping: 'Every button you press calls a function! Strike calls attack(), Heal calls heal(). See the call stack in the Teaching Panel.',
    },
    waves: [
      { enemies: ['infiniteLooper'] },
      { enemies: ['infiniteLooper', 'returnlessFunction'] },
    ],
    unlocksAbility: 'powerStrike',
    rewards: [
      { type: 'item', itemId: 'manaPotion', quantity: 1 },
      { type: 'gold', amount: 30 },
      { type: 'badge', badgeId: 'function_forge', name: 'Function Forger', icon: '⚙️' },
    ],
    exercise: {
      title: 'Write a Damage Function',
      description: 'Write a function called `calcDamage` that takes two parameters: `attack` and `defense`. It should return `attack - defense`, but never less than 1.',
      context: '// Level 2 Exercise — Functions',
      prefix: '',
      starterCode: `function calcDamage(attack, defense) {
  // your code here
}`,
      suffix: '',
      testFn: `
        try {
          eval(code);
          if (typeof calcDamage !== 'function') return { pass: false, message: '❌ calcDamage must be a function.' };
          if (calcDamage(10, 4) !== 6)  return { pass: false, message: '❌ calcDamage(10, 4) should return 6.' };
          if (calcDamage(5, 10) !== 1)  return { pass: false, message: '❌ calcDamage(5, 10) should return 1 (min 1).' };
          if (calcDamage(20, 0) !== 20) return { pass: false, message: '❌ calcDamage(20, 0) should return 20.' };
          return { pass: true, message: '✅ calcDamage works correctly!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'Use Math.max(1, attack - defense) to ensure the result is never below 1.',
      xpReward: 60,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'The Array Labyrinth',
    subtitle: 'Collections of power',
    backgroundClass: 'bg-labyrinth',
    concept: {
      name: 'Arrays',
      icon: '📋',
      tagline: 'Ordered collections of values.',
      explanation: `An array is an ordered list of values.
Key operations:
• <code>push()</code>    — add to the end
• <code>pop()</code>     — remove from the end
• <code>shift()</code>   — remove from the front
• <code>unshift()</code> — add to the front
• <code>splice()</code>  — remove/insert anywhere
• <code>slice()</code>   — copy a portion (non-destructive)

Access elements by <em>zero-based index</em>: <code>arr[0]</code> is first.`,
      codeExample: `const enemies = ["Goblin", "Troll", "Dragon"];

// Access by index
console.log(enemies[0]); // "Goblin"
console.log(enemies[2]); // "Dragon"

// Modify array
enemies.push("Witch");   // adds to end → length = 4
enemies.pop();           // removes "Witch" → length = 3

// Iterate
enemies.forEach((enemy, index) => {
  console.log(\`\${index}: \${enemy}\`);
});`,
      gameMapping: 'Your enemies are stored in the enemies[] array. Array Slash hits ALL of them using forEach. Watch the live array in the Teaching Panel!',
    },
    waves: [
      { enemies: ['indexError', 'indexError', 'indexError'] },
      { enemies: ['mutationMonster', 'indexError'] },
    ],
    unlocksAbility: 'arraySlash',
    rewards: [
      { type: 'item', itemId: 'healthPotion', quantity: 2 },
      { type: 'item', itemId: 'arrayScroll', quantity: 1 },
      { type: 'gold', amount: 40 },
      { type: 'badge', badgeId: 'array_master', name: 'Array Master', icon: '📋' },
    ],
    exercise: {
      title: 'Array Operations',
      description: 'Start with `const party = ["Warrior"];`. Add "Mage" and "Rogue" to the array using push(). Then write a statement that gives the variable `first` the value of the first element.',
      context: '// Level 3 Exercise — Arrays',
      prefix: 'const party = ["Warrior"];\n',
      starterCode: `// Add "Mage" and "Rogue" to party
// Assign first element to variable 'first'
`,
      suffix: '',
      testFn: `
        try {
          const party = ["Warrior"];
          eval(code);
          if (party.length !== 3) return { pass: false, message: \`❌ party should have 3 elements, got \${party.length}.\` };
          if (!party.includes("Mage"))  return { pass: false, message: '❌ "Mage" not found in party.' };
          if (!party.includes("Rogue")) return { pass: false, message: '❌ "Rogue" not found in party.' };
          if (typeof first === 'undefined') return { pass: false, message: '❌ variable "first" not declared.' };
          if (first !== "Warrior") return { pass: false, message: \`❌ first should be "Warrior", got "\${first}".\` };
          return { pass: true, message: '✅ Array operations correct!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'party.push("Mage"); party.push("Rogue"); const first = party[0];',
      xpReward: 65,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: 'The Object Sanctum',
    subtitle: 'Structured data with identity',
    backgroundClass: 'bg-sanctum',
    concept: {
      name: 'Objects',
      icon: '🗃️',
      tagline: 'Key-value collections with structure.',
      explanation: `An object groups related data and behaviour under named properties.
• Properties are key-value pairs: <code>{ key: value }</code>
• Access with dot notation: <code>obj.name</code>
• Or bracket notation: <code>obj["name"]</code>
• Methods are functions stored as properties
• <code>Object.keys()</code>, <code>Object.values()</code>, <code>Object.entries()</code>
  are powerful tools for iterating.`,
      codeExample: `// Object literal
const player = {
  name: "Hero",
  hp: 100,
  attack: 15,
  greet() {
    return \`I am \${this.name}, HP: \${this.hp}\`;
  }
};

// Accessing properties
console.log(player.name);    // "Hero"
console.log(player["hp"]);   // 100

// Spread to create modified copy (immutable update)
const wounded = { ...player, hp: 80 };
console.log(wounded.hp);     // 80
console.log(player.hp);      // 100 (unchanged!)`,
      gameMapping: 'Your player IS an object. Every stat you see is an object property. The spread operator creates new states without mutation — pure functions!',
    },
    waves: [
      { enemies: ['undefinedPropDemon', 'undefinedPropDemon'] },
      { enemies: ['protoChainWalker'] },
    ],
    unlocksAbility: 'filterShield',
    rewards: [
      { type: 'item', itemId: 'typeShield', quantity: 1 },
      { type: 'gold', amount: 50 },
      { type: 'badge', badgeId: 'object_master', name: 'Object Architect', icon: '🗃️' },
    ],
    exercise: {
      title: 'Immutable Object Update',
      description: 'Given a player object, create a NEW object called `damagedPlayer` that has all the same properties but with `hp` reduced by 30. Do NOT mutate the original `player`.',
      context: '// Level 4 Exercise — Objects',
      prefix: `const player = { name: "Hero", hp: 100, mp: 50, attack: 15 };\n`,
      starterCode: `// Create damagedPlayer using spread
`,
      suffix: '',
      testFn: `
        try {
          const player = { name: "Hero", hp: 100, mp: 50, attack: 15 };
          eval(code);
          if (player.hp !== 100) return { pass: false, message: '❌ Do NOT mutate the original player! player.hp changed.' };
          if (typeof damagedPlayer === 'undefined') return { pass: false, message: '❌ damagedPlayer is not defined.' };
          if (damagedPlayer.hp !== 70) return { pass: false, message: \`❌ damagedPlayer.hp should be 70, got \${damagedPlayer.hp}.\` };
          if (damagedPlayer.name !== 'Hero') return { pass: false, message: '❌ damagedPlayer should retain name "Hero".' };
          return { pass: true, message: '✅ Immutable update works perfectly!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'const damagedPlayer = { ...player, hp: player.hp - 30 };',
      xpReward: 70,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'The HOF Highlands',
    subtitle: 'Functions that command functions',
    backgroundClass: 'bg-highlands',
    concept: {
      name: 'Higher-Order Functions',
      icon: '🌊',
      tagline: 'Functions that take or return other functions.',
      explanation: `A higher-order function (HOF) either:
• Takes a function as an argument, or
• Returns a function

The most important array HOFs are:
• <code>map(fn)</code>    — transform every element
• <code>filter(fn)</code> — keep elements matching a predicate
• <code>reduce(fn)</code> — collapse array into a single value
• <code>forEach(fn)</code>— iterate (no return value)
• <code>find(fn)</code>   — first matching element

HOFs replace explicit for-loops with declarative, composable code.`,
      codeExample: `const enemies = [
  { name: "Goblin", hp: 20 },
  { name: "Troll",  hp: 80 },
  { name: "Ghost",  hp: 5  },
];

// filter — keep living enemies (hp > 0)
const alive = enemies.filter(e => e.hp > 0);

// map — extract names into a new array
const names = enemies.map(e => e.name);
// ["Goblin", "Troll", "Ghost"]

// reduce — total HP remaining
const totalHp = enemies.reduce((sum, e) => sum + e.hp, 0);
// 105`,
      gameMapping: 'Array Slash uses forEach to hit every enemy. Filter Shield uses filter() to remove harmful effects. Map Strike uses map() to transform damage values!',
    },
    waves: [
      { enemies: ['impureFunction', 'impureFunction'] },
      { enemies: ['impureFunction', 'mutationMonster'] },
    ],
    unlocksAbility: 'mapStrike',
    rewards: [
      { type: 'item', itemId: 'megaPotion', quantity: 1 },
      { type: 'gold', amount: 60 },
      { type: 'badge', badgeId: 'hof_master', name: 'HOF Hero', icon: '🌊' },
    ],
    exercise: {
      title: 'Master the Three HOFs',
      description: 'Using the `enemies` array, write: (1) `livingEnemies` — filtered to only enemies with hp > 0. (2) `enemyNames` — array of just the name strings. (3) `totalHp` — sum of all hp values.',
      context: '// Level 5 Exercise — Higher-Order Functions',
      prefix: `const enemies = [
  { name: "Goblin", hp: 20 },
  { name: "Troll",  hp: 0  },
  { name: "Dragon", hp: 150 }
];\n`,
      starterCode: `const livingEnemies = // filter...
const enemyNames    = // map...
const totalHp       = // reduce...
`,
      suffix: '',
      testFn: `
        try {
          const enemies = [{ name:"Goblin",hp:20},{name:"Troll",hp:0},{name:"Dragon",hp:150}];
          eval(code);
          if (!Array.isArray(livingEnemies) || livingEnemies.length !== 2)
            return { pass: false, message: \`❌ livingEnemies should have 2 items, got \${Array.isArray(livingEnemies)?livingEnemies.length:'?'}.\` };
          if (!Array.isArray(enemyNames) || enemyNames.join(',') !== 'Goblin,Troll,Dragon')
            return { pass: false, message: '❌ enemyNames should be ["Goblin","Troll","Dragon"].' };
          if (totalHp !== 170)
            return { pass: false, message: \`❌ totalHp should be 170, got \${totalHp}.\` };
          return { pass: true, message: '✅ All three HOFs correct!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'filter(e => e.hp > 0) / map(e => e.name) / reduce((sum, e) => sum + e.hp, 0)',
      xpReward: 80,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: 'The Closure Cavern',
    subtitle: 'Functions that remember',
    backgroundClass: 'bg-cavern',
    concept: {
      name: 'Closures & Scope',
      icon: '🔒',
      tagline: 'Functions capture their surrounding scope.',
      explanation: `A closure is a function that "remembers" the variables from its
outer scope even after that outer scope has returned.

Scope types:
• <strong>Global</strong> — accessible everywhere
• <strong>Function</strong> — local to the function
• <strong>Block</strong> — inside {} (let/const only)

Every time you define a function inside another function,
the inner function closes over the outer variables.`,
      codeExample: `function createCounter(start = 0) {
  let count = start;  // captured by inner function

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getValue()  { return count; },
  };
}

const turnCounter = createCounter(0);
turnCounter.increment(); // 1
turnCounter.increment(); // 2
turnCounter.getValue();  // 2  — count persists!`,
      gameMapping: 'The Closure Bomb ability creates a persistent damage-over-time effect — a closure captures the damage value and "remembers" it across turns.',
    },
    waves: [
      { enemies: ['staleClosure'] },
      { enemies: ['staleClosure', 'impureFunction'] },
    ],
    unlocksAbility: 'closureBomb',
    rewards: [
      { type: 'item', itemId: 'closureScroll', quantity: 1 },
      { type: 'gold', amount: 70 },
      { type: 'badge', badgeId: 'closure_master', name: 'Closure Keeper', icon: '🔒' },
    ],
    exercise: {
      title: 'Build a Closure',
      description: 'Create a function `makeMultiplier(factor)` that returns a NEW function. The returned function should take a number `n` and return `n * factor`.',
      context: '// Level 6 Exercise — Closures',
      prefix: '',
      starterCode: `function makeMultiplier(factor) {
  // return a function that multiplies by factor
}`,
      suffix: '',
      testFn: `
        try {
          eval(code);
          if (typeof makeMultiplier !== 'function') return { pass: false, message: '❌ makeMultiplier must be a function.' };
          const double = makeMultiplier(2);
          const triple = makeMultiplier(3);
          if (typeof double !== 'function') return { pass: false, message: '❌ makeMultiplier must return a function.' };
          if (double(5)  !== 10) return { pass: false, message: \`❌ makeMultiplier(2)(5) should be 10, got \${double(5)}.\` };
          if (triple(4)  !== 12) return { pass: false, message: \`❌ makeMultiplier(3)(4) should be 12, got \${triple(4)}.\` };
          if (double(7)  !== 14) return { pass: false, message: \`❌ makeMultiplier(2)(7) should be 14, got \${double(7)}.\` };
          return { pass: true, message: '✅ Closure implemented correctly!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'return function(n) { return n * factor; }  — factor is captured by the closure.',
      xpReward: 85,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: 'The DOM Citadel',
    subtitle: 'Commanding the browser',
    backgroundClass: 'bg-citadel',
    concept: {
      name: 'DOM Manipulation',
      icon: '🌐',
      tagline: 'Read and write the live web page.',
      explanation: `The Document Object Model (DOM) is a tree of objects
representing the current HTML page. JavaScript can:
• <code>querySelector</code> — select elements
• <code>createElement</code> — create new nodes
• <code>innerHTML / textContent</code> — set content
• <code>classList</code> — add/remove CSS classes
• <code>addEventListener</code> — react to user events

Every visual change you've seen in this game is DOM manipulation!`,
      codeExample: `// Select an element
const hpBar = document.querySelector('#hp-bar');

// Update content
hpBar.textContent = "80 / 100";

// Change styles via classList
hpBar.classList.add('low-hp');     // adds CSS class
hpBar.classList.remove('full-hp');

// Create and append a new element
const logEntry = document.createElement('p');
logEntry.textContent = "Hero attacks!";
document.querySelector('#log').appendChild(logEntry);

// React to clicks
const btn = document.querySelector('#attack-btn');
btn.addEventListener('click', () => {
  console.log('Attack clicked!');
});`,
      gameMapping: 'This entire game is DOM manipulation! Every HP bar update, every log entry, every enemy card is a DOM operation. Open DevTools and inspect the live DOM!',
    },
    waves: [
      { enemies: ['domLeech', 'domLeech'] },
      { enemies: ['domLeech', 'staleClosure'] },
    ],
    unlocksAbility: null,
    rewards: [
      { type: 'item', itemId: 'debugDagger', quantity: 1 },
      { type: 'gold', amount: 80 },
      { type: 'badge', badgeId: 'dom_master', name: 'DOM Commander', icon: '🌐' },
    ],
    exercise: {
      title: 'DOM Query',
      description: 'Using the DOM API, write code that: (1) selects the element with id "game-header" and stores it in `header`. (2) selects ALL elements with class "tab-btn" and stores them in `tabs`.',
      context: '// Level 7 Exercise — DOM Manipulation',
      prefix: '',
      starterCode: `const header = // select #game-header
const tabs   = // select all .tab-btn elements
`,
      suffix: '',
      testFn: `
        try {
          eval(code);
          if (!header || header.id !== 'game-header') return { pass: false, message: '❌ header should be the #game-header element.' };
          if (!tabs || tabs.length === 0) return { pass: false, message: '❌ tabs should be a NodeList/Array of .tab-btn elements.' };
          return { pass: true, message: '✅ DOM queries correct!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'document.querySelector("#game-header") and document.querySelectorAll(".tab-btn")',
      xpReward: 75,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: 'The Async Abyss',
    subtitle: 'Time is just a promise',
    backgroundClass: 'bg-abyss',
    concept: {
      name: 'Async JavaScript',
      icon: '⏱️',
      tagline: 'Don\'t block. Promise to come back.',
      explanation: `JavaScript is single-threaded but can handle async operations
without freezing via the <strong>event loop</strong>.

Evolution of async patterns:
1. <strong>Callbacks</strong> — passed as arguments, can lead to "callback hell"
2. <strong>Promises</strong> — chainable, cleaner error handling
3. <strong>async/await</strong> — syntactic sugar, reads like sync code

The event loop: Call Stack → Web APIs → Callback Queue → Call Stack`,
      codeExample: `// Callback (old style)
setTimeout(() => console.log("After 1s"), 1000);

// Promise
fetch('/api/enemy')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await (modern)
async function loadLevel(id) {
  try {
    const res  = await fetch(\`/api/levels/\${id}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
  }
}`,
      gameMapping: 'Async Blast charges for 1.8 seconds before striking — a real setTimeout Promise! Watch the Async Timeline in the Teaching Panel to see the event loop in action.',
    },
    waves: [
      { enemies: ['callbackHell'] },
      { enemies: ['raceCon', 'callbackHell'] },
    ],
    unlocksAbility: 'asyncBlast',
    rewards: [
      { type: 'item', itemId: 'megaPotion', quantity: 2 },
      { type: 'gold', amount: 100 },
      { type: 'badge', badgeId: 'async_master', name: 'Promise Keeper', icon: '⏱️' },
    ],
    exercise: {
      title: 'Write an async function',
      description: 'Write an async function `delay(ms)` that returns a Promise resolving after `ms` milliseconds.',
      context: '// Level 8 Exercise — async/await',
      prefix: '',
      starterCode: `async function delay(ms) {
  // return a Promise that resolves after ms milliseconds
}`,
      suffix: '',
      testFn: `
        try {
          eval(code);
          if (typeof delay !== 'function') return { pass: false, message: '❌ delay must be a function.' };
          const result = delay(100);
          if (!(result instanceof Promise)) return { pass: false, message: '❌ delay must return a Promise.' };
          return { pass: true, message: '✅ async function implemented correctly!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'return new Promise(resolve => setTimeout(resolve, ms));',
      xpReward: 90,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'The ES6 Peaks',
    subtitle: 'Modern JavaScript mastery',
    backgroundClass: 'bg-peaks',
    concept: {
      name: 'Modern ES6+ Features',
      icon: '🚀',
      tagline: 'Write less, express more.',
      explanation: `ES2015 (ES6) and beyond introduced powerful syntax:
• <strong>Arrow functions</strong> <code>() =&gt; {}</code>
• <strong>Destructuring</strong> — extract from objects/arrays
• <strong>Spread / Rest</strong> <code>...</code>
• <strong>Template literals</strong> <code>\`Hello \${name}\`</code>
• <strong>Default parameters</strong>
• <strong>Optional chaining</strong> <code>obj?.prop</code>
• <strong>Nullish coalescing</strong> <code>?? default</code>
• <strong>Modules</strong> <code>import / export</code>`,
      codeExample: `// Destructuring
const { name, hp, mp } = player;
const [first, ...rest] = enemies;

// Spread
const newPlayer = { ...player, hp: 80 };
const allEnemies = [...wave1, ...wave2];

// Template literals
const msg = \`\${name} has \${hp}/\${player.maxHp} HP\`;

// Optional chaining & nullish coalescing
const gold = player?.inventory?.gold ?? 0;

// Arrow functions
const double = n => n * 2;
const alive  = enemies.filter(e => e.hp > 0);`,
      gameMapping: 'This entire codebase uses ES6+ features: arrow functions, destructuring, spread operators, template literals, and modules. You\'ve been using them all along!',
    },
    waves: [
      { enemies: ['legacyCode'] },
      { enemies: ['legacyCode', 'protoChainWalker'] },
    ],
    unlocksAbility: null,
    rewards: [
      { type: 'item', itemId: 'codeSword', quantity: 1 },
      { type: 'gold', amount: 120 },
      { type: 'badge', badgeId: 'es6_master', name: 'ES6 Pioneer', icon: '🚀' },
    ],
    exercise: {
      title: 'Destructuring & Spread',
      description: 'Given the player object, use destructuring to extract `name` and `hp`. Then use spread to create `buffedPlayer` with `attack` increased by 10.',
      context: '// Level 9 Exercise — ES6+',
      prefix: `const player = { name: "Hero", hp: 80, mp: 40, attack: 15, defense: 5 };\n`,
      starterCode: `// Destructure name and hp from player
// Create buffedPlayer with attack + 10
`,
      suffix: '',
      testFn: `
        try {
          const player = { name: "Hero", hp: 80, mp: 40, attack: 15, defense: 5 };
          eval(code);
          if (typeof name === 'undefined' || name !== 'Hero') return { pass: false, message: '❌ name should be "Hero".' };
          if (typeof hp === 'undefined' || hp !== 80) return { pass: false, message: '❌ hp should be 80.' };
          if (typeof buffedPlayer === 'undefined') return { pass: false, message: '❌ buffedPlayer is not defined.' };
          if (buffedPlayer.attack !== 25) return { pass: false, message: \`❌ buffedPlayer.attack should be 25, got \${buffedPlayer.attack}.\` };
          if (player.attack !== 15) return { pass: false, message: '❌ Do not mutate the original player!' };
          return { pass: true, message: '✅ Destructuring and spread used correctly!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'const { name, hp } = player; const buffedPlayer = { ...player, attack: player.attack + 10 };',
      xpReward: 90,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 10,
    title: 'The Debug Dimension',
    subtitle: 'Fix the bugs. Save the world.',
    backgroundClass: 'bg-dimension',
    concept: {
      name: 'Debugging & Clean Code',
      icon: '🐛',
      tagline: 'Find it. Fix it. Prevent it.',
      explanation: `Debugging is the art of finding and fixing errors.

Types of errors:
• <strong>SyntaxError</strong> — invalid code (typo, missing bracket)
• <strong>ReferenceError</strong> — variable not declared
• <strong>TypeError</strong> — wrong type for operation
• <strong>LogicError</strong> — code runs but produces wrong output

Debugging tools:
• <code>console.log()</code> — the classic approach
• <code>debugger</code> — pause execution in DevTools
• Browser DevTools → Sources → Breakpoints
• Read the stack trace carefully!`,
      codeExample: `// BUG 1: ReferenceError
// console.log(score); // ← ReferenceError: score is not defined
const score = 0;
console.log(score);    // ✅ 0

// BUG 2: TypeError
// const name = null;
// console.log(name.toUpperCase()); // ← TypeError
const name = null;
console.log(name?.toUpperCase() ?? 'unknown'); // ✅ safe

// BUG 3: Logic error
function isEven(n) {
  return n % 2 === 0;  // was: n % 2 == 1 (wrong logic)
}`,
      gameMapping: 'The final boss is a "Fix the Bug" battle — you must identify and fix broken code to deal damage. Each correct fix is a critical hit!',
    },
    waves: [
      { enemies: ['typeCoercionDragon'] },
      { enemies: ['asyncNightmare'] },
    ],
    unlocksAbility: null,
    rewards: [
      { type: 'item', itemId: 'megaPotion', quantity: 3 },
      { type: 'gold', amount: 200 },
      { type: 'badge', badgeId: 'js_master', name: 'JavaScript Master', icon: '🏆' },
    ],
    exercise: {
      title: 'Fix the Bug!',
      description: 'The function below has THREE bugs. Find and fix them all. It should: take an array of numbers, filter out non-positive values, double each remaining number, and return their sum.',
      context: '// Level 10 Exercise — Debugging',
      prefix: '',
      starterCode: `function processNumbers(numbers) {
  const positive = numbers.filter(n => n > 0);
  const doubled  = positive.map(n => n + n);    // BUG 1: should multiply, not add? Actually ok
  const total    = doubled.reduce((sum, n) => sum + n); // BUG 2: missing initial value
  return total
}
// BUG 3: missing semicolon above and function may throw on empty array`,
      suffix: '',
      testFn: `
        try {
          eval(code);
          if (typeof processNumbers !== 'function') return { pass: false, message: '❌ processNumbers must be a function.' };
          if (processNumbers([1, -2, 3, 0, 4]) !== 16) return { pass: false, message: \`❌ processNumbers([1,-2,3,0,4]) should be 16, got \${processNumbers([1,-2,3,0,4])}.\` };
          if (processNumbers([-1, -2]) !== 0) return { pass: false, message: \`❌ processNumbers([-1,-2]) should be 0, got \${processNumbers([-1,-2])}.\` };
          if (processNumbers([5]) !== 10) return { pass: false, message: \`❌ processNumbers([5]) should be 10, got \${processNumbers([5])}.\` };
          return { pass: true, message: '✅ All bugs fixed! JavaScript Master!' };
        } catch(e) { return { pass: false, message: '❌ ' + e.message }; }
      `,
      hint: 'Fix reduce initial value: reduce((sum,n) => sum+n, 0). Ensure empty array returns 0.',
      xpReward: 100,
    },
  },
];

export default LEVELS;
