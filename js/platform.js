/**
 * platform.js — JavaScript Learning Platform controller
 *
 * Handles:
 *  - Curriculum dashboard rendering
 *  - Lesson view rendering (concept, analogy, explanation, code, challenge)
 *  - Interactive exercise runner (eval-based sandbox)
 *  - Progress persistence via localStorage
 *  - Module navigation
 */

import { LEVELS } from './data/levels.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'jslp_progress_v1';
const TOTAL       = LEVELS.length;

// ─── State ────────────────────────────────────────────────────────────────────
let _currentModuleId  = 1;
let _completedModules = [];   // array of module IDs the user has completed
let _currentStarterCode = ''; // original starter code for reset

// ─── Progress persistence ─────────────────────────────────────────────────────
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.completed)) _completedModules = data.completed;
    }
  } catch (_) { /* ignore */ }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: _completedModules }));
  } catch (_) { /* ignore */ }
}

function markCompleted(moduleId) {
  if (!_completedModules.includes(moduleId)) {
    _completedModules.push(moduleId);
    saveProgress();
  }
}

function isCompleted(moduleId) {
  return _completedModules.includes(moduleId);
}

/** Module N is accessible if it's module 1 OR module N-1 has been completed */
function isAccessible(moduleId) {
  if (moduleId === 1) return true;
  return _completedModules.includes(moduleId - 1);
}

// ─── Syntax highlighting (ported from teachingPanel.js) ───────────────────────
// Uses a character-by-character tokenizer to avoid false matches inside <span>
// attributes — keyword 'const' inside a highlighted string won't be re-matched.
const KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for','while','do',
  'switch','case','break','continue','new','class','extends','import','export',
  'default','try','catch','finally','throw','typeof','instanceof','void',
  'delete','in','of','this','super','async','await','true','false','null',
  'undefined','from','static','get','set',
]);

function syntaxHighlight(code) {
  let out    = '';
  let i      = 0;
  const len  = code.length;

  const peek = (n = 1) => code.slice(i, i + n);
  const esc  = (ch) =>
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch;

  while (i < len) {
    // ── Single-line comment ──────────────────────────────────────────────
    if (peek(2) === '//') {
      let comment = '';
      while (i < len && code[i] !== '\n') comment += code[i++];
      out += `<span class="sh-comment">${comment.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
      continue;
    }
    // ── Multi-line comment ───────────────────────────────────────────────
    if (peek(2) === '/*') {
      let comment = '';
      while (i < len && peek(2) !== '*/') comment += code[i++];
      // consume '*/' with bounds check
      if (i < len) comment += code[i++];
      if (i < len) comment += code[i++];
      out += `<span class="sh-comment">${comment.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
      continue;
    }
    // ── Template literal ─────────────────────────────────────────────────
    if (code[i] === '`') {
      let str = code[i++];
      while (i < len && code[i] !== '`') {
        if (code[i] === '\\') str += code[i++];
        if (i < len) str += code[i++];
      }
      // consume closing backtick with bounds check
      if (i < len) str += code[i++];
      out += `<span class="sh-string">${str.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
      continue;
    }
    // ── String literals ───────────────────────────────────────────────────
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let str = code[i++];
      while (i < len && code[i] !== q) {
        if (code[i] === '\\') str += code[i++];
        if (i < len) str += code[i++];
      }
      // consume closing quote with bounds check
      if (i < len) str += code[i++];
      out += `<span class="sh-string">${str.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
      continue;
    }
    // ── Numbers ───────────────────────────────────────────────────────────
    if (/[0-9]/.test(code[i]) && !/[a-zA-Z_$]/.test(out.slice(-1))) {
      let num = '';
      while (i < len && /[0-9._]/.test(code[i])) num += code[i++];
      out += `<span class="sh-number">${num}</span>`;
      continue;
    }
    // ── Identifiers / keywords ────────────────────────────────────────────
    if (/[a-zA-Z_$]/.test(code[i])) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_$]/.test(code[i])) word += code[i++];
      if (KEYWORDS.has(word)) {
        out += `<span class="sh-keyword">${word}</span>`;
      } else if (i < len && code[i] === '(') {
        out += `<span class="sh-function">${word}</span>`;
      } else {
        out += word;
      }
      continue;
    }
    // ── Everything else ───────────────────────────────────────────────────
    out += esc(code[i++]);
  }
  return out;
}

// ─── Screen switching ─────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ─── Toast notification ───────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const toast = document.createElement('div');
  // Use the existing .notification class family from main.css
  toast.className = `notification notification-${type}`;
  toast.innerHTML = `<span>${message}</span>
    <button class="notif-close" aria-label="Dismiss">✕</button>`;
  toast.querySelector('.notif-close').onclick = () => toast.remove();
  container.appendChild(toast);
  // Animate in
  requestAnimationFrame(() => toast.classList.add('notification-visible'));
  setTimeout(() => {
    toast.classList.remove('notification-visible');
    toast.classList.add('notification-hiding');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function renderDashboard() {
  showScreen('dashboard-screen');
  const grid = document.getElementById('module-grid');
  if (!grid) return;

  const done = _completedModules.length;
  const pct  = Math.round((done / TOTAL) * 100);

  // Update header progress
  const txt = document.getElementById('dash-progress-text');
  if (txt) txt.textContent = `${done} / ${TOTAL} modules completed`;

  // Update progress bar
  const bar   = document.getElementById('dash-progress-bar');
  const label = document.getElementById('dash-progress-label');
  if (bar)   bar.style.width = `${pct}%`;
  if (label) label.textContent = `${pct}%`;

  // Render module cards
  grid.innerHTML = LEVELS.map(level => {
    const completed   = isCompleted(level.id);
    const accessible  = isAccessible(level.id);
    const locked      = !accessible;

    const statusIcon  = completed ? '✅' : locked ? '🔒' : '▶️';
    const btnLabel    = completed ? 'Review' : locked ? 'Locked' : 'Start';
    const cardClass   = `module-card${completed ? ' module-completed' : ''}${locked ? ' module-locked' : ''}`;

    return `<div class="${cardClass}" role="listitem" data-module="${level.id}"
                 tabindex="${locked ? -1 : 0}" aria-label="Module ${level.id}: ${level.concept.name}${locked ? ' (locked)' : ''}">
  <div class="module-card-top">
    <span class="module-num">Module ${level.id}</span>
    <span class="module-status-badge">${statusIcon}</span>
  </div>
  <span class="module-icon">${level.concept.icon}</span>
  <div class="module-name">${level.concept.name}</div>
  <div class="module-tagline">${level.concept.tagline}</div>
  <div class="module-card-btn">${btnLabel}</div>
</div>`;
  }).join('');

  // Click handler on grid (event delegation)
  grid.onclick = (e) => {
    const card = e.target.closest('.module-card');
    if (!card || card.classList.contains('module-locked')) return;
    openLesson(parseInt(card.dataset.module, 10));
  };
  grid.onkeydown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.module-card');
    if (!card || card.classList.contains('module-locked')) return;
    e.preventDefault();
    openLesson(parseInt(card.dataset.module, 10));
  };
}

// ─── Open a lesson ────────────────────────────────────────────────────────────
function openLesson(moduleId) {
  _currentModuleId = moduleId;
  renderLesson(moduleId);
  showScreen('lesson-screen');
  // Scroll content to top
  const content = document.getElementById('lesson-content');
  if (content) content.scrollTop = 0;
}

// ─── Lesson rendering ─────────────────────────────────────────────────────────
function renderLesson(moduleId) {
  const level = LEVELS.find(l => l.id === moduleId);
  if (!level) return;
  const { concept, exercise } = level;

  // ── Header bar ──────────────────────────────────────────────────────────
  const numEl    = document.getElementById('lesson-module-num');
  const titleEl  = document.getElementById('lesson-header-title');
  const progEl   = document.getElementById('lesson-progress-text');
  if (numEl)   numEl.textContent   = `Module ${moduleId}`;
  if (titleEl) titleEl.textContent = concept.name;
  if (progEl)  progEl.textContent  = `${moduleId} / ${TOTAL}`;

  // ── Concept heading ──────────────────────────────────────────────────────
  const iconEl    = document.getElementById('lesson-concept-icon');
  const nameEl    = document.getElementById('lesson-concept-name');
  const taglineEl = document.getElementById('lesson-concept-tagline');
  if (iconEl)    iconEl.textContent    = concept.icon;
  if (nameEl)    nameEl.textContent    = concept.name;
  if (taglineEl) taglineEl.textContent = concept.tagline;

  // ── Analogy box ──────────────────────────────────────────────────────────
  const analogyEl = document.getElementById('lesson-analogy-text');
  if (analogyEl) {
    analogyEl.innerHTML = concept.analogy || '';
    const box = document.getElementById('lesson-analogy');
    if (box) box.style.display = concept.analogy ? '' : 'none';
  }

  // ── Explanation ──────────────────────────────────────────────────────────
  const explEl = document.getElementById('lesson-explanation');
  if (explEl) explEl.innerHTML = concept.explanation || '';

  // ── Code example ─────────────────────────────────────────────────────────
  const codeEl    = document.getElementById('lesson-code-example');
  const codeSect  = document.getElementById('lesson-code-section');
  if (concept.codeExample) {
    if (codeEl)   codeEl.innerHTML   = syntaxHighlight(concept.codeExample);
    if (codeSect) codeSect.style.display = '';
  } else {
    if (codeSect) codeSect.style.display = 'none';
  }

  // ── Challenge ────────────────────────────────────────────────────────────
  if (exercise) {
    document.getElementById('challenge-title').textContent       = exercise.title;
    document.getElementById('challenge-xp').textContent          = `+${exercise.xpReward} XP`;
    document.getElementById('challenge-description').innerHTML   = exercise.description;
    const prefix  = document.getElementById('challenge-prefix');
    const suffix  = document.getElementById('challenge-suffix');
    const input   = document.getElementById('challenge-input');
    const hintTxt = document.getElementById('challenge-hint-text');
    if (prefix)  prefix.textContent  = exercise.prefix  || '';
    if (suffix)  suffix.textContent  = exercise.suffix  || '';
    if (input)   input.value         = exercise.starterCode || '';
    if (hintTxt) hintTxt.textContent = exercise.hint    || '';
    _currentStarterCode = exercise.starterCode || '';

    // Reset feedback and hint visibility
    const fb   = document.getElementById('challenge-feedback');
    const hint = document.getElementById('challenge-hint');
    if (fb)   fb.innerHTML = '';
    if (hint) hint.classList.add('hidden');

    const challengeSection = document.getElementById('challenge-section');
    if (challengeSection) challengeSection.style.display = '';
  } else {
    const challengeSection = document.getElementById('challenge-section');
    if (challengeSection) challengeSection.style.display = 'none';
  }

  // ── Sidebar navigation ───────────────────────────────────────────────────
  renderSidebar(moduleId);

  // ── Prev / Next buttons ──────────────────────────────────────────────────
  const prevBtn = document.getElementById('btn-prev-module');
  const nextBtn = document.getElementById('btn-next-module');
  if (prevBtn) {
    prevBtn.disabled = moduleId <= 1;
    prevBtn.style.opacity = moduleId <= 1 ? '0.3' : '';
  }
  if (nextBtn) {
    const isLast     = moduleId >= TOTAL;
    const nextLocked = !isAccessible(moduleId + 1);
    nextBtn.textContent = isLast ? 'Finish Course 🎓' : 'Next Module →';
    nextBtn.disabled = false;   // always visible; marking complete happens on click
  }
}

function renderSidebar(activeModuleId) {
  const list = document.getElementById('nav-module-list');
  if (!list) return;

  list.innerHTML = LEVELS.map(level => {
    const completed  = isCompleted(level.id);
    const accessible = isAccessible(level.id);
    const locked     = !accessible;
    const active     = level.id === activeModuleId;

    const cls = [
      'nav-module-item',
      'tab-btn',          // class for DOM exercise compatibility
      active     ? 'nav-active'    : '',
      completed  ? 'nav-completed' : '',
      locked     ? 'nav-locked'    : '',
    ].filter(Boolean).join(' ');

    const statusIcon = completed ? '✅' : locked ? '🔒' : active ? '▶' : '';

    return `<li class="${cls}" data-module="${level.id}"
               tabindex="${locked ? -1 : 0}"
               role="listitem"
               aria-label="Module ${level.id}: ${level.concept.name}${locked ? ' (locked)' : ''}${completed ? ' (completed)' : ''}">
  <span class="nav-item-icon">${level.concept.icon}</span>
  <span class="nav-item-label">${level.concept.name}</span>
  <span class="nav-item-status">${statusIcon}</span>
</li>`;
  }).join('');

  // Click / keyboard navigation
  list.onclick = (e) => {
    const item = e.target.closest('.nav-module-item');
    if (!item || item.classList.contains('nav-locked')) return;
    openLesson(parseInt(item.dataset.module, 10));
  };
  list.onkeydown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.nav-module-item');
    if (!item || item.classList.contains('nav-locked')) return;
    e.preventDefault();
    openLesson(parseInt(item.dataset.module, 10));
  };
}

// ─── Exercise runner ──────────────────────────────────────────────────────────
/**
 * TEACHING: eval() runs the student's code — used here in a controlled
 * educational sandbox. Never use eval() with untrusted input in production!
 *
 * FIX: convert const/let → var so that eval() exposes declarations
 * to the enclosing test-function scope (const/let are block-scoped in eval).
 */
function runExercise() {
  const level = LEVELS.find(l => l.id === _currentModuleId);
  if (!level?.exercise) return;

  const exercise = level.exercise;
  const inputEl  = document.getElementById('challenge-input');
  const code     = (inputEl?.value || '').trim();

  const fullCode = (exercise.prefix || '') + '\n' + code + '\n' + (exercise.suffix || '');
  // NOTE: This simple regex substitution replaces `const`/`let` globally.
  // It may affect keywords inside string literals in edge cases, but it is
  // an acceptable trade-off for this educational sandbox (same approach used
  // in the original renderer.js). A full AST transform would be overkill here.
  const execCode = fullCode
    .replace(/\bconst\b/g, 'var')
    .replace(/\blet\b/g, 'var');

  let result;
  try {
    // eslint-disable-next-line no-new-func
    const testFunc = new Function('code', exercise.testFn);
    result = testFunc(execCode);
  } catch (err) {
    result = { pass: false, message: `❌ Runtime error: ${err.message}` };
  }

  showChallengeFeedback(result);

  if (result.pass) {
    markCompleted(_currentModuleId);
    showToast(`+${exercise.xpReward} XP  🎉`, 'success');
    // Re-render sidebar to show ✅
    renderSidebar(_currentModuleId);
    // Update dashboard progress lazily (will update when navigating back)
  }
}

function showChallengeFeedback(result) {
  const fb = document.getElementById('challenge-feedback');
  if (!fb) return;
  fb.innerHTML = `<div class="feedback ${result.pass ? 'feedback-pass' : 'feedback-fail'}">${result.message}</div>`;
}

// ─── Wiring DOM events ────────────────────────────────────────────────────────
function wireEvents() {
  // Back to dashboard
  document.getElementById('btn-back-dashboard')?.addEventListener('click', () => {
    renderDashboard();
  });

  // Run challenge
  document.getElementById('btn-run-challenge')?.addEventListener('click', () => {
    runExercise();
  });

  // Show hint
  document.getElementById('btn-show-hint')?.addEventListener('click', () => {
    document.getElementById('challenge-hint')?.classList.remove('hidden');
  });

  // Reset challenge to starter code
  document.getElementById('btn-reset-challenge')?.addEventListener('click', () => {
    const input = document.getElementById('challenge-input');
    if (input) input.value = _currentStarterCode;
    const fb = document.getElementById('challenge-feedback');
    if (fb) fb.innerHTML = '';
  });

  // Prev module
  document.getElementById('btn-prev-module')?.addEventListener('click', () => {
    if (_currentModuleId > 1) openLesson(_currentModuleId - 1);
  });

  // Next module
  document.getElementById('btn-next-module')?.addEventListener('click', () => {
    // Mark current as completed if not already (allows skipping)
    markCompleted(_currentModuleId);

    if (_currentModuleId >= TOTAL) {
      // Course complete!
      renderDashboard();
      showToast('🎓 Congratulations! You completed the JavaScript course!', 'success');
    } else {
      openLesson(_currentModuleId + 1);
    }
  });

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run code
  document.getElementById('challenge-input')?.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runExercise();
    }
  });
}

// ─── Entry point ─────────────────────────────────────────────────────────────
export function initPlatform() {
  loadProgress();
  wireEvents();
  renderDashboard();
}
