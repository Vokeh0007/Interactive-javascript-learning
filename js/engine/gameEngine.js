/**
 * TEACHING CONCEPT: Execution Context, Scope, Module Pattern, Event-Driven Architecture
 *
 * GameEngine is the central orchestrator.  It demonstrates:
 *   - Module pattern (a single exported object with methods)
 *   - State machine (phases guarded by if/switch)
 *   - async/await for sequential turn flow
 *   - Separation of concerns: engine owns logic, renderer owns DOM
 *   - Callback / event pattern: engine notifies renderer via GameState subscriptions
 */

import GameState, { GAME_PHASES } from '../state/gameState.js';
import Logger                     from '../utils/logger.js';
import LEVELS                     from '../data/levels.js';
import { createPlayer, unlockAbility, PLAYER_ABILITIES } from '../entities/player.js';
import { createEnemy, getLivingEnemies, damageEnemy } from '../entities/enemy.js';
import { addItem }                from '../entities/inventory.js';
import {
  executePlayerAction,
  executeEnemyTurn,
  resolveTurnEffects,
  collectVictoryXP,
} from './combatEngine.js';
import {
  waitForAnimation,
  asyncEnemyTurn,
  chargeAsyncBlast,
  loadLevelAsync,
} from './asyncEngine.js';

// ─── Internal engine state ────────────────────────────────────────────────────
let _currentWaveIndex = 0;
let _pendingAsyncBlast = null; // Stores a pending async blast Promise

// ─── GameEngine public API ────────────────────────────────────────────────────
const GameEngine = {

  // ── Initialization ────────────────────────────────────────────────────────
  /**
   * Bootstrap the game: create player, load level 1, go to MENU.
   * TEACHING: async function as entry point — await for sequential setup.
   */
  async init(playerName = 'Hero') {
    Logger.log('GameEngine.init() called', 'system');
    GameState.pushCallStack('GameEngine.init', [playerName]);

    const player    = createPlayer(playerName);
    const inventory = addItem([], 'healthPotion', 2);

    GameState.setState({
      player,
      inventory,
      phase:       GAME_PHASES.MENU,
      currentLevel: 1,
    });

    GameState.popCallStack();
    Logger.log('GameEngine.init() complete', 'system');
  },

  // ── Level loading ─────────────────────────────────────────────────────────
  /**
   * Load and start a level.
   * TEACHING: async/await + Promise-based level loading (asyncEngine.loadLevelAsync).
   */
  async startLevel(levelId) {
    Logger.log(`GameEngine.startLevel(${levelId})`, 'system');
    GameState.pushCallStack('startLevel', [levelId]);

    const levelData = await loadLevelAsync(levelId, (id) => {
      const level = LEVELS.find(l => l.id === id);
      if (!level) throw new Error(`Level ${id} not found`);
      return level;
    });

    _currentWaveIndex = 0;
    GameState.setState({
      phase:       GAME_PHASES.PLAYER_TURN,
      currentLevel: levelId,
      asyncTimeline: [],
      lastAction:  null,
    });

    await this._startWave(levelData);
    GameState.popCallStack();
  },

  // ── Wave management ───────────────────────────────────────────────────────
  async _startWave(levelData) {
    const wave = levelData.waves[_currentWaveIndex];
    if (!wave) {
      // All waves cleared — level complete
      await this._levelComplete(levelData);
      return;
    }

    Logger.log(`Wave ${_currentWaveIndex + 1} / ${levelData.waves.length}`, 'system');

    // TEACHING: Array.map() — transform wave enemy IDs into live enemy objects
    const enemies = wave.enemies.map(templateId => createEnemy(templateId));

    GameState.setState({ enemies, phase: GAME_PHASES.PLAYER_TURN });
  },

  // ── Player action ─────────────────────────────────────────────────────────
  /**
   * Called when the player selects an ability.
   * TEACHING: async/await turn loop; each step awaits the previous.
   */
  async playerAction(abilityId, targetId = null) {
    const state = GameState.getState();
    if (state.phase !== GAME_PHASES.PLAYER_TURN) return;
    if (state.isTurnAnimating) return;

    GameState.setState({ isTurnAnimating: true, phase: GAME_PHASES.PLAYER_TURN });
    GameState.pushCallStack('playerAction', [abilityId]);
    Logger.log(`Player action: ${abilityId}`, 'action');

    const { player, enemies, inventory } = state;

    // ── Async Blast: special handling ────────────────────────────────────────
    if (abilityId === 'asyncBlast') {
      const firstAlive = getLivingEnemies(enemies)[0];
      if (firstAlive) {
        const blastAbility = PLAYER_ABILITIES.find(a => a.id === 'asyncBlast');
        const { damage, message } = blastAbility.execute(player, firstAlive.instanceId);

        Logger.log(message, 'action');
        GameState.setState({ isTurnAnimating: false, phase: GAME_PHASES.PLAYER_TURN });

        // TEACHING: We don't await here — blast resolves independently on a timer
        _pendingAsyncBlast = chargeAsyncBlast(damage, 1800).then(async (dmg) => {
          const latestState = GameState.getState();
          if (latestState.phase === GAME_PHASES.GAME_OVER) return;

          const latestFirstAlive = getLivingEnemies(latestState.enemies)[0];
          if (!latestFirstAlive) return;

          const hitEnemies = damageEnemy(latestState.enemies, latestFirstAlive.instanceId, dmg);
          GameState.setState({ enemies: hitEnemies });
          Logger.log(`⚡ Async Blast hits for ${dmg}!`, 'action');

          // Check if enemies cleared after blast
          if (getLivingEnemies(hitEnemies).length === 0) {
            await this._waveCleared(latestState.player, hitEnemies.filter(e => e.hp <= 0));
          }
        });

        GameState.popCallStack();
        return;
      }
    }

    // ── Normal action ─────────────────────────────────────────────────────────
    const firstAlive = getLivingEnemies(enemies)[0];
    const resolvedTargetId = targetId || (firstAlive ? firstAlive.instanceId : null);

    const { player: p2, enemies: e2, log } = executePlayerAction(
      abilityId, player, enemies, resolvedTargetId,
    );

    log.forEach(msg => Logger.log(msg, 'action'));
    GameState.setState({ player: p2, enemies: e2 });

    await waitForAnimation(400);

    // Check if all enemies defeated
    const allDead = getLivingEnemies(e2).length === 0;
    if (allDead) {
      await this._waveCleared(p2, e2);
      GameState.setState({ isTurnAnimating: false });
      GameState.popCallStack();
      return;
    }

    // Enemy turn
    await this._doEnemyTurn(p2, e2);
    GameState.setState({ isTurnAnimating: false, phase: GAME_PHASES.PLAYER_TURN });
    GameState.popCallStack();
  },

  // ── Enemy turn ────────────────────────────────────────────────────────────
  async _doEnemyTurn(player, enemies) {
    GameState.setState({ phase: GAME_PHASES.ENEMY_TURN });
    GameState.pushCallStack('_doEnemyTurn');

    const result = await asyncEnemyTurn(() => executeEnemyTurn(player, enemies));
    result.log.forEach(msg => Logger.log(msg, 'action'));

    // Resolve end-of-turn effects (DoTs, buff timers)
    const { player: p3, enemies: e3, log: effectLog } =
      resolveTurnEffects(result.player, enemies);
    effectLog.forEach(msg => Logger.log(msg, 'action'));

    GameState.setState({
      player:       p3,
      enemies:      e3,
      currentTurn:  (GameState.get('currentTurn') || 0) + 1,
    });

    // Check player death
    if (p3.hp <= 0) {
      await this._gameOver('Your hero has fallen. Study the concept and try again!');
    }

    GameState.popCallStack();
  },

  // ── Wave cleared ──────────────────────────────────────────────────────────
  async _waveCleared(player, defeatedEnemies) {
    Logger.log('Wave cleared!', 'system');

    // Award XP and gold
    const { player: rewardedPlayer, leveledUp, totalXP, totalGold } =
      collectVictoryXP(player, defeatedEnemies);

    GameState.setState({ player: rewardedPlayer });

    if (leveledUp) {
      Logger.log(`LEVEL UP! Now Lv.${rewardedPlayer.level}`, 'system');
    }

    await waitForAnimation(500);

    // Advance to next wave
    _currentWaveIndex++;
    const levelData = LEVELS.find(l => l.id === GameState.get('currentLevel'));
    await this._startWave(levelData);
  },

  // ── Level complete ────────────────────────────────────────────────────────
  async _levelComplete(levelData) {
    Logger.log(`Level ${levelData.id} complete!`, 'system');
    GameState.pushCallStack('_levelComplete', [levelData.id]);

    const state     = GameState.getState();
    let { player, inventory } = state;

    // Apply rewards
    // TEACHING: Array operations — forEach to apply each reward
    levelData.rewards.forEach(reward => {
      if (reward.type === 'item') {
        inventory = addItem(inventory, reward.itemId, reward.quantity || 1);
      }
      if (reward.type === 'gold') {
        player = { ...player, gold: (player.gold || 0) + reward.amount };
      }
      if (reward.type === 'badge') {
        const badges = [...GameState.get('earnedBadges'), reward];
        GameState.setState({ earnedBadges: badges });
      }
    });

    // Unlock new ability if specified
    if (levelData.unlocksAbility) {
      player = unlockAbility(player, levelData.unlocksAbility);
      Logger.log(`Unlocked ability: ${levelData.unlocksAbility}`, 'system');
    }

    const completedLevels = [
      ...new Set([...GameState.get('completedLevels'), levelData.id]),
    ];

    GameState.setState({
      player,
      inventory,
      completedLevels,
      phase: GAME_PHASES.LEVEL_COMPLETE,
    });

    GameState.popCallStack();
  },

  // ── Game over ─────────────────────────────────────────────────────────────
  async _gameOver(message) {
    Logger.log(`GAME OVER: ${message}`, 'error');
    GameState.setState({ phase: GAME_PHASES.GAME_OVER });
  },

  // ── Use an inventory item ─────────────────────────────────────────────────
  /**
   * TEACHING: Object property access, conditional logic, calling pure functions.
   */
  useItem(itemId) {
    const state    = GameState.getState();
    let { player } = state;
    let inventory  = state.inventory;

    const item = inventory.find(i => i.id === itemId);
    if (!item || item.quantity < 1) {
      Logger.log(`Item not found or depleted: ${itemId}`, 'error');
      return;
    }

    const { effect } = item;
    Logger.log(`Used item: ${item.name}`, 'action');

    if (effect.type === 'heal') {
      player = { ...player, hp: Math.min(player.maxHp, player.hp + effect.value) };
      Logger.log(`${player.name} healed for ${effect.value} HP`, 'action');
    }
    if (effect.type === 'mp') {
      player = { ...player, mp: Math.min(player.maxMp, player.mp + effect.value) };
      Logger.log(`${player.name} restored ${effect.value} MP`, 'action');
    }
    if (effect.type === 'unlock_ability') {
      player = unlockAbility(player, effect.value);
    }

    // Remove one from inventory
    // TEACHING: Array.map() + Array.filter() — immutable remove-one-quantity
    inventory = inventory
      .map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0);

    GameState.setState({ player, inventory });
  },

  // ── Proceed to next level ─────────────────────────────────────────────────
  async nextLevel() {
    const nextLevelId = GameState.get('currentLevel') + 1;
    if (nextLevelId > LEVELS.length) {
      Logger.log('All levels complete — YOU WIN!', 'system');
      return;
    }
    await this.startLevel(nextLevelId);
  },

  // ── Retry current level ───────────────────────────────────────────────────
  async retryLevel() {
    // Restore player HP/MP to full (half penalty)
    const player = GameState.get('player');
    const restored = {
      ...player,
      hp: Math.floor(player.maxHp * 0.7),
      mp: Math.floor(player.maxMp * 0.7),
      statusEffects: [],
    };
    GameState.setState({ player: restored });
    await this.startLevel(GameState.get('currentLevel'));
  },
};

export default GameEngine;
