/**
 * TEACHING CONCEPT: Objects, State Management, Observer Pattern
 *
 * GameState demonstrates:
 *   - Objects as central state containers
 *   - Spread operator for immutable state updates  ({ ...state, ...updates })
 *   - Pub/Sub pattern (subscribe / notify)
 *   - Factory function that returns an initial state object
 *   - Call-stack simulation for teaching mode
 */

import Logger from '../utils/logger.js';

// ─── Game phase constants ──────────────────────────────────────────────────────
// TEACHING: Object as an enum (named constants, no magic strings)
export const GAME_PHASES = {
  MENU:           'MENU',
  LOADING:        'LOADING',
  PLAYER_TURN:    'PLAYER_TURN',
  ENEMY_TURN:     'ENEMY_TURN',
  EXERCISE:       'EXERCISE',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER:      'GAME_OVER',
};

// ─── Initial state factory ────────────────────────────────────────────────────
// TEACHING: Factory function — returns a FRESH object each time (no shared ref)
const createInitialState = () => ({
  phase:           GAME_PHASES.MENU,
  currentLevel:    1,
  player:          null,
  enemies:         [],       // TEACHING: Array of enemy objects
  inventory:       [],       // TEACHING: Array-based inventory
  completedLevels: [],
  earnedBadges:    [],
  totalXP:         0,
  currentTurn:     0,
  isTurnAnimating: false,
  callStack:       [],       // TEACHING: Simulated JS call stack
  asyncTimeline:   [],       // TEACHING: Async event timeline
  lastAction:      null,
});

// ─── Private state ────────────────────────────────────────────────────────────
let _state = createInitialState();
// TEACHING: Object whose values are arrays of callback functions
let _subscribers = {};

// ─── Public GameState API ─────────────────────────────────────────────────────
const GameState = {
  /**
   * Return a shallow copy of state.
   * TEACHING: Spread operator creates a new object — callers can't mutate internals.
   */
  getState() {
    return { ..._state };
  },

  /** Read a single key. */
  get(key) {
    return _state[key];
  },

  /**
   * Partial state update (like React setState).
   * TEACHING: Spread merges two objects; only changed keys are published.
   */
  setState(updates) {
    const prevState = { ..._state };
    _state = { ..._state, ...updates };

    Logger.log(`State updated: [${Object.keys(updates).join(', ')}]`, 'system');

    // Notify key-specific subscribers
    Object.keys(updates).forEach(key => {
      (_subscribers[key] || []).forEach(fn => fn(_state[key], prevState[key]));
    });

    // Notify wildcard subscribers
    (_subscribers['*'] || []).forEach(fn =>
      fn(_state, prevState, Object.keys(updates))
    );
  },

  /**
   * Subscribe to state changes.
   * @param {string}   key - State key to watch, or '*' for any change
   * @param {Function} fn  - Callback(newValue, oldValue) or (newState, prevState, changedKeys)
   * @returns {Function} Unsubscribe function (closure)
   */
  subscribe(key, fn) {
    if (!_subscribers[key]) _subscribers[key] = [];
    _subscribers[key].push(fn);
    return () => {
      _subscribers[key] = _subscribers[key].filter(s => s !== fn);
    };
  },

  /** Hard reset (e.g., return to main menu). */
  reset() {
    _state       = createInitialState();
    _subscribers = {};
    Logger.clear();
    Logger.log('Game state reset', 'system');
  },

  // ── Call-stack simulation (teaching mode) ────────────────────────────────
  /**
   * Push a frame onto the simulated call stack.
   * TEACHING: Spread creates a new array rather than mutating the old one.
   */
  pushCallStack(fnName, args = []) {
    const frame = { id: Date.now(), fnName, args, timestamp: Date.now() };
    const callStack = [...(_state.callStack || []), frame];
    this.setState({ callStack });
    return frame;
  },

  /** Pop the top frame from the simulated call stack. */
  popCallStack() {
    const callStack = (_state.callStack || []).slice(0, -1);
    this.setState({ callStack });
  },

  /** Add an async event to the timeline visualization. */
  addAsyncEvent(event) {
    const asyncTimeline = [
      ...(_state.asyncTimeline || []),
      { ...event, timestamp: Date.now() },
    ];
    this.setState({ asyncTimeline });
  },
};

export default GameState;
