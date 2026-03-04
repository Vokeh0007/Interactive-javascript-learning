/**
 * TEACHING CONCEPT: Objects, Arrays, Factory Functions, Array methods
 *
 * Enemy module demonstrates:
 *   - Template objects as blueprints
 *   - Factory function (createEnemy) that builds enemies from templates
 *   - Array of objects (ENEMY_TEMPLATES) accessed by key or filter
 *   - Spread operator for creating independent enemy instances
 *   - Array.filter() to get living enemies
 *   - Array.find() to locate a specific enemy
 */

import Logger from '../utils/logger.js';

// ─── Enemy templates ──────────────────────────────────────────────────────────
// TEACHING: An object whose values are template blueprints (data, not instances)
export const ENEMY_TEMPLATES = {
  // ── Level 1 enemies (Variables) ───────────────────────────────────────────
  undeclaredGhost: {
    id: 'undeclaredGhost',
    name: 'Undeclared Ghost',
    sprite: '👻',
    flavor: 'A variable declared but never assigned — haunts your scope.',
    hp: 30,
    attack: 6,
    defense: 0,
    xpReward: 15,
    goldReward: 5,
    abilities: ['scratch'],
    isBoss: false,
  },
  nullCreature: {
    id: 'nullCreature',
    name: 'Null Creature',
    sprite: '🕳️',
    flavor: 'The value of nothing. Beware null reference errors.',
    hp: 45,
    attack: 8,
    defense: 1,
    xpReward: 20,
    goldReward: 8,
    abilities: ['nullBite'],
    isBoss: false,
  },

  // ── Level 2 enemies (Functions) ───────────────────────────────────────────
  infiniteLooper: {
    id: 'infiniteLooper',
    name: 'Infinite Looper',
    sprite: '🔄',
    flavor: 'A loop that never terminates. Stack overflow imminent.',
    hp: 55,
    attack: 10,
    defense: 2,
    xpReward: 25,
    goldReward: 10,
    abilities: ['loopStrike'],
    isBoss: false,
  },
  returnlessFunction: {
    id: 'returnlessFunction',
    name: 'Void Wraith',
    sprite: '🌑',
    flavor: 'A function that returns undefined. Hauntingly useless.',
    hp: 40,
    attack: 9,
    defense: 0,
    xpReward: 22,
    goldReward: 9,
    abilities: ['voidScratch'],
    isBoss: false,
  },

  // ── Level 3 enemies (Arrays) ──────────────────────────────────────────────
  indexError: {
    id: 'indexError',
    name: 'Index Troll',
    sprite: '🧌',
    flavor: 'Off-by-one errors lurk here. array[-1] is your doom.',
    hp: 65,
    attack: 12,
    defense: 3,
    xpReward: 30,
    goldReward: 12,
    abilities: ['indexSmash'],
    isBoss: false,
  },
  mutationMonster: {
    id: 'mutationMonster',
    name: 'Mutation Beast',
    sprite: '🦠',
    flavor: 'Directly mutates your arrays. Dangerous side effects.',
    hp: 80,
    attack: 14,
    defense: 4,
    xpReward: 35,
    goldReward: 15,
    abilities: ['mutateStrike', 'spliceAttack'],
    isBoss: false,
  },

  // ── Level 4 enemies (Objects) ─────────────────────────────────────────────
  undefinedPropDemon: {
    id: 'undefinedPropDemon',
    name: 'Undefined Prop Demon',
    sprite: '👿',
    flavor: 'Accesses properties that don\'t exist. Cannot read undefined.',
    hp: 70,
    attack: 13,
    defense: 5,
    xpReward: 32,
    goldReward: 14,
    abilities: ['propError'],
    isBoss: false,
  },
  protoChainWalker: {
    id: 'protoChainWalker',
    name: 'Proto Chain Walker',
    sprite: '⛓️',
    flavor: 'Traverses the prototype chain endlessly.',
    hp: 90,
    attack: 15,
    defense: 6,
    xpReward: 40,
    goldReward: 18,
    abilities: ['chainAttack'],
    isBoss: false,
  },

  // ── Level 5 enemies (HOF) ─────────────────────────────────────────────────
  impureFunction: {
    id: 'impureFunction',
    name: 'Impure Function',
    sprite: '🧪',
    flavor: 'Side-effects everywhere. State modified unexpectedly.',
    hp: 85,
    attack: 16,
    defense: 5,
    xpReward: 38,
    goldReward: 16,
    abilities: ['sideEffectBlast'],
    isBoss: false,
  },

  // ── Level 6 enemies (Closures) ────────────────────────────────────────────
  staleClosure: {
    id: 'staleClosure',
    name: 'Stale Closure',
    sprite: '🗄️',
    flavor: 'Captures old variable values. Subtly broken behaviour.',
    hp: 100,
    attack: 17,
    defense: 7,
    xpReward: 45,
    goldReward: 20,
    abilities: ['staleHit'],
    isBoss: false,
  },

  // ── Level 7 enemies (DOM) ─────────────────────────────────────────────────
  domLeech: {
    id: 'domLeech',
    name: 'DOM Leech',
    sprite: '🪲',
    flavor: 'Attaches event listeners and never removes them. Memory leak!',
    hp: 95,
    attack: 16,
    defense: 6,
    xpReward: 44,
    goldReward: 19,
    abilities: ['leechDrain'],
    isBoss: false,
  },

  // ── Level 8 enemies (Async) ───────────────────────────────────────────────
  callbackHell: {
    id: 'callbackHell',
    name: 'Callback Hell Demon',
    sprite: '😈',
    flavor: 'Nested callbacks 8 levels deep. Pyramid of doom.',
    hp: 110,
    attack: 18,
    defense: 7,
    xpReward: 50,
    goldReward: 22,
    abilities: ['nestedBite', 'hellfire'],
    isBoss: false,
  },
  raceCon: {
    id: 'raceCon',
    name: 'Race Condition',
    sprite: '🏁',
    flavor: 'Two async operations fighting for the same resource.',
    hp: 120,
    attack: 20,
    defense: 8,
    xpReward: 55,
    goldReward: 25,
    abilities: ['raceStrike'],
    isBoss: false,
  },

  // ── Level 9 enemies (ES6+) ────────────────────────────────────────────────
  legacyCode: {
    id: 'legacyCode',
    name: 'Legacy Code Golem',
    sprite: '🗿',
    flavor: 'var everywhere, no arrow functions, pre-ES6 despair.',
    hp: 130,
    attack: 21,
    defense: 9,
    xpReward: 60,
    goldReward: 28,
    abilities: ['varCurse', 'hoistSmash'],
    isBoss: false,
  },

  // ── Boss enemies ──────────────────────────────────────────────────────────
  typeCoercionDragon: {
    id: 'typeCoercionDragon',
    name: 'Type Coercion Dragon',
    sprite: '🐉',
    flavor: '"0" == false? true. [] == ![] ? true. The dragon abuses JS type coercion.',
    hp: 200,
    attack: 25,
    defense: 12,
    xpReward: 100,
    goldReward: 50,
    abilities: ['coercionBreath', 'equalityConfuse'],
    isBoss: true,
  },
  asyncNightmare: {
    id: 'asyncNightmare',
    name: 'Async Nightmare',
    sprite: '💀',
    flavor: 'The final boss. Unhandled promise rejections, race conditions, and deadlocks.',
    hp: 300,
    attack: 30,
    defense: 15,
    xpReward: 200,
    goldReward: 100,
    abilities: ['promiseRejection', 'deadlock', 'callbackHellfire'],
    isBoss: true,
  },
};

// ─── Factory function ─────────────────────────────────────────────────────────
/**
 * Create a live enemy instance from a template.
 * TEACHING: Spread copies all template properties into a fresh object —
 *           instances are independent; mutating one doesn't affect the template.
 */
export const createEnemy = (templateId) => {
  const template = ENEMY_TEMPLATES[templateId];
  if (!template) throw new Error(`Unknown enemy template: "${templateId}"`);

  const enemy = {
    ...template,                        // copy all template fields
    instanceId: `${templateId}_${Date.now()}`, // unique per-instance id
    hp:    template.hp,                 // current HP
    maxHp: template.hp,                 // TEACHING: maxHp tracks max for HP bar percentage
    statusEffects: [],                  // TEACHING: fresh array, not shared with template
    isAlive: true,
  };

  Logger.log(`Enemy spawned: ${enemy.name}`, 'system', { enemy: { name: enemy.name, hp: enemy.hp } });
  return enemy;
};

// ─── Array helper functions ───────────────────────────────────────────────────
// TEACHING: Functions operating on enemy arrays — no mutation of originals

/** Returns a NEW array with only living enemies. */
export const getLivingEnemies = (enemies) =>
  enemies.filter(e => e.hp > 0);   // TEACHING: Array.filter()

/** Find an enemy by instanceId. */
export const findEnemy = (enemies, instanceId) =>
  enemies.find(e => e.instanceId === instanceId); // TEACHING: Array.find()

/**
 * Apply damage to a specific enemy in an array.
 * Returns a NEW array (map replaces the matching enemy).
 * TEACHING: Array.map() — transform without mutation.
 */
export const damageEnemy = (enemies, instanceId, amount) =>
  enemies.map(enemy => {
    if (enemy.instanceId !== instanceId) return enemy; // unchanged
    const reduction = enemy.defense || 0;
    const actualDamage = Math.max(1, amount - reduction);
    const newHp = Math.max(0, enemy.hp - actualDamage);
    Logger.log(
      `${enemy.name} takes ${actualDamage} dmg (raw ${amount} − ${reduction} def)`,
      'action',
      { before: enemy.hp, after: newHp },
    );
    return { ...enemy, hp: newHp };
  });

/**
 * Apply damage to ALL living enemies.
 * TEACHING: Array.map() applied to every element.
 */
export const damageAllEnemies = (enemies, amount) =>
  enemies.map(enemy => {
    if (enemy.hp <= 0) return enemy;
    const reduction = enemy.defense || 0;
    const actualDamage = Math.max(1, amount - reduction);
    const newHp = Math.max(0, enemy.hp - actualDamage);
    Logger.log(`${enemy.name} hit for ${actualDamage} (AOE)`, 'action');
    return { ...enemy, hp: newHp };
  });

/**
 * Apply a status effect (e.g. burn DoT) to a specific enemy.
 * TEACHING: Nested spread for immutable update inside an array.
 */
export const applyEnemyStatusEffect = (enemies, instanceId, effect) =>
  enemies.map(enemy =>
    enemy.instanceId === instanceId
      ? { ...enemy, statusEffects: [...enemy.statusEffects, { ...effect }] }
      : enemy,
  );

/**
 * Tick status effects on all enemies (reduce duration, remove expired).
 * Returns accumulated DoT damage per enemy: [{instanceId, damage}]
 */
export const tickEnemyStatusEffects = (enemies) => {
  const dotDamages = [];

  const updated = enemies.map(enemy => {
    if (enemy.hp <= 0) return enemy;

    let hp = enemy.hp;

    // Apply DoT damage from each effect
    const tickedEffects = enemy.statusEffects.map(e => {
      if (e.damage) {
        hp = Math.max(0, hp - e.damage);
        dotDamages.push({ instanceId: enemy.instanceId, damage: e.damage, effectName: e.name });
      }
      return { ...e, duration: e.duration - 1 };
    });

    const statusEffects = tickedEffects.filter(e => e.duration > 0);
    return { ...enemy, hp, statusEffects };
  });

  return { updatedEnemies: updated, dotDamages };
};

export default {
  ENEMY_TEMPLATES,
  createEnemy,
  getLivingEnemies,
  findEnemy,
  damageEnemy,
  damageAllEnemies,
  applyEnemyStatusEffect,
  tickEnemyStatusEffects,
};
