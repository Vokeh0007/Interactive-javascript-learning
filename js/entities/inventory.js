/**
 * TEACHING CONCEPT: Arrays — CRUD, Higher-Order Methods, Immutability
 *
 * Inventory module demonstrates:
 *   - Array as a data structure (not just a list)
 *   - Immutable add / remove / update via spread + filter + map
 *   - Array.find() to locate items
 *   - Array.some() for existence checks
 *   - Array.reduce() to compute total values
 *   - Array.sort() for ordering (with a comparator function)
 */

import Logger from '../utils/logger.js';

// ─── Item templates ───────────────────────────────────────────────────────────
export const ITEM_TEMPLATES = {
  // Potions
  healthPotion: {
    id: 'healthPotion',
    name: 'Health Potion',
    icon: '🧪',
    type: 'consumable',
    subtype: 'potion',
    description: 'Restores 40 HP.',
    effect: { type: 'heal', value: 40 },
    value: 15,  // gold value
  },
  megaPotion: {
    id: 'megaPotion',
    name: 'Mega Potion',
    icon: '💊',
    type: 'consumable',
    subtype: 'potion',
    description: 'Restores 80 HP.',
    effect: { type: 'heal', value: 80 },
    value: 30,
  },
  manaPotion: {
    id: 'manaPotion',
    name: 'Mana Potion',
    icon: '🔵',
    type: 'consumable',
    subtype: 'potion',
    description: 'Restores 25 MP.',
    effect: { type: 'mp', value: 25 },
    value: 20,
  },
  // Weapons
  codeSword: {
    id: 'codeSword',
    name: 'Code Sword',
    icon: '⚔️',
    type: 'equipment',
    subtype: 'weapon',
    description: 'A blade forged from clean code. +8 attack.',
    effect: { type: 'attack', value: 8 },
    value: 50,
  },
  debugDagger: {
    id: 'debugDagger',
    name: 'Debug Dagger',
    icon: '🗡️',
    type: 'equipment',
    subtype: 'weapon',
    description: 'Finds and exploits bugs. +5 attack, +3 speed.',
    effect: { type: 'attack', value: 5 },
    value: 35,
  },
  // Armor
  typeShield: {
    id: 'typeShield',
    name: 'Type Shield',
    icon: '🛡️',
    type: 'equipment',
    subtype: 'armor',
    description: 'Strong type-checking defense. +7 defense.',
    effect: { type: 'defense', value: 7 },
    value: 45,
  },
  // Scrolls (teach a concept)
  arrayScroll: {
    id: 'arrayScroll',
    name: 'Array Scroll',
    icon: '📜',
    type: 'consumable',
    subtype: 'scroll',
    description: 'Reveals the Array Slash ability.',
    effect: { type: 'unlock_ability', value: 'arraySlash' },
    value: 25,
  },
  closureScroll: {
    id: 'closureScroll',
    name: 'Closure Scroll',
    icon: '🔒',
    type: 'consumable',
    subtype: 'scroll',
    description: 'Reveals the Closure Bomb ability.',
    effect: { type: 'unlock_ability', value: 'closureBomb' },
    value: 40,
  },
};

// ─── Inventory factory ────────────────────────────────────────────────────────
/**
 * Creates an inventory item instance.
 * TEACHING: Factory + spread — template stays unchanged.
 */
export const createItem = (templateId, quantity = 1) => {
  const template = ITEM_TEMPLATES[templateId];
  if (!template) throw new Error(`Unknown item: "${templateId}"`);
  return {
    ...template,
    instanceId: `${templateId}_${Date.now()}`,
    quantity,
  };
};

// ─── Inventory operations (pure functions on arrays) ─────────────────────────

/**
 * Add an item to the inventory.
 * If item already exists (same id), increment quantity (immutable update via map).
 * TEACHING: Array.some(), Array.map() vs Array.push().
 */
export const addItem = (inventory, templateId, quantity = 1) => {
  // TEACHING: Array.some() — does any element match?
  const alreadyOwned = inventory.some(item => item.id === templateId);

  if (alreadyOwned) {
    // TEACHING: Array.map() — returns new array with one item updated
    return inventory.map(item =>
      item.id === templateId
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }

  // TEACHING: Spread to append without mutation
  const newItem = createItem(templateId, quantity);
  Logger.log(`Item added: ${newItem.name} ×${quantity}`, 'action');
  return [...inventory, newItem];
};

/**
 * Remove (or reduce quantity of) an item.
 * TEACHING: Array.filter() — remove elements matching a predicate.
 */
export const removeItem = (inventory, templateId, quantity = 1) => {
  return inventory
    .map(item =>
      item.id === templateId
        ? { ...item, quantity: item.quantity - quantity }
        : item,
    )
    .filter(item => item.quantity > 0); // TEACHING: filter removes depleted items
};

/**
 * Find an item by id.
 * TEACHING: Array.find() — returns first match or undefined.
 */
export const findItem = (inventory, templateId) =>
  inventory.find(item => item.id === templateId);

/**
 * Check if inventory has at least 1 of an item.
 * TEACHING: Array.some() as a boolean check.
 */
export const hasItem = (inventory, templateId) =>
  inventory.some(item => item.id === templateId && item.quantity > 0);

/**
 * Total gold value of entire inventory.
 * TEACHING: Array.reduce() — accumulate a single value from an array.
 */
export const totalValue = (inventory) =>
  inventory.reduce((total, item) => total + item.value * item.quantity, 0);

/**
 * Get all consumables.
 * TEACHING: Array.filter() with object property predicate.
 */
export const getConsumables = (inventory) =>
  inventory.filter(item => item.type === 'consumable');

/**
 * Get all equipment.
 */
export const getEquipment = (inventory) =>
  inventory.filter(item => item.type === 'equipment');

/**
 * Sort inventory by value (descending).
 * TEACHING: Array.sort() with a comparator function — sorts a COPY.
 */
export const sortByValue = (inventory) =>
  [...inventory].sort((a, b) => b.value - a.value); // spread to avoid mutating original

export default {
  ITEM_TEMPLATES,
  createItem,
  addItem,
  removeItem,
  findItem,
  hasItem,
  totalValue,
  getConsumables,
  getEquipment,
  sortByValue,
};
