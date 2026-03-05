/**
 * TEACHING CONCEPT: Objects, Factory Functions, First-Class Functions, Getters
 *
 * Player module demonstrates:
 *   - Factory functions (createPlayer returns a plain object)
 *   - Objects with computed property getters (hpPercent, isAlive …)
 *   - Pure functions: applyDamage, applyHeal, addXP never mutate their input;
 *     they return a NEW object via the spread operator.
 *   - Functions as values: ability.execute is a function stored in an object
 *   - Array.filter + Array.reduce on status effects
 *   - Array.includes for ability check
 */

import Logger from '../utils/logger.js';

// ─── Player Abilities ─────────────────────────────────────────────────────────
// TEACHING: Array of objects — each object has a function stored as a property
export const PLAYER_ABILITIES = [
  {
    id: 'basicAttack',
    name: 'Strike',
    icon: '⚔️',
    description: 'A direct physical attack. Demonstrates a function call.',
    mpCost: 0,
    type: 'damage',
    target: 'single',
    unlockedAt: 1,
    // TEACHING: Arrow function stored as a property value
    getDamage: (player) => player.attack + Math.floor(Math.random() * 8) + 2,
    execute(player) {
      const dmg = this.getDamage(player);
      return { damage: dmg, message: `${player.name} strikes for ${dmg} damage!` };
    },
  },
  {
    id: 'powerStrike',
    name: 'Power Strike',
    icon: '💥',
    description: 'Heavy attack — demonstrates a function returning a computed value.',
    mpCost: 10,
    type: 'damage',
    target: 'single',
    unlockedAt: 2,
    getDamage: (player) =>
      Math.floor(player.attack * 1.8) + Math.floor(Math.random() * 12),
    execute(player) {
      const dmg = this.getDamage(player);
      return { damage: dmg, message: `${player.name} unleashes POWER STRIKE for ${dmg}!` };
    },
  },
  {
    id: 'heal',
    name: 'Heal',
    icon: '💚',
    description: 'Restore HP — function returns a heal amount based on maxHp.',
    mpCost: 15,
    type: 'heal',
    target: 'self',
    unlockedAt: 2,
    getHeal: (player) => Math.floor(player.maxHp * 0.3),
    execute(player) {
      const amount = this.getHeal(player);
      return { heal: amount, message: `${player.name} restores ${amount} HP!` };
    },
  },
  {
    id: 'arraySlash',
    name: 'Array Slash',
    icon: '🌊',
    description: 'Hits ALL enemies — demonstrates Array.forEach() iteration.',
    mpCost: 20,
    type: 'damage',
    target: 'all',
    unlockedAt: 3,
    getDamage: (player) =>
      Math.floor(player.attack * 0.7) + Math.floor(Math.random() * 6),
    execute(player) {
      const dmg = this.getDamage(player);
      return { damage: dmg, message: `${player.name} uses ARRAY SLASH, hitting all enemies for ${dmg}!` };
    },
  },
  {
    id: 'filterShield',
    name: 'Filter Shield',
    icon: '🛡️',
    description: 'Gain defense — demonstrates Array.filter() removing unwanted effects.',
    mpCost: 12,
    type: 'buff',
    target: 'self',
    unlockedAt: 4,
    execute(player) {
      return {
        buff: { id: 'shield', name: 'Shielded', icon: '🛡️', duration: 2, effect: 'defense', value: 12 },
        message: `${player.name} activates FILTER SHIELD! (+12 defense, 2 turns)`,
      };
    },
  },
  {
    id: 'mapStrike',
    name: 'Map Strike',
    icon: '🗺️',
    description: 'Transform and amplify damage — demonstrates Array.map() on values.',
    mpCost: 18,
    type: 'damage',
    target: 'all',
    unlockedAt: 4,
    getDamage: (player) => Math.floor(player.attack * 0.9) + Math.floor(Math.random() * 10),
    execute(player) {
      const dmg = this.getDamage(player);
      return { damage: dmg, message: `${player.name} uses MAP STRIKE on all enemies for ${dmg}!` };
    },
  },
  {
    id: 'closureBomb',
    name: 'Closure Bomb',
    icon: '🔒',
    description: 'A persistent damage-over-time — demonstrates closures capturing state.',
    mpCost: 22,
    type: 'dot',
    target: 'single',
    unlockedAt: 5,
    getDotDamage: (player) => Math.floor(player.attack * 0.4),
    execute(player) {
      const dmg = this.getDotDamage(player);
      return {
        dot: { name: 'Burn', icon: '🔥', duration: 3, damage: dmg },
        message: `${player.name} plants a CLOSURE BOMB! (${dmg} damage/turn for 3 turns)`,
      };
    },
  },
  {
    id: 'asyncBlast',
    name: 'Async Blast',
    icon: '⚡',
    description: 'Charged super attack — demonstrates async/await with a delay.',
    mpCost: 30,
    type: 'damage_async',
    target: 'single',
    unlockedAt: 7,
    delay: 1800,
    getDamage: (player) =>
      Math.floor(player.attack * 2.5) + Math.floor(Math.random() * 20),
    execute(player) {
      const dmg = this.getDamage(player);
      return {
        damage: dmg,
        delayed: true,
        delay: this.delay,
        message: `${player.name} charges ASYNC BLAST… resolving in ${this.delay / 1000}s`,
      };
    },
  },
];

// ─── Factory function ─────────────────────────────────────────────────────────
/**
 * TEACHING: Factory function — returns a new player object every call.
 * Compare to class syntax: both produce objects; factory functions are plain JS.
 */
export const createPlayer = (name = 'Hero') => {
  const player = {
    name,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    attack: 15,
    defense: 5,
    speed: 10,
    statusEffects: [],          // TEACHING: Array of active status-effect objects
    abilities: ['basicAttack', 'heal'],  // TEACHING: Array of ability IDs
    gold: 0,

    // TEACHING: Getters — computed properties accessed like regular properties
    get hpPercent()       { return Math.floor((this.hp / this.maxHp) * 100); },
    get mpPercent()       { return Math.floor((this.mp / this.maxMp) * 100); },
    get isAlive()         { return this.hp > 0; },

    // TEACHING: Array.filter + Array.reduce to sum stat bonuses from effects
    get effectiveAttack() {
      const bonus = this.statusEffects
        .filter(e => e.effect === 'attack')
        .reduce((sum, e) => sum + e.value, 0);
      return this.attack + bonus;
    },
    get effectiveDefense() {
      const bonus = this.statusEffects
        .filter(e => e.effect === 'defense')
        .reduce((sum, e) => sum + e.value, 0);
      return this.defense + bonus;
    },
  };

  Logger.log(`Player "${name}" created`, 'system', { player: { name, hp: player.hp, mp: player.mp } });
  return player;
};

// ─── Pure state-transform functions ───────────────────────────────────────────
// TEACHING: Pure functions — no side effects, same input → same output, return new object

/**
 * Apply damage to a player.  Returns a NEW player object (spread operator).
 * TEACHING: effectiveDefense is computed inline — do NOT rely on object getters
 * after spreading, because { ...player } converts getters to plain values.
 */
export const applyDamage = (player, rawAmount) => {
  // Compute defense inline (getter may be stale after spread)
  const defenseBonus = Array.isArray(player.statusEffects)
    ? player.statusEffects.filter(e => e.effect === 'defense').reduce((s, e) => s + e.value, 0)
    : 0;
  const reduction = (player.defense || 0) + defenseBonus;
  const actualDamage = Math.max(1, rawAmount - reduction);
  const newHp = Math.max(0, player.hp - actualDamage);

  Logger.log(
    `${player.name} takes ${actualDamage} dmg (raw ${rawAmount} − ${reduction} def)`,
    'action',
    { before: player.hp, after: newHp },
  );
  return { ...player, hp: newHp };
};

/** Heal player — clamp to maxHp. */
export const applyHeal = (player, amount) => {
  const newHp = Math.min(player.maxHp, player.hp + amount);
  Logger.log(`${player.name} heals ${newHp - player.hp} HP`, 'action');
  return { ...player, hp: newHp };
};

/** Restore MP — clamp to maxMp. */
export const restoreMP = (player, amount) =>
  ({ ...player, mp: Math.min(player.maxMp, player.mp + amount) });

/**
 * Deduct MP cost.  Returns null if not enough MP.
 * TEACHING: Null as a sentinel (guard clause).
 */
export const spendMP = (player, amount) => {
  if (player.mp < amount) return null;
  return { ...player, mp: player.mp - amount };
};

/**
 * Award XP, handle level-up loop.
 * TEACHING: while loop, nested object spread.
 */
export const addXP = (player, amount) => {
  let { xp, level, xpToNextLevel, attack, defense, maxHp, hp, maxMp, mp } = player;
  xp += amount;
  let leveledUp = false;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
    attack   += 3;
    defense  += 1;
    maxHp    += 20;
    hp        = maxHp;   // full heal on level-up
    maxMp    += 10;
    mp        = maxMp;
    leveledUp = true;
    Logger.log(`${player.name} leveled up to Lv.${level}!`, 'system');
  }

  return {
    player: { ...player, xp, level, xpToNextLevel, attack, defense, maxHp, hp, maxMp, mp },
    leveledUp,
  };
};

/**
 * Add a status effect.
 * TEACHING: Spread into an array — immutable append.
 */
export const applyStatusEffect = (player, effect) => {
  const statusEffects = [...player.statusEffects, { ...effect, appliedAt: Date.now() }];
  Logger.log(`${player.name} gains: ${effect.name}`, 'action');
  return { ...player, statusEffects };
};

/**
 * Reduce effect durations and remove expired ones.
 * TEACHING: Array.map() + Array.filter() chained.
 */
export const tickStatusEffects = (player) => {
  const statusEffects = player.statusEffects
    .map(e => ({ ...e, duration: e.duration - 1 }))
    .filter(e => e.duration > 0);
  return { ...player, statusEffects };
};

/**
 * Unlock a new ability by ID.
 * TEACHING: Array.includes() guard + spread to append.
 */
export const unlockAbility = (player, abilityId) => {
  if (player.abilities.includes(abilityId)) return player;
  Logger.log(`${player.name} unlocked: ${abilityId}`, 'system');
  return { ...player, abilities: [...player.abilities, abilityId] };
};

export default {
  createPlayer,
  applyDamage,
  applyHeal,
  restoreMP,
  spendMP,
  addXP,
  applyStatusEffect,
  tickStatusEffects,
  unlockAbility,
  PLAYER_ABILITIES,
};
