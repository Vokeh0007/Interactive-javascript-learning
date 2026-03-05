/**
 * TEACHING CONCEPT: Closures, Modules, Array Manipulation, Pub/Sub Pattern
 *
 * Logger demonstrates:
 *   - Module pattern using closure (private _entries, _subscribers)
 *   - Array.push() for appending entries
 *   - Array.slice() to bound the log size (no mutation of original)
 *   - Array.filter() to remove a subscriber (immutable remove)
 *   - Objects with timestamps (Date API)
 *   - Pub/Sub: subscribers notified on every new log entry
 */

const MAX_LOG_ENTRIES = 60;

/**
 * Creates a single log entry object.
 * TEACHING: Factory function — a function that returns a new object.
 */
const createLogEntry = (action, type = 'info', data = null) => ({
  id: Date.now() + Math.random(),
  timestamp: new Date().toISOString(),
  timeLabel: new Date().toLocaleTimeString(),
  action,
  type,   // 'info' | 'action' | 'error' | 'system' | 'async' | 'hof'
  data,
});

// ─── Private state (closure variables) ───────────────────────────────────────
let _entries = [];        // TEACHING: Array used as a log buffer
let _subscribers = [];    // TEACHING: Array of subscriber functions

// ─── Public API ───────────────────────────────────────────────────────────────
const Logger = {
  /**
   * Append a log entry and notify subscribers.
   * TEACHING: Array.push(), conditional array replacement with slice().
   */
  log(action, type = 'info', data = null) {
    const entry = createLogEntry(action, type, data);
    _entries.push(entry);

    // Keep the log bounded — slice returns a NEW array (no mutation of original)
    if (_entries.length > MAX_LOG_ENTRIES) {
      _entries = _entries.slice(-MAX_LOG_ENTRIES);
    }

    this._notify(entry);
    return entry;
  },

  /** Return a shallow copy — callers cannot mutate internal state. */
  getEntries() {
    return [..._entries];
  },

  /** Return the last N entries using Array.slice(). */
  getLastN(n) {
    return _entries.slice(-n);
  },

  /** Clear all entries. */
  clear() {
    _entries = [];
    this._notify(null);
  },

  /**
   * Subscribe to log updates.
   * TEACHING: Functions as first-class values (fn stored in array).
   * Returns an unsubscribe function — demonstrates closures over fn reference.
   */
  subscribe(fn) {
    _subscribers.push(fn);
    return () => {
      // TEACHING: Array.filter() returns a new array excluding fn
      _subscribers = _subscribers.filter(s => s !== fn);
    };
  },

  /** Notify all subscribers — forEach higher-order function. */
  _notify(entry) {
    _subscribers.forEach(fn => fn(entry, _entries));
  },
};

export default Logger;
