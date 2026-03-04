/**
 * TEACHING CONCEPT: DOM Manipulation, Event-Driven Programming, Module Pattern
 *
 * Renderer is the single module responsible for all DOM updates.
 * It demonstrates:
 *   - Separation of logic (engine) from presentation (renderer)
 *   - querySelector / getElementById for element selection
 *   - innerHTML / textContent for content updates
 *   - classList for toggling CSS states
 *   - addEventListener for user interaction
 *   - Template literals for constructing HTML strings
 *   - Subscribing to GameState (observer pattern binding)
 */

import GameState, { GAME_PHASES } from '../state/gameState.js';
import Logger                      from '../utils/logger.js';
import LEVELS                      from '../data/levels.js';
import { PLAYER_ABILITIES }        from '../entities/player.js';
import { getLivingEnemies }        from '../entities/enemy.js';
import { renderConceptModal }      from './teachingPanel.js';
import { showXP, showLevelUp, showSuccess, showError, showInfo } from './notifications.js';

// ─── Cached DOM element refs ──────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── Screen management ────────────────────────────────────────────────────────
const showScreen = (screenId) => {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const screen = $(screenId);
  if (screen) screen.classList.add('active');
};

// ─── Menu screen ──────────────────────────────────────────────────────────────
export const renderMenu = (completedLevels = []) => {
  showScreen('menu-screen');

  const levelMap = $('level-map');
  if (!levelMap) return;

  levelMap.innerHTML = LEVELS.map(level => {
    const completed = completedLevels.includes(level.id);
    const locked    = level.id > 1 && !completedLevels.includes(level.id - 1);
    return `<div class="level-card ${completed ? 'completed' : ''} ${locked ? 'locked' : ''}"
              data-level="${level.id}" role="button" tabindex="${locked ? -1 : 0}"
              aria-label="Level ${level.id}: ${level.title}${locked ? ' (locked)' : ''}">
  <div class="level-num">${level.id}</div>
  <div class="level-icon">${level.concept.icon}</div>
  <div class="level-title">${level.title}</div>
  <div class="level-concept">${level.concept.name}</div>
  <div class="level-status">${completed ? '✅' : locked ? '🔒' : '▶️'}</div>
</div>`;
  }).join('');
};

// ─── Player stats bar ─────────────────────────────────────────────────────────
export const renderPlayerStats = (player) => {
  if (!player) return;

  const setText  = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
  const setWidth = (id, pct) => { const e = $(id); if (e) e.style.width = `${Math.max(0, Math.min(100, pct))}%`; };
  const setClass = (id, cls, cond) => {
    const e = $(id);
    if (e) cond ? e.classList.add(cls) : e.classList.remove(cls);
  };

  // TEACHING: Compute derived values directly — do NOT rely on spread getters
  // because { ...player, hp: newHp } creates plain properties, not getters
  const hpPercent = player.maxHp > 0 ? Math.floor((player.hp / player.maxHp) * 100) : 0;
  const mpPercent = player.maxMp > 0 ? Math.floor((player.mp / player.maxMp) * 100) : 0;
  const xpPercent = player.xpToNextLevel > 0
    ? Math.floor((player.xp / player.xpToNextLevel) * 100) : 0;

  setText('player-hp-text', `${player.hp}/${player.maxHp}`);
  setText('player-mp-text', `${player.mp}/${player.maxMp}`);
  setText('player-xp-text', `${player.xp}/${player.xpToNextLevel}`);

  setWidth('player-hp-bar', hpPercent);
  setWidth('player-mp-bar', mpPercent);
  setWidth('player-xp-bar', xpPercent);

  // Color coding for low HP
  setClass('player-hp-bar', 'bar-critical', hpPercent < 25);
  setClass('player-hp-bar', 'bar-low',      hpPercent < 50 && hpPercent >= 25);

  setText('player-name-display', player.name);
  setText('player-display-name', player.name);
  setText('player-hp-display', `❤️ ${player.hp}`);
  setText('player-mp-display', `💙 ${player.mp}`);

  // Level badge
  const lb = $('level-badge');
  if (lb) lb.textContent = `Level ${player.level}`;

  // Status effects
  renderPlayerStatusEffects(player.statusEffects);
};

const renderPlayerStatusEffects = (effects) => {
  const container = $('player-status-effects');
  if (!container) return;
  if (!effects || effects.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = effects.map(e =>
    `<span class="status-effect" title="${e.name} (${e.duration} turns)">${e.icon || '⚡'}</span>`
  ).join('');
};

// ─── Battlefield ──────────────────────────────────────────────────────────────
export const renderEnemies = (enemies) => {
  const zone = $('enemy-zone');
  if (!zone) return;

  if (!enemies || enemies.length === 0) {
    zone.innerHTML = '<div class="no-enemies">// enemies = []</div>';
    return;
  }

  zone.innerHTML = enemies.map(enemy => {
    const hpPct = Math.max(0, Math.floor((enemy.hp / enemy.maxHp) * 100));
    const alive = enemy.hp > 0;
    return `<div class="entity-card enemy-card ${enemy.isBoss ? 'boss-card' : ''} ${alive ? '' : 'dead-card'}"
              data-enemy-id="${enemy.instanceId}" role="button" tabindex="0"
              aria-label="${enemy.name}, HP ${enemy.hp}">
  <div class="entity-sprite ${enemy.isBoss ? 'boss-sprite' : ''}">${enemy.sprite}</div>
  <div class="entity-name">${enemy.name}</div>
  ${enemy.isBoss ? '<div class="boss-label">BOSS</div>' : ''}
  <div class="enemy-hp-bar-wrap">
    <div class="enemy-hp-bar ${hpPct < 30 ? 'hp-low' : ''}" style="width:${hpPct}%"></div>
  </div>
  <div class="entity-stats">
    <span class="enemy-hp-text">❤️ ${enemy.hp}/${enemy.maxHp}</span>
  </div>
  ${enemy.statusEffects && enemy.statusEffects.length > 0
    ? `<div class="status-effects">${enemy.statusEffects.map(e =>
        `<span class="status-effect" title="${e.name}">${e.icon || '🔥'}</span>`).join('')}</div>`
    : ''}
  ${!alive ? '<div class="dead-overlay">💀</div>' : ''}
</div>`;
  }).join('');
};

// ─── Damage float numbers ─────────────────────────────────────────────────────
/**
 * Show a floating damage number over an entity card.
 * TEACHING: Uses DOM createElement, CSS animations, and setTimeout.
 */
export const showDamageFloat = (entityId, amount, isCrit = false) => {
  const card = document.querySelector(`[data-enemy-id="${entityId}"]`)
             || document.getElementById('player-card');
  if (!card) return;

  card.classList.remove('hit');
  void card.offsetWidth; // force reflow to restart animation
  card.classList.add('hit');

  const float = document.createElement('div');
  float.className = `damage-float${isCrit ? ' crit' : ''}`;
  float.textContent = `-${amount}`;
  card.appendChild(float);

  // TEACHING: setTimeout with closure — remove element after animation ends
  setTimeout(() => float.remove(), 900);
};

/** Flash the player card when taking a hit. */
export const flashPlayerHit = () => {
  const card = document.getElementById('player-card');
  if (!card) return;
  card.classList.remove('player-hit');
  void card.offsetWidth;
  card.classList.add('player-hit');
};

// ─── Combat log ───────────────────────────────────────────────────────────────
const MAX_LOG_DISPLAY = 50;
let _logEntries = [];

export const appendCombatLog = (message, type = 'info') => {
  _logEntries.push({ message, type, time: new Date().toLocaleTimeString() });
  if (_logEntries.length > MAX_LOG_DISPLAY) {
    _logEntries = _logEntries.slice(-MAX_LOG_DISPLAY);
  }

  const log = $('log-entries');
  if (!log) return;

  const entry = document.createElement('div');
  entry.className = `log-entry log-entry-${type}`;
  entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString()}</span>
<span class="log-msg">${message}</span>`;

  log.appendChild(entry);
  log.scrollTop = log.scrollHeight; // auto-scroll
};

export const clearCombatLog = () => {
  _logEntries = [];
  const log = $('log-entries');
  if (log) log.innerHTML = '';
};

// ─── Action buttons ───────────────────────────────────────────────────────────
export const renderActionButtons = (player) => {
  const container = $('action-buttons');
  if (!container || !player) return;

  const abilities = PLAYER_ABILITIES.filter(a =>
    player.abilities.includes(a.id)
  );

  container.innerHTML = abilities.map(a => {
    const hasMP   = player.mp >= a.mpCost;
    const tooltip = `${a.description} (${a.mpCost > 0 ? a.mpCost + ' MP' : 'free'})`;
    return `<button class="btn btn-action ${!hasMP ? 'btn-disabled' : ''}"
              data-ability="${a.id}"
              ${!hasMP ? 'disabled' : ''}
              title="${tooltip}"
              aria-label="${a.name}: ${tooltip}">
  <span class="action-icon">${a.icon}</span>
  <span class="action-name">${a.name}</span>
  ${a.mpCost > 0 ? `<span class="action-cost">${a.mpCost}MP</span>` : ''}
</button>`;
  }).join('');
};

// ─── Inventory preview ────────────────────────────────────────────────────────
export const renderInventoryPreview = (inventory) => {
  const container = $('inventory-items');
  if (!container) return;

  const consumables = inventory ? inventory.filter(i => i.type === 'consumable') : [];

  if (consumables.length === 0) {
    container.innerHTML = '<span class="inv-empty">empty</span>';
    return;
  }

  container.innerHTML = consumables.map(item =>
    `<button class="inv-item-btn" data-item="${item.id}"
              title="${item.description}" aria-label="Use ${item.name}">
  ${item.icon} <span class="inv-qty">×${item.quantity}</span>
</button>`
  ).join('');
};

// ─── Concept banner ───────────────────────────────────────────────────────────
export const renderConceptBanner = (levelData) => {
  if (!levelData) return;
  const { concept } = levelData;

  const iconEl     = $('concept-icon');
  const titleEl    = $('concept-title');
  const subtitleEl = $('concept-subtitle');

  if (iconEl)     iconEl.textContent     = concept.icon;
  if (titleEl)    titleEl.textContent    = concept.name;
  if (subtitleEl) subtitleEl.textContent = concept.tagline;
};

// ─── Level badge ──────────────────────────────────────────────────────────────
export const renderLevelBadge = (levelId) => {
  const badge = $('level-badge');
  if (badge) badge.textContent = `Level ${levelId}`;
};

// ─── Level Complete modal ─────────────────────────────────────────────────────
export const showLevelCompleteModal = (levelData, player) => {
  const modal     = $('level-complete-modal');
  const rewards   = $('level-rewards');
  const mastered  = $('concept-mastered');
  if (!modal) return;

  if (rewards) {
    rewards.innerHTML = levelData.rewards.map(r => {
      if (r.type === 'item')  return `<div class="reward-item">📦 ${r.itemId} ×${r.quantity || 1}</div>`;
      if (r.type === 'gold')  return `<div class="reward-item">💰 ${r.amount} gold</div>`;
      if (r.type === 'badge') return `<div class="reward-item">${r.icon} ${r.name}</div>`;
      return '';
    }).join('');
  }

  if (mastered) {
    mastered.innerHTML = `<span class="mastered-icon">${levelData.concept.icon}</span>
<span class="mastered-name">${levelData.concept.name}</span>`;
  }

  modal.hidden = false;
};

export const hideLevelCompleteModal = () => {
  const modal = $('level-complete-modal');
  if (modal) modal.hidden = true;
};

// ─── Game Over modal ──────────────────────────────────────────────────────────
export const showGameOverModal = (message) => {
  const modal = $('game-over-modal');
  const msg   = $('game-over-message');
  if (modal) modal.hidden = false;
  if (msg)   msg.textContent = message || 'Your hero has fallen.';
};

export const hideGameOverModal = () => {
  const modal = $('game-over-modal');
  if (modal) modal.hidden = true;
};

// ─── Exercise modal ───────────────────────────────────────────────────────────
export const showExerciseModal = (exercise) => {
  if (!exercise) return;

  const modal = $('exercise-modal');
  const title = $('exercise-title');
  const desc  = $('exercise-description');
  const prefix = $('exercise-prefix');
  const input  = $('exercise-input');
  const suffix = $('exercise-suffix');
  const badge  = $('exercise-badge');
  const hint   = $('hint-text');

  if (title)  title.textContent  = exercise.title;
  if (desc)   desc.textContent   = exercise.description;
  if (prefix) prefix.textContent = exercise.prefix  || '';
  if (input)  input.value        = exercise.starterCode || '';
  if (suffix) suffix.textContent = exercise.suffix  || '';
  if (badge)  badge.textContent  = `+${exercise.xpReward} XP`;
  if (hint)   hint.textContent   = exercise.hint    || '';

  const feedback = $('exercise-feedback');
  if (feedback) feedback.innerHTML = '';
  const hintDiv = $('exercise-hint');
  if (hintDiv) hintDiv.classList.add('hidden');

  if (modal) modal.hidden = false;
};

export const hideExerciseModal = () => {
  const modal = $('exercise-modal');
  if (modal) modal.hidden = true;
};

export const showExerciseFeedback = (result, proceedsToNextLevel = false) => {
  const fb = $('exercise-feedback');
  if (!fb) return;
  const nextBtn = result.pass && proceedsToNextLevel
    ? `<button class="btn btn-primary btn-xs btn-next-after-exercise" style="margin-top:8px">Next Level →</button>`
    : '';
  fb.innerHTML = `<div class="feedback ${result.pass ? 'feedback-pass' : 'feedback-fail'}">
  ${result.message}${nextBtn}
</div>`;
};

// ─── Disable/enable actions during animation ──────────────────────────────────
export const setActionsDisabled = (disabled) => {
  const container = $('action-buttons');
  if (!container) return;
  container.querySelectorAll('button').forEach(btn => {
    btn.disabled = disabled || btn.classList.contains('btn-disabled');
  });
};

// ─── Full game screen render ──────────────────────────────────────────────────
export const renderGameScreen = (state) => {
  showScreen('game-screen');

  const levelData = LEVELS.find(l => l.id === state.currentLevel);

  renderLevelBadge(state.currentLevel);
  renderPlayerStats(state.player);
  renderEnemies(state.enemies);
  renderActionButtons(state.player);
  renderInventoryPreview(state.inventory);
  if (levelData) renderConceptBanner(levelData);
};

// ─── Subscribe to state and auto-render ───────────────────────────────────────
export const initRenderer = (engine) => {
  // ── Phase transitions ──────────────────────────────────────────────────────
  GameState.subscribe('phase', (phase) => {
    if (phase === GAME_PHASES.MENU) {
      renderMenu(GameState.get('completedLevels') || []);
    }
    if (phase === GAME_PHASES.PLAYER_TURN || phase === GAME_PHASES.ENEMY_TURN) {
      renderGameScreen(GameState.getState());
    }
    if (phase === GAME_PHASES.LEVEL_COMPLETE) {
      const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
      showLevelCompleteModal(levelData, GameState.get('player'));
    }
    if (phase === GAME_PHASES.GAME_OVER) {
      showGameOverModal();
    }
  });

  // ── Live re-renders ────────────────────────────────────────────────────────
  GameState.subscribe('player',    (player)    => {
    renderPlayerStats(player);
    renderActionButtons(player);
  });
  GameState.subscribe('enemies',   (enemies)   => renderEnemies(enemies));
  GameState.subscribe('inventory', (inventory) => renderInventoryPreview(inventory));

  // ── Animation state ────────────────────────────────────────────────────────
  GameState.subscribe('isTurnAnimating', (animating) => setActionsDisabled(animating));

  // ── Logger → combat log ────────────────────────────────────────────────────
  Logger.subscribe((entry) => {
    if (!entry) return;
    if (entry.type === 'action' || entry.type === 'error') {
      appendCombatLog(entry.action, entry.type);
    }
  });

  // ── Wire up all button event listeners ────────────────────────────────────
  _wireButtons(engine);
};

// ─── Exercise advancement flag ────────────────────────────────────────────────
// True when the exercise was triggered from the "Next Level" button in the
// Level Complete modal — closing/skipping it should start the next level.
let _exerciseProceedsToNextLevel = false;

// ─── Button wiring ────────────────────────────────────────────────────────────
const _wireButtons = (engine) => {
  // ── Menu: level card clicks ────────────────────────────────────────────────
  const levelMap = $('level-map');
  if (levelMap) {
    levelMap.addEventListener('click', async (e) => {
      const card = e.target.closest('.level-card');
      if (!card || card.classList.contains('locked')) return;
      const levelId = parseInt(card.dataset.level, 10);
      showScreen('game-screen');
      clearCombatLog();
      await engine.startLevel(levelId);
    });
    // keyboard support
    levelMap.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.level-card');
      if (!card || card.classList.contains('locked')) return;
      const levelId = parseInt(card.dataset.level, 10);
      showScreen('game-screen');
      clearCombatLog();
      await engine.startLevel(levelId);
    });
  }

  // ── Start game button ─────────────────────────────────────────────────────
  const btnStart = $('btn-start-game');
  if (btnStart) {
    btnStart.addEventListener('click', async () => {
      showScreen('game-screen');
      clearCombatLog();
      await engine.startLevel(1);
    });
  }

  // ── Main menu button ──────────────────────────────────────────────────────
  const btnMenu = $('btn-menu');
  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      GameState.setState({ phase: GAME_PHASES.MENU });
    });
  }

  // ── Toggle teaching panel ─────────────────────────────────────────────────
  const btnToggle = $('btn-toggle-panel');
  const panel     = $('teaching-panel');
  if (btnToggle && panel) {
    btnToggle.addEventListener('click', () => {
      panel.classList.toggle('panel-hidden');
      btnToggle.setAttribute('aria-pressed', panel.classList.contains('panel-hidden') ? 'false' : 'true');
    });
  }

  // ── Action button clicks (event delegation) ───────────────────────────────
  const actionButtons = $('action-buttons');
  if (actionButtons) {
    actionButtons.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-ability]');
      if (!btn || btn.disabled) return;
      const abilityId = btn.dataset.ability;
      // Determine target (first living enemy by default)
      const enemies = GameState.get('enemies') || [];
      const firstAlive = getLivingEnemies(enemies)[0];
      await engine.playerAction(abilityId, firstAlive ? firstAlive.instanceId : null);
    });
  }

  // ── Enemy card target selection ───────────────────────────────────────────
  // Store selected target
  let _selectedEnemyId = null;
  const enemyZone = $('enemy-zone');
  if (enemyZone) {
    enemyZone.addEventListener('click', (e) => {
      const card = e.target.closest('.enemy-card');
      if (!card || card.classList.contains('dead-card')) return;
      _selectedEnemyId = card.dataset.enemyId;

      // Highlight selected
      enemyZone.querySelectorAll('.enemy-card').forEach(c =>
        c.classList.remove('enemy-selected')
      );
      card.classList.add('enemy-selected');
    });
  }

  // ── Inventory item use ────────────────────────────────────────────────────
  const inventoryItems = $('inventory-items');
  if (inventoryItems) {
    inventoryItems.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-item]');
      if (!btn) return;
      engine.useItem(btn.dataset.item);
    });
  }

  // ── Learn More button → concept modal ────────────────────────────────────
  const btnLearnMore = $('btn-learn-more');
  if (btnLearnMore) {
    btnLearnMore.addEventListener('click', () => {
      const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
      if (levelData) {
        renderConceptModal(levelData.concept);
        const modal = $('concept-modal');
        if (modal) modal.hidden = false;
      }
    });
  }

  // ── Close concept modal ───────────────────────────────────────────────────
  $('btn-close-concept-modal')?.addEventListener('click', () => {
    const modal = $('concept-modal');
    if (modal) modal.hidden = true;
  });

  // ── Try exercise from concept modal ──────────────────────────────────────
  $('btn-start-exercise')?.addEventListener('click', () => {
    const conceptModal = $('concept-modal');
    if (conceptModal) conceptModal.hidden = true;
    const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
    if (levelData?.exercise) showExerciseModal(levelData.exercise);
  });

  $('btn-skip-exercise')?.addEventListener('click', () => {
    const modal = $('concept-modal');
    if (modal) modal.hidden = true;
  });

  // ── Exercise: run code ────────────────────────────────────────────────────
  $('btn-run-exercise')?.addEventListener('click', () => {
    const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
    if (!levelData?.exercise) return;

    const input    = $('exercise-input');
    const code     = (input?.value || '').trim();
    const exercise = levelData.exercise;

    // Build the full code string (prefix + student code + suffix)
    const fullCode = (exercise.prefix || '') + '\n' + code + '\n' + (exercise.suffix || '');

    // TEACHING: eval() runs the student's code — used here in a controlled
    // educational sandbox. Never use eval() with untrusted input in production!
    //
    // FIX: convert const/let → var so that eval() can expose the declarations
    // to the enclosing test-function scope (const/let are block-scoped in eval).
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

    showExerciseFeedback(result, _exerciseProceedsToNextLevel);

    if (result.pass) {
      const xp = exercise.xpReward || 50;
      showXP(xp);
      const player = GameState.get('player');
      if (player) {
        const { xp: curXp, xpToNextLevel: curXpToNext, level: curLevel } = GameState.get('player');
        let totalXp = curXp + xp;
        let newLevel = curLevel;
        let newNextLevel = curXpToNext;
        let leveledUp = false;
        while (totalXp >= newNextLevel) {
          totalXp -= newNextLevel;
          newLevel++;
          newNextLevel = Math.floor(newNextLevel * 1.5);
          leveledUp = true;
        }
        if (leveledUp) showLevelUp(newLevel);
        GameState.setState({
          player: {
            ...GameState.get('player'),
            xp: totalXp,
            level: newLevel,
            xpToNextLevel: newNextLevel,
          },
        });
      }
    }
  });

  // ── Exercise: show hint ───────────────────────────────────────────────────
  $('btn-hint')?.addEventListener('click', () => {
    const hintDiv = $('exercise-hint');
    if (hintDiv) hintDiv.classList.remove('hidden');
  });

  // ── Exercise: close ───────────────────────────────────────────────────────
  $('btn-close-exercise')?.addEventListener('click', async () => {
    // If this exercise was triggered by "Next Level", proceed to next level.
    const proceeds = _exerciseProceedsToNextLevel;
    _exerciseProceedsToNextLevel = false;
    hideExerciseModal();
    if (proceeds) await engine.nextLevel();
  });

  // ── Level complete: next level ────────────────────────────────────────────
  $('btn-next-level')?.addEventListener('click', async () => {
    hideLevelCompleteModal();
    // Show exercise first, then advance after the exercise is closed/skipped.
    const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
    if (levelData?.exercise) {
      _exerciseProceedsToNextLevel = true;
      showExerciseModal(levelData.exercise);
    } else {
      await engine.nextLevel();
    }
  });

  // ── Level complete: replay ────────────────────────────────────────────────
  $('btn-replay-level')?.addEventListener('click', async () => {
    hideLevelCompleteModal();
    await engine.retryLevel();
  });

  // ── Game over: retry ──────────────────────────────────────────────────────
  $('btn-retry')?.addEventListener('click', async () => {
    hideGameOverModal();
    await engine.retryLevel();
  });

  // ── Game over: main menu ──────────────────────────────────────────────────
  $('btn-go-menu')?.addEventListener('click', () => {
    hideGameOverModal();
    GameState.setState({ phase: GAME_PHASES.MENU });
  });

  // ── Exercise: after completing, proceed to next level ─────────────────────
  // The "Next Level →" button is injected into exercise-feedback on pass.
  const exerciseFeedback = $('exercise-feedback');
  if (exerciseFeedback) {
    exerciseFeedback.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-next-after-exercise')) {
        _exerciseProceedsToNextLevel = false;
        hideExerciseModal();
        await engine.nextLevel();
      }
    });
  }

  // ── Clear combat log ──────────────────────────────────────────────────────
  $('btn-clear-log')?.addEventListener('click', () => clearCombatLog());

  // ── Keyboard: Escape closes modals ────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [$('concept-modal'), $('exercise-modal')].forEach(m => {
      if (m && !m.hidden) m.hidden = true;
    });
  });
};

export default {
  initRenderer,
  renderMenu,
  renderGameScreen,
  renderPlayerStats,
  renderEnemies,
  renderActionButtons,
  appendCombatLog,
  showExerciseModal,
  hideExerciseModal,
  showLevelCompleteModal,
  hideLevelCompleteModal,
  showGameOverModal,
  hideGameOverModal,
};
