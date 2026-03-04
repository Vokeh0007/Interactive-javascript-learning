/**
 * TEACHING CONCEPT: Module Bootstrap, Execution Context, DOMContentLoaded
 *
 * main.js is the entry point.  It demonstrates:
 *   - DOMContentLoaded event — code waits for DOM to be ready before running
 *   - async IIFE (Immediately Invoked Function Expression) for top-level await
 *   - Import / export (ES Modules) — separation of concerns across files
 *   - try/catch for top-level error handling
 *   - The execution order of JavaScript: parse → execute → react to events
 */

import GameEngine          from './engine/gameEngine.js';
import { initRenderer }    from './ui/renderer.js';
import { initTeachingPanel } from './ui/teachingPanel.js';
import { renderMenu }      from './ui/renderer.js';
import GameState, { GAME_PHASES } from './state/gameState.js';
import Logger              from './utils/logger.js';

// ─── Bootstrap ────────────────────────────────────────────────────────────────
/**
 * The application entry point.
 *
 * TEACHING: DOMContentLoaded fires after the HTML is parsed but before
 * images/stylesheets finish loading — the correct time to manipulate the DOM.
 *
 * We wrap everything in an async IIFE so we can use await at the top level.
 */
document.addEventListener('DOMContentLoaded', async () => {
  Logger.log('DOM ready — bootstrapping JavaScript Mastery Simulator', 'system');

  try {
    // ── Step 1: Initialize the teaching panel (subscribe to state) ──────────
    // TEACHING: This sets up Observer subscriptions BEFORE any state changes.
    //           Order matters — register listeners first.
    initTeachingPanel();

    // ── Step 2: Initialize the renderer (wire DOM events) ───────────────────
    // TEACHING: The renderer observes GameState and translates state → DOM.
    initRenderer(GameEngine);

    // ── Step 3: Initialize the game engine (create player, set initial state) ─
    // TEACHING: async/await — we wait for engine init before showing the menu.
    await GameEngine.init('Hero');

    // ── Step 4: Show the main menu ───────────────────────────────────────────
    renderMenu(GameState.get('completedLevels') || []);

    Logger.log('Bootstrap complete — welcome to JavaScript Mastery Simulator!', 'system');

  } catch (error) {
    // TEACHING: Always handle errors at the top level.
    //           An uncaught error here would silently break the entire app.
    console.error('Bootstrap error:', error);
    Logger.log(`FATAL: ${error.message}`, 'error');

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div style="padding:2rem;color:#ff6b6b;font-family:monospace">
        <h2>❌ Failed to start JavaScript Mastery Simulator</h2>
        <p>${error.message}</p>
        <p>Please ensure you are serving this over HTTP (not file://).</p>
        <p>Try: <code>npx serve .</code> or <code>python -m http.server 8080</code></p>
      </div>`;
    }
  }
});
