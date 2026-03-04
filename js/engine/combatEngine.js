/**
 * TEACHING CONCEPT: Higher-Order Functions, Pure Functions, Functional Composition
 *
 * CombatEngine demonstrates:
 *   - Pure functions (no side effects, predictable output)
 *   - Higher-order functions used for damage calculation pipelines
 *   - Array.reduce() for applying multiple modifiers
 *   - Functions returning objects (result records)
 *   - Math utilities (Math.max, Math.floor, Math.random)
 */

import Logger from '../utils/logger.js';
import {
  applyDamage as applyPlayerDamage,
  applyHeal,
  spendMP,
  applyStatusEffect,
  tickStatusEffects as tickPlayerEffects,
  addXP,
} from '../entities/player.js';
import {
  damageEnemy,
  damageAllEnemies,
  getLivingEnemies,
  applyEnemyStatusEffect,
  tickEnemyStatusEffects,
} from '../entities/enemy.js';
import { PLAYER_ABILITIES } from '../entities/player.js';

// ─── Damage modifier pipeline ─────────────────────────────────────────────────
// TEACHING: Array of modifier functions — each one transforms the damage value
// This demonstrates HOFs: functions stored in arrays and applied via reduce()
const DAMAGE_MODIFIERS = [
  // Critical hit modifier (20% chance for 1.5× damage)
  (dmg, _ctx) => Math.random() < 0.2 ? Math.floor(dmg * 1.5) : dmg,
];

/**
 * Apply all damage modifiers via reduce.
 * TEACHING: Array.reduce() as a pipeline — each modifier transforms the value.
 */
const applyModifiers = (baseDamage, context = {}) =>
  DAMAGE_MODIFIERS.reduce((dmg, modifier) => modifier(dmg, context), baseDamage);

// ─── Enemy AI ─────────────────────────────────────────────────────────────────
// TEACHING: Object as a lookup table of functions (strategy pattern)
const ENEMY_AI = {
  scratch:         (enemy) => ({ damage: enemy.attack, msg: `${enemy.name} scratches!` }),
  nullBite:        (enemy) => ({ damage: Math.floor(enemy.attack * 1.1), msg: `${enemy.name} bites with null force!` }),
  loopStrike:      (enemy) => ({ damage: enemy.attack, repeat: 2, msg: `${enemy.name} strikes twice!` }),
  voidScratch:     (enemy) => ({ damage: Math.floor(enemy.attack * 0.9), msg: `${enemy.name} scratches vaguely.` }),
  indexSmash:      (enemy) => ({ damage: Math.floor(enemy.attack * 1.2), msg: `${enemy.name} smashes with an index error!` }),
  mutateStrike:    (enemy) => ({ damage: enemy.attack, debuff: { id: 'mutate', name: 'Mutated', icon: '🧬', duration: 2, effect: 'defense', value: -4 }, msg: `${enemy.name} mutates your defenses!` }),
  spliceAttack:    (enemy) => ({ damage: Math.floor(enemy.attack * 1.3), msg: `${enemy.name} splices you!` }),
  propError:       (enemy) => ({ damage: Math.floor(enemy.attack * 1.1), msg: `${enemy.name} tries to read your undefined property!` }),
  chainAttack:     (enemy) => ({ damage: enemy.attack, chain: true, msg: `${enemy.name} follows the prototype chain!` }),
  sideEffectBlast: (enemy) => ({ damage: Math.floor(enemy.attack * 1.4), msg: `${enemy.name} unleashes unintended side effects!` }),
  staleHit:        (enemy) => ({ damage: enemy.attack, msg: `${enemy.name} hits with a stale closure value!` }),
  leechDrain:      (enemy) => ({ damage: Math.floor(enemy.attack * 0.8), drain: Math.floor(enemy.attack * 0.3), msg: `${enemy.name} leaches from the DOM!` }),
  nestedBite:      (enemy) => ({ damage: enemy.attack, msg: `${enemy.name} bites from 8 levels deep!` }),
  hellfire:        (enemy) => ({ damage: Math.floor(enemy.attack * 1.5), msg: `${enemy.name} unleashes HELLFIRE!` }),
  raceStrike:      (enemy) => ({ damage: Math.floor(enemy.attack * 1.3), msg: `${enemy.name} strikes in a race condition!` }),
  varCurse:        (enemy) => ({ damage: enemy.attack, debuff: { id: 'hoisted', name: 'Hoisted', icon: '⬆️', duration: 2, effect: 'attack', value: -5 }, msg: `${enemy.name} curses you with var hoisting!` }),
  hoistSmash:      (enemy) => ({ damage: Math.floor(enemy.attack * 1.3), msg: `${enemy.name} hoists a massive blow!` }),
  coercionBreath:  (enemy) => ({ damage: Math.floor(enemy.attack * 1.6), msg: `${enemy.name} breathes coercion fire! ([] == ![] is true!)` }),
  equalityConfuse: (enemy) => ({ damage: Math.floor(enemy.attack * 1.2), debuff: { id: 'confused', name: 'Confused', icon: '😵', duration: 2, effect: 'attack', value: -8 }, msg: `${enemy.name} confuses with loose equality!` }),
  promiseRejection:(enemy) => ({ damage: Math.floor(enemy.attack * 1.4), msg: `${enemy.name} launches an unhandled promise rejection!` }),
  deadlock:        (enemy) => ({ damage: Math.floor(enemy.attack * 1.8), stun: true, msg: `${enemy.name} DEADLOCKS your actions for a turn!` }),
  callbackHellfire:(enemy) => ({ damage: Math.floor(enemy.attack * 2.0), msg: `${enemy.name} unleashes CALLBACK HELLFIRE!` }),
};

/**
 * Pick a random ability from an enemy's ability list.
 * TEACHING: Array indexing with Math.random() and Math.floor().
 */
const pickEnemyAbility = (enemy) => {
  const idx = Math.floor(Math.random() * enemy.abilities.length);
  return enemy.abilities[idx];
};

// ─── Player action resolution ─────────────────────────────────────────────────
/**
 * Execute a player ability against target(s).
 * Returns { player, enemies, log } — pure transformation.
 *
 * TEACHING: Function returns structured result object; switch/case dispatch.
 */
export const executePlayerAction = (abilityId, player, enemies, targetId = null) => {
  Logger.log(`executePlayerAction("${abilityId}")`, 'action');

  const ability = PLAYER_ABILITIES.find(a => a.id === abilityId);
  if (!ability) return { player, enemies, log: [`Unknown ability: ${abilityId}`] };

  // Guard: check MP
  const updatedPlayer = spendMP(player, ability.mpCost);
  if (!updatedPlayer) {
    return { player, enemies, log: [`Not enough MP for ${ability.name}!`] };
  }

  const result = ability.execute(updatedPlayer, targetId);
  let finalPlayer  = { ...updatedPlayer };
  let finalEnemies = [...enemies];
  const log        = [result.message];

  // ── Handle action types ───────────────────────────────────────────────────
  if (result.damage !== undefined) {
    const modifiedDamage = applyModifiers(result.damage, { player: finalPlayer });
    const isCrit = modifiedDamage > result.damage;
    if (isCrit) log.push('⚡ CRITICAL HIT!');

    if (ability.target === 'all') {
      // TEACHING: Higher-order function — pass function to transform array
      finalEnemies = damageAllEnemies(finalEnemies, modifiedDamage);
    } else if (targetId) {
      finalEnemies = damageEnemy(finalEnemies, targetId, modifiedDamage);
    } else {
      // Default: target first living enemy
      const firstAlive = getLivingEnemies(finalEnemies)[0];
      if (firstAlive) {
        finalEnemies = damageEnemy(finalEnemies, firstAlive.instanceId, modifiedDamage);
      }
    }
  }

  if (result.heal !== undefined) {
    finalPlayer = applyHeal(finalPlayer, result.heal);
  }

  if (result.buff !== undefined) {
    finalPlayer = applyStatusEffect(finalPlayer, result.buff);
  }

  if (result.dot !== undefined && targetId) {
    finalEnemies = applyEnemyStatusEffect(finalEnemies, targetId, result.dot);
    log.push(`${result.dot.name} applied to target (${result.dot.duration} turns)`);
  } else if (result.dot !== undefined) {
    const firstAlive = getLivingEnemies(finalEnemies)[0];
    if (firstAlive) {
      finalEnemies = applyEnemyStatusEffect(finalEnemies, firstAlive.instanceId, result.dot);
    }
  }

  return { player: finalPlayer, enemies: finalEnemies, log, isCrit: result.isCrit };
};

// ─── Enemy turn resolution ────────────────────────────────────────────────────
/**
 * Resolve ALL living enemies' attacks against the player.
 * TEACHING: Array.filter() + Array.reduce() — pipeline transformation.
 */
export const executeEnemyTurn = (player, enemies) => {
  Logger.log('executeEnemyTurn()', 'action');

  const livingEnemies = getLivingEnemies(enemies); // TEACHING: filter
  const log = [];

  // TEACHING: Array.reduce() accumulates player state across all attacks
  const finalPlayer = livingEnemies.reduce((currentPlayer, enemy) => {
    const abilityId  = pickEnemyAbility(enemy);
    const aiHandler  = ENEMY_AI[abilityId];
    if (!aiHandler) return currentPlayer;

    const result = aiHandler(enemy);
    log.push(result.msg);

    let p = applyPlayerDamage(currentPlayer, result.damage || 0);

    if (result.debuff) {
      p = applyStatusEffect(p, result.debuff);
    }

    // Repeat attack (e.g. loopStrike)
    if (result.repeat && result.repeat > 1) {
      for (let i = 1; i < result.repeat; i++) {
        p = applyPlayerDamage(p, result.damage || 0);
        log.push(`${enemy.name} attacks again!`);
      }
    }

    return p;
  }, player);

  return { player: finalPlayer, log };
};

// ─── End-of-turn cleanup ──────────────────────────────────────────────────────
/**
 * Apply DoT effects and reduce durations on both sides.
 * TEACHING: Separate concerns — one function per responsibility.
 */
export const resolveTurnEffects = (player, enemies) => {
  const { updatedEnemies, dotDamages } = tickEnemyStatusEffects(enemies);
  const tickedPlayer = tickPlayerEffects(player);
  const log = dotDamages.map(d => `🔥 ${d.effectName} deals ${d.damage} to enemy`);
  return { player: tickedPlayer, enemies: updatedEnemies, log };
};

/**
 * Award XP for defeated enemies.
 * TEACHING: Array.filter + Array.reduce to collect total rewards.
 */
export const collectVictoryXP = (player, defeatedEnemies) => {
  const totalXP   = defeatedEnemies.reduce((sum, e) => sum + e.xpReward, 0);
  const totalGold = defeatedEnemies.reduce((sum, e) => sum + e.goldReward, 0);
  const { player: updatedPlayer, leveledUp } = addXP(player, totalXP);
  Logger.log(`Victory! +${totalXP} XP, +${totalGold} gold`, 'system');
  return { player: { ...updatedPlayer, gold: updatedPlayer.gold + totalGold }, leveledUp, totalXP, totalGold };
};

export default {
  executePlayerAction,
  executeEnemyTurn,
  resolveTurnEffects,
  collectVictoryXP,
};
