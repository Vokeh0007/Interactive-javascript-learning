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
      analogy: `Think of a variable as a <strong>labeled storage box</strong> 📦. You write a name on the outside (the variable name) and put something inside (the value). Whenever you need that value later, you just say the name — JavaScript opens the right box and hands you what's inside!`,
      explanation: `A <strong>variable</strong> is a named container for a value. You create one by declaring it:

<strong>Step 1 — Choose a keyword:</strong>
• <code>const</code> — the value <em>cannot change</em> (use this by default)
• <code>let</code>   — the value <em>can be changed</em> later (use when needed)
• <code>var</code>   — old-style, avoid in modern code

<strong>Step 2 — Give it a name:</strong> descriptive names like <code>playerName</code> or <code>enemyHp</code>

<strong>Step 3 — Assign a value:</strong> use <code>=</code> to put a value in the box

JavaScript is <em>dynamically typed</em> — the same variable can hold a number, string, boolean, or object without you having to declare the type.`,
      codeExample: `// Step 1: Declare with const (value won't change)
const playerName = "Hero";   // string — text in quotes

// Step 2: Declare with let (value can change later)
let hp = 100;                // number — no quotes needed
let isAlive = true;          // boolean — true or false
let loot = null;             // null — intentionally empty

// Step 3: Reassign a let variable
hp = hp - 20;                // hp is now 80

// Check the type of any value
console.log(typeof playerName); // "string"
console.log(typeof hp);         // "number"
console.log(typeof isAlive);    // "boolean"`,
      gameMapping: 'Your player\'s HP, MP, and name are all variables! Open the Teaching Panel → Objects tab and watch them update live as you take damage. Every property you see is a variable stored in JavaScript memory.',
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
      description: `Let's put variables to work! Follow these steps:
1️⃣  Declare a variable called <code>enemyName</code> and assign it the string <code>"Goblin"</code>
2️⃣  Declare a variable called <code>enemyHp</code> and assign it the number <code>50</code>

<em>Tip: Use <code>const</code> for enemyName (it won't change) and <code>let</code> for enemyHp (HP can change in battle).</em>`,
      context: '// Level 1 Exercise — Variables',
      prefix: '',
      starterCode: `// Step 1: Declare enemyName as the string "Goblin"
// Hint: const enemyName = ...

// Step 2: Declare enemyHp as the number 50
// Hint: let enemyHp = ...
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
      analogy: `A function is like a <strong>vending machine</strong> 🎰. You press a button (call it by name), drop in coins (pass arguments), it runs its internal process, and delivers a snack (returns a value). Press the same button any time — you always get the same result, and the machine handles all the messy internals for you!`,
      explanation: `A <strong>function</strong> is a named, reusable block of code. Here's the anatomy:

<strong>1. Define it once</strong> with the <code>function</code> keyword (or an arrow <code>=></code>)
<strong>2. Name it</strong> clearly — <code>calculateDamage</code> is better than <code>cd</code>
<strong>3. Declare parameters</strong> — the inputs the function expects
<strong>4. Write the body</strong> — the steps that run when called
<strong>5. Return a value</strong> — the output sent back to the caller

Functions are <em>first-class citizens</em> in JavaScript — you can store them in variables, pass them to other functions, and return them just like numbers or strings.`,
      codeExample: `// Function declaration
function attack(attacker, target) {
  const damage = attacker.power - target.defense;
  return Math.max(1, damage); // always deal at least 1
}

// Arrow function (ES6+ shorthand — same thing!)
const heal = (player, amount) =>
  ({ ...player, hp: player.hp + amount });

// Calling functions — pass arguments, get a result back
const dmg   = attack(hero, goblin); // returns a number
const hero2 = heal(hero, 30);       // returns a new object

// A function with a default parameter
function greet(name = "Hero") {
  return \`Welcome, \${name}!\`;
}
console.log(greet());         // "Welcome, Hero!"
console.log(greet("Wizard")); // "Welcome, Wizard!"`,
      gameMapping: 'Every button click calls a function! Strike → attack(), Heal → heal(). Watch the Call Stack tab in the Teaching Panel — it shows which functions are running right now, nested inside each other.',
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
      description: `Time to write your own function! Follow these steps:
1️⃣  Declare a function called <code>calcDamage</code>
2️⃣  Give it two parameters: <code>attack</code> and <code>defense</code>
3️⃣  Calculate <code>attack - defense</code> inside the function body
4️⃣  Return the result — but <strong>never less than 1</strong> (a hit always does at least 1 damage)

<em>Tip: <code>Math.max(a, b)</code> returns whichever is larger. So <code>Math.max(1, damage)</code> ensures you never return 0 or negative.</em>`,
      context: '// Level 2 Exercise — Functions',
      prefix: '',
      starterCode: `function calcDamage(attack, defense) {
  // Step 1: Calculate raw damage
  const damage = attack - defense;

  // Step 2: Return damage, but never less than 1
  return Math.max(1, damage);
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
      analogy: `An array is like a <strong>numbered row of lockers</strong> 🔢. Locker <code>[0]</code> is first, <code>[1]</code> is next, and so on. You can open any locker instantly by its number, add new lockers at the back with <code>push()</code>, or remove the last one with <code>pop()</code>. The whole row is your array!`,
      explanation: `An <strong>array</strong> is an ordered list of values. Each value has a <em>zero-based index</em> — the first item is always at position <code>[0]</code>.

<strong>Creating an array:</strong>
<code>const enemies = ["Goblin", "Troll", "Dragon"];</code>

<strong>Reading values by index:</strong>
<code>enemies[0]</code> → "Goblin" | <code>enemies[2]</code> → "Dragon"

<strong>Key methods:</strong>
• <code>push(value)</code>    — add to the <em>end</em>
• <code>pop()</code>         — remove from the <em>end</em>
• <code>shift()</code>       — remove from the <em>front</em>
• <code>unshift(value)</code> — add to the <em>front</em>
• <code>length</code>        — how many items are in the array
• <code>forEach(fn)</code>   — run a function for each item`,
      codeExample: `const enemies = ["Goblin", "Troll", "Dragon"];

// Access by index (zero-based!)
console.log(enemies[0]); // "Goblin"
console.log(enemies[2]); // "Dragon"
console.log(enemies.length); // 3

// Add / remove
enemies.push("Witch");   // → ["Goblin","Troll","Dragon","Witch"]
enemies.pop();           // → ["Goblin","Troll","Dragon"]

// Iterate over every element
enemies.forEach((enemy, index) => {
  console.log(\`Enemy #\${index}: \${enemy}\`);
});
// Enemy #0: Goblin
// Enemy #1: Troll
// Enemy #2: Dragon`,
      gameMapping: 'Your enemies are stored in an <code>enemies[]</code> array. Array Slash hits ALL of them using <code>forEach</code>. Open the Arrays tab to see the live array update as enemies fall!',
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
      description: `Let's build a party roster using array methods! Follow these steps:
1️⃣  You already have <code>const party = ["Warrior"]</code> — it's given to you
2️⃣  Use <code>party.push("Mage")</code> to add Mage to the party
3️⃣  Use <code>party.push("Rogue")</code> to add Rogue to the party
4️⃣  Declare a variable <code>first</code> equal to the first element: <code>party[0]</code>

<em>After your code, party should have 3 members and first should be "Warrior".</em>`,
      context: '// Level 3 Exercise — Arrays',
      prefix: 'const party = ["Warrior"];\n',
      starterCode: `// Step 2: Add "Mage" to the party
party.push("Mage");

// Step 3: Add "Rogue" to the party
party.push("Rogue");

// Step 4: Get the first element (index 0)
const first = party[0];
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
      analogy: `An object is like a <strong>player ID card</strong> 🪪. Instead of scattering a hero's name, HP, and level across separate variables, you bundle them all onto one card with labeled fields: <code>name: "Hero"</code>, <code>hp: 100</code>, <code>level: 5</code>. One object = all the facts about one thing.`,
      explanation: `An <strong>object</strong> groups related data under named properties (key-value pairs).

<strong>Create an object:</strong>
<code>const player = { name: "Hero", hp: 100 };</code>

<strong>Read a property:</strong>
• Dot notation: <code>player.name</code> → "Hero"
• Bracket notation: <code>player["hp"]</code> → 100 (useful for dynamic keys)

<strong>Update a property:</strong>
<code>player.hp = 80;</code>

<strong>The spread trick (immutable update):</strong>
<code>const wounded = { ...player, hp: 80 };</code>
This creates a <em>new</em> object with all of player's properties, but <code>hp</code> replaced. The original <code>player</code> is unchanged!

<strong>Useful Object methods:</strong>
• <code>Object.keys(obj)</code>   — array of all key names
• <code>Object.values(obj)</code> — array of all values
• <code>Object.entries(obj)</code>— array of [key, value] pairs`,
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
console.log(player.hp);      // 100 — original unchanged!

// Iterate over all properties
Object.entries(player).forEach(([key, val]) => {
  console.log(\`\${key}: \${val}\`);
});`,
      gameMapping: 'Your hero IS a JavaScript object. Every stat you see in the Teaching Panel → Objects tab is an object property. Watch the <code>hp</code> property update live when you take damage!',
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
      description: `The spread operator is your safest tool for updating objects. Follow these steps:
1️⃣  You have <code>const player = { name: "Hero", hp: 100, mp: 50, attack: 15 }</code>
2️⃣  Create a NEW object called <code>damagedPlayer</code> using the spread operator
3️⃣  Give <code>damagedPlayer</code> all of player's properties, but with <code>hp</code> reduced by 30
4️⃣  <strong>Do NOT change the original player object</strong> — spread creates a copy!

<em>The spread syntax <code>{ ...player, hp: 70 }</code> copies all properties from player, then overrides hp with 70.</em>`,
      context: '// Level 4 Exercise — Objects',
      prefix: `const player = { name: "Hero", hp: 100, mp: 50, attack: 15 };\n`,
      starterCode: `// Use spread to create a damaged copy
const damagedPlayer = { ...player, hp: player.hp - 30 };

// player.hp should still be 100 (we never touched it!)
// damagedPlayer.hp should be 70
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
      analogy: `Higher-order functions are like <strong>power tools</strong> 🔧. Instead of cutting each board by hand (a manual for-loop), you load them into a power saw (<code>.map()</code>, <code>.filter()</code>) and it applies the same blade to every piece at once. The "higher-order" part is that you hand the saw your own blade (a callback function)!`,
      explanation: `A <strong>higher-order function (HOF)</strong> either takes a function as an argument or returns one. The built-in array HOFs replace messy for-loops with clean, readable code:

<strong>map(fn)</strong> — transform every element, return a new array of the same length
<strong>filter(fn)</strong> — keep only elements where fn returns <code>true</code>
<strong>reduce(fn, start)</strong> — collapse the whole array into one value
<strong>find(fn)</strong> — return the first element where fn returns <code>true</code>
<strong>some(fn) / every(fn)</strong> — true if any/all elements pass the test

<em>Key insight: none of these modify the original array. They always return something new.</em>`,
      codeExample: `const enemies = [
  { name: "Goblin", hp: 20 },
  { name: "Troll",  hp: 0  },
  { name: "Dragon", hp: 150 },
];

// filter — keep only alive enemies
const alive = enemies.filter(e => e.hp > 0);
// [Goblin, Dragon]

// map — extract names into a new array
const names = enemies.map(e => e.name);
// ["Goblin", "Troll", "Dragon"]

// reduce — total HP remaining
const totalHp = enemies.reduce((sum, e) => sum + e.hp, 0);
// 170

// find — first enemy with hp above 100
const boss = enemies.find(e => e.hp > 100);
// { name: "Dragon", hp: 150 }`,
      gameMapping: 'Array Slash uses <code>forEach</code> to hit every enemy. Filter Shield uses <code>filter()</code> to remove harmful effects. Map Strike uses <code>map()</code> to transform damage values. HOFs are the engine of this game!',
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
      description: `Practice the three most powerful array methods! You have an enemies array — complete each step:
1️⃣  <strong>filter:</strong> Create <code>livingEnemies</code> — only enemies with <code>hp > 0</code>
2️⃣  <strong>map:</strong> Create <code>enemyNames</code> — just the <code>name</code> string from each enemy
3️⃣  <strong>reduce:</strong> Create <code>totalHp</code> — the sum of all hp values (alive or dead)

<em>Remember: each HOF takes an arrow function as its argument: <code>.filter(e => ...)</code></em>`,
      context: '// Level 5 Exercise — Higher-Order Functions',
      prefix: `const enemies = [
  { name: "Goblin", hp: 20 },
  { name: "Troll",  hp: 0  },
  { name: "Dragon", hp: 150 }
];\n`,
      starterCode: `// Step 1: filter — keep enemies where hp > 0
const livingEnemies = enemies.filter(e => e.hp > 0);

// Step 2: map — extract just the name from each enemy
const enemyNames = enemies.map(e => e.name);

// Step 3: reduce — sum all hp values (start the total at 0)
const totalHp = enemies.reduce((sum, e) => sum + e.hp, 0);
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
      analogy: `A closure is like a <strong>magic backpack</strong> 🎒. When you create a function inside another function, the inner function packs up all the nearby variables into its backpack. Even after the outer function has finished and "left the room," the inner function still carries those variables wherever it goes — forever!`,
      explanation: `A <strong>closure</strong> is a function that "remembers" the variables from its surrounding scope, even after that outer scope has returned.

<strong>Scope in JavaScript:</strong>
• <strong>Global scope</strong> — accessible everywhere in the program
• <strong>Function scope</strong> — local to the function; goes away when the function returns
• <strong>Block scope</strong> — inside <code>{}</code> with <code>let</code>/<code>const</code>

<strong>How closures work:</strong>
1. You define a function <em>inside</em> another function
2. The inner function <em>closes over</em> any variables it references from the outer function
3. Even after the outer function returns, the inner function keeps those variables alive

<em>This is how you can create "private" state in JavaScript — variables that only the returned function can access!</em>`,
      codeExample: `function createCounter(start = 0) {
  let count = start;  // captured by the inner functions

  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getValue()  { return count; },
  };
}

// Each call creates an INDEPENDENT closure
const turnCounter = createCounter(0);
const roundCounter = createCounter(10);

turnCounter.increment(); // 1
turnCounter.increment(); // 2
turnCounter.getValue();  // 2  — count persists!

roundCounter.getValue(); // 10 — completely separate!`,
      gameMapping: 'The Closure Bomb creates a persistent damage-over-time effect — it closes over the damage value and "remembers" it across multiple combat turns, just like a counter closure.',
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
      description: `Create a "function factory" using closures! Follow these steps:
1️⃣  Write a function called <code>makeMultiplier</code> that takes a <code>factor</code> parameter
2️⃣  Inside it, <strong>return a new function</strong> that takes a number <code>n</code>
3️⃣  The returned function should return <code>n * factor</code>

<em>The magic: <code>factor</code> stays alive inside the returned function — that's the closure!</em>
<em>After your code: <code>const double = makeMultiplier(2);</code> then <code>double(5)</code> should return 10.</em>`,
      context: '// Level 6 Exercise — Closures',
      prefix: '',
      starterCode: `function makeMultiplier(factor) {
  // Return an inner function that multiplies by factor
  return function(n) {
    return n * factor; // factor is "closed over" here
  };
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
      analogy: `The DOM is like a <strong>live game board</strong> 🗺️. The HTML page is the board, and each element is a tile. JavaScript is the game master who can reach in at any moment and change a tile, add a new card, flip a token, or update the score — all while the game is being played!`,
      explanation: `The <strong>Document Object Model (DOM)</strong> is a JavaScript representation of your HTML page as a tree of objects. Every tag becomes a node you can read and modify.

<strong>Select an element:</strong>
• <code>document.querySelector("#id")</code> — first match by CSS selector
• <code>document.querySelectorAll(".class")</code> — all matches (NodeList)
• <code>document.getElementById("id")</code> — by id directly

<strong>Read / update content:</strong>
• <code>element.textContent = "text"</code> — safe text, no HTML
• <code>element.innerHTML = "&lt;b&gt;bold&lt;/b&gt;"</code> — HTML string

<strong>Change appearance:</strong>
• <code>element.classList.add("glow")</code>
• <code>element.classList.toggle("hidden")</code>

<strong>React to user events:</strong>
• <code>element.addEventListener("click", handler)</code>`,
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
      gameMapping: 'Every HP bar, every log entry, every enemy card in this game is DOM manipulation! Open DevTools → Elements tab and watch the DOM update live as you battle.',
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
      description: `Practice selecting elements from the live game page! Follow these steps:
1️⃣  Use <code>document.querySelector("#game-header")</code> to select the header element and store it in <code>header</code>
2️⃣  Use <code>document.querySelectorAll(".tab-btn")</code> to select ALL tab buttons and store them in <code>tabs</code>

<em>querySelector returns ONE element. querySelectorAll returns ALL matches as a NodeList (like an array).</em>`,
      context: '// Level 7 Exercise — DOM Manipulation',
      prefix: '',
      starterCode: `// Step 1: Select the element with id "game-header"
const header = document.querySelector("#game-header");

// Step 2: Select ALL elements with class "tab-btn"
const tabs = document.querySelectorAll(".tab-btn");
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
      analogy: `Async is like <strong>ordering pizza</strong> 🍕. You place your order (start the async operation), then keep playing your game (run other code). You don't stand frozen at the door waiting — when the delivery arrives (the Promise resolves), you handle it. No blocking, no waiting, just a callback when it's ready!`,
      explanation: `JavaScript is <strong>single-threaded</strong> — only one thing runs at a time. But it can handle slow operations (network, timers) <em>without freezing</em> using the <strong>event loop</strong>.

<strong>The three async patterns (oldest to newest):</strong>

1. <strong>Callbacks</strong> — pass a function to run "when done" (gets messy with nesting)
2. <strong>Promises</strong> — chainable with <code>.then()</code> / <code>.catch()</code>
3. <strong>async/await</strong> — reads like synchronous code, cleanest syntax

<strong>The event loop flow:</strong>
Call Stack → (async op goes to) Web APIs → Callback Queue → Call Stack

<em>Watch the Async tab in the Teaching Panel to see this live!</em>`,
      codeExample: `// 1. Callback (old style — nesting gets ugly)
setTimeout(() => console.log("After 1s"), 1000);

// 2. Promise chain
fetch('/api/enemy')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 3. async/await (modern — reads like sync code!)
async function loadLevel(id) {
  try {
    const res  = await fetch(\`/api/levels/\${id}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
  }
}

// await pauses THIS function only — other code keeps running
const level = await loadLevel(1);`,
      gameMapping: 'Async Blast charges for 1.8 seconds (a real setTimeout + Promise) before striking. Watch the Async Timeline tab — you\'ll see the Call Stack, Web APIs, and Queue update in real time!',
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
      description: `Build a delay utility — one of the most common async patterns! Follow these steps:
1️⃣  Declare an <code>async function delay(ms)</code>
2️⃣  Inside it, return a <code>new Promise(...)</code>
3️⃣  The Promise executor takes a <code>resolve</code> callback
4️⃣  Use <code>setTimeout(resolve, ms)</code> to call resolve after ms milliseconds

<em>An async function always returns a Promise automatically. Returning a Promise from inside it just wraps it cleanly.</em>`,
      context: '// Level 8 Exercise — async/await',
      prefix: '',
      starterCode: `async function delay(ms) {
  // Return a Promise that resolves after ms milliseconds
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
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
      analogy: `ES6 features are like <strong>keyboard shortcuts</strong> ⌨️. They don't give you new powers — you could write all this code the old way. But once you learn them, you'll write the same logic in half the keystrokes, and your code will be far easier to read at a glance!`,
      explanation: `ES2015 (ES6) and later versions added powerful new syntax. Here are the ones you'll use every day:

<strong>Destructuring</strong> — unpack values from objects/arrays into variables:
<code>const { name, hp } = player;</code>

<strong>Spread <code>...</code></strong> — copy and merge objects/arrays:
<code>const newPlayer = { ...player, hp: 80 };</code>

<strong>Template literals</strong> — embed variables in strings:
<code>\`\${name} has \${hp} HP\`</code> (use backticks, not quotes)

<strong>Arrow functions</strong> — shorter function syntax:
<code>const double = n => n * 2;</code>

<strong>Optional chaining <code>?.</code></strong> — safe property access:
<code>player?.inventory?.gold</code> — returns undefined instead of throwing

<strong>Nullish coalescing <code>??</code></strong> — default if null/undefined:
<code>const gold = player.gold ?? 0;</code>`,
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
      gameMapping: 'This entire game engine uses ES6+ features end-to-end: arrow functions everywhere, destructuring in every function, spread for immutable updates, and template literals in every log message. You\'ve been reading ES6+ all along!',
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
      description: `Practice two of the most-used ES6 features! Follow these steps:
1️⃣  Use <strong>destructuring</strong> to pull <code>name</code> and <code>hp</code> out of the player object into their own variables
2️⃣  Use the <strong>spread operator</strong> to create a <code>buffedPlayer</code> — a copy of player with <code>attack</code> increased by 10
3️⃣  <strong>Do NOT change the original player object</strong> — spread creates a brand new copy!

<em>Destructuring syntax: <code>const { name, hp } = player;</code></em>
<em>Spread syntax: <code>const buffedPlayer = { ...player, attack: player.attack + 10 };</code></em>`,
      context: '// Level 9 Exercise — ES6+',
      prefix: `const player = { name: "Hero", hp: 80, mp: 40, attack: 15, defense: 5 };\n`,
      starterCode: `// Step 1: Destructure name and hp from player
const { name, hp } = player;

// Step 2: Create buffedPlayer with attack + 10 using spread
const buffedPlayer = { ...player, attack: player.attack + 10 };
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
      analogy: `Debugging is like being a <strong>detective</strong> 🔍. Your <code>console.log()</code> is the magnifying glass. You follow the evidence (output values), eliminate suspects (code paths), and don't stop until you've caught the bug red-handed. Every great programmer is a great debugger!`,
      explanation: `Every program has bugs. Here's your debugging toolkit:

<strong>Types of errors:</strong>
• <strong>SyntaxError</strong> — invalid code that can't even parse (missing bracket, typo)
• <strong>ReferenceError</strong> — using a variable that doesn't exist
• <strong>TypeError</strong> — wrong type for an operation (null.toUpperCase())
• <strong>Logic error</strong> — code runs fine, but produces wrong output (hardest to find!)

<strong>Debugging workflow:</strong>
1. <strong>Read the error message</strong> — it tells you exactly what went wrong and where
2. <strong>console.log()</strong> suspicious values to see what's actually there
3. <strong>Use DevTools</strong> → Sources → click a line to set a breakpoint
4. <strong>Shrink the problem</strong> — comment out code until you isolate the bug
5. <strong>Check assumptions</strong> — are your variables what you think they are?`,
      codeExample: `// BUG 1: ReferenceError — using before declaring
// console.log(score); // ← ReferenceError!
const score = 0;
console.log(score);    // ✅ 0

// BUG 2: TypeError — calling method on null
// const name = null;
// console.log(name.toUpperCase()); // ← TypeError!
const name = null;
console.log(name?.toUpperCase() ?? 'unknown'); // ✅ safe

// BUG 3: Logic error — wrong operator
function isEven(n) {
  return n % 2 === 0;  // was: n % 2 == 1 (wrong!)
}
console.log(isEven(4)); // ✅ true`,
      gameMapping: 'The final boss is a "Fix the Bug" battle — you must identify and fix broken code to deal damage. Each correct fix is a critical hit! Use console.log() to investigate.',
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
      description: `Put on your detective hat 🔍! The function below has a bug. Find and fix it:

<strong>Bug:</strong> The <code>reduce()</code> call is missing its <strong>initial value</strong>. Without it, calling the function on an empty array (or an all-negative array where the filter returns <code>[]</code>) will throw a TypeError.

<em>Fix: add <code>, 0</code> as the second argument to reduce so it starts counting from 0 even when the array is empty.</em>
<em>Test cases: processNumbers([1,-2,3,0,4]) → 16 | processNumbers([-1,-2]) → 0 | processNumbers([5]) → 10</em>`,
      context: '// Level 10 Exercise — Debugging',
      prefix: '',
      starterCode: `function processNumbers(numbers) {
  const positive = numbers.filter(n => n > 0);
  const doubled  = positive.map(n => n * 2);
  // BUG: reduce() has no initial value — crashes on empty arrays!
  const total = doubled.reduce((sum, n) => sum + n);
  return total;
}`,
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
