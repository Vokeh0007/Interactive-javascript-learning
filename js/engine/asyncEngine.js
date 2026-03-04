/**
 * TEACHING CONCEPT: Async JavaScript — Promises, async/await, setTimeout, Event Loop
 *
 * AsyncEngine demonstrates:
 *   - Creating Promises manually (new Promise)
 *   - setTimeout as a Web API (non-blocking)
 *   - async/await syntax for readable async code
 *   - Promise.all() for parallel async operations
 *   - try/catch with async/await
 *   - Event loop visualization via addAsyncEvent()
 */

import GameState from '../state/gameState.js';
import Logger from '../utils/logger.js';

// ─── Utility: promisified delay ───────────────────────────────────────────────
/**
 * Returns a Promise that resolves after `ms` milliseconds.
 * TEACHING: This is the async primitive — setTimeout wrapped in a Promise.
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export const delay = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));

// ─── Turn animation delay ─────────────────────────────────────────────────────
/**
 * Wait for the UI turn animation to finish.
 * TEACHING: await pauses execution here without blocking the browser.
 */
export const waitForAnimation = async (ms = 600) => {
  GameState.addAsyncEvent({ phase: 'callstack', label: 'waitForAnimation', state: 'running' });
  Logger.log(`⏳ waitForAnimation(${ms}ms) — awaiting…`, 'async');

  await delay(ms);

  GameState.addAsyncEvent({ phase: 'callstack', label: 'waitForAnimation', state: 'resolved' });
  Logger.log(`✅ waitForAnimation resolved`, 'async');
};

// ─── Async Blast: delayed high-damage attack ──────────────────────────────────
/**
 * Simulate the Async Blast ability:
 *   1. Announce charge (synchronous)
 *   2. Wait `delayMs` (async — setTimeout / Promise)
 *   3. Resolve with the damage value
 *
 * TEACHING: This is a real async operation — the Promise resolves after a delay.
 *
 * @param {number} damage   - Amount of damage to deal after delay
 * @param {number} delayMs  - How long to charge (ms)
 * @returns {Promise<number>} - Resolves with damage amount
 */
export const chargeAsyncBlast = async (damage, delayMs = 1800) => {
  Logger.log(`⚡ Async Blast charging… (${delayMs}ms)`, 'async');

  // Visualize: move into Web API queue
  GameState.addAsyncEvent({ phase: 'webapi', label: `setTimeout(${delayMs}ms)`, state: 'pending' });

  await delay(delayMs);

  // Visualize: move to callback queue, then resolved
  GameState.addAsyncEvent({ phase: 'queue',   label: 'AsyncBlast callback', state: 'queued'   });
  GameState.addAsyncEvent({ phase: 'queue',   label: 'AsyncBlast callback', state: 'resolved' });

  Logger.log(`⚡ Async Blast RESOLVED — ${damage} damage!`, 'async');
  return damage;
};

// ─── Async enemy turn ─────────────────────────────────────────────────────────
/**
 * Wraps the enemy turn in an async context so the UI can animate.
 * TEACHING: async function + await for sequential async steps.
 *
 * @param {Function} enemyTurnFn - The sync combat function to call after animation
 * @returns {Promise<Object>}    - The combat result
 */
export const asyncEnemyTurn = async (enemyTurnFn) => {
  Logger.log('asyncEnemyTurn() called', 'async');
  GameState.addAsyncEvent({ phase: 'callstack', label: 'asyncEnemyTurn', state: 'running' });

  // Step 1: brief pause (enemy "thinks")
  await delay(400);

  // Step 2: execute the combat logic
  const result = enemyTurnFn();

  // Step 3: brief pause after attack
  await delay(300);

  GameState.addAsyncEvent({ phase: 'callstack', label: 'asyncEnemyTurn', state: 'resolved' });
  Logger.log('asyncEnemyTurn() resolved', 'async');

  return result;
};

// ─── Promise.all demo: parallel async operations ──────────────────────────────
/**
 * Run multiple async actions in PARALLEL using Promise.all().
 * TEACHING: Promise.all() — all Promises start at once, resolve when ALL done.
 *
 * @param {Function[]} asyncFns - Array of functions returning Promises
 * @returns {Promise<any[]>}    - Array of all resolved values
 */
export const runParallel = async (asyncFns) => {
  Logger.log(`runParallel() — ${asyncFns.length} operations in parallel`, 'async');
  GameState.addAsyncEvent({ phase: 'webapi', label: `Promise.all(${asyncFns.length})`, state: 'pending' });

  // TEACHING: Promise.all starts all Promises simultaneously
  const results = await Promise.all(asyncFns.map(fn => fn()));

  GameState.addAsyncEvent({ phase: 'queue', label: 'Promise.all resolved', state: 'resolved' });
  Logger.log(`runParallel() — all ${asyncFns.length} resolved`, 'async');
  return results;
};

// ─── Level load simulation ────────────────────────────────────────────────────
/**
 * Simulate loading a level with an async operation.
 * TEACHING: async/await with try/catch for error handling.
 *
 * @param {number}   levelId  - Level to load
 * @param {Function} loadFn   - Sync function that returns level data
 * @returns {Promise<Object>} - Level data
 */
export const loadLevelAsync = async (levelId, loadFn) => {
  Logger.log(`loadLevelAsync(${levelId}) — starting`, 'async');
  GameState.addAsyncEvent({ phase: 'callstack', label: `loadLevel(${levelId})`, state: 'running' });

  try {
    await delay(200); // simulate async load
    const levelData = loadFn(levelId);
    GameState.addAsyncEvent({ phase: 'callstack', label: `loadLevel(${levelId})`, state: 'resolved' });
    Logger.log(`loadLevelAsync(${levelId}) — resolved`, 'async');
    return levelData;
  } catch (error) {
    Logger.log(`loadLevelAsync(${levelId}) — ERROR: ${error.message}`, 'error');
    GameState.addAsyncEvent({ phase: 'callstack', label: `loadLevel(${levelId})`, state: 'rejected' });
    throw error;  // TEACHING: re-throw so callers can handle it too
  }
};

export default {
  delay,
  waitForAnimation,
  chargeAsyncBlast,
  asyncEnemyTurn,
  runParallel,
  loadLevelAsync,
};
