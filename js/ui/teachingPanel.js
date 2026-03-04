/**
 * TEACHING CONCEPT: DOM Manipulation, Live Data Visualization, ES6 Template Literals
 *
 * TeachingPanel demonstrates:
 *   - DOM querying with querySelector / querySelectorAll
 *   - Dynamically building HTML via template literals (backtick strings)
 *   - Subscribing to state changes (observer pattern in action)
 *   - JSON.stringify for pretty-printing objects
 *   - Live mutation vs immutability visualization
 */

import GameState      from '../state/gameState.js';
import Logger         from '../utils/logger.js';
import { PLAYER_ABILITIES } from '../entities/player.js';

// ─── DOM element references ───────────────────────────────────────────────────
// TEACHING: Caching DOM refs avoids repeated querySelector calls
const el = (id) => document.getElementById(id);

// ─── Tab switching ────────────────────────────────────────────────────────────
let _activeTab = 'objects';

export const initTabs = () => {
  const tabButtons = document.querySelectorAll('#teaching-panel .tab-btn');
  const tabContents = document.querySelectorAll('#teaching-panel .tab-content');

  // TEACHING: forEach to attach event listeners to a NodeList
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      _activeTab = tabName;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tab-${tabName}`);
      if (content) content.classList.add('active');
    });
  });
};

// ─── Objects tab ──────────────────────────────────────────────────────────────
/**
 * Render the player object as a live property list.
 * TEACHING: Object.entries() returns [[key, value], …] pairs — iterated with map().
 */
export const renderPlayerObject = (player) => {
  const container = el('player-object-body');
  if (!container || !player) return;

  // Derived display values (computed inline, not relying on getters after spread)
  const displayKeys = ['name', 'hp', 'maxHp', 'mp', 'maxMp', 'level', 'xp',
    'xpToNextLevel', 'attack', 'defense', 'speed', 'gold'];

  // TEACHING: Object.entries() + filter + map → join to build HTML
  const rows = displayKeys
    .filter(key => player[key] !== undefined)
    .map(key => {
      const value = player[key];
      const typeClass = `type-${typeof value}`;
      const valueStr = typeof value === 'string' ? `"${value}"` : String(value);
      const changed = container.dataset.prev
        ? JSON.parse(container.dataset.prev)[key] !== value
        : false;
      return `<div class="obj-row ${changed ? 'prop-changed' : ''}">
  <span class="prop-key">${key}</span><span class="prop-colon">:</span>
  <span class="prop-value ${typeClass}">${valueStr}</span>
</div>`;
    });

  // Status effects sub-array
  const effectsHtml = player.statusEffects && player.statusEffects.length > 0
    ? `<div class="obj-row"><span class="prop-key">statusEffects</span><span class="prop-colon">:</span>
         <span class="prop-value type-array">[${player.statusEffects.map(e => `"${e.name}"`).join(', ')}]</span></div>`
    : `<div class="obj-row"><span class="prop-key">statusEffects</span><span class="prop-colon">:</span>
         <span class="prop-value type-array">[]</span></div>`;

  container.innerHTML = rows.join('') + effectsHtml;
  container.dataset.prev = JSON.stringify(
    Object.fromEntries(displayKeys.map(k => [k, player[k]]))
  );
};

/**
 * Render the enemies array.
 * TEACHING: Array.map() to build per-enemy HTML cards.
 */
export const renderEnemiesObject = (enemies) => {
  const container = el('enemies-object-body');
  if (!container) return;

  if (!enemies || enemies.length === 0) {
    container.innerHTML = '<div class="empty-msg">// no enemies</div>';
    return;
  }

  const html = enemies.map((enemy, i) => {
    const alive = enemy.hp > 0;
    return `<div class="obj-enemy ${alive ? '' : 'enemy-dead'}">
  <div class="obj-row"><span class="prop-key">enemies[${i}].name</span><span class="prop-colon">:</span>
    <span class="prop-value type-string">"${enemy.name}"</span></div>
  <div class="obj-row"><span class="prop-key">enemies[${i}].hp</span><span class="prop-colon">:</span>
    <span class="prop-value type-number ${enemy.hp < enemy.maxHp * 0.3 ? 'prop-low' : ''}">${enemy.hp}/${enemy.maxHp}</span></div>
  <div class="obj-row"><span class="prop-key">enemies[${i}].attack</span><span class="prop-colon">:</span>
    <span class="prop-value type-number">${enemy.attack}</span></div>
</div>`;
  });

  container.innerHTML = html.join('');
};

// ─── Arrays tab ───────────────────────────────────────────────────────────────
/**
 * Render inventory as a visual array.
 * TEACHING: Array visualization with indices and types.
 */
export const renderInventoryArray = (inventory) => {
  const container = el('inventory-array-display');
  if (!container) return;

  if (!inventory || inventory.length === 0) {
    container.innerHTML = '<div class="array-empty">[ ]  // empty array</div>';
    return;
  }

  const html = inventory.map((item, i) =>
    `<div class="array-element">
  <span class="array-index">[${i}]</span>
  <span class="array-value">{ name: "${item.name}", qty: ${item.quantity} }</span>
</div>`
  );

  container.innerHTML = html.join('');
};

/**
 * Render enemies as an array view.
 */
export const renderEnemiesArray = (enemies) => {
  const container = el('enemies-array-display');
  if (!container) return;

  if (!enemies || enemies.length === 0) {
    container.innerHTML = '<div class="array-empty">[ ]  // no enemies</div>';
    return;
  }

  const html = enemies.map((e, i) =>
    `<div class="array-element ${e.hp <= 0 ? 'array-dead' : ''}">
  <span class="array-index">[${i}]</span>
  <span class="array-value">"${e.name}" hp:${e.hp}</span>
  <span class="array-type ${e.hp <= 0 ? 'type-dead' : 'type-alive'}">${e.hp > 0 ? '●' : '○'}</span>
</div>`
  );

  container.innerHTML = html.join('');
};

/**
 * Render the execution log as an array view.
 */
export const renderLogArray = (entries) => {
  const container = el('log-array-display');
  if (!container) return;

  const last5 = entries.slice(-5).reverse();
  const html  = last5.map((entry, i) =>
    `<div class="array-element log-array-entry log-type-${entry.type}">
  <span class="array-index">[${i}]</span>
  <span class="array-value">"${entry.action.substring(0, 40)}"</span>
</div>`
  );

  container.innerHTML = html.length ? html.join('') : '<div class="array-empty">[]</div>';
};

// ─── Call Stack tab ───────────────────────────────────────────────────────────
/**
 * Render the simulated call stack.
 * TEACHING: Visual representation of a LIFO stack — bottom = oldest frame.
 */
export const renderCallStack = (callStack) => {
  const container = el('call-stack-display');
  if (!container) return;

  if (!callStack || callStack.length === 0) {
    container.innerHTML = `<div class="stack-frame stack-empty">
  <span class="frame-name">// call stack empty</span>
</div>`;
    return;
  }

  // Reverse: newest frame on top (like DevTools)
  const html = [...callStack].reverse().map((frame, i) => {
    const isTop = i === 0;
    const argsStr = (frame.args || []).map(a =>
      typeof a === 'string' ? `"${a}"` : String(a)
    ).join(', ');
    return `<div class="stack-frame ${isTop ? 'frame-top' : ''}">
  <span class="frame-name">${frame.fnName}(${argsStr})</span>
  <span class="frame-indicator">${isTop ? '← executing' : ''}</span>
</div>`;
  });

  // Always show anonymous root
  html.push(`<div class="stack-frame stack-root">
  <span class="frame-name">(anonymous)</span>
</div>`);

  container.innerHTML = html.join('');
};

/**
 * Render the execution log in the Call Stack tab.
 */
export const renderExecutionLog = (entries) => {
  const container = el('execution-log-display');
  if (!container) return;

  const last12 = entries.slice(-12).reverse();
  const html   = last12.map(entry =>
    `<div class="exec-entry exec-type-${entry.type}">
  <span class="exec-time">${entry.timeLabel}</span>
  <span class="exec-msg">${entry.action}</span>
</div>`
  );

  container.innerHTML = html.length
    ? html.join('')
    : '<div class="exec-empty">// no log entries yet</div>';
};

// ─── Async Timeline tab ───────────────────────────────────────────────────────
/**
 * Render the async event loop timeline.
 * TEACHING: Visualizes Call Stack → Web APIs → Callback Queue flow.
 */
export const renderAsyncTimeline = (timeline) => {
  const callstackTrack = el('async-callstack-track');
  const webapiTrack    = el('async-webapi-track');
  const queueTrack     = el('async-queue-track');
  const asyncLog       = el('async-log');

  if (!callstackTrack || !webapiTrack || !queueTrack) return;

  const events = timeline || [];

  const renderTrack = (track, phase) => {
    const phaseEvents = events.filter(e => e.phase === phase);
    const last3 = phaseEvents.slice(-3);
    track.innerHTML = last3.map(e =>
      `<div class="timeline-item state-${e.state}">${e.label}</div>`
    ).join('') || '<div class="timeline-empty">—</div>';
  };

  renderTrack(callstackTrack, 'callstack');
  renderTrack(webapiTrack,    'webapi');
  renderTrack(queueTrack,     'queue');

  if (asyncLog) {
    const lastEvents = events.slice(-8).reverse();
    asyncLog.innerHTML = lastEvents.map(e =>
      `<div class="async-event async-${e.state}">
  <span class="async-phase">${e.phase}</span>
  <span class="async-label">${e.label}</span>
  <span class="async-state">${e.state}</span>
</div>`
    ).join('') || '<div class="async-empty">// No async events yet</div>';
  }
};

// ─── Concept code block formatting ────────────────────────────────────────────
/**
 * Basic syntax highlighting for code strings.
 * TEACHING: Character-by-character tokenizer — avoids regex matching inside
 * already-emitted <span> attributes (which the old regex approach broke).
 * Processes the source left-to-right, emitting one token type at a time.
 */
const syntaxHighlight = (code) => {
  if (!code) return '';

  const KEYWORDS = new Set([
    'const','let','var','function','return','async','await',
    'if','else','for','while','new','class','import','export',
    'default','try','catch','throw','typeof','instanceof','in','of',
  ]);

  // HTML-escape a raw string (safe for use inside element text content)
  const esc = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let out = '';
  let i   = 0;

  while (i < code.length) {
    // ── Line comment (//) ───────────────────────────────────────────────────
    if (code[i] === '/' && code[i + 1] === '/') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      out += `<span class="sh-comment">${esc(code.slice(i, j))}</span>`;
      i = j;

    // ── String literal (", ', `) ────────────────────────────────────────────
    } else if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const q = code[i];
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue; }
        if (code[j] === q)    { j++;    break;    }
        j++;
      }
      out += `<span class="sh-string">${esc(code.slice(i, j))}</span>`;
      i = j;

    // ── Numeric literal ─────────────────────────────────────────────────────
    } else if (/[0-9]/.test(code[i]) && (i === 0 || !/\w/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[0-9.]/.test(code[j])) j++;
      out += `<span class="sh-number">${esc(code.slice(i, j))}</span>`;
      i = j;

    // ── Identifier or keyword ───────────────────────────────────────────────
    } else if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      out += KEYWORDS.has(word)
        ? `<span class="sh-keyword">${esc(word)}</span>`
        : esc(word);
      i = j;

    // ── Any other character ─────────────────────────────────────────────────
    } else {
      out += esc(code[i]);
      i++;
    }
  }

  return out;
};

/**
 * Render concept explanation in the concept modal.
 */
export const renderConceptModal = (concept) => {
  const title = document.getElementById('modal-concept-title');
  const body  = document.getElementById('modal-concept-body');
  if (!title || !body || !concept) return;

  title.textContent = `${concept.icon} ${concept.name}`;

  body.innerHTML = `
<div class="concept-tagline">${concept.tagline}</div>
<div class="concept-explanation">${concept.explanation}</div>
${concept.codeExample ? `
<div class="concept-code-section">
  <div class="code-label">Code Example</div>
  <pre class="concept-code"><code>${syntaxHighlight(concept.codeExample)}</code></pre>
</div>` : ''}
${concept.gameMapping ? `
<div class="game-mapping">
  <span class="mapping-icon">🎮</span>
  <span class="mapping-text">${concept.gameMapping}</span>
</div>` : ''}`;
};

// ─── Initialize and subscribe ─────────────────────────────────────────────────
/**
 * Set up all state subscriptions so the panel auto-updates.
 * TEACHING: This is the Observer pattern — panel observes state changes.
 */
export const initTeachingPanel = () => {
  initTabs();

  // Subscribe to player changes
  GameState.subscribe('player', (player) => {
    if (!player) return;
    renderPlayerObject(player);
  });

  // Subscribe to enemies changes
  GameState.subscribe('enemies', (enemies) => {
    renderEnemiesObject(enemies);
    renderEnemiesArray(enemies);
  });

  // Subscribe to inventory changes
  GameState.subscribe('inventory', (inventory) => {
    renderInventoryArray(inventory);
  });

  // Subscribe to call stack changes
  GameState.subscribe('callStack', (callStack) => {
    renderCallStack(callStack);
  });

  // Subscribe to async timeline changes
  GameState.subscribe('asyncTimeline', (timeline) => {
    renderAsyncTimeline(timeline);
  });

  // Subscribe to logger updates
  Logger.subscribe((entry, allEntries) => {
    renderExecutionLog(allEntries);
    renderLogArray(allEntries);
  });
};

export default {
  initTeachingPanel,
  renderPlayerObject,
  renderEnemiesObject,
  renderInventoryArray,
  renderEnemiesArray,
  renderCallStack,
  renderExecutionLog,
  renderAsyncTimeline,
  renderConceptModal,
};
