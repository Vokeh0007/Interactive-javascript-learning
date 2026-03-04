/**
 * TEACHING CONCEPT: DOM Manipulation, Event Listeners, Closures
 *
 * Notifications module demonstrates:
 *   - createElement / appendChild (DOM construction)
 *   - setTimeout with closure (auto-dismiss)
 *   - classList for dynamic styling
 *   - Removing DOM elements safely
 */

// ─── Notification types ───────────────────────────────────────────────────────
export const NOTIFY_TYPES = {
  INFO:    'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR:   'error',
  XP:      'xp',
  LEVEL_UP:'levelup',
};

// ─── Internal state ───────────────────────────────────────────────────────────
let _container = null;

/** Lazily get or create the notification container. */
const getContainer = () => {
  if (!_container) {
    _container = document.getElementById('notification-container');
  }
  return _container;
};

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Show a toast notification.
 * TEACHING: Creates a DOM element, sets content, appends, then removes after delay.
 *
 * @param {string} message  - Notification text
 * @param {string} type     - One of NOTIFY_TYPES
 * @param {number} duration - Auto-dismiss delay in ms (0 = sticky)
 */
export const showNotification = (message, type = NOTIFY_TYPES.INFO, duration = 3000) => {
  const container = getContainer();
  if (!container) return;

  // TEACHING: createElement + setting properties
  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.setAttribute('role', 'status');

  // Icon map — object as lookup table
  const icons = {
    [NOTIFY_TYPES.INFO]:     'ℹ️',
    [NOTIFY_TYPES.SUCCESS]:  '✅',
    [NOTIFY_TYPES.WARNING]:  '⚠️',
    [NOTIFY_TYPES.ERROR]:    '❌',
    [NOTIFY_TYPES.XP]:       '⭐',
    [NOTIFY_TYPES.LEVEL_UP]: '🆙',
  };

  el.innerHTML = `<span class="notif-icon">${icons[type] || 'ℹ️'}</span>
<span class="notif-text">${message}</span>
<button class="notif-close" aria-label="Dismiss">✕</button>`;

  // TEACHING: addEventListener — closure captures `el`
  el.querySelector('.notif-close').addEventListener('click', () => dismiss(el));

  container.appendChild(el);

  // Trigger CSS enter animation
  requestAnimationFrame(() => el.classList.add('notification-visible'));

  // TEACHING: setTimeout stores a timer reference (closure over `el`)
  if (duration > 0) {
    setTimeout(() => dismiss(el), duration);
  }

  return el;
};

/** Remove a notification with a fade-out animation. */
const dismiss = (el) => {
  if (!el || !el.parentNode) return;
  el.classList.remove('notification-visible');
  el.classList.add('notification-hiding');
  // TEACHING: setTimeout — wait for CSS transition, then remove from DOM
  setTimeout(() => el.parentNode && el.parentNode.removeChild(el), 300);
};

export const showXP = (amount) =>
  showNotification(`+${amount} XP`, NOTIFY_TYPES.XP, 2500);

export const showLevelUp = (newLevel) =>
  showNotification(`🎉 Level Up! Now Lv.${newLevel}`, NOTIFY_TYPES.LEVEL_UP, 4000);

export const showSuccess = (msg) =>
  showNotification(msg, NOTIFY_TYPES.SUCCESS, 3000);

export const showError = (msg) =>
  showNotification(msg, NOTIFY_TYPES.ERROR, 3500);

export const showInfo = (msg) =>
  showNotification(msg, NOTIFY_TYPES.INFO, 2500);

export default {
  showNotification,
  showXP,
  showLevelUp,
  showSuccess,
  showError,
  showInfo,
  NOTIFY_TYPES,
};
