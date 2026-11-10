/**
 * Tales To Eternity — Foundry VTT game system.
 * Rules source: Tales To Eternity - Fragments Of The Cosmos (FTC).
 */

const SYSTEM_ID = "tales-to-eternity";
const SYSTEM_PATH = `systems/${SYSTEM_ID}`;
const { fields } = foundry.data;

/* -------------------------------------------- */
/*  Configuration                               */
/* -------------------------------------------- */

const TTE = {
  attributes: ["strength", "agility", "dexterity", "intellect", "spirit", "charisma"],
  skills: [
    "acrobatics", "coordination", "deception", "gymnastics", "insight", "intimidation", "investigation", "lore",
    "medicine", "mysticism", "perception", "persuasion", "society", "stealth", "survival", "thievery"
  ],
  ranks: ["Untrained", "Trained", "Expert", "Master"],
  attributeRange: { min: -5, max: 5 },
  maxLevel: 12,
  maxWounds: 3,
  recoveryDC: 11,
  advantageDie: "1d6",
  lifeCategories: ["fragile", "weak", "medium", "strong"],
  lifeTable: {
    fragile: [12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 28],
    weak: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37],
    medium: [19, 22, 24, 27, 29, 32, 34, 37, 39, 42, 44, 47],
    strong: [23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56]
  },
  featureTypes: ["race", "class", "specialization", "technique", "other", "trait", "action", "reaction", "bossAction"],
  /** Kinds of monster abilities (Rupture Of The Cosmos chapter 2), in sheet order. */
  monsterAbilityTypes: ["trait", "action", "reaction", "bossAction"],
  /** Monsters (Rupture Of The Cosmos chapter 1). */
  monsterTypes: ["aberration", "beast", "construct", "dragon", "elemental", "fiend", "giant", "humanoid", "monstrosity", "ooze",
    "plant", "undead"],
  monsterRoles: ["minion", "standard", "elite", "boss"],
  /** Monster Life by level: Fragile, Weak, Medium, Strong (a Medium is 12 + 2.5 per level after the first). */
  monsterLife: {
    fragile: [6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 20],
    weak: [9, 12, 13, 15, 17, 19, 21, 23, 24, 27, 28, 30],
    medium: [12, 15, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40],
    strong: [15, 19, 22, 25, 28, 32, 34, 38, 40, 44, 47, 50]
  },
  /** What each role does to Life (a Boss multiplies by the number of characters), attacks per round for Power, and base points. */
  roleLife: { minion: 0.5, standard: 1, elite: 2 },
  roleAttacks: { minion: 1, standard: 1, elite: 2, boss: 4 },
  rolePoints: { minion: 4, standard: 8, elite: 16, boss: 8 },
  /** Minions deal fixed damage by Tier. */
  minionDamage: [3, 4, 5, 6],
  /** Average of one roll of each damage category by Tier (for Power). */
  averageDamage: { weak: [2.5, 3.5, 4.5, 5.5], medium: [3.5, 4.5, 5.5, 6.5], strong: [4.5, 5.5, 6.5, 7.5], brutal: [5, 7, 9, 11] },
  /** Encounter budget: points per character for each difficulty. */
  encounterBudget: { easy: 4, normal: 6, hard: 8, deadly: 12 },
  /** XP for each difficulty, as a share of a Normal encounter. */
  encounterXP: { trivial: 0, easy: 0.5, normal: 1, hard: 1.5, deadly: 2 },
  /** Classes (FTC chapter 4). Specializations are chosen at this level. */
  specializationLevel: 2,
  /** Levels that give +1 to two attributes. */
  attributeLevels: [3, 6, 9, 12],
  manaTypes: ["none", "caster", "halfCaster"],
  /** Mana Points by level. */
  manaTable: {
    caster: [8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41],
    halfCaster: [4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21]
  },
  /** When a class resource (like Combo) empties or refills. */
  resourceResets: ["rest", "combat"],
  /** Magic (FTC chapter 6). */
  spellSchools: ["creation", "enchantment", "protection", "restoration"],
  spellActions: ["main", "minor", "reaction"],
  spellRolls: ["attack", "test", "healing", "none"],
  spellDCBase: 10,
  /** Spells learned at these levels: Casters learn 4 each time, Half-Casters 2. */
  spellLevels: [1, 4, 7, 10],
  spellsPerLevel: { caster: 4, halfCaster: 2 },
  /** How often a feature can be used. */
  usePeriods: ["turn", "combat", "rest", "recover"],
  /** Sizes (FTC chapter 3): token space in grid squares, base Load and reach in Zones. */
  sizes: {
    minute: { space: 0.5, load: 5, reach: 1 },
    compact: { space: 1, load: 10, reach: 1 },
    standard: { space: 1, load: 10, reach: 1 },
    broad: { space: 2, load: 15, reach: 2 },
    massive: { space: 3, load: 20, reach: 3 },
    colossal: { space: 4, load: 25, reach: 4 }
  },
  defaultSize: "standard",
  /** Dialects and the language each belongs to. Dialects of the same language understand each other. */
  languages: {
    bretonic: "common",
    common: "common",
    dwarvish: "dwarf",
    elvish: "elf",
    gnomish: "dwarf",
    orcish: "orc"
  },
  passiveBase: 10,
  passiveAdvantage: 3,
  restInterval: 24 * 60 * 60,
  /** Senses and how they drive token vision. */
  senses: {
    darkvision: { visionMode: "darkvision" },
    blindsight: { detectionMode: "senseAll" }
  },
  /** Conditions (FTC chapter 8). `implies` lists conditions that come with this one. */
  conditions: {
    blinded: { core: "blind" },
    deafened: { core: "deaf" },
    mute: { core: "silence" },
    burned: { core: "burning", tiered: true, damage: { category: "medium", type: "heat" } },
    chilled: { core: "frozen", tiered: true, damage: { category: "weak", type: "freeze" } },
    deprived: { core: "degen", levels: 5, hud: false },
    fainted: { core: "unconscious", implies: ["incapacitated", "prone"] },
    hidden: { core: "invisible" },
    injured: { core: "bleeding", automatic: true, hud: false },
    scared: { core: "fear" },
    incapacitated: { core: "paralysis", implies: ["mute"] },
    prone: { core: "prone" },
    restrained: { core: "restrain" },
    concentrating: { core: "eye" },
    stunned: { core: "stun", implies: ["incapacitated"] }
  },
  /** Extra statuses that are not conditions in the book but drive automation. */
  extraStatuses: {
    dodging: { core: "holyShield" },
    squeezing: { img: "icons/svg/downgrade.svg", implies: ["prone"], grid: true },
    cover: { core: "magicShield", grid: true },
    totalCover: { core: "coldShield", grid: true },
    dead: { core: "dead" }
  },
  maxDeprived: 5,
  damageTypes: ["arcane", "blast", "blunt", "cut", "freeze", "heat", "lightning", "thrust"],
  affinities: ["none", "resistance", "weakness", "immunity"],
  /** Damage dice by category and Tier. */
  damageDice: {
    weak: ["1d4", "1d6", "1d8", "1d10"],
    medium: ["1d6", "1d8", "1d10", "1d12"],
    strong: ["1d8", "1d10", "1d12", "3d4"],
    brutal: ["2d4", "2d6", "2d8", "2d10"]
  },
  /** Spell damage dice by category and Tier: about one die above weapons. Spell healing uses the weapon table. */
  spellDice: {
    weak: ["1d6", "1d8", "1d10", "1d12"],
    medium: ["1d8", "1d10", "1d12", "3d4"],
    strong: ["1d10", "1d12", "3d4", "2d8"],
    brutal: ["2d6", "2d8", "2d10", "2d12"]
  },
  /** Partial Cover: +2 Defense. */
  coverBonus: 2,
  shieldReactionBonus: 2,
  /** Rest lasts 8 hours (6 with Early Riser). */
  restHours: 8,
  /** Defense by armor and Tier. */
  armor: {
    none: [10, 11, 12, 13],
    light: [12, 13, 14, 15],
    medium: [13, 14, 15, 16],
    heavy: [14, 15, 16, 17]
  },
  baseSpeed: 6,
  /** Gear that gives light, by item name: radius in Zones (a Zone is one grid square) and how long it lasts. */
  lightSources: {
    torch: { bright: 4, dim: 8, seconds: 3600, color: "#ff9329", animation: "torch" }
  },
  /**
   * The number each automated feature uses, by feature name. A feature's own "Value" field replaces it,
   * so a number can be changed for one character without touching the code. Tier notation ("1 > 2 > 3 > 4")
   * and attributes (@strength) work.
   */
  featureValues: {
    "Mark Prey": "1 > 2 > 3 > 4",
    "Combo": "2",
    "Dueling": "1",
    "Point Blank": "1",
    "Deadeye": "19",
    "Flow": "1",
    "Low Blow": "1",
    "Great Weapon Fighting": "@strength",
    "Kick Them While They're Down": "@agility",
    "Dirty Trick": "10 + @agility",
    "Destructive Mind": "@intellect",
    "Potent Healing": "@intellect",
    "Blood Casting": "2",
    "Overcharge": "d4 > d6 > d8 > d10",
    "Brawler": "d6 > d8 > d10 > d12",
    "Second Wind": "d8 > d10 > d12 > 3d4",
    "Second Chance": "d12",
    "First Aid": "1",
    "Bulwark": "1",
    "Fleet Medic": "1",
    "Thrown Weapon Fighting": "2"
  },
  /** Biography details. */
  profileFields: ["gender", "age", "height", "weight", "hair", "eyes"],
  /** Other Speeds and their icons. */
  speeds: { swim: { icon: "fa-person-swimming" }, climb: { icon: "fa-mountain" } },
  concentrationDC: 10,
  /** Item rules (FTC chapter 5). */
  gearCategories: ["adventureGear", "ammunition", "kit", "potion"],
  armorCategories: ["light", "medium", "heavy", "shield"],
  damageCategories: ["weak", "medium", "strong", "brutal"],
  /** Weapon groups in the book. A weapon can also have a custom group. */
  weaponGroups: ["Axe", "Bow", "Crossbow", "Hammer", "Knife", "Polearm", "Sword"],
  /** Classes in the book, for Specializations and Spell lists. */
  classNames: ["Archer", "Healer", "Mage", "Thief", "Warrior"],
  /** Weapon properties. `value` is the kind of parameter the property takes, if any. */
  weaponProperties: {
    ammunition: { value: "text" },
    light: {},
    twoHanded: {},
    versatile: {},
    reach: { value: "number" },
    thrown: { value: "range" },
    reload: { value: "number" },
    flexible: { value: "attribute" },
    range: { value: "range" },
    heavy: {}
  },
  /** Armor and shield properties. `only` limits a property to armor or shields. */
  armorProperties: {
    noisy: {},
    restrictive: {},
    heavy: {},
    covering: { only: "shield" },
    reinforced: { value: "damageTypes" },
    vulnerable: { value: "damageTypes" },
    warded: { value: "conditions" },
    focused: { only: "armor" },
    deflecting: { only: "shield" },
    bashing: { only: "shield" }
  },
  heavyStrength: 2,
  bashingDamage: { category: "medium", type: "blunt", attribute: "strength" },
  potionKinds: ["life", "mana"],
  /** Potion dice: Life potions use the Life (weapon) table, Mana potions the Mana table. */
  manaDice: {
    weak: ["1d6", "1d8", "1d10", "1d12"],
    medium: ["1d8", "1d10", "1d12", "3d4"],
    strong: ["1d10", "1d12", "3d4", "2d8"],
    brutal: ["2d6", "2d8", "2d10", "2d12"]
  },
  capacityTypes: ["load", "items"],
  smallItemsPerLoad: 10,
  aurelPerLoad: 500,
  physicalTypes: ["equipment", "weapon", "armor", "container"],
  sourceBooks: { FTC: "Fragments Of The Cosmos" },
  defaultSource: "FTC"
};

/** Capitalized key used in localization paths (e.g. "strength" -> "Strength"). */
const cap = key => key.charAt(0).toUpperCase() + key.slice(1);
const loc = key => game.i18n.localize(key);
const fmt = (key, data) => game.i18n.format(key, data);
const signed = n => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);

const tierOf = level => Math.ceil(level / 3);

/** A monster's Life before its role, from the Life table of Rupture Of The Cosmos. */
const monsterLifeAt = (category, level) => TTE.monsterLife[category]?.[level - 1] ?? TTE.monsterLife.medium[level - 1];

/**
 * How many points a monster is worth (Rupture Of The Cosmos, chapter 1): 8 × √(Toughness × Threat), compared with a
 * Standard Medium monster of the group's level. Abilities the GM added (items without the "native" flag) add 10% Threat.
 * @param {Actor} actor  An npc.
 * @param {object} [options]  Level, role, number of characters (for a Boss) and the group's level (the monster's own by default).
 */
function monsterPower(actor, { level, role, characters, groupLevel } = {}) {
  const system = actor.system;
  const monster = system.monster;
  level ??= system.details.level;
  role ??= monster.role;
  characters ??= monster.characters;
  groupLevel ??= level;
  const t = tierOf(level) - 1;
  const tg = tierOf(groupLevel) - 1;
  const attr = key => {
    const a = monster.attributes[key];
    return a?.scale ? Math.min(a.value + t, TTE.attributeRange.max) : (a?.value ?? 0);
  };
  const life = Math.ceil(monsterLifeAt(system.life.category, level) * (role === "boss" ? characters : TTE.roleLife[role]));
  const defense = monster.defense + t;
  const resisted = ["blunt", "cut", "thrust"].filter(k => ["resistance", "immunity"].includes(system.affinities[k])).length;
  const features = actor.items.filter(i => i.type === "feature");
  const lasting = features.filter(i => /^(Regeneration|Undying)\b/.test(i.name)).length;
  const added = features.filter(i => ["action", "reaction", "bossAction"].includes(i.system.featureType)
    && !i.getFlag(SYSTEM_ID, "native")).length;
  const toughness = (life / monsterLifeAt("medium", groupLevel)) * (1 + (0.08 * (defense - (10 + tg))))
    * (1 + (resisted >= 3 ? 0.5 : resisted ? 0.25 : 0)) * (1 + (0.1 * lasting));
  const hits = actor.items.filter(i => i.type === "weapon").map(w => {
    const category = w.system.damage.category || "medium";
    const average = role === "minion" ? TTE.minionDamage[t] : TTE.averageDamage[category][t];
    return (average / TTE.averageDamage.medium[tg]) * (1 + (0.08 * (attr(w.system.attribute) - (2 + tg))));
  });
  const threat = TTE.roleAttacks[role] * Math.max(0.5, ...hits) * (1 + (0.1 * added));
  return 8 * Math.sqrt(Math.max(toughness, 0) * Math.max(threat, 0)) * (role === "minion" ? 0.75 : 1);
}

/**
 * A monster ability's text at its owner's level: Difficulties (10 + Attribute), attack bonuses, damage dice
 * (fixed for Minions, as inline rolls) and every "A > B > C > D" value at the monster's Tier.
 * Without an owner the text stays in book notation.
 */
function monsterText(html, actor) {
  const system = actor?.system;
  const tier = system?.details?.tier;
  if ( !html || !tier || !system.attributes ) return html;
  const value = key => system.attributes[key] ?? 0;
  return String(html)
    .replace(/<span class="tte-dc" data-attr="(\w+)">[^<]*<\/span>/g, (m, key) => String(10 + value(key)))
    .replace(/<span class="tte-atk" data-attr="(\w+)">[^<]*<\/span>/g, (m, key) => `${signed(value(key))} (${loc(`TTE.Attribute.${cap(key)}`)})`)
    .replace(/<span class="tte-dmg" data-category="(\w+)">[^<]*<\/span>/g, (m, category) => {
      if ( system.minion ) return `<strong>${TTE.minionDamage[tier - 1]}</strong>`;
      const c = TTE.damageDice[category] ? category : "medium";
      return `${loc(`TTE.DamageCategory.${c}`)} [[/r ${TTE.damageDice[c][tier - 1]}]]`;
    })
    .replace(/([^\s<>]+) > ([^\s<>]+) > ([^\s<>]+) > ([^\s<>]+)/g, (...m) => m[tier]);
}

/** A monster ability's name without a note in parentheses ("Shake Off (2 actions)" is "Shake Off"). */
const abilityName = name => String(name ?? "").replace(/’/g, "'").replace(/\s*\([^)]*\)\s*$/, "").trim();

/** A feature of this creature by its ability name (ignoring notes in parentheses). */
function monsterFeature(actor, name) {
  return actor?.items?.find(i => (i.type === "feature") && (abilityName(i.name) === name)) ?? null;
}

/**
 * Numbers a monster ability's text holds: the attribute of its Difficulty, its damage categories,
 * the damage types it names and its "A > B > C > D" values.
 */
function abilityInfo(item) {
  const html = String(item?.system?.description ?? "");
  const text = html.replace(/<[^>]+>/g, " ");
  return {
    dcAttr: html.match(/class="tte-dc" data-attr="(\w+)"/)?.[1] ?? null,
    categories: [...html.matchAll(/class="tte-dmg" data-category="(\w+)"/g)].map(m => m[1]),
    types: [...text.matchAll(/\b(Arcane|Blast|Blunt|Cut|Freeze|Heat|Lightning|Thrust)\b/g)].map(m => m[1].toLowerCase()),
    ladder: text.match(/(\d+) > (\d+) > (\d+) > (\d+)/)?.slice(1).map(Number) ?? null,
    text
  };
}

/** Damage dice of a category at a monster's Tier (a Minion's damage is a fixed number). */
function monsterDice(actor, category = "medium") {
  const tier = actor.system.details?.tier ?? 1;
  if ( actor.system.minion ) return String(TTE.minionDamage[tier - 1]);
  return TTE.damageDice[TTE.damageDice[category] ? category : "medium"][tier - 1];
}

/** A monster's Difficulty: 10 + the attribute its ability names (or its best attribute). */
function monsterDC(actor, attr) {
  const attributes = actor.system.attributes ?? {};
  const value = attr ? (attributes[attr] ?? 0) : Math.max(...Object.values(attributes), 0);
  return 10 + value;
}

/** The value for a Tier from "A > B > C > D" (Spells always list all four Tiers). */
const atTier = (notation, tier) => {
  const values = String(notation ?? "").split(">").map(v => v.trim()).filter(v => v);
  return values[Math.min(tier, values.length) - 1] ?? "";
};

/**
 * Value of a "1 > 2 > 3 > 4" notation for a Tier. A feature gained after Tier 1
 * lists values starting from the Tier in which it is gained.
 */
function tieredValue(notation, tier, gainLevel = 1) {
  const values = String(notation ?? "").split(">").map(v => Number(v.trim())).filter(v => Number.isFinite(v));
  if ( !values.length ) return 0;
  const index = Math.max(0, Math.min(tier - tierOf(gainLevel), values.length - 1));
  return values[index];
}
const xpNeeded = level => (level < TTE.maxLevel ? (level + 1) * 100 : 0);
const lifeMax = (category, level) => TTE.lifeTable[category]?.[level - 1] ?? 0;
const isGM = () => game.users.activeGM?.isSelf ?? game.user.isGM;
const PHYSICAL = ["strength", "agility", "dexterity"];

/** Combine advantage and disadvantage sources: they don't stack and cancel each other out. */
function netMode(advice) {
  const adv = advice.advantage.length > 0;
  const dis = advice.disadvantage.length > 0;
  if ( adv && !dis ) return "advantage";
  if ( dis && !adv ) return "disadvantage";
  return "normal";
}

/** Formula for critical damage: the maximum of the dice plus a new roll of the same dice. */
function criticalFormula(formula) {
  const max = new Roll(formula).evaluateSync({ maximize: true }).total;
  return `${max} + ${formula}`;
}

/** Damage dice one step up (Overcharge): d4 > d6 > d8 > d10 > d12 > 3d4 > 2d8 > 2d10 > 2d12. */
const DICE_LADDER = ["1d4", "1d6", "1d8", "1d10", "1d12", "3d4", "2d8", "2d10", "2d12"];
function upgradeDice(formula) {
  const f = String(formula ?? "").trim().replace(/^d/, "1d");
  const i = DICE_LADDER.indexOf(f);
  if ( (i >= 0) && (i < DICE_LADDER.length - 1) ) return DICE_LADDER[i + 1];
  const m = f.match(/^(\d+)d(\d+)$/);
  if ( !m ) return f;
  return Number(m[2]) < 12 ? `${m[1]}d${Number(m[2]) + 2}` : `${Number(m[1]) + 1}d12`;
}

/** Levels at which a class learns a Warrior Technique (its "Technique" features). */
function techniqueLevels(cls) {
  return (cls?.system.features ?? []).filter(f => f.name === "Technique").map(f => f.level);
}

/** "16/64" -> [16, 64]. */
function parseRange(text) {
  const m = String(text ?? "").match(/(\d+)\s*\/\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/** The token of an actor on the current scene, the controlled one first. */
function activeToken(actor) {
  if ( !globalThis.canvas?.ready || !actor ) return null;
  return canvas.tokens.controlled.find(t => t.actor === actor) ?? actor.getActiveTokens()[0] ?? null;
}

/** Distance between two tokens in Zones (a Zone is one grid square). Adjacent tokens are 1 Zone apart. */
function zoneDistance(a, b) {
  if ( !a || !b || !globalThis.canvas?.grid ) return null;
  const size = canvas.grid.size;
  const box = t => {
    const x = t.document.x / size;
    const y = t.document.y / size;
    return { x0: x, y0: y, x1: x + t.document.width, y1: y + t.document.height };
  };
  const p = box(a);
  const q = box(b);
  const gx = Math.max(0, q.x0 - p.x1, p.x0 - q.x1);
  const gy = Math.max(0, q.y0 - p.y1, p.y0 - q.y1);
  return Math.round(Math.max(gx, gy)) + 1;
}

/** Street Scoundrel: a hindered creature has any Condition other than Concentrating, Hidden or Injured. */
function isHindered(actor) {
  return [...(actor?.system?.conditions ?? [])].some(c => (c in TTE.conditions) && !["concentrating", "hidden", "injured"].includes(c));
}

/** Turns an effect lasts "until the end of its next Turn": during its own Turn, that is the Turn after. */
function turnsUntilNextTurnEnd(actor) {
  const current = game.combat?.combatant?.actor;
  return (current && actor && (current.uuid === actor.uuid)) ? 2 : 1;
}

/** Give a creature a Condition that ends at the end of its next Turn. */
async function applyTimedStatus(actor, id, turns) {
  if ( !actor?.isOwner ) return false;
  if ( !actor.statuses.has(id) ) await actor.toggleStatusEffect(id, { active: true });
  const effect = actor.effects.find(e => e.statuses?.has(id));
  if ( effect ) await effect.setFlag(SYSTEM_ID, "turnsLeft", turns ?? turnsUntilNextTurnEnd(actor));
  return true;
}

/** A short chat card: icon, title and a line of text. */
function chatNote(actor, { icon = "fa-circle-info", title, text = "" }) {
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<div class="tte-chat-card"><header><i class="fa-solid ${icon}"></i><div><h3>${title}</h3>`
      + `${text ? `<span>${text}</span>` : ""}</div></header></div>`
  });
}

/** Every actor that can be on the current scene: world actors and unlinked tokens. */
function sceneActors() {
  return new Set([...(game.actors ?? []), ...(globalThis.canvas?.scene?.tokens?.map(t => t.actor).filter(a => a) ?? [])]);
}

/** End the effects a creature keeps up with Concentration (Protective Ward, Inspire, Sanctuary...). */
async function endSpellEffects(casterUuid) {
  for ( const actor of sceneActors() ) {
    const ids = (actor.effects ?? []).filter(e => e.getFlag(SYSTEM_ID, "concentration") === casterUuid).map(e => e.id);
    if ( ids.length && actor.isOwner ) await actor.deleteEmbeddedDocuments("ActiveEffect", ids);
  }
}

/** Ask whether a creature uses a Reaction (Guardian, Shield Fighting, Arcane Blood...). */
async function askReaction(actor, feature, text) {
  if ( !actor?.isOwner || !game.settings.get(SYSTEM_ID, "reactionPrompts") ) return false;
  return foundry.applications.api.DialogV2.confirm({
    window: { title: `${actor.name}: ${feature.name ?? feature}` },
    content: `<p>${text}</p>`,
    rejectClose: false
  });
}

/* -------------------------------------------- */
/*  Data Models                                 */
/* -------------------------------------------- */

class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const int = (options = {}) => new fields.NumberField({ required: true, nullable: false, integer: true, ...options });
    return {
      attributes: new fields.SchemaField(Object.fromEntries(TTE.attributes.map(key => [
        key, int({ initial: 0, min: TTE.attributeRange.min, max: TTE.attributeRange.max })
      ]))),
      skills: new fields.SchemaField(Object.fromEntries(TTE.skills.map(key => [
        key, new fields.SchemaField({ rank: int({ initial: 0, min: 0, max: 3 }) })
      ]))),
      details: new fields.SchemaField({
        class: new fields.StringField({ initial: "" }),
        specialization: new fields.StringField({ initial: "" }),
        level: int({ initial: 1, min: 1, max: TTE.maxLevel }),
        xp: int({ initial: 0, min: 0 })
      }),
      life: new fields.SchemaField({
        value: int({ initial: lifeMax("medium", 1), min: 0 }),
        category: new fields.StringField({ required: true, initial: "medium", choices: TTE.lifeCategories })
      }),
      wounds: int({ initial: 0, min: 0, max: TTE.maxWounds }),
      deprived: int({ initial: 0, min: 0, max: TTE.maxDeprived }),
      conditionTier: new fields.SchemaField(Object.fromEntries(
        Object.entries(TTE.conditions).filter(([, c]) => c.tiered).map(([key]) => [key, int({ initial: 1, min: 1, max: 4 })])
      )),
      currency: int({ initial: 0, min: 0 }),
      size: new fields.StringField({ required: true, initial: TTE.defaultSize, choices: Object.keys(TTE.sizes) }),
      languages: new fields.SchemaField({
        value: new fields.SetField(new fields.StringField({ blank: false })),
        custom: new fields.StringField({ initial: "" })
      }),
      speed: int({ initial: TTE.baseSpeed, min: 0 }),
      /** Defense is derived from armor, shield, Tier and effects; the field only lets modules (token bars) find it. */
      defense: int({ initial: 10, min: 0 }),
      /** Swim and Climb Speeds (0 = none: those cost +1 Zone). */
      speeds: new fields.SchemaField(Object.fromEntries(Object.keys(TTE.speeds).map(key => [key, int({ initial: 0, min: 0 })]))),
      affinities: new fields.SchemaField(Object.fromEntries(TTE.damageTypes.map(key => [
        key, new fields.StringField({ required: true, initial: "none", choices: TTE.affinities })
      ]))),
      mana: new fields.SchemaField({ value: int({ initial: 0, min: 0 }) }),
      resource: new fields.SchemaField({
        label: new fields.StringField({ initial: "" }),
        value: int({ initial: 0, min: 0 }),
        max: int({ initial: 0, min: 0 })
      }),
      senses: new fields.SchemaField(Object.fromEntries(Object.keys(TTE.senses).map(key => [
        key, int({ initial: 0, min: 0 })
      ]))),
      lastRest: new fields.NumberField({ required: false, nullable: true, initial: null }),
      biography: new fields.HTMLField({ initial: "" }),
      appearance: new fields.HTMLField({ initial: "" }),
      profile: new fields.SchemaField(Object.fromEntries(TTE.profileFields.map(key => [key, new fields.StringField({ initial: "" })])))
    };
  }

  prepareDerivedData() {
    const level = this.details.level;
    this.details.tier = tierOf(level);
    this.details.xpNext = xpNeeded(level) || null;
    this.race = this.parent.items?.find(i => i.type === "race") ?? null;
    this.#prepareClass();
    this.life.max = this.maxLife(this.life.category, level, this.deprived);
    this.reach = (TTE.sizes[this.size] ?? TTE.sizes[TTE.defaultSize]).reach;
    this.life.injured = this.life.value <= (this.life.max / 2);
    this.skillRankLimit = Math.min(this.details.tier, 3);
    this.passivePerception = TTE.passiveBase + this.attributes.spirit + this.skills.perception.rank;
    this.#prepareInventory();

    // Conditions in effect, including the ones that come with another condition.
    const conditions = new Set(this.parent.statuses ?? []);
    if ( this.deprived > 0 ) conditions.add("deprived");
    if ( this.life.injured ) conditions.add("injured");
    let added = true;
    while ( added ) {
      added = false;
      for ( const id of [...conditions] ) {
        for ( const implied of (TTE.conditions[id] ?? TTE.extraStatuses[id])?.implies ?? [] ) {
          if ( !conditions.has(implied) ) { conditions.add(implied); added = true; }
        }
      }
    }
    this.conditions = conditions;
    this.fainted = conditions.has("fainted");
    this.dead = conditions.has("dead");

    // Spell effects on this creature (Protective Ward, Inspire, Quicken...): see SPELL_EFFECTS.
    const buffs = (this.parent.effects ?? []).filter(e => !e.disabled && e.getFlag(SYSTEM_ID, "spellBuff"));
    const sum = key => buffs.reduce((total, e) => total + (Number(e.getFlag(SYSTEM_ID, "spellBuff")[key]) || 0), 0);
    this.defense += sum("defense");
    this.rollBonuses = buffs.filter(e => Number(e.getFlag(SYSTEM_ID, "spellBuff").roll)).map(e => ({
      label: e.name, value: Number(e.getFlag(SYSTEM_ID, "spellBuff").roll)
    }));

    let speed = this.speed + sum("speed");
    // Fleet Medic (Field Doctor): Speed +1 Zone.
    if ( this.parent.items?.some(i => (i.type === "feature") && (i.name === "Fleet Medic")) ) speed += this.parent.featureNumber("Fleet Medic");
    const halved = conditions.has("chilled") || (this.deprived >= 2) || this.gear.heavyPenalty;
    if ( halved ) speed = Math.ceil(speed / 2);
    if ( conditions.has("fainted") || conditions.has("restrained") ) speed = 0;
    // Opportunist: Speed 0 until the end of its Turn.
    if ( this.parent.effects?.some(e => !e.disabled && e.getFlag(SYSTEM_ID, "speedZero")) ) speed = 0;
    this.movement = speed;
  }

  /** Load, Defense and what equipped armor and shields do. */
  #prepareInventory() {
    const items = this.parent.items;
    const tier = this.details.tier;

    // Load: items count unless they sit in a container that isn't carried or doesn't weigh anything.
    const counts = item => {
      let parent = items.get(item.system.container);
      const seen = new Set();
      while ( parent && !seen.has(parent.id) ) {
        seen.add(parent.id);
        if ( !parent.system.carried || parent.system.weightless ) return false;
        parent = items.get(parent.system.container);
      }
      return true;
    };
    let load = 0;
    let small = 0;
    let bonus = 0;
    for ( const item of items ) {
      if ( !TTE.physicalTypes.includes(item.type) ) continue;
      if ( (item.type === "container") && !item.system.carried ) continue;
      if ( !counts(item) ) continue;
      if ( item.system.load > 0 ) load += item.system.quantity * item.system.load;
      else small += item.system.quantity;
      if ( (item.type === "container") && item.system.equipped ) bonus += item.system.loadBonus;
    }
    load += Math.floor(small / TTE.smallItemsPerLoad) + Math.floor(this.currency / TTE.aurelPerLoad);
    this.load = {
      value: Math.round(load * 100) / 100,
      max: (TTE.sizes[this.size] ?? TTE.sizes[TTE.defaultSize]).load + this.attributes.strength + bonus,
      small
    };

    // Defense: the best equipped armor for your Tier, plus one shield.
    const equipped = items.filter(i => (i.type === "armor") && i.system.equipped);
    const armor = equipped.filter(i => i.system.category !== "shield")
      .sort((a, b) => TTE.armor[b.system.category][0] - TTE.armor[a.system.category][0])[0] ?? null;
    const shield = equipped.filter(i => i.system.category === "shield")
      .sort((a, b) => b.system.shieldBonus - a.system.shieldBonus)[0] ?? null;
    this.defense = TTE.armor[armor?.system.category ?? "none"][tier - 1] + (shield?.system.shieldBonus ?? 0);

    // Properties of what you wear.
    const worn = [armor, shield].filter(i => i);
    const has = key => worn.some(i => i.system.properties[key]);
    const set = key => new Set(worn.flatMap(i => [...i.system.properties[key]]));
    const strong = this.attributes.strength >= TTE.heavyStrength;
    this.gear = {
      armor, shield,
      noisy: has("noisy"),
      restrictive: has("restrictive"),
      focused: has("focused"),
      heavyPenalty: has("heavy") && !strong,
      warded: set("warded")
    };

    // Affinities: what you set yourself, plus Reinforced (Resistance) and Vulnerable (Weakness).
    // Resistance and Weakness to the same type cancel each other out.
    const reinforced = set("reinforced");
    const vulnerable = set("vulnerable");
    this.affinity = {};
    for ( const type of TTE.damageTypes ) {
      let value = this.affinities[type];
      if ( value !== "immunity" ) {
        const resist = (value === "resistance") || reinforced.has(type);
        const weak = (value === "weakness") || vulnerable.has(type);
        value = resist && weak ? "none" : resist ? "resistance" : weak ? "weakness" : "none";
      }
      this.affinity[type] = value;
    }
  }

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
    this.parent.updateSource({ "prototypeToken.actorLink": true, "prototypeToken.sight.enabled": true });
  }

  /** What the class gives: Life category, Mana, Conjuring Attribute and its own resource (like Combo). */
  #prepareClass() {
    const items = this.parent.items;
    const cls = items?.find(i => i.type === "class") ?? null;
    this.class = cls;
    this.specialization = items?.find(i => i.type === "specialization") ?? null;
    if ( cls ) this.life.category = cls.system.life;
    const manaType = cls?.system.mana ?? "none";
    this.mana.max = TTE.manaTable[manaType]?.[this.details.level - 1] ?? 0;
    this.conjuring = cls?.system.conjuring || null;
    const conjuringValue = this.conjuring ? this.attributes[this.conjuring] : 0;
    this.spellAttack = conjuringValue;
    this.spellDC = TTE.spellDCBase + conjuringValue;
    const perLevel = TTE.spellsPerLevel[manaType] ?? 0;
    this.spellsKnownMax = TTE.spellLevels.filter(l => l <= this.details.level).length * perLevel;
    this.resourceReset = "rest";
    this.resourceFromClass = false;
    if ( cls?.system.resource.label ) {
      this.resource.label = cls.system.resource.label;
      this.resource.max = tieredValue(cls.system.resource.max, this.details.tier);
      this.resourceReset = cls.system.resource.reset;
      this.resourceFromClass = true;
    }
  }

  /** Maximum Life: the Life table, plus the race's bonus. Deprived 4 halves it (round up). */
  maxLife(category, level, deprived) {
    const max = lifeMax(category, level) + (this.race?.system.lifeBonus ?? 0);
    return deprived >= 4 ? Math.ceil(max / 2) : max;
  }

  /** Keep Life within bounds and apply the "reaching 0 Life" rule. */
  async _preUpdate(changes, options, user) {
    if ( (await super._preUpdate(changes, options, user)) === false ) return false;
    const { getProperty, setProperty } = foundry.utils;

    // Remember the old level for the level up reminder (TTEActor#_onUpdate).
    const newLevel = getProperty(changes, "system.details.level");
    if ( (newLevel !== undefined) && (newLevel !== this.details.level) ) options.tteLevelFrom = this.details.level;

    // Size sets how many grid squares the token takes.
    const size = getProperty(changes, "system.size");
    if ( size && TTE.sizes[size] ) {
      const space = TTE.sizes[size].space;
      setProperty(changes, "prototypeToken.width", space);
      setProperty(changes, "prototypeToken.height", space);
    }

    const level = getProperty(changes, "system.details.level") ?? this.details.level;

    // XP can never go past what the current level needs.
    const xp = getProperty(changes, "system.details.xp") ?? this.details.xp;
    const xpMax = xpNeeded(level);
    if ( xp > xpMax ) setProperty(changes, "system.details.xp", xpMax);
    else if ( getProperty(changes, "system.details.xp") !== undefined ) setProperty(changes, "system.details.xp", Math.max(0, xp));

    // A new level raises current Life and Mana by what their maximum grew; a lower level caps them.
    if ( (level !== this.details.level) && (getProperty(changes, "system.life.value") === undefined) && (this.life.value > 0) ) {
      const category = this.class ? this.class.system.life : this.life.category;
      const grown = this.maxLife(category, level, this.deprived) - this.life.max;
      setProperty(changes, "system.life.value", Math.max(1, this.life.value + Math.max(0, grown)));
    }
    const manaType = this.class?.system.mana ?? "none";
    if ( (level !== this.details.level) && (manaType !== "none") && (getProperty(changes, "system.mana.value") === undefined) ) {
      const newMax = TTE.manaTable[manaType][level - 1];
      const grown = newMax - this.mana.max;
      setProperty(changes, "system.mana.value", Math.min(newMax, this.mana.value + Math.max(0, grown)));
    }

    const newValue = getProperty(changes, "system.life.value");
    if ( newValue === undefined ) return;
    const category = this.class ? this.class.system.life : (getProperty(changes, "system.life.category") ?? this.life.category);
    const deprived = getProperty(changes, "system.deprived") ?? this.deprived;
    const max = this.maxLife(category, level, deprived);
    let value = Math.max(0, Math.min(Number(newValue) || 0, max));
    // Last Stand (Defender): once per Recover, drop to 1 Life instead of 0.
    if ( (this.life.value > 0) && (value === 0) && !options.tteNoLastStand ) {
      const lastStand = this.parent.items.find(i => (i.type === "feature") && (i.name === "Last Stand"));
      if ( lastStand?.system.uses.value > 0 ) {
        value = 1;
        options.tteLastStand = lastStand.id;
      }
    }
    setProperty(changes, "system.life.value", value);

    // Statuses are effects, so they are applied after the update (see TTEActor#_onUpdate).
    options.tteStatus ??= {};
    if ( (this.life.value > 0) && (value === 0) ) {
      options.tteStatus.fainted = true;
      const wounds = (getProperty(changes, "system.wounds") ?? this.wounds) + 1;
      setProperty(changes, "system.wounds", Math.min(wounds, TTE.maxWounds));
      if ( wounds > TTE.maxWounds ) options.tteStatus.dead = true;
    }
    else if ( (this.life.value === 0) && (value > 0) ) options.tteStatus.fainted = false;
  }
}

/**
 * Monsters and other NPCs (Rupture Of The Cosmos). They share the character's data so rolls, attacks, conditions and
 * effects work the same, but their numbers come from Level and Role: Attributes marked to scale rise by 1 per Tier
 * (up to +5), Defense is the Tier 1 value + Tier − 1, and Life comes from the monster Life table times the role.
 */
class NpcData extends CharacterData {
  static defineSchema() {
    const int = (options = {}) => new fields.NumberField({ required: true, nullable: false, integer: true, ...options });
    return {
      ...super.defineSchema(),
      monster: new fields.SchemaField({
        type: new fields.StringField({ required: true, initial: "beast", choices: TTE.monsterTypes }),
        role: new fields.StringField({ required: true, initial: "standard", choices: TTE.monsterRoles }),
        /** Characters a Boss faces: its Life and points are multiplied by them. */
        characters: int({ initial: 4, min: 1, max: 8 }),
        /** Defense at Tier 1. */
        defense: int({ initial: 10, min: 0 }),
        /** Attributes at Tier 1; the ones that scale rise by 1 per Tier. */
        attributes: new fields.SchemaField(Object.fromEntries(TTE.attributes.map(key => [key, new fields.SchemaField({
          value: int({ initial: 0, min: TTE.attributeRange.min, max: TTE.attributeRange.max }),
          scale: new fields.BooleanField({ initial: false })
        })]))),
        conditionImmunities: new fields.SetField(new fields.StringField({ blank: false })),
        /** Conjuring Attribute for monsters that know Spells. */
        conjuring: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.attributes] })
      })
    };
  }

  prepareDerivedData() {
    const monster = this.monster;
    const tier = tierOf(this.details.level);
    for ( const key of TTE.attributes ) {
      const a = monster.attributes[key];
      this.attributes[key] = a.scale ? Math.min(a.value + tier - 1, TTE.attributeRange.max) : a.value;
    }
    this.minion = monster.role === "minion";
    this.boss = monster.role === "boss";
    super.prepareDerivedData();

    // Defense: Tier 1 value + Tier − 1, plus Spell effects.
    const buffs = (this.parent.effects ?? []).filter(e => !e.disabled && e.getFlag(SYSTEM_ID, "spellBuff"));
    this.defense = monster.defense + tier - 1
      + buffs.reduce((total, e) => total + (Number(e.getFlag(SYSTEM_ID, "spellBuff").defense) || 0), 0);
    // Condition immunities work like Warded armor.
    this.gear.warded = new Set([...this.gear.warded, ...monster.conditionImmunities]);
    this.conjuring = monster.conjuring || null;
    this.spellAttack = this.conjuring ? this.attributes[this.conjuring] : 0;
    this.spellDC = TTE.spellDCBase + this.spellAttack;
    this.power = this.parent.items ? monsterPower(this.parent) : 0;
  }

  /** Maximum Life: the monster Life table times the role (a Boss: times the characters). Deprived 4 halves it. */
  maxLife(category, level, deprived) {
    const role = this.monster.role;
    const max = Math.ceil(monsterLifeAt(category, level) * (role === "boss" ? this.monster.characters : TTE.roleLife[role]));
    return deprived >= 4 ? Math.ceil(max / 2) : max;
  }

  async _preCreate(data, options, user) {
    if ( (await foundry.abstract.TypeDataModel.prototype._preCreate.call(this, data, options, user)) === false ) return false;
    // Monster tokens are unlinked (each one has its own Life) and hostile, unless the data says otherwise.
    const update = {};
    if ( !foundry.utils.hasProperty(data, "prototypeToken.actorLink") ) update["prototypeToken.actorLink"] = false;
    if ( !foundry.utils.hasProperty(data, "prototypeToken.disposition") ) update["prototypeToken.disposition"] = CONST.TOKEN_DISPOSITIONS.HOSTILE;
    if ( Object.keys(update).length ) this.parent.updateSource(update);
  }

  /** A monster that drops to 0 Life dies instead of falling Fainted (no Wounds). */
  async _preUpdate(changes, options, user) {
    if ( (await super._preUpdate(changes, options, user)) === false ) return false;
    if ( options.tteStatus?.fainted ) {
      delete options.tteStatus.fainted;
      options.tteStatus.dead = true;
      foundry.utils.setProperty(changes, "system.wounds", this.wounds);
    }
    else if ( options.tteStatus?.fainted === false ) {
      delete options.tteStatus.fainted;
      options.tteStatus.dead = false;
    }
    // A new role or number of characters keeps the same share of Life.
    const role = foundry.utils.getProperty(changes, "system.monster.role");
    const characters = foundry.utils.getProperty(changes, "system.monster.characters");
    if ( ((role && (role !== this.monster.role)) || (characters && (characters !== this.monster.characters)))
      && (foundry.utils.getProperty(changes, "system.life.value") === undefined) && this.life.max ) {
      const r = role ?? this.monster.role;
      const c = characters ?? this.monster.characters;
      const level = foundry.utils.getProperty(changes, "system.details.level") ?? this.details.level;
      const max = Math.ceil(monsterLifeAt(this.life.category, level) * (r === "boss" ? c : TTE.roleLife[r]));
      foundry.utils.setProperty(changes, "system.life.value", Math.max(1, Math.round(max * (this.life.value / this.life.max))));
    }
  }
}

class RaceData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const int = (options = {}) => new fields.NumberField({ required: true, nullable: false, integer: true, ...options });
    return {
      description: new fields.HTMLField({ initial: "" }),
      size: new fields.StringField({ required: true, initial: TTE.defaultSize, choices: Object.keys(TTE.sizes) }),
      speed: int({ initial: TTE.baseSpeed, min: 0 }),
      languages: new fields.SetField(new fields.StringField({ blank: false })),
      senses: new fields.SchemaField(Object.fromEntries(Object.keys(TTE.senses).map(key => [key, int({ initial: 0, min: 0 })]))),
      lifeBonus: int({ initial: 0 }),
      /** Extra Skills to choose at character creation (e.g. Adaptable). */
      skills: int({ initial: 0, min: 0 }),
      details: new fields.SchemaField({
        height: new fields.StringField({ initial: "" }),
        weight: new fields.StringField({ initial: "" }),
        lifespan: new fields.StringField({ initial: "" })
      }),
      features: grantedFeatureField(),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }
}

class FeatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      featureType: new fields.StringField({ required: true, initial: "class", choices: TTE.featureTypes }),
      level: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1, max: TTE.maxLevel }),
      uses: new fields.SchemaField({
        spent: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        max: new fields.StringField({ initial: "" }),
        per: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.usePeriods] })
      }),
      /** The number an automated feature uses (see TTE.featureValues); empty = the book's value. */
      value: new fields.StringField({ initial: "" }),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }

  prepareDerivedData() {
    // Uses can grow with Tier ("1 > 2 > 3 > 4 times per combat").
    const level = this.parent.actor?.system?.details?.level ?? 1;
    const max = this.uses.max ? tieredValue(this.uses.max, tierOf(level), this.level) : 0;
    this.uses.value = Math.max(0, max - this.uses.spent);
    this.uses.total = max;
  }
}

/** An item by name and quantity, looked up in the Items compendium. */
const itemEntryField = () => new fields.SchemaField({
  name: new fields.StringField({ initial: "" }),
  quantity: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1 })
});

/** A feature as written in a race, class or specialization. */
const grantedFeatureField = () => new fields.ArrayField(new fields.SchemaField({
  name: new fields.StringField({ initial: "" }),
  level: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1, max: TTE.maxLevel }),
  description: new fields.HTMLField({ initial: "" }),
  uses: new fields.SchemaField({
    max: new fields.StringField({ initial: "" }),
    per: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.usePeriods] })
  })
}));

class SpellData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      school: new fields.StringField({ required: true, initial: "creation", choices: TTE.spellSchools }),
      action: new fields.StringField({ required: true, initial: "main", choices: TTE.spellActions }),
      trigger: new fields.StringField({ initial: "" }),
      range: new fields.StringField({ initial: "" }),
      duration: new fields.StringField({ initial: "Instant" }),
      concentration: new fields.BooleanField({ initial: false }),
      components: new fields.SchemaField({
        verbal: new fields.BooleanField({ initial: true }),
        somatic: new fields.BooleanField({ initial: false })
      }),
      roll: new fields.SchemaField({
        type: new fields.StringField({ required: true, initial: "none", choices: TTE.spellRolls }),
        /** Damage or healing category: the dice come from the table for the Tier. Empty = the custom formula. */
        category: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.damageCategories] }),
        formula: new fields.StringField({ initial: "" }),
        damageType: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.damageTypes] }),
        attribute: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.attributes] })
      }),
      classes: new fields.StringField({ initial: "" }),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }

  /** Spells made before categories: a formula that matches a table row becomes that category. */
  static migrateData(source) {
    const roll = source.roll;
    if ( roll && !roll.category && roll.formula ) {
      const norm = text => String(text).split(">").map(v => v.trim().replace(/^1d/, "d")).join(" > ");
      const table = roll.type === "healing" ? TTE.damageDice : TTE.spellDice;
      const match = Object.entries(table).find(([, dice]) => norm(dice.join(">")) === norm(roll.formula));
      if ( match ) {
        roll.category = match[0];
        roll.formula = "";
      }
    }
    return super.migrateData(source);
  }

  /** The dice table this Spell uses: healing uses the weapon table, damage the Spell table. */
  get diceTable() {
    return this.roll.type === "healing" ? TTE.damageDice : TTE.spellDice;
  }

  /** Damage or healing dice at a Tier. */
  formulaAt(tier) {
    if ( this.roll.category ) return this.diceTable[this.roll.category]?.[tier - 1] ?? "";
    return atTier(this.roll.formula, tier);
  }

  /** The dice for every Tier, e.g. "d10 > d12 > 3d4 > 2d8". */
  get diceLabel() {
    if ( this.roll.category ) return this.diceTable[this.roll.category].map(d => d.replace(/^1d/, "d")).join(" > ");
    return this.roll.formula;
  }

  /** The Spell rolls dice. */
  get hasDice() {
    return !!(this.roll.category || this.roll.formula);
  }

  /** Components as letters, e.g. "V, S". */
  get componentLabel() {
    return [this.components.verbal && "V", this.components.somatic && "S"].filter(Boolean).join(", ");
  }
}

class ClassData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      life: new fields.StringField({ required: true, initial: "medium", choices: TTE.lifeCategories }),
      skills: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 3, min: 0 }),
      mana: new fields.StringField({ required: true, initial: "none", choices: TTE.manaTypes }),
      conjuring: new fields.StringField({ initial: "", blank: true, choices: ["", ...TTE.attributes] }),
      resource: new fields.SchemaField({
        label: new fields.StringField({ initial: "" }),
        max: new fields.StringField({ initial: "" }),
        reset: new fields.StringField({ required: true, initial: "rest", choices: TTE.resourceResets })
      }),
      noConcentration: new fields.BooleanField({ initial: false }),
      startingEquipment: new fields.HTMLField({ initial: "" }),
      /** Starting equipment for the character creator: groups of options, each option a list of items. */
      equipment: new fields.ArrayField(new fields.ArrayField(new fields.ArrayField(itemEntryField()))),
      weaponChoices: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
      currency: new fields.StringField({ initial: "1d12 * 10" }),
      features: grantedFeatureField(),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }
}

class SpecializationData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      class: new fields.StringField({ initial: "" }),
      features: grantedFeatureField(),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }
}

/** Fields every physical item has: Category, Load, Value and Description, plus where it is kept. */
class PhysicalItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      quantity: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 0 }),
      load: new fields.NumberField({ required: true, nullable: false, initial: 1, min: 0 }),
      value: new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 }),
      container: new fields.StringField({ required: false, nullable: true, blank: false, initial: null }),
      source: new fields.StringField({ initial: TTE.defaultSource })
    };
  }

  /** The container this item is in, if any. */
  get containerItem() {
    return this.parent.actor?.items.get(this.container) ?? null;
  }
}

class EquipmentData extends PhysicalItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      category: new fields.StringField({ required: true, initial: "adventureGear", choices: TTE.gearCategories }),
      /** What a kit unpacks into. */
      contents: new fields.ArrayField(itemEntryField()),
      /** Ammunition: pieces spent from the current bundle (a bundle's size comes from its name, like "Arrows (20)"). */
      charges: new fields.SchemaField({
        spent: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 })
      }),
      potion: new fields.SchemaField({
        kind: new fields.StringField({ required: true, initial: "life", choices: TTE.potionKinds }),
        potency: new fields.StringField({ required: true, initial: "weak", choices: TTE.damageCategories })
      })
    };
  }
  /** Pieces in one bundle of ammunition ("Arrows (20)" is 20); other gear is 1. */
  get bundleSize() {
    if ( this.category !== "ammunition" ) return 1;
    return Number(this.parent?.name.match(/\((\d+)\)/)?.[1]) || 1;
  }

  /** Pieces of ammunition left, across every bundle. */
  get ammoLeft() {
    if ( this.quantity < 1 ) return 0;
    return (this.quantity * this.bundleSize) - Math.min(this.charges.spent, this.bundleSize);
  }

  /** Spend one piece: a bundle that runs out is used up. */
  async spendAmmo() {
    const size = this.bundleSize;
    const spent = this.charges.spent + 1;
    if ( spent >= size ) return this.parent.update({ "system.quantity": Math.max(0, this.quantity - 1), "system.charges.spent": 0 });
    return this.parent.update({ "system.charges.spent": spent });
  }

}

class WeaponData extends PhysicalItemData {
  static defineSchema() {
    const props = {};
    for ( const [key, config] of Object.entries(TTE.weaponProperties) ) {
      if ( !config.value ) props[key] = new fields.BooleanField({ initial: false });
      else if ( config.value === "number" ) props[key] = new fields.NumberField({ required: false, nullable: true, integer: true, min: 0, initial: null });
      else props[key] = new fields.StringField({ initial: "" });
    }
    return {
      ...super.defineSchema(),
      group: new fields.StringField({ initial: "" }),
      attribute: new fields.StringField({ required: true, initial: "strength", choices: TTE.attributes }),
      damage: new fields.SchemaField({
        /** Empty = the custom formula below. */
        category: new fields.StringField({ required: true, initial: "medium", blank: true, choices: ["", ...TTE.damageCategories] }),
        formula: new fields.StringField({ initial: "" }),
        type: new fields.StringField({ required: true, initial: "cut", choices: TTE.damageTypes })
      }),
      properties: new fields.SchemaField(props),
      equipped: new fields.BooleanField({ initial: false })
    };
  }

  /** Damage dice for a Tier. Versatile with two hands goes up one category. */
  damageFormula(tier, { upgrade = false } = {}) {
    // Minions deal fixed damage by Tier, whatever they attack with.
    if ( this.parent?.actor?.system?.minion ) return String(TTE.minionDamage[tier - 1]);
    if ( !this.damage.category ) {
      const formula = atTier(this.damage.formula, tier) || "1d4";
      return upgrade ? upgradeDice(formula) : formula;
    }
    let index = TTE.damageCategories.indexOf(this.damage.category);
    if ( upgrade ) index = Math.min(index + 1, TTE.damageCategories.length - 1);
    return TTE.damageDice[TTE.damageCategories[index]][tier - 1];
  }

  /** Damage as words, e.g. "Medium Cut" (just "Cut" with a custom formula). */
  get damageLabel() {
    const type = loc(`TTE.DamageType.${this.damage.type}`);
    return this.damage.category ? `${loc(`TTE.DamageCategory.${this.damage.category}`)} ${type}` : type;
  }

  /** Short property labels, e.g. "Light, Thrown (4/12)". */
  get propertyLabels() {
    return Object.entries(TTE.weaponProperties).flatMap(([key, config]) => {
      const value = this.properties[key];
      if ( !value ) return [];
      const label = loc(`TTE.WeaponProperty.${key}`);
      if ( !config.value ) return [label];
      const shown = config.value === "attribute" ? loc(`TTE.Attribute.${cap(value)}`) : value;
      return [`${label} (${shown})`];
    });
  }
}

class ArmorData extends PhysicalItemData {
  static defineSchema() {
    const props = {};
    for ( const [key, config] of Object.entries(TTE.armorProperties) ) {
      if ( !config.value ) props[key] = new fields.BooleanField({ initial: false });
      else {
        const choices = config.value === "damageTypes" ? TTE.damageTypes : Object.keys(TTE.conditions);
        props[key] = new fields.SetField(new fields.StringField({ choices }));
      }
    }
    return {
      ...super.defineSchema(),
      category: new fields.StringField({ required: true, initial: "light", choices: TTE.armorCategories }),
      shieldBonus: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 0 }),
      properties: new fields.SchemaField(props),
      equipped: new fields.BooleanField({ initial: false })
    };
  }

  get isShield() {
    return this.category === "shield";
  }

  /** Defense this armor gives at a Tier, or the shield's bonus. */
  defenseAt(tier) {
    return this.isShield ? this.shieldBonus : TTE.armor[this.category][tier - 1];
  }

  get propertyLabels() {
    return Object.entries(TTE.armorProperties).flatMap(([key, config]) => {
      const value = this.properties[key];
      const label = loc(`TTE.ArmorProperty.${key}`);
      if ( !config.value ) return value ? [label] : [];
      const prefix = config.value === "damageTypes" ? "TTE.DamageType" : "TTE.Condition";
      return [...value].map(v => `${label} (${loc(`${prefix}.${v}`)})`);
    });
  }
}

class ContainerData extends PhysicalItemData {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      capacity: new fields.SchemaField({
        type: new fields.StringField({ required: true, initial: "load", choices: TTE.capacityTypes }),
        value: new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 })
      }),
      loadBonus: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
      weightless: new fields.BooleanField({ initial: false }),
      carried: new fields.BooleanField({ initial: true }),
      equipped: new fields.BooleanField({ initial: false })
    };
  }

  /** Items directly inside this container. */
  get contents() {
    return this.parent.actor?.items.filter(i => i.system.container === this.parent.id) ?? [];
  }

  /** How full the container is, in its capacity unit (Load or number of items). */
  get used() {
    const contents = this.contents;
    if ( this.capacity.type === "items" ) return contents.reduce((n, i) => n + i.system.quantity, 0);
    return contents.reduce((n, i) => n + (i.system.quantity * (i.system.load ?? 0)), 0);
  }
}

/* -------------------------------------------- */
/*  Documents                                   */
/* -------------------------------------------- */

class TTEActor extends Actor {

  /* -------------------------------------------- */
  /*  Tests                                       */
  /* -------------------------------------------- */

  /**
   * Roll an attribute test: d20 + attribute.
   * @param {string} key                Attribute key.
   * @param {object} [options]
   * @param {boolean} [options.dialog]  Show the roll dialog.
   */
  async rollAttribute(key, { dialog = true, dc = null, label = null } = {}) {
    label ??= loc(`TTE.Attribute.${cap(key)}`);
    const advice = this.getAdvice({ attribute: key });
    const config = dialog
      ? await TTERollDialog.prompt({ title: fmt("TTE.Roll.Title", { name: label }), advice, fields: this.#testOptions() })
      : { mode: netMode(advice) };
    if ( !config ) return null;
    return this.#rollTest({ ...config, mode: await this.#testMode(config), label, attribute: key, dc });
  }

  /**
   * Roll a skill test: d20 + chosen attribute + skill rank.
   * Skills are not tied to an attribute, so the attribute is picked in the dialog.
   * @param {string} key                Skill key.
   * @param {object} [options]
   * @param {boolean} [options.dialog]  Show the roll dialog.
   */
  async rollSkill(key, { dialog = true } = {}) {
    const label = loc(`TTE.Skill.${cap(key)}`);
    const advice = this.getAdvice({ skill: key });
    const config = dialog
      ? await TTERollDialog.prompt({ title: fmt("TTE.Roll.Title", { name: label }), chooseAttribute: true, advice, fields: this.#testOptions(key) })
      : { mode: netMode(advice) };
    if ( !config ) return null;
    return this.#rollTest({ ...config, mode: await this.#testMode(config), label, skill: key });
  }

  /**
   * Roll a flat test: d20 with no attribute or skill.
   * @param {object} [options]
   * @param {boolean} [options.dialog]  Show the roll dialog.
   */
  async rollFlat({ dialog = true } = {}) {
    const label = loc("TTE.FlatTest");
    const advice = this.getAdvice();
    const config = dialog
      ? await TTERollDialog.prompt({ title: fmt("TTE.Roll.Title", { name: label }), advice, fields: this.#testOptions() })
      : { mode: netMode(advice) };
    if ( !config ) return null;
    return this.#rollTest({ ...config, mode: await this.#testMode(config), label });
  }

  /** Extra choices for a Test: Driven to Conquer (Advantage once per Rest), Forest Stalker (Stealth in a forest). */
  #testOptions(skill = null) {
    const fields = [];
    const driven = this.featureReady("Driven to Conquer");
    if ( driven ) fields.push({ name: "driven", type: "checkbox", value: false, label: driven.name, hint: loc("TTE.Feature.DrivenHint") });
    const forest = (skill === "stealth") && this.feature("Forest Stalker");
    if ( forest ) fields.push({ name: "forest", type: "checkbox", value: false, label: forest.name, hint: loc("TTE.Feature.ForestStalkerHint") });
    return fields;
  }

  /** The roll mode after Driven to Conquer or Forest Stalker: Advantage, or normal if there was Disadvantage. */
  async #testMode(config) {
    const extra = config.extra ?? {};
    let advantage = !!extra.forest && !!this.feature("Forest Stalker");
    const driven = extra.driven && this.featureReady("Driven to Conquer");
    if ( driven ) {
      await this.spendFeature(driven);
      advantage = true;
    }
    if ( !advantage || (config.mode === "advantage") ) return config.mode;
    return config.mode === "disadvantage" ? "normal" : "advantage";
  }

  /**
   * Passive test: 10 + modifiers. Advantage and Disadvantage are a flat +3 or -3.
   * @param {object} [options]
   * @param {string} [options.attribute]  Attribute key.
   * @param {string} [options.skill]      Skill key.
   * @param {string} [options.mode]       "advantage", "normal" or "disadvantage".
   * @returns {number}
   */
  getPassive({ attribute, skill, mode = "normal" } = {}) {
    let total = TTE.passiveBase;
    if ( attribute ) total += this.system.attributes[attribute];
    if ( skill ) total += this.system.skills[skill].rank;
    if ( mode === "advantage" ) total += TTE.passiveAdvantage;
    else if ( mode === "disadvantage" ) total -= TTE.passiveAdvantage;
    return total;
  }

  /**
   * Advantage and Disadvantage this creature's conditions suggest for a roll.
   * @param {object} [options]
   * @param {string} [options.attribute]  Attribute used, if any.
   * @param {boolean} [options.test]      The roll is an Attribute or Skill Test.
   * @param {boolean} [options.attack]    The roll is an attack.
   * @param {Array<Actor|object>} [options.targets]  Attack targets: actors, or {actor, distance, ranged, range} when
   *                                       their position on the scene is known.
   * @returns {{advantage: string[], disadvantage: string[], autoFail: string[], notes: string[]}}
   */
  getAdvice({ attribute, skill, test = !!(attribute || skill), attack = false, targets = [], weapon = null } = {}) {
    const c = this.system.conditions ?? new Set();
    const gear = this.system.gear ?? {};
    const deprived = this.system.deprived ?? 0;
    const advice = { advantage: [], disadvantage: [], autoFail: [], notes: [] };
    const add = (list, key) => advice[list].push(loc(`TTE.Advice.${key}`));
    const infos = targets.map(t => ((t?.documentName === "Actor") ? { actor: t, distance: null } : t)).filter(t => t?.actor);
    const positioned = infos.some(i => (i.distance !== null) && (i.distance !== undefined));

    if ( c.has("scared") ) add("disadvantage", "scared");
    if ( c.has("squeezing") && (attack || ["strength", "agility"].includes(attribute)) ) add("disadvantage", "squeezing");
    if ( test && (deprived >= 3) ) add("disadvantage", "deprived3");
    if ( (skill === "stealth") && gear.noisy ) add("disadvantage", "noisy");
    if ( (skill === "perception") && monsterFeature(this, "Keen Senses") ) add("advantage", "keenSenses");
    if ( test && gear.restrictive ) {
      if ( ["agility", "dexterity"].includes(attribute) ) add("disadvantage", "restrictive");
      else if ( !attribute ) advice.notes.push(loc("TTE.Advice.restrictiveNote"));
    }
    if ( weapon?.properties.heavy && (this.system.attributes.strength < TTE.heavyStrength) ) {
      add("disadvantage", "heavyWeapon");
    }
    if ( (weapon?.properties.range || weapon?.properties.thrown) && !positioned ) advice.notes.push(loc("TTE.Advice.rangedNote"));
    if ( attack ) {
      if ( deprived >= 1 ) add("disadvantage", "deprived1");
      for ( const key of ["blinded", "prone", "restrained"] ) if ( c.has(key) ) add("disadvantage", key);
      if ( c.has("hidden") ) add("advantage", "hidden");
      const taunt = this.effects?.find(e => !e.disabled && e.getFlag(SYSTEM_ID, "taunt"));
      for ( const info of infos ) {
        const target = info.actor;
        const tc = target.system?.conditions;
        if ( !tc ) continue;
        const known = (info.distance !== null) && (info.distance !== undefined);
        const near = !known || (info.distance <= 1);
        const ranged = info.ranged ?? !!weapon?.properties.range;
        if ( tc.has("blinded") ) add("advantage", "targetBlinded");
        if ( tc.has("restrained") ) add("advantage", "targetRestrained");
        if ( tc.has("stunned") ) add("advantage", "targetStunned");
        if ( tc.has("fainted") && near ) {
          add("advantage", "targetFainted");
          advice.notes.push(loc("TTE.Attack.AutoHit"));
        }
        else if ( tc.has("prone") ) {
          if ( near ) add("advantage", "targetProne");
          else if ( ranged ) add("disadvantage", "targetProneFar");
        }
        if ( tc.has("hidden") ) add("disadvantage", "targetHidden");
        if ( tc.has("dodging") ) add("disadvantage", "targetDodging");
        if ( tc.has("squeezing") ) {
          if ( ranged ) add("disadvantage", "targetSqueezingRanged");
          else add("advantage", "targetSqueezingMelee");
        }
        // Pack Tactics (monster): Advantage against a creature adjacent to one of its allies.
        if ( monsterFeature(this, "Pack Tactics") && info.token?.document && globalThis.canvas?.ready ) {
          const me = activeToken(this);
          const allied = canvas.tokens.placeables.some(t => me && (t !== me) && (t !== info.token) && t.actor
            && (t.document.disposition === me.document.disposition) && !t.actor.statuses?.has("dead")
            && (zoneDistance(t, info.token) <= 1));
          if ( allied ) add("advantage", "packTactics");
        }
        // Taunt (Defender): Disadvantage on attacks against anyone but the one who taunted you.
        if ( taunt && (taunt.getFlag(SYSTEM_ID, "taunt") !== target.uuid) ) add("disadvantage", "taunted");
        if ( ranged && known ) {
          // Point Blank (Archer) removes the Disadvantage within 1 Zone, Eagle Eye the one beyond the first range.
          if ( (info.distance <= 1) && !this.feature("Point Blank") ) add("disadvantage", "rangedClose");
          if ( info.range ) {
            if ( info.distance > info.range[1] ) {
              advice.notes.push(fmt("TTE.Attack.OutOfRange", { name: target.name, distance: info.distance, max: info.range[1] }));
            }
            else if ( (info.distance > info.range[0]) && !this.feature("Eagle Eye") ) add("disadvantage", "longRange");
          }
        }
      }
    }
    if ( attribute && PHYSICAL.includes(attribute) ) {
      for ( const key of ["fainted", "stunned"] ) {
        if ( c.has(key) ) advice.autoFail.push(loc(`TTE.Condition.${key}`));
      }
    }
    for ( const list of ["advantage", "disadvantage"] ) advice[list] = [...new Set(advice[list])];
    advice.notes = [...new Set(advice.notes)];
    return advice;
  }

  /**
   * Build and evaluate a d20 test.
   * @param {object} options
   * @param {{label: string, value: number}[]} [options.flats]  Bonuses from features, shown as tags.
   * @returns {Promise<{roll: Roll, natural: number, formulaTags: string[]}>}
   */
  async #evaluateD20({ attribute, skill, mode = "normal", bonus = "", flats = [] }) {
    const system = this.system;
    flats = [...flats, ...(system.rollBonuses ?? [])];
    const parts = ["1d20"];
    const data = {};
    const tags = [];

    if ( attribute ) {
      data.attribute = system.attributes[attribute];
      parts.push("@attribute");
      tags.push(loc(`TTE.Attribute.${cap(attribute)}`));
    }
    if ( skill ) {
      const rank = system.skills[skill].rank;
      data.rank = rank;
      parts.push("@rank");
      tags.push(loc(`TTE.Rank.${TTE.ranks[rank]}`));
    }
    if ( mode === "advantage" ) parts.push(`+ ${TTE.advantageDie}`);
    else if ( mode === "disadvantage" ) parts.push(`- ${TTE.advantageDie}`);
    if ( mode !== "normal" ) tags.push(loc(`TTE.Roll.${cap(mode)}`));
    for ( const flat of flats ) {
      parts.push(`${flat.value >= 0 ? "+" : "-"} ${Math.abs(flat.value)}`);
      tags.push(`${flat.label} ${signed(flat.value)}`);
    }

    bonus = String(bonus ?? "").trim();
    if ( bonus ) {
      const term = /^[+-]/.test(bonus) ? bonus : `+ ${bonus}`;
      if ( Roll.validate(`0 ${term}`) ) parts.push(term);
      else ui.notifications.warn(fmt("TTE.Roll.InvalidBonus", { bonus }));
    }

    const formula = parts.map((p, i) => ((i === 0) || /^[+-]/.test(p) ? p : `+ ${p}`)).join(" ");
    const roll = await new Roll(formula, data).evaluate();
    // Only the d20 counts for a natural 20 or 1, never the Advantage d6.
    return { roll, natural: roll.dice[0]?.total, tags };
  }

  /**
   * Roll a Test and post it. With a Difficulty, the card says whether it succeeded.
   * Veteran (Warrior Technique) adds a button to reroll it.
   * @returns {Promise<Roll>}  The roll, with `tteSuccess` set when there is a Difficulty.
   */
  async #rollTest({ label, attribute, skill, mode = "normal", bonus = "", dc = null, reroll = false }) {
    const { roll, natural, tags } = await this.#evaluateD20({ attribute, skill, mode, bonus });
    if ( !skill && attribute ) tags.shift();
    let crit = "";
    if ( natural === 20 ) crit = `<span class="tte-crit success">${loc("TTE.Roll.CritSuccess")}</span>`;
    else if ( natural === 1 ) crit = `<span class="tte-crit failure">${loc("TTE.Roll.CritFailure")}</span>`;
    const autoFail = attribute ? this.getAdvice({ attribute }).autoFail : [];
    if ( autoFail.length ) {
      crit += `<span class="tte-crit failure">${loc("TTE.Roll.AutoFail")} (${autoFail.join(", ")})</span>`;
    }
    let success = null;
    if ( dc !== null && dc !== undefined ) {
      success = !autoFail.length && (roll.total >= dc);
      tags.push(fmt("TTE.Roll.Difficulty", { dc }));
      crit += `<span class="tte-crit ${success ? "success" : "failure"}">${loc(success ? "TTE.Roll.Success" : "TTE.Roll.Failure")}</span>`;
    }
    if ( reroll ) tags.push(loc("TTE.Roll.Reroll"));

    const veteran = !reroll && (success !== true) && this.featureReady("Veteran");
    const flavor = `<div class="tte-roll-flavor"><strong>${label}</strong>`
      + (tags.length ? `<span class="tte-roll-tags">${tags.join(" · ")}</span>` : "")
      + `${crit}</div>`
      + (veteran ? `<button type="button" class="tte-chat-button" data-tte-action="veteranTest">`
        + `<i class="fa-solid fa-rotate"></i> ${fmt("TTE.Reroll.Button", { name: veteran.name })}</button>` : "");
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      flags: { [SYSTEM_ID]: { test: { label, attribute, skill, mode, bonus, dc } } }
    });
    roll.tteSuccess = success;
    return roll;
  }

  /** Veteran: reroll a Test from its chat card. */
  async rerollTest(test) {
    const veteran = this.featureReady("Veteran");
    if ( !veteran ) return ui.notifications.warn(fmt("TTE.Uses.NoneLeft", { name: "Veteran" }));
    await this.spendFeature(veteran);
    return this.#rollTest({ ...test, reroll: true });
  }

  /* -------------------------------------------- */
  /*  Features                                    */
  /* -------------------------------------------- */

  /** A feature this creature has, by name. */
  feature(name) {
    return this.items?.find(i => (i.type === "feature") && (i.name === name)) ?? null;
  }

  /** A feature this creature has with uses left (or without a use limit). */
  featureReady(name) {
    const item = this.feature(name);
    return (item && (!item.system.uses.total || (item.system.uses.value > 0))) ? item : null;
  }

  /**
   * The value a feature uses at this creature's Tier: its own "Value" field, or the book's (TTE.featureValues).
   * Attributes like @strength become numbers. Dice stay as a formula.
   */
  featureFormula(name) {
    const raw = String(this.feature(name)?.system.value?.trim() || TTE.featureValues[name] || "");
    const values = raw.split(">").map(v => v.trim()).filter(Boolean);
    if ( !values.length ) return "";
    const tier = this.system.details?.tier ?? 1;
    const index = Math.max(0, Math.min(values.length - 1, tier - 1 - (4 - values.length)));
    return values[index].replace(/@(\w+)/g, (m, key) => String(this.system.attributes?.[key] ?? 0));
  }

  /** A feature's value as a number. */
  featureNumber(name) {
    const formula = this.featureFormula(name);
    if ( !formula ) return 0;
    try {
      return Math.round(new Roll(formula).evaluateSync().total) || 0;
    } catch(err) {
      return Number(formula) || 0;
    }
  }

  /** Spend one use of a feature. */
  async spendFeature(item) {
    if ( item?.system.uses.total ) await item.update({ "system.uses.spent": item.system.uses.spent + 1 });
  }

  /** The creature can take a Reaction: one per Round, none while Incapacitated or after Shocking Grasp. */
  canReact() {
    if ( this.system.conditions?.has("incapacitated") ) return false;
    if ( this.effects.some(e => !e.disabled && e.getFlag(SYSTEM_ID, "noReactions")) ) return false;
    return !(game.combat?.started && this.getFlag(SYSTEM_ID, "reactionUsed"));
  }

  /** Spend the Reaction (only tracked in combat). Warns when it was already spent. */
  async useReaction() {
    if ( !this.canReact() ) ui.notifications.warn(fmt("TTE.Reaction.Spent", { name: this.name }));
    if ( game.combat?.started ) await this.setFlag(SYSTEM_ID, "reactionUsed", true);
  }

  /** The creature marked with Mark Prey. */
  get markedPrey() {
    return this.getFlag(SYSTEM_ID, "mark") ?? null;
  }

  /** Key of the current combat Turn, to know whether this creature moved during it (Point Blank). */
  static turnKey() {
    const combat = game.combat;
    return combat?.started ? `${combat.id}.${combat.round}.${combat.turn}` : null;
  }

  /** Attack with a reaction (Last Resort, No Honor Among Thieves): an equipped melee weapon, or unarmed. */
  reactionAttack(options = {}) {
    const weapon = this.items.find(i => (i.type === "weapon") && i.system.equipped && !i.system.properties.range);
    options = { kind: "reaction", ...options };
    return weapon ? this.rollWeaponAttack(weapon, options) : this.rollUnarmedAttack(options);
  }

  /** How far this creature reaches with melee attacks, in Zones: its equipped melee weapon, or its size. */
  get meleeReach() {
    const weapon = this.items.find(i => (i.type === "weapon") && i.system.equipped && !i.system.properties.range);
    return weapon?.system.properties.reach || this.system.reach || 1;
  }

  /**
   * Last Resort (the target) and No Honor Among Thieves (an ally of the target): when a creature within your
   * Melee Reach attacks, you can use your Reaction to attack it first.
   */
  async #counterAttacks(infos, myToken) {
    if ( !globalThis.canvas?.ready || !myToken?.document ) return;
    const used = new Set();
    const attacker = foundry.utils.escapeHTML(this.name);
    const offer = async (token, name, text) => {
      const actor = token?.actor;
      if ( !actor || (actor === this) || used.has(actor) || !actor.canReact?.() ) return;
      const feature = actor.featureReady?.(name);
      if ( !feature ) return;
      const distance = zoneDistance(token, myToken);
      if ( (distance === null) || (distance > actor.meleeReach) ) return;
      if ( !(await askReaction(actor, feature, text)) ) return;
      used.add(actor);
      await actor.spendFeature(feature);
      if ( name === "No Honor Among Thieves" ) await actor.setFlag(SYSTEM_ID, "freeDirtyTrick", true);
      await actor.reactionAttack({ targets: [myToken] });
    };
    for ( const info of infos ) {
      await offer(info.token, "Last Resort", fmt("TTE.Reaction.LastResort", { attacker }));
      if ( !info.token?.document ) continue;
      for ( const t of canvas.tokens.placeables ) {
        if ( (t === info.token) || (t === myToken) || (t.document.disposition !== info.token.document.disposition) ) continue;
        await offer(t, "No Honor Among Thieves", fmt("TTE.Reaction.NoHonor", {
          attacker, target: foundry.utils.escapeHTML(info.token.name) }));
      }
    }
  }

  /** Spend Combo on a Finisher. */
  async spendCombo(cost) {
    const combo = this.system.resource?.value ?? 0;
    if ( combo < cost ) {
      ui.notifications.warn(fmt("TTE.Finisher.NotEnough", { cost, value: combo, label: this.system.resource?.label || "Combo" }));
      return false;
    }
    await this.update({ "system.resource.value": combo - cost });
    return true;
  }

  /** Bulwark (Defender): an ally of the target with Bulwark within 1 Zone gives it +1 Defense. */
  #bulwarkFor(token) {
    if ( !globalThis.canvas?.ready || !token?.document ) return null;
    return canvas.tokens.placeables.find(t => (t !== token) && (t.document.disposition === token.document.disposition)
      && t.actor?.feature?.("Bulwark") && (zoneDistance(t, token) <= 1)) ?? null;
  }

  /**
   * Shield Fighting (the target, against a melee attack) or Protection (an ally of the target within 1 Zone):
   * with a shield equipped, a Reaction gives the target +2 Defense against this attack (info.reactionDefense).
   */
  async #defensiveReaction(infos) {
    for ( const info of infos ) {
      const target = info.actor;
      const ready = (actor, name) => actor?.feature?.(name) && actor.system.gear?.shield && actor.canReact();
      const candidates = [];
      if ( !info.ranged && ready(target, "Shield Fighting") ) candidates.push({ actor: target, name: "Shield Fighting" });
      if ( globalThis.canvas?.ready && info.token?.document ) {
        for ( const t of canvas.tokens.placeables ) {
          if ( (t === info.token) || (t.actor === this) || (t.document.disposition !== info.token.document.disposition) ) continue;
          if ( ready(t.actor, "Protection") && (zoneDistance(t, info.token) <= 1) ) candidates.push({ actor: t.actor, name: "Protection" });
        }
      }
      for ( const c of candidates ) {
        const feature = c.actor.feature(c.name);
        const yes = await askReaction(c.actor, feature, fmt("TTE.Reaction.Defense", {
          attacker: foundry.utils.escapeHTML(this.name), target: foundry.utils.escapeHTML(info.token?.name ?? target.name),
          bonus: signed(TTE.shieldReactionBonus) }));
        if ( !yes ) continue;
        await c.actor.useReaction();
        info.reactionDefense = { bonus: TTE.shieldReactionBonus, note: `${feature.name} (${c.actor.name}) ${signed(TTE.shieldReactionBonus)}` };
        break;
      }
    }
  }

  /** Deflecting (shield): the target uses its Reaction to make the attacker reroll a Ranged Attack with Disadvantage. */
  async #deflect(r, d20) {
    const actor = r.actor;
    const shield = actor?.system?.gear?.shield;
    if ( !shield?.system.properties.deflecting || !actor.canReact?.() ) return;
    const yes = await askReaction(actor, shield, fmt("TTE.Reaction.Deflecting", {
      attacker: foundry.utils.escapeHTML(this.name), target: foundry.utils.escapeHTML(r.name) }));
    if ( !yes ) return;
    await actor.useReaction();
    const mode = (d20.mode === "advantage") ? "normal" : "disadvantage";
    const { roll, natural } = await this.#evaluateD20({ ...d20, mode });
    const critical = (natural !== 1) && (natural >= r.critAt);
    Object.assign(r, { critical, hit: critical || ((natural !== 1) && (roll.total >= r.defense)) });
    r.notes.push(fmt("TTE.Reaction.DeflectingNote", { name: foundry.utils.escapeHTML(shield.name), total: roll.total }));
  }

  /** Guardian (Defender): when a creature within 1 Zone is hit, take the hit instead with a Reaction. */
  async #guardian(r, myToken, isMarked) {
    if ( !globalThis.canvas?.ready || !r.token?.document ) return;
    for ( const t of canvas.tokens.placeables ) {
      if ( (t === r.token) || (t === myToken) || (t.actor === this) || (t.document.disposition !== r.token.document.disposition) ) continue;
      const actor = t.actor;
      const feature = actor?.feature?.("Guardian");
      if ( !feature || !actor.canReact() || (zoneDistance(t, r.token) > 1) ) continue;
      const yes = await askReaction(actor, feature, fmt("TTE.Reaction.Guardian", {
        attacker: foundry.utils.escapeHTML(this.name), target: foundry.utils.escapeHTML(r.name) }));
      if ( !yes ) continue;
      await actor.useReaction();
      r.notes.push(fmt("TTE.Reaction.GuardianNote", { name: foundry.utils.escapeHTML(r.name) }));
      Object.assign(r, { token: t, actor, name: t.name, marked: isMarked(actor) });
      return;
    }
  }

  /** Choices for a weapon attack: what kind of attack, and finishers or features to use if it hits. */
  #attackOptions({ withKind = true, kind = "main", marked = false } = {}) {
    const fields = [];
    if ( withKind ) {
      fields.push({
        name: "kind", type: "select", value: kind, label: loc("TTE.AttackKind.Label"),
        hint: this.feature("Opportunist") ? loc("TTE.AttackKind.OpportunistNote") : "",
        options: ["main", "secondary", "opportunity", "reaction"].map(k => ({ value: k, label: loc(`TTE.AttackKind.${k}`) }))
      });
    }
    const combo = this.system.resource?.value ?? 0;
    const eviscerate = this.feature("Combo");
    if ( eviscerate && (combo > 0) ) {
      fields.push({ name: "eviscerate", type: "number", value: 0, min: 0, max: combo, label: loc("TTE.Finisher.Eviscerate"),
        hint: loc("TTE.Finisher.EviscerateHint") });
    }
    const free = !!this.getFlag(SYSTEM_ID, "freeDirtyTrick");
    if ( this.feature("Dirty Trick") && (free || (combo >= 2)) ) {
      fields.push({
        name: "dirtyTrick", type: "select", value: "", label: loc(free ? "TTE.Finisher.DirtyTrickFree" : "TTE.Finisher.DirtyTrick"),
        hint: loc("TTE.Finisher.OnHit"),
        options: [{ value: "", label: loc("TTE.Roll.None") }, { value: "blinded", label: loc("TTE.Condition.blinded") },
          { value: "prone", label: loc("TTE.Condition.prone") }]
      });
    }
    const driven = this.featureReady("Driven to Conquer");
    if ( driven ) fields.push({ name: "driven", type: "checkbox", value: false, label: driven.name, hint: loc("TTE.Feature.DrivenHint") });
    const killing = marked && this.featureReady("Killing Shot");
    if ( killing ) fields.push({ name: "killingShot", type: "checkbox", value: false, label: killing.name, hint: loc("TTE.Feature.KillingShotHint") });
    return fields;
  }

  /** Choices when Conjuring a Spell: Overcharge, Destructive Mind, Cataclysm and Blood Casting. */
  #spellOptions({ deals, arcane, maxTier, attack = false }) {
    const fields = [];
    const add = (name, hint) => {
      const item = this.featureReady(name);
      if ( item ) fields.push({ name: name.replace(/\s/g, "").replace(/^./, c => c.toLowerCase()), type: "checkbox", value: false,
        label: item.name, hint: loc(hint) });
    };
    if ( deals ) {
      add("Overcharge", (arcane && this.feature("Pure Mana")) ? "TTE.Overcharge.PureMana" : "TTE.Overcharge.Hint");
      add("Destructive Mind", "TTE.Feature.DestructiveMindHint");
      add("Cataclysm", "TTE.Feature.CataclysmHint");
    }
    const driven = attack && this.featureReady("Driven to Conquer");
    if ( driven ) fields.push({ name: "driven", type: "checkbox", value: false, label: driven.name, hint: loc("TTE.Feature.DrivenHint") });
    const blood = this.feature("Blood Casting");
    if ( blood && this.system.mana.max ) {
      fields.push({ name: "bloodMP", type: "number", value: 0, min: 0, max: maxTier, label: blood.name, hint: loc("TTE.Feature.BloodCastingHint") });
    }
    return fields;
  }

  /* -------------------------------------------- */
  /*  Attacks and damage                          */
  /* -------------------------------------------- */

  /**
   * Attack: d20 + Attribute against the target's Defense. A natural 20 is a critical hit.
   * With targets, the attack checks each one and, if it hits, rolls and applies the damage.
   * @param {object} [options]
   * @param {string} [options.label]      Name shown in chat.
   * @param {string} [options.attribute]  Default attribute.
   * @param {{formula: string, type: string, unarmed?: boolean}} [options.damage]  Damage dealt on a hit.
   * @param {WeaponData} [options.weapon]  Weapon used.
   * @param {boolean} [options.dialog]    Show the roll dialog.
   * @param {string} [options.kind]       "main", "secondary", "opportunity" or "reaction".
   * @param {object} [options.spell]      Spell attacks: {range, arcane, cataclysm, destructiveMind}.
   */
  async rollAttack({ label = loc("TTE.Attack.Title"), attribute = "strength", damage = null, weapon = null, dialog = true,
    preset = null, note = "", kind = null, spell = null, reroll = false, targets = null, rider = null } = {}) {
    const replay = { label, attribute, damage, itemId: weapon?.parent?.id ?? null, note, kind, spell };
    const tokens = targets ?? Array.from(game.user.targets ?? []);
    const myToken = activeToken(this);
    const props = weapon?.properties ?? {};
    const system = this.system;
    const tier = system.details.tier;

    // Where each target is: ranged weapons, thrown weapons beyond reach, and Spells that reach farther than 1 Zone.
    const thrown = parseRange(props.thrown);
    if ( thrown && this.feature("Thrown Weapon Fighting") ) thrown.forEach((v, i) => { thrown[i] = v + this.featureNumber("Thrown Weapon Fighting"); });
    const spellZones = spell ? Number(String(spell.range ?? "").match(/(\d+)\s*Zones?\s*$/i)?.[1] ?? 0) : 0;
    const reach = props.reach || system.reach || 1;
    const infos = tokens.filter(t => t.actor).map(token => {
      const distance = zoneDistance(myToken, token);
      let ranged = !!props.range || (spellZones > 1);
      let range = parseRange(props.range) ?? ((spellZones > 1) ? [spellZones, spellZones] : null);
      if ( !props.range && thrown && (distance !== null) && (distance > reach) ) {
        ranged = true;
        range = thrown;
      }
      return { token, actor: token.actor, distance, ranged, range };
    });
    const isRanged = infos.length ? infos.some(i => i.ranged) : (!!props.range || (spellZones > 1));
    const advice = this.getAdvice({ attack: true, targets: infos, weapon });
    const mark = this.markedPrey;
    const isMarked = actor => !!mark && (actor?.uuid === mark.uuid);

    const hands = props.twoHanded ? true : props.versatile ? false : null;
    const fields = this.#attackOptions({ withKind: !spell, kind: kind ?? "main", marked: infos.some(i => isMarked(i.actor)) });
    const config = preset ?? (dialog
      ? await TTERollDialog.prompt({ title: label, chooseAttribute: true, attribute, advice, twoHands: hands, fields })
      : { mode: netMode(advice), attribute, twoHands: hands ?? false, extra: {} });
    if ( !config ) return null;
    const extra = { kind: kind ?? "main", ...(config.extra ?? {}) };
    if ( spell ) extra.kind = "main";
    if ( !reroll ) {
      if ( !spell ) await this.#endSanctuary();
      if ( ["opportunity", "reaction"].includes(extra.kind) ) await this.useReaction();
    }

    // Sanctuary: attacking a protected creature takes a Spirit Test first. On a failure, the attack against it is lost.
    if ( !reroll ) {
      for ( const info of [...infos] ) {
        const sanctuary = info.actor.effects?.find(e => !e.disabled && e.getFlag(SYSTEM_ID, "spellBuff")?.sanctuary);
        if ( !sanctuary ) continue;
        const { dc } = sanctuary.getFlag(SYSTEM_ID, "spellBuff").sanctuary;
        const test = await this.rollAttribute("spirit", { dialog: false, dc, label: `${loc("TTE.Attribute.Spirit")} (${sanctuary.name})` });
        if ( test?.tteSuccess === false ) {
          infos.splice(infos.indexOf(info), 1);
          await chatNote(this, { icon: "fa-dove", title: sanctuary.name, text: fmt("TTE.SpellEffect.SanctuaryLost", { name: foundry.utils.escapeHTML(info.token.name) }) });
        }
      }
      if ( tokens.some(t => t.actor) && !infos.length ) return null;
    }

    // Two-Handed with one hand deals half damage; Versatile with two hands goes up one category.
    let half = false;
    if ( damage && weapon ) {
      half = !!props.twoHanded && !config.twoHands;
      damage = { type: damage.type, formula: weapon.damageFormula(tier, { upgrade: props.versatile && config.twoHands }) };
    }
    // Monster abilities that change the attack's damage (Maul: Brutal Cut instead; Grab: Weak).
    if ( damage && rider?.override ) {
      damage = { type: rider.override === "weapon" ? damage.type : rider.override, formula: monsterDice(this, rider.categories?.[0]) };
    }
    // Secondary Attack: half damage, unless a feature makes it full.
    const secondaryFull = (this.feature("Dual Wielding") && props.light) || (this.feature("Double Shot") && isRanged)
      || this.feature("Extra Attack");
    const notes = [];
    if ( extra.kind === "secondary" ) {
      if ( !secondaryFull ) half = true;
      if ( weapon && !props.light && !secondaryFull ) notes.push(loc("TTE.AttackKind.SecondaryLight"));
    }

    // Advantage and bonuses from features.
    let mode = config.mode;
    const featureTags = [];
    if ( extra.driven && !reroll ) {
      const driven = this.featureReady("Driven to Conquer");
      if ( driven ) {
        await this.spendFeature(driven);
        mode = (mode === "disadvantage") ? "normal" : "advantage";
        featureTags.push(driven.name);
      }
    }
    if ( (extra.kind === "opportunity") && this.feature("Opportunist") ) {
      mode = (mode === "disadvantage") ? "normal" : "advantage";
      featureTags.push("Opportunist");
    }
    const unmoving = (extra.kind === "opportunity") && monsterFeature(this, "Unmoving Guard");
    if ( unmoving ) {
      mode = (mode === "disadvantage") ? "normal" : "advantage";
      featureTags.push(unmoving.name);
    }
    if ( rider ) featureTags.push(rider.name);
    // Shield Fighting and Protection: a Reaction that gives the target +2 Defense against this attack.
    if ( !reroll ) await this.#defensiveReaction(infos);
    // Last Resort and No Honor Among Thieves: a Reaction attack against this creature before its attack lands.
    if ( !reroll ) await this.#counterAttacks(infos, myToken);
    const flats = [];
    const equippedWeapons = this.items.filter(i => (i.type === "weapon") && i.system.equipped).length;
    if ( weapon && this.feature("Dueling") && !props.twoHanded && !config.twoHands && (equippedWeapons <= 1) ) {
      flats.push({ label: "Dueling", value: this.featureNumber("Dueling") });
    }
    const myTurn = game.combat?.started && (game.combat.combatant?.actor?.uuid === this.uuid);
    if ( weapon && isRanged && this.feature("Point Blank") && myTurn && (this.getFlag(SYSTEM_ID, "moved") !== TTEActor.turnKey()) ) {
      flats.push({ label: "Point Blank", value: this.featureNumber("Point Blank") });
    }

    const { roll, natural, tags } = await this.#evaluateD20({ attribute: config.attribute || undefined, mode, bonus: config.bonus, flats });
    tags.push(...featureTags);
    if ( reroll ) tags.push(loc("TTE.Roll.Reroll"));
    const critical = natural === 20;

    // Hit or miss for each target.
    const killing = extra.killingShot ? this.featureReady("Killing Shot") : null;
    let killingUsed = false;
    const results = infos.map(info => {
      const actor = info.actor;
      const r = { token: info.token, actor, name: info.token.name, hit: null, critical: false, notes: [], marked: isMarked(actor), ranged: info.ranged };
      let defense = actor.system?.defense;
      if ( defense === undefined ) {
        if ( natural === 20 ) Object.assign(r, { hit: true, critical: true });
        else if ( natural === 1 ) r.hit = false;
        return r;
      }
      // Cover: Partial gives +2 Defense (Eagle Eye ignores it on ranged attacks); Total can't be hit.
      if ( actor.statuses?.has("totalCover") ) {
        r.hit = false;
        r.notes.push(loc("TTE.Condition.totalCover"));
        return r;
      }
      const cover = actor.statuses?.has("cover") || actor.effects?.some(e => !e.disabled
        && (e.getFlag(SYSTEM_ID, "spellBuff")?.cover || e.getFlag(SYSTEM_ID, "plantedShield")));
      if ( cover && !(info.ranged && this.feature("Eagle Eye")) ) {
        defense += TTE.coverBonus;
        r.notes.push(`${loc("TTE.Condition.cover")} ${signed(TTE.coverBonus)}`);
      }
      if ( info.reactionDefense ) {
        defense += info.reactionDefense.bonus;
        r.notes.push(info.reactionDefense.note);
      }
      const bulwark = this.#bulwarkFor(info.token);
      if ( bulwark ) {
        const bonus = bulwark.actor.featureNumber("Bulwark");
        defense += bonus;
        r.notes.push(fmt("TTE.Attack.Bulwark", { name: bulwark.name, bonus: signed(bonus) }));
      }
      const critAt = (r.marked && this.feature("Deadeye")) ? Math.min(20, this.featureNumber("Deadeye") || 20) : 20;
      Object.assign(r, { defense, critAt });
      const autoHit = actor.system.conditions?.has("fainted") && ((info.distance === null) || (info.distance <= 1));
      if ( autoHit ) {
        Object.assign(r, { hit: true, critical: true });
        r.autoHit = true;
        r.notes.push(loc("TTE.Condition.fainted"));
      }
      else if ( natural === 1 ) r.hit = false;
      else if ( natural >= critAt ) {
        Object.assign(r, { hit: true, critical: true });
        if ( natural < 20 ) r.notes.push("Deadeye");
      }
      else r.hit = roll.total >= defense;
      if ( r.hit && !r.critical && r.marked && killing && !killingUsed ) {
        r.critical = true;
        killingUsed = true;
        r.notes.push(killing.name);
      }
      return r;
    });
    if ( killingUsed ) await this.spendFeature(killing);
    // Deflecting (shield): a Ranged Attack that hits can be rerolled with Disadvantage, using the target's Reaction.
    if ( !reroll ) for ( const r of results.filter(x => x.hit && x.ranged && !x.autoHit) ) {
      await this.#deflect(r, { attribute: config.attribute || undefined, mode, bonus: config.bonus, flats });
    }
    // Guardian (Defender): an ally within 1 Zone takes the hit instead.
    if ( !reroll ) for ( const r of results.filter(x => x.hit) ) await this.#guardian(r, myToken, isMarked);
    // Parry and Protect (monsters): half the damage, or an ally takes half.
    if ( !reroll && damage ) for ( const r of results.filter(x => x.hit) ) await this.#protect(r);
    const hits = results.filter(r => r.hit);

    // Combo (Thief): gained on a hit, then spent on Finishers.
    let eviscerate = 0;
    let trick = "";
    const free = !!this.getFlag(SYSTEM_ID, "freeDirtyTrick");
    if ( hits.length && this.feature("Combo") ) {
      let gain = (hits.some(r => r.critical) && this.feature("Flow")) ? 2 : 1;
      if ( this.feature("Low Blow") && hits.some(r => isHindered(r.actor)) ) gain += this.featureNumber("Low Blow");
      const before = system.resource.value;
      let combo = Math.min(system.resource.max || Infinity, before + gain);
      const gained = combo - before;
      eviscerate = Math.max(0, Math.min(Number(extra.eviscerate) || 0, combo));
      combo -= eviscerate;
      trick = extra.dirtyTrick || "";
      if ( trick && !free ) {
        if ( combo >= 2 ) combo -= 2;
        else trick = "";
      }
      await this.update({ "system.resource.value": combo });
      const spent = before + gained - combo;
      notes.push(fmt(spent ? "TTE.Combo.ChangeSpent" : "TTE.Combo.Change", { before, gained, spent, after: combo, label: system.resource.label || "Combo" }));
    }
    else if ( hits.length && free && extra.dirtyTrick ) trick = extra.dirtyTrick;
    if ( free ) await this.unsetFlag(SYSTEM_ID, "freeDirtyTrick");

    // Results.
    let body = "";
    if ( results.length ) {
      body = `<ul class="tte-attack-results">${results.map(r => {
        const state = r.hit === null ? "" : r.critical ? "crit" : r.hit ? "hit" : "miss";
        const text = r.hit === null ? "?" : loc(r.critical ? "TTE.Attack.CriticalHit" : r.hit ? "TTE.Attack.Hit" : "TTE.Attack.Miss");
        const extras = r.notes.length ? ` <small>(${r.notes.join(", ")})</small>` : "";
        return `<li class="${state}"><span>${foundry.utils.escapeHTML(r.name)}${extras}</span><strong>${text}</strong></li>`;
      }).join("")}</ul>`;
    } else body = `<p class="tte-roll-note">${loc("TTE.Attack.NoTargets")}</p>`;
    if ( advice.notes.length ) body += `<p class="tte-roll-note">${advice.notes.join(" ")}</p>`;
    if ( note ) body += `<p class="tte-roll-note">${note}</p>`;
    for ( const n of notes ) body += `<p class="tte-roll-note">${n}</p>`;
    if ( weapon ) {
      const labels = weapon.propertyLabels;
      if ( labels.length ) body += `<p class="tte-roll-note">${labels.join(", ")}</p>`;
    }
    if ( (extra.kind === "opportunity") && this.feature("Opportunist") && hits.length ) {
      body += `<p class="tte-roll-note">${loc("TTE.AttackKind.OpportunistHit")}</p>`;
      for ( const r of hits ) {
        if ( !r.actor?.isOwner ) continue;
        await r.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: `Opportunist: ${loc("TTE.SpellEffect.SpeedZero")}`, img: "icons/svg/net.svg",
          flags: { [SYSTEM_ID]: { speedZero: true, turnsLeft: 1 } }
        }]);
      }
    }

    let crit = "";
    if ( critical ) crit = `<span class="tte-crit success">${loc("TTE.Attack.CriticalHit")}</span>`;
    else if ( natural === 1 ) crit = `<span class="tte-crit failure">${loc("TTE.Roll.CritFailure")}</span>`;

    // Damage against each target hit, with the bonuses decided now (features are spent on the hit).
    const deals = [];
    const dealing = damage ? {
      formula: damage.formula, type: damage.type, half, label, maximize: !!spell?.cataclysm,
      ignoreResistance: !!spell?.arcane && !!this.feature("Arcane Focus"), spell: !!spell,
      takenNote: (spell?.arcane && this.feature("Mana Disruption")) ? "TTE.Feature.ManaDisruptionNote" : null
    } : null;
    if ( dealing && rider?.extra ) dealing.extra = { formula: monsterDice(this, rider.categories?.[0]), type: rider.extra, label: rider.name };
    if ( dealing && rider?.drain ) dealing.drain = true;
    if ( damage ) {
      // Great Weapon Fighting adds Strength once per Turn (outside combat, once per attack).
      const turn = TTEActor.turnKey();
      let greatWeapon = props.twoHanded && config.twoHands
        && (turn ? (this.getFlag(SYSTEM_ID, "greatWeapon") !== turn) && this.featureReady("Great Weapon Fighting")
          : this.feature("Great Weapon Fighting"));
      let mind = spell?.destructiveMind ? this.featureReady("Destructive Mind") : null;
      for ( const r of hits ) {
        const bonus = [];
        if ( r.marked && !spell && this.feature("Mark Prey") ) bonus.push({ label: "Mark Prey", value: this.featureNumber("Mark Prey") });
        if ( eviscerate ) bonus.push({ label: "Eviscerate", value: eviscerate * this.featureNumber("Combo") });
        if ( greatWeapon ) {
          bonus.push({ label: "Great Weapon Fighting", value: this.featureNumber("Great Weapon Fighting") });
          if ( turn ) {
            await this.setFlag(SYSTEM_ID, "greatWeapon", turn);
            await this.spendFeature(greatWeapon);
          }
          greatWeapon = null;
        }
        const kick = this.feature("Kick Them While They're Down");
        if ( kick && isHindered(r.actor) ) bonus.push({ label: kick.name, value: this.featureNumber(kick.name) });
        if ( mind ) {
          bonus.push({ label: mind.name, value: this.featureNumber("Destructive Mind") });
          await this.spendFeature(mind);
          mind = null;
        }
        const deal = { token: r.token, critical: r.critical, flats: bonus };
        if ( r.half ) deal.half = true;
        if ( r.protector ) deal.protector = r.protector.document?.uuid ?? null;
        deals.push(deal);
      }
    }
    const auto = deals.length > 0 && game.settings.get(SYSTEM_ID, "autoDamage");
    const buttons = [];
    if ( deals.length && !auto ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="dealDamage">
      <i class="fa-solid fa-burst"></i> ${loc("TTE.Attack.RollDamage")}</button>`);
    if ( damage && (!results.length || results.some(r => r.hit === null)) ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="rollDamage">
      <i class="fa-solid fa-burst"></i> ${loc(deals.length ? "TTE.Attack.RollDamageOthers" : "TTE.Attack.RollDamage")}</button>`);
    // Rerolls: Relentless Aim on a miss against the marked creature, Veteran on any miss.
    const missed = results.length ? results.some(r => r.hit === false) : true;
    const relentless = results.some(r => (r.hit === false) && r.marked) && this.featureReady("Relentless Aim");
    if ( relentless ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="reroll" data-feature="Relentless Aim">
      <i class="fa-solid fa-crosshairs"></i> ${fmt("TTE.Reroll.Button", { name: relentless.name })}</button>`);
    const veteran = missed && this.featureReady("Veteran");
    if ( veteran ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="reroll" data-feature="Veteran">
      <i class="fa-solid fa-rotate"></i> ${fmt("TTE.Reroll.Button", { name: veteran.name })}</button>`);

    const flavor = `<div class="tte-roll-flavor"><strong>${label}</strong>`
      + (tags.length ? `<span class="tte-roll-tags">${tags.join(" · ")}</span>` : "")
      + `${crit}</div>${body}${buttons.join("")}`;
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      flags: { [SYSTEM_ID]: { attack: {
        label, critical, damage: damage ? { ...damage, half } : null,
        pending: (deals.length && !auto) ? { ...dealing, targets: deals.map(d => ({
          uuid: d.token?.document?.uuid ?? null, actorUuid: d.token?.actor?.uuid ?? null, critical: d.critical, flats: d.flats,
          half: d.half ?? false, protector: d.protector ?? null })) } : null,
        replay: { ...replay, preset: { ...config, mode, extra: { ...extra, killingShot: false, driven: false } } }
      } } }
    });

    // Damage rolls right away only when the world setting says so; otherwise the card's button rolls it.
    if ( auto ) for ( const deal of deals ) await this.#dealHit({ ...dealing, ...deal, half: dealing.half || !!deal.half });
    if ( trick && hits[0] ) await this.#dirtyTrick(hits[0], trick);
    if ( rider && hits.length ) await this.#riderHit(rider, hits);
    if ( !reroll && hits.length ) await this.#retaliate(hits, myToken);
    roll.tteHits = hits.map(r => r.token);
    return roll;
  }

  /** Roll the damage an attack card saved for each creature it hit. */
  async dealPendingDamage(pending) {
    const { targets = [], ...dealing } = pending;
    for ( const t of targets ) {
      const doc = t.uuid ? fromUuidSync(t.uuid) : null;
      const actor = doc?.actor ?? (t.actorUuid ? fromUuidSync(t.actorUuid) : null);
      await this.#dealHit({ ...dealing, token: doc?.object ?? null, actor, critical: t.critical, flats: t.flats,
        half: dealing.half || !!t.half, protector: t.protector });
    }
  }

  /**
   * Damage for one creature an attack hit, with what monster abilities add: extra damage (Dive),
   * Life drained (Drain) and an ally who takes half (Protect).
   */
  async #dealHit({ extra = null, drain = false, protector = null, ...deal }) {
    let share = null;
    if ( protector ) {
      const doc = typeof protector === "string" ? fromUuidSync(protector) : protector;
      share = doc?.object ?? doc ?? null;
    }
    const roll = await this.dealDamage({ ...deal, share });
    if ( extra ) await this.dealDamage({ ...deal, ...extra, flats: [], half: false, share });
    if ( drain && roll?.tteTaken ) await this.applyHealing(Math.floor(roll.tteTaken / 2));
    return roll;
  }

  /** Reroll an attack from its chat card (Relentless Aim or Veteran). */
  async rerollAttack(attack, featureName) {
    const feature = this.featureReady(featureName);
    if ( !feature ) return ui.notifications.warn(fmt("TTE.Uses.NoneLeft", { name: featureName }));
    const replay = attack?.replay;
    if ( !replay ) return;
    await this.spendFeature(feature);
    const weapon = replay.itemId ? this.items.get(replay.itemId)?.system ?? null : null;
    return this.rollAttack({ ...replay, weapon, dialog: false, reroll: true });
  }

  /** Dirty Trick: the creature makes an Agility Test (10 + your Agility) or becomes Blinded or Prone. */
  async #dirtyTrick(result, condition) {
    const target = result.actor;
    const dc = this.featureNumber("Dirty Trick");
    const label = this.feature("Dirty Trick")?.name ?? "Dirty Trick";
    if ( !target?.isOwner || (typeof target.rollAttribute !== "function") ) {
      return chatNote(this, { icon: "fa-hand-sparkles", title: label,
        text: fmt("TTE.Finisher.DirtyTrickManual", { name: result.name, dc, condition: loc(`TTE.Condition.${condition}`) }) });
    }
    const test = await target.rollAttribute("agility", { dialog: false, dc, label: `${loc("TTE.Attribute.Agility")} (${label})` });
    if ( test?.tteSuccess !== false ) return;
    if ( condition === "blinded" ) await applyTimedStatus(target, "blinded");
    else if ( !target.statuses.has("prone") ) await target.toggleStatusEffect("prone", { active: true });
    return chatNote(this, { icon: "fa-hand-sparkles", title: label,
      text: fmt("TTE.Finisher.DirtyTrickDone", { name: result.name, condition: loc(`TTE.Condition.${condition}`) }) });
  }

  /**
   * Roll damage against one creature and apply it when you can change that creature.
   * @param {object} options
   * @param {Token} [options.token]    The creature hit.
   * @param {string} options.formula   Damage dice.
   * @param {string} options.type      Damage type.
   * @param {boolean} [options.critical]  Maximum of the dice plus a new roll of them.
   * @param {boolean} [options.half]      Half damage (rounded up).
   * @param {boolean} [options.maximize]  Maximum possible damage (Cataclysm).
   * @param {{label: string, value: number}[]} [options.flats]  Bonuses from features.
   * @param {string} [options.takenNote]  Localization key of a note shown when the creature takes damage.
   */
  async dealDamage({ token = null, actor = token?.actor ?? null, formula, type, critical = false, half = false, maximize = false,
    flats = [], label = "", ignoreResistance = false, takenNote = null, spell = false, share = null }) {
    let full = [critical ? criticalFormula(formula) : formula, ...flats.map(f => `${f.value >= 0 ? "+" : "-"} ${Math.abs(f.value)}`)].join(" ");
    if ( half ) full = `ceil((${full}) / 2)`;
    const roll = await new Roll(full).evaluate(maximize ? { maximize: true } : {});
    const typeLabel = loc(`TTE.DamageType.${type}`);
    const tags = [typeLabel, ...flats.map(f => `${f.label} ${signed(f.value)}`)];
    if ( half ) tags.push(loc("TTE.Attack.HalfShort"));
    if ( maximize ) tags.push(loc("TTE.Attack.Maximized"));
    const name = foundry.utils.escapeHTML(token?.name ?? actor?.name ?? "");

    const canApply = !!actor?.isOwner && (typeof actor.applyDamage === "function");
    let body = "";
    if ( canApply ) {
      // Protect: the ally takes half of the damage (rounded up), the creature hit the rest.
      let amount = roll.total;
      if ( share?.actor?.isOwner ) {
        const half = Math.ceil(amount / 2);
        amount -= half;
        const shared = await share.actor.applyDamage(half, { type, critical: false, ignoreResistance, card: false, spell });
        body += `<p class="tte-damage-result"><i class="fa-solid fa-shield"></i> `
          + `${fmt("TTE.Attack.Took", { name: foundry.utils.escapeHTML(share.name), amount: shared.taken, type: typeLabel })}</p>`;
      }
      const result = await actor.applyDamage(amount, { type, critical, ignoreResistance, card: false, spell });
      roll.tteTaken = result.taken;
      body += `<p class="tte-damage-result"><i class="fa-solid fa-heart-crack"></i> `
        + `${fmt("TTE.Attack.Took", { name, amount: result.taken, type: typeLabel })}</p>`;
      if ( result.affinity !== "none" ) {
        body += `<p class="tte-roll-note">${loc(`TTE.Affinity.${result.affinity}`)}: ${result.before} → ${result.taken}</p>`;
      }
      if ( takenNote && result.taken ) body += `<p class="tte-roll-note">${fmt(takenNote, { name })}</p>`;
    }
    else {
      body = `<button type="button" class="tte-chat-button" data-tte-action="applyDamage">`
        + `<i class="fa-solid fa-heart-crack"></i> ${loc("TTE.Attack.Apply")}</button>`;
      if ( takenNote ) body += `<p class="tte-roll-note">${fmt(takenNote, { name: name || "—" })}</p>`;
    }
    const flavor = `<div class="tte-roll-flavor"><strong>${fmt("TTE.Attack.Damage", { name: label })}${name ? ` → ${name}` : ""}</strong>`
      + `<span class="tte-roll-tags">${tags.join(" · ")}</span>`
      + (critical ? `<span class="tte-crit success">${loc("TTE.Attack.CriticalHit")}</span>` : "")
      + `</div>${body}`;
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      flags: { [SYSTEM_ID]: { damage: { amount: roll.total, type, critical } } }
    });
    return roll;
  }

  /**
   * Conjure a Spell: pick the Tier (up to your own), pay its cost in MP, then roll.
   * Single-target Spells are attacks (d20 + Conjuring Attribute against Defense);
   * area Spells ask for a Test against 10 + Conjuring Attribute, with half damage on a success.
   * With targets, Tests, damage and healing are rolled and applied on their own.
   */
  async conjure(item, { dialog = true, echo = false } = {}) {
    const spell = item.system;
    const system = this.system;
    const conditions = system.conditions ?? new Set();
    if ( spell.components.verbal && conditions.has("mute") ) {
      return ui.notifications.warn(fmt("TTE.Spell.CantSpeak", { name: this.name }));
    }
    if ( conditions.has("incapacitated") ) return ui.notifications.warn(fmt("TTE.Spell.Incapacitated", { name: this.name }));
    if ( spell.concentration && system.class?.system.noConcentration ) {
      return ui.notifications.warn(fmt("TTE.Spell.NoConcentration", { class: system.class.name }));
    }

    const attack = spell.roll.type === "attack";
    const tokens = Array.from(game.user.targets ?? []).filter(t => t.actor);
    const targets = tokens.map(t => t.actor);
    const advice = this.getAdvice({ attack, targets, attribute: attack ? undefined : null });
    if ( attack && (system.deprived >= 1) ) advice.disadvantage = [...new Set([...advice.disadvantage, loc("TTE.Advice.deprived1")])];
    if ( spell.concentration && conditions.has("concentrating") ) advice.notes.push(loc("TTE.Spell.EndsConcentration"));
    if ( spell.components.somatic ) advice.notes.push(loc("TTE.Spell.SomaticNote"));
    const maxTier = system.details.tier;
    const mana = system.mana.max ? { value: system.mana.value, max: system.mana.max } : null;
    const deals = spell.hasDice && !!spell.roll.damageType;
    const arcane = deals && (spell.roll.damageType === "arcane");
    const fields = this.#spellOptions({ deals, arcane, maxTier, attack });
    const config = dialog
      ? await TTERollDialog.prompt({ title: item.name, advice: attack ? advice : { ...advice, advantage: [], disadvantage: [] },
        spell: { maxTier, mana, attack }, fields })
      : { mode: netMode(advice), tier: maxTier, spendMana: !!mana, bonus: "", extra: {} };
    if ( !config ) return null;
    const extra = config.extra ?? {};

    // Cost: the Tier in MP. Blood Casting pays part of it with Life (2 Life per MP).
    const tier = Math.min(config.tier || maxTier, maxTier);
    if ( config.spendMana && mana ) {
      const fromLife = Math.max(0, Math.min(Number(extra.bloodMP) || 0, tier));
      const fromMana = tier - fromLife;
      if ( mana.value < fromMana ) return ui.notifications.warn(fmt("TTE.Spell.NotEnoughMana", { cost: fromMana, value: mana.value }));
      const update = { "system.mana.value": mana.value - fromMana };
      const lifePerMP = this.featureNumber("Blood Casting") || 2;
      if ( fromLife ) update["system.life.value"] = Math.max(0, system.life.value - (fromLife * lifePerMP));
      await this.update(update);
      if ( fromLife ) await chatNote(this, { icon: "fa-droplet", title: this.feature("Blood Casting")?.name ?? "Blood Casting",
        text: fmt("TTE.Feature.BloodCastingPaid", { mp: fromLife, life: fromLife * lifePerMP }) });
    }
    // A new Concentration Spell ends the effects of the last one. Attacking with a Spell ends Sanctuary on you.
    if ( spell.concentration ) await endSpellEffects(this.uuid);
    if ( spell.concentration && !this.statuses.has("concentrating") ) await this.toggleStatusEffect("concentrating", { active: true });
    if ( deals ) await this.#endSanctuary();
    if ( spell.action === "reaction" ) await this.useReaction();
    const effects = SPELL_EFFECTS[item.name] ?? {};

    let formula = spell.formulaAt(tier);
    if ( deals && extra.overcharge ) formula = upgradeDice(formula);
    const cataclysm = (deals && extra.cataclysm) ? this.featureReady("Cataclysm") : null;
    if ( cataclysm ) await this.spendFeature(cataclysm);
    const info = { range: spell.range, arcane, cataclysm: !!cataclysm, destructiveMind: !!extra.destructiveMind };
    const label = `${item.name} (${loc("TTE.Tier")} ${tier})`;
    const conjuring = system.conjuring ?? undefined;
    const auto = tokens.length > 0;
    const tags = [extra.overcharge && "Overcharge", cataclysm?.name, echo && "Arcane Echo"].filter(Boolean);
    await this.#spellCard(item, { tier, formula, auto: auto && (spell.roll.type !== "attack"), tags, echo });

    let result = null;
    if ( attack ) {
      result = await this.rollAttack({
        label, attribute: conjuring,
        damage: deals ? { formula, type: spell.roll.damageType } : null,
        preset: { ...config, attribute: conjuring }, spell: info
      });
    }
    else if ( auto && (spell.roll.type === "test") ) {
      result = await this.#areaSpell({ label, formula: deals ? formula : "", type: spell.roll.damageType,
        attribute: spell.roll.attribute, dc: system.spellDC, tokens, info, effect: effects.fail, tier, item });
    }
    else if ( auto && (spell.roll.type === "healing") && formula && !effects.noRoll ) result = await this.rollHealing({ formula, label: item.name, spell: true });

    // What the Spell does besides damage and healing (SPELL_EFFECTS).
    if ( effects.hit && result?.tteHits?.length ) {
      const lines = [];
      for ( const token of result.tteHits ) lines.push(await this.#applySpellEffect(effects.hit, token, { tier, item }));
      await this.#spellEffectNote(item, lines);
    }
    if ( effects.buff ) await this.#spellBuff(item, effects.buff, { tier, tokens });
    if ( effects.target === "cleanse" ) await this.#cleanse(item, { tier, tokens });
    if ( effects.target === "restoreVigor" ) await this.#restoreVigor(item, { tier, tokens });
    if ( effects.self?.damage ) {
      const roll = await new Roll(TTE.spellDice[effects.self.damage][tier - 1]).evaluate();
      const taken = (await this.applyDamage(roll.total, { type: spell.roll.damageType, card: false })).taken;
      const typeLabel = loc(`TTE.DamageType.${spell.roll.damageType}`);
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `<div class="tte-roll-flavor"><strong>${fmt("TTE.SpellEffect.SelfDamage", { name: item.name })}</strong>`
          + `<span class="tte-roll-tags">${typeLabel}</span></div><p class="tte-damage-result"><i class="fa-solid fa-heart-crack"></i> `
          + `${fmt("TTE.Attack.Took", { name: foundry.utils.escapeHTML(this.name), amount: taken, type: typeLabel })}</p>` });
    }

    // Overcharge hurts the Mage (not with Pure Mana on an Arcane Spell); Cataclysm leaves them Stunned.
    if ( deals && extra.overcharge && !(arcane && this.feature("Pure Mana")) ) await this.#overchargeBacklash();
    if ( cataclysm ) {
      await applyTimedStatus(this, "stunned");
      await chatNote(this, { icon: "fa-explosion", title: cataclysm.name, text: fmt("TTE.Feature.CataclysmStunned", { name: this.name }) });
    }
    return result;
  }

  /** Arcane Echo (Arcanist): Conjure an Arcane Spell again, once per combat. */
  async arcaneEcho(itemId) {
    const item = this.items.get(itemId);
    const echo = this.featureReady("Arcane Echo");
    if ( !item ) return;
    if ( !echo ) return ui.notifications.warn(fmt("TTE.Uses.NoneLeft", { name: "Arcane Echo" }));
    const done = await this.conjure(item, { echo: true });
    if ( done !== undefined ) await this.spendFeature(echo);
    return done;
  }

  /** Overcharge: Weak Arcane damage to yourself, which can't be reduced in any way. */
  async #overchargeBacklash() {
    const roll = await new Roll(this.featureFormula("Overcharge") || TTE.damageDice.weak[this.system.details.tier - 1]).evaluate();
    const result = await this.applyDamage(roll.total, { card: false });
    const flavor = `<div class="tte-roll-flavor"><strong>${loc("TTE.Overcharge.Backlash")}</strong>`
      + `<span class="tte-roll-tags">${loc("TTE.DamageType.arcane")}</span></div>`
      + `<p class="tte-damage-result"><i class="fa-solid fa-heart-crack"></i> ${fmt("TTE.Attack.Took", {
        name: foundry.utils.escapeHTML(this.name), amount: result.taken, type: loc("TTE.DamageType.arcane") })}</p>`;
    return roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor });
  }

  /**
   * Area Spell with targets: each target makes its Test against your Spell Difficulty, and the damage is rolled once.
   * A success halves the damage.
   */
  async #areaSpell({ label, formula, type, attribute, dc, tokens, info, effect = null, tier = 1, item = null }) {
    const roll = formula ? await new Roll(formula).evaluate(info.cataclysm ? { maximize: true } : {}) : null;
    let mind = info.destructiveMind ? this.featureReady("Destructive Mind") : null;
    const disruption = info.arcane && this.feature("Mana Disruption");
    const rows = [];
    for ( const token of tokens ) {
      const actor = token.actor;
      const name = foundry.utils.escapeHTML(token.name);
      let success = null;
      if ( attribute && (typeof actor.rollAttribute === "function") && actor.isOwner ) {
        const test = await actor.rollAttribute(attribute, { dialog: false, dc, label: `${loc(`TTE.Attribute.${cap(attribute)}`)} (${label})` });
        success = test?.tteSuccess ?? null;
      }
      const state = success === null ? "" : success ? "miss" : "hit";
      const testText = success === null ? "?" : loc(success ? "TTE.Roll.Success" : "TTE.Roll.Failure");
      // What a failure does besides damage (Prone, Blinded, Chilled...).
      const effectText = (effect && (success === false)) ? await this.#applySpellEffect(effect, token, { tier, item }) : "";
      if ( !roll ) {
        rows.push(`<li class="${state}"><span>${name}${effectText ? ` <small>(${effectText})</small>` : ""}</span><strong>${testText}</strong></li>`);
        continue;
      }
      let amount = roll.total;
      const parts = [];
      if ( mind ) {
        const bonus = this.featureNumber("Destructive Mind");
        amount += bonus;
        parts.push(`${mind.name} ${signed(bonus)}`);
        await this.spendFeature(mind);
        mind = null;
      }
      if ( success ) {
        amount = Math.ceil(amount / 2);
        parts.push(loc("TTE.Attack.HalfShort"));
      }
      let taken = amount;
      let extraNote = "";
      if ( actor.isOwner && (typeof actor.applyDamage === "function") ) {
        const result = await actor.applyDamage(amount, { type, ignoreResistance: info.arcane && !!this.feature("Arcane Focus"), card: false, spell: true });
        taken = result.taken;
        if ( result.affinity !== "none" ) parts.push(`${loc(`TTE.Affinity.${result.affinity}`)} ${result.before} → ${result.taken}`);
        if ( disruption && taken ) extraNote = fmt("TTE.Feature.ManaDisruptionNote", { name });
      }
      else parts.push(loc("TTE.Attack.NotApplied"));
      if ( effectText ) parts.push(effectText);
      rows.push(`<li class="${state}"><span>${name} <small>(${testText}${parts.length ? `, ${parts.join(", ")}` : ""})</small></span>`
        + `<strong>−${taken}</strong></li>${extraNote ? `<li class="tte-roll-note">${extraNote}</li>` : ""}`);
    }
    const flavor = `<div class="tte-roll-flavor"><strong>${roll ? fmt("TTE.Attack.Damage", { name: label }) : label}</strong>`
      + `<span class="tte-roll-tags">${[roll && loc(`TTE.DamageType.${type}`), fmt("TTE.Roll.Difficulty", { dc }),
        info.cataclysm && loc("TTE.Attack.Maximized")].filter(Boolean).join(" · ")}</span></div>`
      + `<ul class="tte-attack-results">${rows.join("")}</ul>`
      + ((roll && rows.some(r => r.includes(loc("TTE.Attack.NotApplied")))) ? `<button type="button" class="tte-chat-button" data-tte-action="applyDamage">`
        + `<i class="fa-solid fa-heart-crack"></i> ${loc("TTE.Attack.Apply")}</button><button type="button" class="tte-chat-button" data-tte-action="applyDamage" data-half="1">`
        + `<i class="fa-solid fa-shield-halved"></i> ${loc("TTE.Spell.ApplyHalf")}</button>` : "");
    if ( roll ) {
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor,
        flags: { [SYSTEM_ID]: { damage: { amount: roll.total, type, critical: false } } } });
    }
    else await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this }), content: flavor });
    return roll;
  }

  /**
   * Apply what a Spell does to one creature that failed its Test or was hit (see SPELL_EFFECTS).
   * @returns {Promise<string>}  A short line saying what happened.
   */
  async #applySpellEffect(effect, token, { tier, item }) {
    const actor = token?.actor ?? token;
    const name = foundry.utils.escapeHTML(token?.name ?? actor?.name ?? "");
    const lines = [];
    if ( effect.zones ) lines.push(fmt("TTE.SpellEffect.Pushed", { zones: atTier(effect.zones, tier) }));
    if ( !actor?.isOwner ) {
      if ( effect.status ) lines.push(loc(`TTE.Condition.${effect.status}`));
      return [...lines, loc("TTE.Attack.NotApplied")].join(", ");
    }
    if ( effect.status ) {
      if ( effect.timed ) await applyTimedStatus(actor, effect.status);
      else if ( !actor.statuses.has(effect.status) ) await actor.toggleStatusEffect(effect.status, { active: true });
      // Damage over time uses the Tier of whoever caused it.
      if ( actor.system.conditionTier?.[effect.status] !== undefined ) await actor.update({ [`system.conditionTier.${effect.status}`]: tier });
      if ( effect.endOnDamage ) await actor.effects.find(e => e.statuses?.has(effect.status))?.setFlag(SYSTEM_ID, "endOnDamage", true);
      if ( actor.statuses.has(effect.status) ) lines.unshift(loc(`TTE.Condition.${effect.status}`));
    }
    if ( effect.endConcentration && actor.statuses.has("concentrating") ) {
      await actor.toggleStatusEffect("concentrating", { active: false });
      lines.push(loc("TTE.SpellEffect.LostConcentration"));
    }
    if ( effect.noReactions ) {
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: `${item?.name ?? ""}: ${loc("TTE.SpellEffect.NoReactions")}`, img: item?.img,
        flags: { [SYSTEM_ID]: { noReactions: true, endsAtTurnStart: true } }
      }]);
      lines.push(loc("TTE.SpellEffect.NoReactions"));
    }
    return lines.join(", ") || name;
  }

  /** A card listing what a Spell did to each creature. */
  #spellEffectNote(item, lines) {
    lines = lines.filter(l => l);
    if ( !lines.length ) return null;
    return chatNote(this, { icon: "fa-wand-sparkles", title: item.name, text: lines.join("<br>") });
  }

  /**
   * A Spell that helps the creatures you target (or you, with no target): an effect that lasts while you
   * keep Concentration, until the end of the target's next Turn, or until the combat ends.
   */
  async #spellBuff(item, buff, { tier, tokens }) {
    const targets = tokens.length ? tokens.map(t => ({ actor: t.actor, name: t.name })) : [{ actor: this, name: this.name }];
    const spell = item.system;
    const data = {};
    if ( buff.defense ) data.defense = Number(atTier(buff.defense, tier)) || 0;
    if ( buff.roll ) data.roll = Number(atTier(buff.roll, tier)) || 0;
    if ( buff.speed ) data.speed = Number(atTier(buff.speed, tier)) || 0;
    if ( buff.cover ) data.cover = true;
    if ( buff.sanctuary ) data.sanctuary = { dc: this.system.spellDC, caster: this.uuid };
    if ( buff.regen ) data.regen = TTE.damageDice[buff.regen][tier - 1];
    const changes = [];
    let wardType = null;
    if ( buff.ward ) {
      const types = tier >= 2 ? TTE.damageTypes : ["freeze", "heat", "lightning"];
      wardType = await foundry.applications.api.DialogV2.wait({
        window: { title: item.name }, classes: ["tte-dialog"], content: `<p>${loc("TTE.SpellEffect.ChooseType")}</p>`, rejectClose: false,
        buttons: types.map(t => ({ action: t, label: loc(`TTE.DamageType.${t}`) }))
      });
      if ( !wardType ) return;
      changes.push({ key: `system.affinities.${wardType}`, mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE, value: "resistance" });
    }
    const flags = { spellBuff: data };
    if ( spell.concentration ) flags.concentration = this.uuid;
    else if ( !buff.timed ) flags.combatEnd = true;
    const lines = [];
    for ( const target of targets ) {
      const actor = target.actor;
      const name = foundry.utils.escapeHTML(target.name);
      if ( !actor?.isOwner ) {
        lines.push(`${name}: ${loc("TTE.Attack.NotApplied")}`);
        continue;
      }
      // The same Spell doesn't stack: it renews.
      const old = actor.effects.filter(e => e.getFlag(SYSTEM_ID, "spell") === item.name).map(e => e.id);
      if ( old.length ) await actor.deleteEmbeddedDocuments("ActiveEffect", old);
      const own = { ...flags, spell: item.name };
      if ( buff.timed ) own.turnsLeft = turnsUntilNextTurnEnd(actor);
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: wardType ? `${item.name} (${loc(`TTE.DamageType.${wardType}`)})` : item.name, img: item.img, changes,
        flags: { [SYSTEM_ID]: own }
      }]);
      const what = [];
      if ( data.defense ) what.push(`${signed(data.defense)} ${loc("TTE.Defense")}`);
      if ( data.roll ) what.push(fmt("TTE.SpellEffect.RollBonus", { bonus: signed(data.roll) }));
      if ( data.speed ) what.push(fmt("TTE.SpellEffect.Speed", { bonus: signed(data.speed) }));
      if ( data.cover ) what.push(loc("TTE.Condition.cover"));
      if ( data.sanctuary ) what.push(fmt("TTE.SpellEffect.SanctuaryOn", { dc: data.sanctuary.dc }));
      if ( data.regen ) what.push(fmt("TTE.SpellEffect.RegenOn", { formula: data.regen }));
      if ( wardType ) what.push(`${loc("TTE.Affinity.resistance")}: ${loc(`TTE.DamageType.${wardType}`)}`);
      lines.push(`${name}: ${what.join(", ")}`);
    }
    return this.#spellEffectNote(item, lines);
  }

  /** Cleanse: end one Condition (two at Tier 4) on the creature you touch. Tier decides which ones. */
  async #cleanse(item, { tier, tokens }) {
    const token = tokens[0];
    const actor = token?.actor ?? this;
    const name = foundry.utils.escapeHTML(token?.name ?? this.name);
    if ( !actor.isOwner ) return this.#spellEffectNote(item, [`${name}: ${loc("TTE.Attack.NotApplied")}`]);
    const allowed = ["blinded", "burned", "chilled", "deafened"];
    if ( tier >= 2 ) allowed.push("mute", "scared");
    if ( tier >= 3 ) allowed.push("restrained", "stunned");
    const removed = [];
    for ( let i = 0; i < (tier >= 4 ? 2 : 1); i++ ) {
      const present = allowed.filter(id => actor.statuses.has(id) && !removed.includes(id));
      if ( !present.length ) break;
      const pick = present.length === 1 ? present[0] : await foundry.applications.api.DialogV2.wait({
        window: { title: item.name }, classes: ["tte-dialog"], content: `<p>${fmt("TTE.SpellEffect.ChooseCondition", { name })}</p>`,
        rejectClose: false, buttons: present.map(id => ({ action: id, label: loc(`TTE.Condition.${id}`) }))
      });
      if ( !pick ) break;
      await actor.toggleStatusEffect(pick, { active: false });
      removed.push(pick);
    }
    const text = removed.length ? fmt("TTE.SpellEffect.Cleansed", { name, conditions: removed.map(id => loc(`TTE.Condition.${id}`)).join(", ") })
      : fmt("TTE.SpellEffect.NothingToCleanse", { name });
    return this.#spellEffectNote(item, [text]);
  }

  /** Restore Vigor: remove 1 > 1 > 2 > 2 Levels of Deprived. */
  async #restoreVigor(item, { tier, tokens }) {
    const token = tokens[0];
    const actor = token?.actor ?? this;
    const name = foundry.utils.escapeHTML(token?.name ?? this.name);
    if ( !actor.isOwner || (typeof actor.setDeprived !== "function") ) return this.#spellEffectNote(item, [`${name}: ${loc("TTE.Attack.NotApplied")}`]);
    const before = actor.system.deprived;
    const after = Math.max(0, before - (Number(atTier("1 > 1 > 2 > 2", tier)) || 1));
    await actor.setDeprived(after);
    return this.#spellEffectNote(item, [fmt("TTE.SpellEffect.Restored", { name, before, after })]);
  }

  /** Sanctuary ends on a creature that attacks or Conjures a Spell that deals damage. */
  async #endSanctuary() {
    const ids = this.effects.filter(e => e.getFlag(SYSTEM_ID, "spellBuff")?.sanctuary).map(e => e.id);
    if ( ids.length ) await this.deleteEmbeddedDocuments("ActiveEffect", ids);
  }

  /** Chat card of a Conjured Spell, with the buttons its roll needs. */
  async #spellCard(item, { tier, formula, auto = false, tags = [], echo = false }) {
    const spell = item.system;
    const TextEditor = foundry.applications.ux.TextEditor.implementation;
    const description = await TextEditor.enrichHTML(spell.description, { relativeTo: item });
    const buttons = [];
    const flags = { label: item.name, formula, type: spell.roll.damageType, attribute: spell.roll.attribute, dc: this.system.spellDC,
      itemId: item.id };
    if ( (spell.roll.type === "test") && !auto ) {
      const attr = spell.roll.attribute ? loc(`TTE.Attribute.${cap(spell.roll.attribute)}`) : loc("TTE.Roll.Attribute");
      buttons.push(`<p class="tte-roll-note">${fmt("TTE.Spell.TestNote", { attribute: attr, dc: this.system.spellDC })}</p>`);
      if ( spell.roll.attribute ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="spellTest">
        <i class="fa-solid fa-dice-d20"></i> ${fmt("TTE.Spell.RollTest", { attribute: attr, dc: this.system.spellDC })}</button>`);
      if ( formula && spell.roll.damageType ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="spellDamage">
        <i class="fa-solid fa-burst"></i> ${loc("TTE.Attack.RollDamage")}</button>`);
    }
    if ( (spell.roll.type === "healing") && formula && !auto ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="spellHeal">
      <i class="fa-solid fa-heart-pulse"></i> ${fmt("TTE.Spell.RollHealing", { formula })}</button>`);
    const echoFeature = !echo && (spell.roll.damageType === "arcane") && formula && this.featureReady("Arcane Echo");
    if ( echoFeature ) buttons.push(`<button type="button" class="tte-chat-button" data-tte-action="arcaneEcho">
      <i class="fa-solid fa-repeat"></i> ${echoFeature.name}</button>`);
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: itemCardHTML(item, { details: item.chatDetails({ tier, conjured: true, formula }), description, buttons, extraTags: tags }),
      flags: { [SYSTEM_ID]: { spell: flags } }
    });
  }

  /**
   * Roll healing. With targets it is applied to them; otherwise the card has an Apply button.
   * Potent Healing (Healer) adds Intellect to Spell healing.
   */
  async rollHealing({ formula, label = "", spell = false }) {
    const potent = spell && this.feature("Potent Healing");
    const bonus = potent ? this.featureNumber("Potent Healing") : 0;
    const roll = await new Roll(bonus ? `${formula} ${bonus >= 0 ? "+" : "-"} ${Math.abs(bonus)}` : formula).evaluate();
    const tokens = Array.from(game.user.targets ?? []).filter(t => t.actor);
    const rows = [];
    for ( const token of tokens ) {
      if ( !token.actor.isOwner || (typeof token.actor.applyHealing !== "function") ) continue;
      await token.actor.applyHealing(roll.total);
      rows.push(`<li class="hit"><span>${foundry.utils.escapeHTML(token.name)}</span><strong>+${roll.total}</strong></li>`);
    }
    const tags = potent ? `<span class="tte-roll-tags">${potent.name} ${signed(bonus)}</span>` : "";
    let flavor = `<div class="tte-roll-flavor"><strong>${fmt("TTE.Spell.Healing", { name: label })}</strong>${tags}</div>`;
    if ( rows.length ) flavor += `<ul class="tte-attack-results">${rows.join("")}</ul>`;
    else flavor += `<button type="button" class="tte-chat-button" data-tte-action="applyHealing">`
      + `<i class="fa-solid fa-heart-pulse"></i> ${loc("TTE.Spell.ApplyHealing")}</button>`;
    const step = spell && this.feature("Mender's Step");
    if ( step ) flavor += `<p class="tte-roll-note">${step.name}: ${loc("TTE.Feature.MendersStepNote")}</p>`;
    await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor, flags: { [SYSTEM_ID]: { healing: { amount: roll.total } } } });
    return roll;
  }

  /** Attack with a weapon item (or a shield with Bashing). */
  async rollWeaponAttack(item, options = {}) {
    if ( item.type === "armor" ) {
      const bash = TTE.bashingDamage;
      return this.rollAttack({
        label: item.name, attribute: bash.attribute,
        damage: { formula: TTE.damageDice[bash.category][this.system.details.tier - 1], type: bash.type }, ...options
      });
    }
    const system = item.system;
    // Ammunition weapons need ammo, and each attack spends one.
    const ammoName = system.properties.ammunition;
    let ammo = null;
    if ( ammoName ) {
      ammo = this.findAmmunition(ammoName);
      if ( !ammo ) {
        ui.notifications.warn(fmt("TTE.Ammo.None", { weapon: item.name, ammo: ammoName }));
        return null;
      }
    }
    // Reload (X): after X attacks, the Main Action reloads the weapon.
    const reload = system.properties.reload;
    const fired = item.getFlag(SYSTEM_ID, "fired") ?? 0;
    if ( reload && (fired >= reload) ) {
      const yes = await foundry.applications.api.DialogV2.confirm({
        window: { title: item.name }, content: `<p>${fmt("TTE.Reload.Needed", { name: item.name })}</p>`, rejectClose: false
      });
      if ( yes ) {
        await item.unsetFlag(SYSTEM_ID, "fired");
        await chatNote(this, { icon: "fa-arrows-rotate", title: fmt("TTE.Reload.Done", { name: item.name }), text: loc("TTE.Reload.DoneHint") });
      }
      return null;
    }
    const notes = [];
    if ( ammo ) notes.push(fmt("TTE.Ammo.Spent", { name: ammo.name, left: Math.max(0, ammo.system.ammoLeft - 1) }));
    if ( reload && (fired + 1 >= reload) ) notes.push(fmt("TTE.Reload.Empty", { name: item.name }));
    const roll = await this.rollAttack({
      label: item.name, attribute: system.attribute, weapon: system,
      damage: { type: system.damage.type },
      note: notes.join(" "),
      ...options
    });
    if ( roll && ammo ) await ammo.system.spendAmmo();
    if ( roll && reload && !options.reroll ) await item.setFlag(SYSTEM_ID, "fired", fired + 1);
    return roll;
  }

  /** The ammunition a weapon uses ("Arrows" finds "Arrows (20)"), preferring what is in a Quiver. */
  findAmmunition(name) {
    const key = name.toLowerCase().trim();
    const ammo = this.items.filter(i => (i.type === "equipment") && (i.system.category === "ammunition")
      && i.name.toLowerCase().startsWith(key) && (i.system.ammoLeft > 0));
    const inQuiver = i => this.items.get(i.system.container)?.system.weightless;
    return ammo.sort((a, b) => Number(inQuiver(b) ?? false) - Number(inQuiver(a) ?? false))[0] ?? null;
  }

  /** Unarmed Attack: Weak Blunt damage, Medium with Brawler. */
  rollUnarmedAttack(options = {}) {
    const formula = (this.feature("Brawler") && this.featureFormula("Brawler")) || TTE.damageDice.weak[this.system.details.tier - 1];
    return this.rollAttack({
      label: loc("TTE.Action.unarmedAttack"), attribute: "strength", damage: { formula, type: "blunt", unarmed: true }, ...options
    });
  }

  /**
   * Roll damage and post it with an Apply button.
   * On a critical hit you take the maximum value of the dice and roll them again, adding both.
   * @param {object} options
   * @param {string} options.formula
   * @param {string} options.type       Damage type.
   * @param {boolean} [options.critical]
   * @param {string} [options.label]
   */
  async rollDamage({ formula, type, critical = false, half = false, label = "", halfOnSuccess = false }) {
    let full = critical ? criticalFormula(formula) : formula;
    if ( half ) full = `ceil((${full}) / 2)`;
    const roll = await new Roll(full).evaluate();
    const typeLabel = loc(`TTE.DamageType.${type}`);
    const flavor = `<div class="tte-roll-flavor"><strong>${fmt("TTE.Attack.Damage", { name: label })}</strong>`
      + `<span class="tte-roll-tags">${typeLabel}</span>`
      + (critical ? `<span class="tte-crit success">${loc("TTE.Attack.CriticalHit")}</span>` : "")
      + (half ? `<span class="tte-roll-tags">${loc("TTE.Attack.HalfShort")}</span>` : "")
      + `</div><button type="button" class="tte-chat-button" data-tte-action="applyDamage">`
      + `<i class="fa-solid fa-heart-crack"></i> ${loc("TTE.Attack.Apply")}</button>`
      + (halfOnSuccess ? `<button type="button" class="tte-chat-button" data-tte-action="applyDamage" data-half="1">`
        + `<i class="fa-solid fa-shield-halved"></i> ${loc("TTE.Spell.ApplyHalf")}</button>` : "");
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor,
      flags: { [SYSTEM_ID]: { damage: { amount: roll.total, type, critical } } }
    });
    return roll;
  }

  /**
   * Apply damage. Affinities are applied as the last step.
   * At 0 Life every instance of damage adds a Wound (2 on a critical hit).
   * @param {number} amount
   * @param {object} [options]
   * @param {string} [options.type]      Damage type, for Affinities. Without a type the damage can't be reduced.
   * @param {boolean} [options.critical]
   * @param {boolean} [options.ignoreResistance]  Resistance doesn't apply (Arcane Focus).
   * @param {boolean} [options.card]     Post a card when an Affinity changes the damage.
   * @returns {Promise<{taken: number, before: number, affinity: string}>}
   */
  async applyDamage(amount, { type, critical = false, ignoreResistance = false, card = true, spell = false } = {}) {
    amount = Math.max(0, Math.floor(amount) || 0);
    let affinity = (type && this.system.affinity?.[type]) || "none";
    // Last Stand: Resistance to all damage for a while.
    let resist = type && this.effects.some(e => !e.disabled && e.getFlag(SYSTEM_ID, "resistAll"));
    // Arcane Blood (Arcane Elf): a Reaction for Resistance to damage from a Spell.
    const blood = spell && type && amount && !resist && !["resistance", "immunity"].includes(affinity) && this.featureReady("Arcane Blood");
    if ( blood && this.canReact() && await askReaction(this, blood, fmt("TTE.Reaction.ArcaneBlood", {
      amount, type: loc(`TTE.DamageType.${type}`) })) ) {
      await this.spendFeature(blood);
      await this.useReaction();
      resist = true;
    }
    if ( resist ) {
      if ( affinity === "none" ) affinity = "resistance";
      else if ( affinity === "weakness" ) affinity = "none";
    }
    if ( ignoreResistance && (affinity === "resistance") ) affinity = "none";
    const before = amount;
    if ( affinity === "resistance" ) amount = Math.ceil(amount / 2);
    else if ( affinity === "weakness" ) amount *= 2;
    else if ( affinity === "immunity" ) amount = 0;
    // Show the math when an Affinity changed the damage.
    if ( card && (affinity !== "none") && before ) {
      const icon = { resistance: "fa-shield-halved", weakness: "fa-heart-crack", immunity: "fa-ban" }[affinity];
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<div class="tte-chat-card tte-affinity-card is-${affinity}"><header><i class="fa-solid ${icon}"></i><div>
          <h3>${fmt("TTE.AffinityApplied.Title", { affinity: loc(`TTE.Affinity.${affinity}`), type: loc(`TTE.DamageType.${type}`) })}</h3>
          <span>${fmt("TTE.AffinityApplied.Math", { name: this.name, before, after: amount })}</span></div></header></div>`
      });
    }
    const result = { taken: amount, before, affinity };
    if ( !amount ) return result;

    const life = this.system.life.value;
    // Regeneration stops after damage of its type; Undying keeps the monster at 1 Life once per combat.
    const regen = monsterFeature(this, "Regeneration");
    if ( regen && (type === TTEActor.abilityType(regen, /took (\w+) damage/i)) ) await this.setFlag(SYSTEM_ID, "regenBlocked", true);
    const undying = monsterFeature(this, "Undying");
    if ( undying && (life > 0) && (amount >= life) && !critical && !this.getFlag(SYSTEM_ID, "undyingUsed")
      && (type !== TTEActor.abilityType(undying, /unless the damage was (\w+)/i)) ) {
      amount = life - 1;
      result.taken = amount;
      await this.setFlag(SYSTEM_ID, "undyingUsed", true);
      await chatNote(this, { icon: "fa-skull", title: undying.name, text: fmt("TTE.Monster.UndyingDone", { name: this.name }) });
    }
    if ( life > 0 ) await this.update({ "system.life.value": life - amount });
    else await this.addWounds(critical ? 2 : 1);

    // Brittle Bones: Blunt damage knocks it Prone. Spiteful Burst: dropping to 0 Life hurts the creatures next to it.
    if ( amount && (type === "blunt") && monsterFeature(this, "Brittle Bones") && !this.statuses.has("prone") ) {
      await this.toggleStatusEffect("prone", { active: true });
    }
    const burst = (life > 0) && (this.system.life.value <= 0) && monsterFeature(this, "Spiteful Burst");
    if ( burst && globalThis.canvas?.ready ) {
      const me = activeToken(this);
      const info = abilityInfo(burst);
      for ( const t of canvas.tokens.placeables ) {
        if ( !me || (t === me) || !t.actor || (zoneDistance(t, me) > 1) ) continue;
        await this.dealDamage({ token: t, formula: monsterDice(this, info.categories[0]),
          type: info.types.find(x => TTE.damageTypes.includes(x)) ?? this.monsterElement, label: burst.name });
      }
    }

    // Effects that end when the creature takes damage (Soothe).
    const ending = this.effects.filter(e => e.getFlag(SYSTEM_ID, "endOnDamage")).map(e => e.id);
    if ( ending.length ) await this.deleteEmbeddedDocuments("ActiveEffect", ending);

    if ( this.system.conditions?.has("concentrating") && !this.system.dead ) {
      const dc = Math.max(TTE.concentrationDC, Math.ceil(amount / 2));
      const focused = this.system.gear?.focused ? ` ${loc("TTE.Concentration.Focused")}` : "";
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<div class="tte-chat-card"><header><i class="fa-solid fa-eye"></i><div>
          <h3>${loc("TTE.Concentration.Title")}</h3><span>${fmt("TTE.Concentration.Check", { dc, attribute: this.system.conjuring ? loc(`TTE.Attribute.${cap(this.system.conjuring)}`) : loc("TTE.Class.Conjuring") })}${focused}</span></div></header></div>`
      });
    }
    return result;
  }

  /** Last Stand (Defender): dropped to 1 Life instead of 0, with Resistance to all damage until the end of the next Turn. */
  async #lastStand(item) {
    if ( !item ) return;
    await this.spendFeature(item);
    await this.createEmbeddedDocuments("ActiveEffect", [{
      name: item.name, img: item.img,
      flags: { [SYSTEM_ID]: { resistAll: true, turnsLeft: turnsUntilNextTurnEnd(this) } }
    }]);
    return chatNote(this, { icon: "fa-shield", title: item.name, text: fmt("TTE.Feature.LastStandDone", { name: this.name }) });
  }

  /** Recover Life. Recovering at least 1 Life removes Fainted. */
  async applyHealing(amount) {
    amount = Math.max(0, Math.floor(amount) || 0);
    if ( !amount ) return;
    return this.update({ "system.life.value": this.system.life.value + amount });
  }

  /** Add Wounds. A Wound past the maximum kills the character. */
  async addWounds(count = 1) {
    const total = this.system.wounds + count;
    await this.update({ "system.wounds": Math.min(total, TTE.maxWounds) });
    if ( total > TTE.maxWounds ) await this.toggleStatusEffect("dead", { active: true, overlay: true });
  }

  /** Recovery roll while Fainted: d20, 11 or higher stands back up with 1 Life. */
  async rollRecovery() {
    const roll = await new Roll("1d20").evaluate();
    const success = roll.total >= TTE.recoveryDC;
    const flavor = `<div class="tte-roll-flavor"><strong>${loc("TTE.Recovery")}</strong>`
      + `<span class="tte-roll-tags">DC ${TTE.recoveryDC}</span>`
      + `<span class="tte-crit ${success ? "success" : "failure"}">`
      + `${loc(success ? "TTE.RecoverySuccess" : "TTE.RecoveryFail")}</span></div>`;
    await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor });
    if ( success ) {
      await this.update({ "system.life.value": Math.max(1, this.system.life.value) });
      await this.toggleStatusEffect("fainted", { active: false });
    }
    return roll;
  }

  /* -------------------------------------------- */
  /*  Conditions                                  */
  /* -------------------------------------------- */

  /**
   * Set the Deprived level. Gaining a Level while already at the last Level gives 1 Wound.
   * @param {number} level
   */
  async setDeprived(level) {
    const current = this.system.deprived;
    if ( (level > TTE.maxDeprived) && (current >= TTE.maxDeprived) ) return this.addWounds(1);
    level = Math.max(0, Math.min(level, TTE.maxDeprived));
    if ( level !== current ) return this.update({ "system.deprived": level });
  }

  /** Turn a condition on or off. Automatic conditions can't be toggled. */
  async toggleCondition(id) {
    const config = TTE.conditions[id] ?? (TTE.extraStatuses[id]?.grid ? TTE.extraStatuses[id] : null);
    if ( !config || config.automatic ) return;
    if ( config.levels ) return this.setDeprived(this.system.deprived > 0 ? 0 : 1);
    return this.toggleStatusEffect(id);
  }

  /** End of this creature's Turn: Burned and Chilled deal damage based on the Condition's Tier. */
  async processTurnEnd() {
    await this.#repeatSaves();
    for ( const [id, config] of Object.entries(TTE.conditions) ) {
      if ( !config.damage || !this.statuses.has(id) ) continue;
      const tier = this.system.conditionTier?.[id] ?? 1;
      const formula = TTE.damageDice[config.damage.category][tier - 1];
      const roll = await new Roll(formula).evaluate();
      const name = loc(`TTE.Condition.${id}`);
      const flavor = `<div class="tte-roll-flavor"><strong>${fmt("TTE.TurnDamage.Title", { condition: name })}</strong>`
        + `<span class="tte-roll-tags">${loc(`TTE.DamageType.${config.damage.type}`)} · ${loc("TTE.Tier")} ${tier}</span></div>`;
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor });
      await this.applyDamage(roll.total, { type: config.damage.type });
    }
    await this.#tickTimedEffects();
  }

  /** Effects that last a number of Turns (Taunt, Dirty Trick, Cataclysm, Last Stand) count down at the end of each Turn. */
  async #tickTimedEffects() {
    for ( const effect of this.effects.filter(e => e.getFlag(SYSTEM_ID, "turnsLeft")) ) {
      const left = effect.getFlag(SYSTEM_ID, "turnsLeft") - 1;
      if ( left <= 0 ) await effect.delete();
      else await effect.setFlag(SYSTEM_ID, "turnsLeft", left);
    }
  }

  /** Start of this creature's Turn: Dodge ends, the Reaction comes back, and Rejuvenation heals. */
  async processTurnStart() {
    if ( this.statuses.has("dodging") ) await this.toggleStatusEffect("dodging", { active: false });
    await this.#regenerate();
    await this.#auras();
    await this.resetUses(["turn"]);
    if ( this.getFlag(SYSTEM_ID, "reactionUsed") ) await this.unsetFlag(SYSTEM_ID, "reactionUsed");
    const ending = this.effects.filter(e => e.getFlag(SYSTEM_ID, "endsAtTurnStart")).map(e => e.id);
    if ( ending.length ) await this.deleteEmbeddedDocuments("ActiveEffect", ending);
    for ( const effect of this.effects.filter(e => !e.disabled && e.getFlag(SYSTEM_ID, "spellBuff")?.regen) ) {
      const formula = effect.getFlag(SYSTEM_ID, "spellBuff").regen;
      const roll = await new Roll(formula).evaluate();
      await this.applyHealing(roll.total);
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `<div class="tte-roll-flavor"><strong>${fmt("TTE.Spell.Healing", { name: effect.name })}</strong></div>`
          + `<ul class="tte-attack-results"><li class="hit"><span>${foundry.utils.escapeHTML(this.name)}</span><strong>+${roll.total}</strong></li></ul>` });
    }
  }

  /**
   * Give the features of the race, class and specialization up to the current level,
   * and remove the ones above it (after a level goes down).
   */
  syncGrantedFeatures() {
    // One sync at a time, so features created together are not given twice.
    this._tteSync = (this._tteSync ?? Promise.resolve()).then(() => this.#syncGrantedFeatures()).catch(console.error);
    return this._tteSync;
  }

  async #syncGrantedFeatures() {
    const level = this.system.details.level;
    const owned = new Map();
    for ( const item of this.items ) {
      const key = item.getFlag(SYSTEM_ID, "grantKey");
      if ( key ) owned.set(key, item);
    }
    const toCreate = [];
    const toDelete = [];
    for ( const source of this.items.filter(i => GRANTING_TYPES.includes(i.type)) ) {
      // Old race features (before class support) have no key; leave them alone.
      if ( (source.type === "race") && this.items.some(i => i.getFlag(SYSTEM_ID, "race") === source.id) ) continue;
      for ( const grant of source.grantedFeatures() ) {
        const has = owned.get(grant.key);
        if ( (grant.level <= level) && !has ) toCreate.push(grant.data);
        else if ( (grant.level > level) && has ) toDelete.push(has.id);
      }
    }
    if ( toDelete.length ) await this.deleteEmbeddedDocuments("Item", toDelete);
    if ( toCreate.length ) await this.createEmbeddedDocuments("Item", toCreate);
  }

  /**
   * Refill the uses of features for the periods that ended.
   * @param {string[]} periods  "turn", "combat", "rest" or "recover".
   */
  async resetUses(periods) {
    const updates = this.items.filter(i => (i.type === "feature") && periods.includes(i.system.uses.per) && i.system.uses.spent)
      .map(i => ({ _id: i.id, "system.uses.spent": 0 }));
    if ( updates.length ) await this.updateEmbeddedDocuments("Item", updates);
  }

  /** End of combat: per-combat uses come back and resources like Combo are lost. */
  async processCombatEnd() {
    await this.resetUses(["turn", "combat"]);
    // Marks, free Finishers and effects that last some Turns end with the combat.
    for ( const flag of ["mark", "freeDirtyTrick", "moved", "reactionUsed", "undyingUsed", "regenBlocked"] ) if ( this.getFlag(SYSTEM_ID, flag) !== undefined ) await this.unsetFlag(SYSTEM_ID, flag);
    // Weapons with Reload are reloaded after the fight.
    const loaded = this.items.filter(i => i.getFlag(SYSTEM_ID, "fired")).map(i => ({ _id: i.id, [`flags.${SYSTEM_ID}.-=fired`]: null }));
    if ( loaded.length ) await this.updateEmbeddedDocuments("Item", loaded);
    const timed = this.effects.filter(e => e.getFlag(SYSTEM_ID, "turnsLeft") || e.getFlag(SYSTEM_ID, "combatEnd") || e.getFlag(SYSTEM_ID, "repeatSave")
      || e.getFlag(SYSTEM_ID, "endsAtTurnStart") || e.getFlag(SYSTEM_ID, "speedZero")).map(e => e.id);
    if ( timed.length ) await this.deleteEmbeddedDocuments("ActiveEffect", timed);
    if ( (this.system.resourceReset === "combat") && this.system.resource.value ) {
      await this.update({ "system.resource.value": 0 });
    }
  }

  /* -------------------------------------------- */
  /*  Monster abilities                           */
  /* -------------------------------------------- */

  /** The element a monster chose (Element trait), Heat until chosen. */
  get monsterElement() {
    return this.getFlag(SYSTEM_ID, "element") ?? "heat";
  }

  /** The weapon a monster ability names in its text, or its first weapon. */
  #abilityWeapon(item) {
    const text = String(item?.system?.description ?? "");
    const weapons = this.items.filter(i => i.type === "weapon");
    return weapons.find(w => text.includes(w.name)) ?? weapons.find(w => w.system.equipped) ?? weapons[0] ?? null;
  }

  /** Use a monster ability (see MONSTER_ABILITIES). Returns false to cancel, or {html, after} like FEATURE_ACTIONS. */
  async #monsterAbility(item, spec) {
    const info = abilityInfo(item);
    if ( spec.save ) {
      const tokens = Array.from(game.user.targets ?? []).filter(t => t.actor && (t.actor !== this));
      if ( !tokens.length ) {
        ui.notifications.warn(loc("TTE.Monster.NeedTargets"));
        return false;
      }
      return { after: () => this.abilitySave(item, spec, tokens.slice(0, spec.maxTargets ?? tokens.length)) };
    }
    if ( spec.rider || spec.attack ) {
      const weapon = this.#abilityWeapon(item);
      if ( !weapon ) return {};
      if ( spec.attack ) return { after: () => this.rollWeaponAttack(weapon) };
      const rider = { ...spec.rider, name: item.name, dcAttr: info.dcAttr, categories: info.categories };
      return { after: () => this.rollWeaponAttack(weapon, { rider }) };
    }
    if ( spec.hide ) {
      if ( !this.statuses.has("hidden") ) await this.toggleStatusEffect("hidden", { active: true });
      return {};
    }
    if ( spec.shakeOff ) {
      const active = [...(this.system.conditions ?? [])].filter(c => (c in TTE.conditions) && !TTE.conditions[c].automatic);
      if ( !active.length ) {
        ui.notifications.info(loc("TTE.Monster.ShakeOffNone"));
        return false;
      }
      const choice = await foundry.applications.api.DialogV2.wait({
        window: { title: item.name }, rejectClose: false,
        buttons: active.map(c => ({ action: c, label: loc(`TTE.Condition.${c}`) }))
      });
      if ( !choice || !active.includes(choice) ) return false;
      await this.toggleStatusEffect(choice, { active: false });
      return { html: fmt("TTE.Monster.ShakeOffDone", { condition: loc(`TTE.Condition.${choice}`) }) };
    }
    if ( spec.element ) {
      const options = info.types.filter(t => ["heat", "freeze", "lightning", "arcane"].includes(t));
      const choice = await foundry.applications.api.DialogV2.wait({
        window: { title: item.name }, rejectClose: false,
        buttons: [...new Set(options)].map(t => ({ action: t, label: loc(`TTE.DamageType.${t}`) }))
      });
      if ( !choice || !options.includes(choice) ) return false;
      const old = this.getFlag(SYSTEM_ID, "element");
      const affinity = /Immunity/.test(info.text) ? "immunity" : "resistance";
      const changes = {};
      for ( const t of ["heat", "freeze", "lightning", "arcane"] ) if ( (t === old) || (t === choice) ) changes[t] = "none";
      // A Heat elemental is Vulnerable to Freeze, and a Freeze elemental to Heat.
      if ( /Vulnerability to Freeze/.test(info.text) ) {
        if ( ["heat", "freeze"].includes(old) ) changes[old === "heat" ? "freeze" : "heat"] = "none";
        if ( choice === "heat" ) changes.freeze = "weakness";
        if ( choice === "freeze" ) changes.heat = "weakness";
      }
      changes[choice] = affinity;
      await this.update({ system: { affinities: changes } });
      await this.setFlag(SYSTEM_ID, "element", choice);
      return { html: fmt("TTE.Monster.ElementSet", { type: loc(`TTE.DamageType.${choice}`) }) };
    }
    if ( spec.material ) {
      const choice = await foundry.applications.api.DialogV2.wait({
        window: { title: item.name }, rejectClose: false,
        buttons: Object.keys(MONSTER_MATERIALS).map(m => ({ action: m, label: loc(`TTE.Monster.Material.${m}`) }))
      });
      if ( !MONSTER_MATERIALS[choice] ) return false;
      const changes = Object.fromEntries(Object.values(MONSTER_MATERIALS).flatMap(m => Object.keys(m)).map(t => [t, "none"]));
      Object.assign(changes, MONSTER_MATERIALS[choice]);
      await this.update({ system: { affinities: changes } });
      await this.setFlag(SYSTEM_ID, "material", choice);
      return { html: fmt("TTE.Monster.MaterialSet", { material: loc(`TTE.Monster.Material.${choice}`) }) };
    }
    return {};
  }

  /** Give a creature that failed a monster's Test what the ability does (a Condition or a named effect). */
  async #abilityCondition(actor, item, { condition, effect, turns, repeat, attribute, dc }) {
    if ( !actor?.isOwner ) return;
    const repeatSave = repeat ? { attribute, dc, label: item.name } : null;
    if ( condition ) {
      if ( turns === "next" ) return applyTimedStatus(actor, condition);
      if ( !actor.statuses.has(condition) ) await actor.toggleStatusEffect(condition, { active: true });
      const own = actor.effects.find(e => e.statuses?.has(condition));
      if ( own && repeatSave ) await own.setFlag(SYSTEM_ID, "repeatSave", repeatSave);
      return;
    }
    if ( effect ) {
      await actor.createEmbeddedDocuments("ActiveEffect", [{
        name: item.name, img: item.img,
        flags: { [SYSTEM_ID]: turns === "next" ? { turnsLeft: turnsUntilNextTurnEnd(actor) } : { repeatSave } }
      }]);
    }
  }

  /**
   * A monster ability with a Test (Breath, Web, Frightful Presence...): each target tests against the monster's
   * Difficulty. Damage is rolled once; on a failure the creature takes it and what else the ability does.
   */
  async abilitySave(item, spec, tokens) {
    const save = spec.save;
    const info = abilityInfo(item);
    const dc = monsterDC(this, info.dcAttr);
    const type = save.damage === "element" ? this.monsterElement : save.damage;
    let damage = null;
    if ( type ) {
      damage = await new Roll(monsterDice(this, info.categories[0])).evaluate();
      await damage.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }),
        flavor: `<div class="tte-roll-flavor"><strong>${fmt("TTE.Attack.Damage", { name: item.name })}</strong>`
          + `<span class="tte-roll-tags">${loc(`TTE.DamageType.${type}`)} · ${loc("TTE.Monster.OnFailure")}</span></div>` });
    }
    const mana = save.mana && info.ladder ? info.ladder[(this.system.details.tier ?? 1) - 1] : 0;
    const label = `${loc(`TTE.Attribute.${cap(save.attribute)}`)} (${item.name})`;
    const lines = [];
    let total = 0;
    for ( const token of tokens ) {
      const actor = token.actor;
      if ( typeof actor?.rollAttribute !== "function" ) continue;
      const test = await actor.rollAttribute(save.attribute, { dialog: false, dc, label });
      const failed = test?.tteSuccess === false;
      lines.push(`<li class="${failed ? "hit" : "miss"}"><span>${foundry.utils.escapeHTML(token.name)}</span>`
        + `<strong>${loc(failed ? "TTE.Monster.Failed" : "TTE.Monster.Resisted")}</strong></li>`);
      if ( !failed ) continue;
      if ( damage && actor.isOwner ) total += (await actor.applyDamage(damage.total, { type })).taken;
      if ( mana && actor.isOwner && actor.system.mana?.value ) {
        await actor.update({ "system.mana.value": Math.max(0, actor.system.mana.value - mana) });
      }
      await this.#abilityCondition(actor, item, { ...save, dc });
    }
    let text = "";
    if ( save.drain && total ) {
      await this.applyHealing(total);
      text = `<p class="tte-roll-note">${fmt("TTE.Monster.Drained", { name: foundry.utils.escapeHTML(this.name), amount: total })}</p>`;
    }
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="tte-chat-card"><header><img src="${item.img}" alt=""><div><h3>${item.name}</h3>`
        + `<span>${fmt("TTE.Monster.TestLine", { attribute: loc(`TTE.Attribute.${cap(save.attribute)}`), dc })}</span></div></header>`
        + `<ul class="tte-attack-results">${lines.join("")}</ul>${text}</div>`
    });
  }

  /** On a hit with a monster ability's attack (Dive, Charge, Maul...): its Test or Condition for each creature hit. */
  async #riderHit(rider, hits) {
    const dc = monsterDC(this, rider.dcAttr);
    const item = { name: rider.name, img: "" };
    for ( const r of hits ) {
      const actor = r.actor;
      if ( !actor?.isOwner ) continue;
      if ( rider.save ) {
        const test = await actor.rollAttribute?.(rider.save.attribute, { dialog: false, dc,
          label: `${loc(`TTE.Attribute.${cap(rider.save.attribute)}`)} (${rider.name})` });
        if ( test?.tteSuccess === false ) await this.#abilityCondition(actor, item, { ...rider.save, dc });
      }
      else if ( rider.condition ) await this.#abilityCondition(actor, item, { condition: rider.condition });
    }
  }

  /** Retaliate (monster): when a creature adjacent to it hits it with a melee attack, it attacks that creature. */
  async #retaliate(hits, myToken) {
    if ( !globalThis.canvas?.ready || !myToken?.document ) return;
    for ( const r of hits ) {
      const actor = r.actor;
      const feature = monsterFeature(actor, "Retaliate");
      if ( !feature || r.ranged || (actor === this) || !actor.canReact?.() || (zoneDistance(r.token, myToken) > 1) ) continue;
      if ( !(await askReaction(actor, feature, fmt("TTE.Reaction.Retaliate", { attacker: foundry.utils.escapeHTML(this.name) }))) ) continue;
      const weapon = actor.#abilityWeapon(feature);
      if ( weapon ) await actor.rollWeaponAttack(weapon, { kind: "reaction", targets: [myToken] });
    }
  }

  /**
   * Protect (monster): an ally adjacent to the creature hit halves the damage and takes the other half.
   * Parry (monster): the creature hit by a melee attack halves the damage.
   */
  async #protect(r) {
    const actor = r.actor;
    const parry = actor?.featureReady?.("Parry") ?? null;
    if ( parry && !r.ranged && actor.canReact?.() && (await askReaction(actor, parry, fmt("TTE.Reaction.Parry", {
      attacker: foundry.utils.escapeHTML(this.name) }))) ) {
      await actor.useReaction();
      await actor.spendFeature(parry);
      r.half = true;
      r.notes.push(parry.name);
      return;
    }
    if ( !globalThis.canvas?.ready || !r.token?.document ) return;
    for ( const t of canvas.tokens.placeables ) {
      if ( (t === r.token) || (t.actor === this) || (t.document.disposition !== r.token.document.disposition) ) continue;
      const feature = monsterFeature(t.actor, "Protect");
      if ( !feature || !t.actor.canReact?.() || (zoneDistance(t, r.token) > 1) ) continue;
      if ( !(await askReaction(t.actor, feature, fmt("TTE.Reaction.Protect", {
        attacker: foundry.utils.escapeHTML(this.name), target: foundry.utils.escapeHTML(r.name) }))) ) continue;
      await t.actor.useReaction();
      r.protector = t;
      r.notes.push(fmt("TTE.Monster.ProtectNote", { name: foundry.utils.escapeHTML(t.name) }));
      return;
    }
  }

  /** Start of a creature's Turn next to monsters with an Aura: each Aura deals its damage. */
  async #auras() {
    const token = activeToken(this);
    if ( !globalThis.canvas?.ready || !token?.document ) return;
    for ( const t of canvas.tokens.placeables ) {
      const owner = t.actor;
      if ( (t === token) || (owner === this) || (zoneDistance(t, token) > 1) ) continue;
      const aura = monsterFeature(owner, "Aura");
      if ( !aura || owner.system.dead || owner.statuses?.has("dead") ) continue;
      const info = abilityInfo(aura);
      const named = info.types.find(x => TTE.damageTypes.includes(x));
      await owner.dealDamage({ token, actor: this, formula: monsterDice(owner, info.categories[0]),
        type: /element/.test(info.text) ? owner.monsterElement : (named ?? owner.monsterElement), label: aura.name });
    }
  }

  /** Regeneration (monster): Life at the start of its Turn, unless it took the damage type that stops it. */
  async #regenerate() {
    const feature = monsterFeature(this, "Regeneration");
    if ( !feature ) return;
    if ( this.getFlag(SYSTEM_ID, "regenBlocked") ) {
      await this.unsetFlag(SYSTEM_ID, "regenBlocked");
      return chatNote(this, { icon: "fa-heart-crack", title: feature.name, text: fmt("TTE.Monster.RegenBlocked", { name: this.name }) });
    }
    if ( (this.system.life.value <= 0) || (this.system.life.value >= this.system.life.max) ) return;
    const roll = await new Roll(monsterDice(this, abilityInfo(feature).categories[0] ?? "weak")).evaluate();
    await this.applyHealing(roll.total);
    await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<div class="tte-roll-flavor"><strong>${feature.name}</strong></div>`
        + `<ul class="tte-attack-results"><li class="hit"><span>${foundry.utils.escapeHTML(this.name)}</span><strong>+${roll.total}</strong></li></ul>` });
  }

  /** The damage type named after "took" (Regeneration) or "unless the damage was" (Undying) in a monster ability. */
  static abilityType(item, pattern) {
    const match = abilityInfo(item).text.match(pattern);
    const type = match?.[1]?.toLowerCase();
    return TTE.damageTypes.includes(type) ? type : null;
  }

  /** End of a creature's Turn: effects that repeat a Test (Web, Petrifying Gaze, Slow) end on a success. */
  async #repeatSaves() {
    for ( const effect of this.effects.filter(e => !e.disabled && e.getFlag(SYSTEM_ID, "repeatSave")) ) {
      const { attribute, dc, label } = effect.getFlag(SYSTEM_ID, "repeatSave");
      const test = await this.rollAttribute(attribute, { dialog: false, dc, label: `${loc(`TTE.Attribute.${cap(attribute)}`)} (${label})` });
      if ( test?.tteSuccess ) await effect.delete();
    }
  }

  /** Spend one use of a feature and show it in chat. */
  async useFeature(item) {
    const uses = item.system.uses;
    if ( uses.total && (uses.value < 1) ) return ui.notifications.warn(fmt("TTE.Uses.NoneLeft", { name: item.name }));
    // Features that do something (see FEATURE_ACTIONS). Returning false cancels without spending a use.
    const action = FEATURE_ACTIONS[item.name.replace(/’/g, "'")];
    const spec = !action && MONSTER_ABILITIES[abilityName(item.name)];
    const outcome = action ? await action.call(this, item) : spec ? await this.#monsterAbility(item, spec) : null;
    if ( outcome === false ) return null;
    if ( uses.total ) await item.update({ "system.uses.spent": uses.spent + 1 });
    await item.toChat({ outcome: outcome?.html, buttons: false });
    if ( outcome?.after ) await outcome.after();
  }

  /** Replace a kit with what it holds (the Adventurer's Kit becomes a Backpack with its gear inside). */
  async unpackKit(kit) {
    const library = await systemPack("items");
    const data = itemsFromEntries(kit.system.contents.map(e => ({ ...e, quantity: e.quantity * Math.max(1, kit.system.quantity) })),
      library, { container: kit.system.container });
    if ( !data.length ) return;
    await this.createEmbeddedDocuments("Item", data, { keepId: true, tteNoUnpack: true });
    await kit.delete();
    ui.notifications.info(fmt("TTE.Kit.Unpacked", { name: kit.name }));
  }

  /** New levels: open the level up window when there is something to choose. */
  async #levelUp(from, to) {
    // Characters from before this was tracked: their earlier levels count as done.
    if ( this.getFlag(SYSTEM_ID, "levelChoices") === undefined ) await this.setFlag(SYSTEM_ID, "levelChoices", from);
    if ( !this.openLevelUp() ) ui.notifications.info(fmt("TTE.LevelUp.Title", { name: this.name, level: to }));
  }

  /** The highest level whose choices were already made (each level's choices are made only once). */
  get levelChoicesDone() {
    return this.getFlag(SYSTEM_ID, "levelChoices") ?? this.system.details.level;
  }

  /** Open the level up window if some level up to the current one still has choices. */
  openLevelUp() {
    const from = this.levelChoicesDone;
    const to = this.system.details.level;
    if ( !TTELevelUp.choicesFor(this, from, to).length ) return false;
    const id = `tte-levelup-${this.id}`;
    const open = foundry.applications.instances.get(id);
    if ( open ) open.close();
    new TTELevelUp({ id, actor: this, from, to }).render(true);
    return true;
  }

  /**
   * Light a Torch (one is used up) or put out the one that is burning.
   * It lights this creature's tokens and burns out on its own when its time is up.
   */
  /** Covering (shield): plant it in the ground for Partial Cover in one direction, or pick it up. */
  async plantShield(item) {
    const planted = this.effects.find(e => e.getFlag(SYSTEM_ID, "plantedShield"));
    if ( planted ) await planted.delete();
    if ( item.getFlag(SYSTEM_ID, "planted") ) {
      await item.unsetFlag(SYSTEM_ID, "planted");
      return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<p class="tte-roll-note">${fmt("TTE.Shield.PickedUp", { name: foundry.utils.escapeHTML(item.name) })}</p>` });
    }
    if ( !item.system.equipped ) return ui.notifications.warn(fmt("TTE.Shield.NotEquipped", { name: item.name }));
    await item.setFlag(SYSTEM_ID, "planted", true);
    await this.createEmbeddedDocuments("ActiveEffect", [{
      name: fmt("TTE.Shield.Planted", { name: item.name }), img: "icons/svg/shield.svg",
      flags: { [SYSTEM_ID]: { plantedShield: item.id } }
    }]);
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<p class="tte-roll-note">${fmt("TTE.Shield.PlantedNote", { name: foundry.utils.escapeHTML(item.name) })}</p>` });
  }

  async toggleLight(item) {
    const lit = this.effects.find(e => e.getFlag(SYSTEM_ID, "light"));
    if ( lit ) return lit.delete();
    const light = item.lightSource;
    if ( item.system.quantity < 1 ) return ui.notifications.warn(fmt("TTE.Item.NoneLeft", { name: item.name }));
    await item.update({ "system.quantity": item.system.quantity - 1 });
    await this.createEmbeddedDocuments("ActiveEffect", [{
      name: fmt("TTE.Light.Lit", { name: item.name }),
      img: "icons/svg/fire.svg",
      duration: { seconds: light.seconds, startTime: game.time.worldTime },
      flags: { [SYSTEM_ID]: { light: item.name.toLowerCase() } }
    }]);
    await this.setTokenLight(light);
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="tte-chat-card"><header><i class="fa-solid fa-fire"></i><div>
        <h3>${fmt("TTE.Light.Lit", { name: item.name })}</h3>
        <span>${fmt("TTE.Light.Hint", { bright: light.bright, dim: light.dim, minutes: Math.round(light.seconds / 60) })}</span></div></header></div>`
    });
  }

  /** Give this creature's tokens a light, or turn it off (null). A Zone is one grid square. */
  async setTokenLight(light) {
    const unit = canvas?.scene?.grid?.distance ?? 1;
    const data = light
      ? { bright: light.bright * unit, dim: light.dim * unit, color: light.color, animation: { type: light.animation, speed: 3, intensity: 3 } }
      : { bright: 0, dim: 0, color: null, animation: { type: null } };
    for ( const token of this.getActiveTokens(false, true) ) await token.update({ light: data });
  }

  /** Regain Mana Points. */
  async applyMana(amount) {
    const mana = this.system.mana;
    const value = Math.min(mana.max, mana.value + Math.max(0, amount));
    await this.update({ "system.mana.value": value });
    return value - mana.value;
  }

  /**
   * Drink a potion. Its effect is based on the Tier of the creature that drinks it.
   * @param {Item} item
   */
  async drinkPotion(item) {
    const potion = item.system.potion;
    if ( item.system.quantity < 1 ) return ui.notifications.warn(fmt("TTE.Item.NoneLeft", { name: item.name }));
    const tier = this.system.details.tier;
    const table = potion.kind === "mana" ? TTE.manaDice : TTE.damageDice;
    const roll = await new Roll(table[potion.potency][tier - 1]).evaluate();
    const flavor = `<div class="tte-roll-flavor"><strong>${foundry.utils.escapeHTML(item.name)}</strong>`
      + `<span class="tte-roll-tags">${loc(`TTE.Potion.${potion.kind}`)} · ${loc(`TTE.DamageCategory.${potion.potency}`)}`
      + ` · ${loc("TTE.Tier")} ${tier}</span></div>`;
    await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this }), flavor });
    await item.update({ "system.quantity": item.system.quantity - 1 });
    if ( potion.kind === "life" ) await this.applyHealing(roll.total);
    else await this.applyMana(roll.total);
    return roll;
  }

  /* -------------------------------------------- */
  /*  Downtime                                    */
  /* -------------------------------------------- */

  /**
   * Downtime. Needs at least 1 Life.
   * Rest (8 hours, once every 24 hours): recover half of your Life and Resources.
   * Recover (24 hours): recover all of your Life and Resources, and remove 1 Wound.
   * @param {"rest"|"recover"} type
   */
  async downtime(type) {
    const system = this.system;
    if ( system.dead || (system.life.value < 1) ) {
      ui.notifications.warn(loc("TTE.Downtime.NeedLife"));
      return null;
    }

    const now = game.time.worldTime;
    if ( (type === "rest") && (system.lastRest !== null) && ((now - system.lastRest) < TTE.restInterval) ) {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: { title: loc("TTE.Downtime.Rest") },
        content: `<p>${loc("TTE.Downtime.RestedRecently")}</p>`,
        rejectClose: false
      });
      if ( !proceed ) return null;
    }

    const full = type === "recover";
    const gain = (value, max) => Math.min(max, value + (full ? max : Math.ceil(max / 2)));
    const life = gain(system.life.value, system.life.max);
    const resource = system.resourceReset === "combat" ? system.resource.value : gain(system.resource.value, system.resource.max);
    const mana = gain(system.mana.value, system.mana.max);
    const wounds = full ? Math.max(0, system.wounds - 1) : system.wounds;
    const update = {
      "system.life.value": life,
      "system.resource.value": resource,
      "system.mana.value": mana,
      "system.wounds": wounds
    };
    if ( type === "rest" ) update["system.lastRest"] = now;

    const lines = [`<li>${loc("TTE.Life")}: ${system.life.value} → ${life}</li>`];
    if ( system.mana.max ) lines.push(`<li>${loc("TTE.Mana")}: ${system.mana.value} → ${mana}</li>`);
    if ( system.resource.max && (resource !== system.resource.value) ) {
      const name = foundry.utils.escapeHTML(system.resource.label || loc("TTE.Resource"));
      lines.push(`<li>${name}: ${system.resource.value} → ${resource}</li>`);
    }
    if ( wounds !== system.wounds ) lines.push(`<li>${loc("TTE.Wounds")}: ${system.wounds} → ${wounds}</li>`);

    await this.update(update);
    await this.resetUses(full ? ["turn", "combat", "rest", "recover"] : ["turn", "combat", "rest"]);
    const title = loc(full ? "TTE.Downtime.Recover" : "TTE.Downtime.Rest");
    // Early Riser (Farmland Gnome): a Rest takes 6 hours.
    const riser = !full && this.feature("Early Riser");
    const hint = full ? loc("TTE.Downtime.RecoverHint")
      : `${loc("TTE.Downtime.RestHint")} ${fmt("TTE.Downtime.Hours", { hours: riser ? 6 : TTE.restHours })}${riser ? ` (${riser.name})` : ""}`;
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="tte-chat-card"><header><i class="fa-solid ${full ? "fa-campground" : "fa-bed"}"></i>
        <div><h3>${title}</h3><span>${hint}</span></div></header><ul class="tte-chat-list">${lines.join("")}</ul></div>`
    });
  }

  /* -------------------------------------------- */
  /*  Updates                                     */
  /* -------------------------------------------- */

  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
    const { hasProperty } = foundry.utils;

    // Refresh token vision when senses change.
    if ( hasProperty(changed, "system.senses") ) {
      for ( const token of this.getActiveTokens(false, true) ) token.reset();
      if ( canvas?.ready ) canvas.perception.update({ initializeVision: true, refreshVision: true });
    }

    // Keep condition effects in sync. Only the user who made the change does it.
    if ( userId !== game.user.id ) return;

    if ( options.tteLastStand ) this.#lastStand(this.items.get(options.tteLastStand));

    // A new level brings new class and specialization features.
    if ( hasProperty(changed, "system.details.level") ) {
      this.syncGrantedFeatures();
      if ( (this.type === "character") && (options.tteLevelFrom < this.system.details.level) ) {
        this.#levelUp(options.tteLevelFrom, this.system.details.level);
      }
    }

    // Placed tokens follow the actor's Size.
    if ( hasProperty(changed, "system.size") ) {
      const space = TTE.sizes[this.system.size]?.space ?? 1;
      for ( const token of this.getActiveTokens(false, true) ) {
        if ( (token.width !== space) || (token.height !== space) ) token.update({ width: space, height: space });
      }
    }
    const sync = { ...(options.tteStatus ?? {}) };
    sync.injured = this.system.life.injured;
    sync.deprived = this.system.deprived > 0;
    for ( const [id, active] of Object.entries(sync) ) {
      if ( this.statuses.has(id) === active ) continue;
      this.toggleStatusEffect(id, { active, overlay: id === "dead" });
    }
  }
}


/**
 * A chat card for an item: header, a grid of details, tags, the description (folded when long),
 * a line with what happened, and buttons.
 */
function itemCardHTML(item, { details, description = "", outcome = "", buttons = [], extraTags = [] }) {
  const esc = foundry.utils.escapeHTML;
  const rows = details.rows.map(r => `<dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd>`).join("");
  const tags = [...details.tags, ...extraTags].map(t => `<span>${esc(t)}</span>`).join("");
  const plain = description.replace(/<[^>]+>/g, "").trim();
  const text = plain ? `<details class="tte-card-description" ${plain.length <= 220 ? "open" : ""}>`
    + `<summary>${loc("TTE.Card.Description")}</summary><div class="tte-chat-body">${description}</div></details>` : "";
  return `<div class="tte-chat-card tte-item-card is-${item.type}">
    <header><img src="${item.img}" alt=""><div><h3>${esc(item.name)}</h3><span>${esc(details.subtitle)}</span></div></header>
    ${rows ? `<dl class="tte-card-rows">${rows}</dl>` : ""}
    ${tags ? `<div class="tte-card-tags">${tags}</div>` : ""}
    ${text}
    ${outcome ? `<p class="tte-feature-outcome">${outcome}</p>` : ""}
    ${buttons.join("")}</div>`;
}

/**
 * What class and specialization features do when used from the sheet, by feature name.
 * Each runs with the actor as `this` and returns false to cancel (no use spent),
 * or {html, after}: a line added to the feature's chat card and something to do afterwards.
 */
/**
 * What monster abilities do when used from the sheet, by ability name. Difficulties and damage come from the
 * ability's own text (its Difficulty attribute and damage categories), so each monster keeps its numbers.
 * save: each targeted creature makes a Test; on a failure it takes damage, a Condition or an effect.
 *   damage: a damage type, "element" (the monster's chosen element) or "weapon".
 *   turns: "next" lasts until the end of its next Turn; repeat: it repeats the Test at the end of each of its Turns.
 * rider: an attack with the monster's weapon that does more on a hit.
 */
const MONSTER_ABILITIES = {
  "Breath": { save: { attribute: "agility", damage: "element" } },
  "Tail Spikes": { save: { attribute: "agility", damage: "thrust" }, maxTargets: 3 },
  "Hellfire": { save: { attribute: "agility", damage: "heat", condition: "burned" } },
  "Mana Feast": { save: { attribute: "spirit", damage: "arcane", mana: true, drain: true } },
  "Dread Wail": { save: { attribute: "spirit", condition: "scared", turns: "next" } },
  "Frightful Presence": { save: { attribute: "spirit", condition: "scared", turns: "next" } },
  "Roar": { save: { attribute: "spirit", condition: "scared", turns: "next" } },
  "Devour Light": { save: { attribute: "spirit", condition: "blinded", turns: "next" } },
  "Luring Song": { save: { attribute: "spirit", effect: true, turns: "next" } },
  "Slow": { save: { attribute: "spirit", effect: true, repeat: true } },
  "Web": { save: { attribute: "agility", condition: "restrained", repeat: true } },
  "Petrifying Gaze": { save: { attribute: "spirit", condition: "restrained", repeat: true }, maxTargets: 1 },
  "Wing Buffet": { save: { attribute: "strength", condition: "prone" } },
  "Dive": { rider: { extra: "blunt", save: { attribute: "strength", condition: "prone" } } },
  "Charge": { rider: { save: { attribute: "strength", condition: "prone" } } },
  "Dirty Fighting": { rider: { save: { attribute: "agility", condition: "prone" } } },
  "Maul": { rider: { override: "cut", condition: "prone" } },
  "Grab": { rider: { override: "weapon", condition: "restrained" } },
  "Drain": { rider: { override: "weapon", drain: true } },
  "Attack": { attack: true },
  "Statue": { hide: true },
  "Camouflage": { hide: true },
  "Invisibility": { hide: true },
  "Shake Off": { shakeOff: true },
  "Element": { element: true },
  "Material": { material: true }
};

/** Golem materials: their Affinities. */
const MONSTER_MATERIALS = {
  stone: { cut: "resistance", thrust: "resistance" },
  iron: { blunt: "resistance", cut: "resistance", lightning: "weakness" },
  wood: { blunt: "resistance", thrust: "resistance", heat: "weakness" }
};

const FEATURE_ACTIONS = {
  /** Archer: a melee attack as a Reaction. */
  async "Last Resort"() {
    return { after: () => this.reactionAttack() };
  },

  /** Deadshot: mark the targeted creature. */
  async "Mark Prey"() {
    const token = Array.from(game.user.targets ?? []).find(t => t.actor);
    if ( !token ) {
      ui.notifications.warn(loc("TTE.Feature.NeedTarget"));
      return false;
    }
    await this.setFlag(SYSTEM_ID, "mark", { uuid: token.actor.uuid, name: token.name });
    return { html: fmt("TTE.Feature.MarkPreyDone", {
      name: foundry.utils.escapeHTML(token.name), bonus: this.featureNumber("Mark Prey")
    }) };
  },

  /** Healer: a targeted Fainted creature regains 1 Life. */
  async "First Aid"() {
    const token = Array.from(game.user.targets ?? []).find(t => t.actor?.system?.conditions?.has("fainted"));
    if ( !token ) {
      ui.notifications.warn(loc("TTE.Feature.NeedFainted"));
      return false;
    }
    if ( !token.actor.isOwner ) {
      ui.notifications.warn(fmt("TTE.Attack.NotOwner", { name: token.name }));
      return false;
    }
    await token.actor.applyHealing(this.featureNumber("First Aid") || 1);
    return { html: fmt("TTE.Feature.FirstAidDone", { name: foundry.utils.escapeHTML(token.name), amount: this.featureNumber("First Aid") || 1 }) };
  },

  /** Healer: the targeted creature (or you) loses the Wound it just gained and regains d12 Life. */
  async "Second Chance"() {
    const token = Array.from(game.user.targets ?? []).find(t => t.actor);
    const actor = token?.actor ?? this;
    if ( !actor.isOwner ) {
      ui.notifications.warn(fmt("TTE.Attack.NotOwner", { name: token.name }));
      return false;
    }
    const roll = await new Roll(this.featureFormula("Second Chance") || "1d12").evaluate();
    const wounds = Math.max(0, actor.system.wounds - 1);
    await actor.update({ "system.wounds": wounds, "system.life.value": actor.system.life.value + roll.total });
    if ( actor.statuses.has("dead") && (wounds <= TTE.maxWounds) ) await actor.toggleStatusEffect("dead", { active: false });
    return { html: fmt("TTE.Feature.SecondChanceDone", { name: foundry.utils.escapeHTML(token?.name ?? actor.name), amount: roll.total }) };
  },

  /** Warrior: regain Strong Life. */
  async "Second Wind"() {
    const formula = this.featureFormula("Second Wind") || TTE.damageDice.strong[this.system.details.tier - 1];
    const roll = await new Roll(formula).evaluate();
    await this.applyHealing(roll.total);
    return { html: fmt("TTE.Feature.SecondWindDone", { amount: roll.total, formula }) };
  },

  /** Thief: Slip Away (1 Combo) or Vanish (2 Combo, then a Stealth Test to Hide). */
  async "Escape Artist"(item) {
    const choice = await foundry.applications.api.DialogV2.wait({
      window: { title: item.name },
      classes: ["tte-dialog"],
      content: `<p>${loc("TTE.Finisher.Choose")}</p>`,
      rejectClose: false,
      buttons: [
        { action: "slip", label: loc("TTE.Finisher.SlipAway"), icon: "fa-solid fa-person-running" },
        { action: "vanish", label: loc("TTE.Finisher.Vanish"), icon: "fa-solid fa-user-secret" }
      ]
    });
    if ( !choice ) return false;
    const cost = choice === "slip" ? 1 : 2;
    if ( !(await this.spendCombo(cost)) ) return false;
    return {
      html: loc(choice === "slip" ? "TTE.Finisher.SlipAwayDone" : "TTE.Finisher.VanishDone"),
      after: choice === "vanish" ? () => this.rollSkill("stealth") : null
    };
  },

  /** Thief: 3 Combo for an extra Main Action. */
  async "Master Thief"() {
    if ( !(await this.spendCombo(3)) ) return false;
    return { html: loc("TTE.Finisher.MasterThiefDone") };
  },

  /** Street Scoundrel: a Reaction attack, with a free Dirty Trick if it hits. */
  async "No Honor Among Thieves"() {
    await this.setFlag(SYSTEM_ID, "freeDirtyTrick", true);
    return { after: () => this.reactionAttack() };
  },

  /** Defender: the targeted creature has Disadvantage on attacks against anyone else until the end of its next Turn. */
  async "Taunt"(item) {
    const token = Array.from(game.user.targets ?? []).find(t => t.actor);
    if ( !token ) {
      ui.notifications.warn(loc("TTE.Feature.NeedTarget"));
      return false;
    }
    if ( !token.actor.isOwner ) {
      ui.notifications.warn(fmt("TTE.Attack.NotOwner", { name: token.name }));
      return false;
    }
    await token.actor.createEmbeddedDocuments("ActiveEffect", [{
      name: fmt("TTE.Feature.TauntEffect", { name: this.name }), img: item.img,
      flags: { [SYSTEM_ID]: { taunt: this.uuid, turnsLeft: turnsUntilNextTurnEnd(token.actor) } }
    }]);
    return { html: fmt("TTE.Feature.TauntDone", { name: foundry.utils.escapeHTML(token.name) }) };
  },

  /** Forest Orc: Dash as a Minor Action, once per combat. */
  async "Swift Runner"() {
    return { html: fmt("TTE.Feature.SwiftRunnerDone", { speed: this.system.movement }) };
  }
};

/**
 * What Spells do besides damage and healing, by Spell name.
 * - fail: to each creature that fails the Spell's Test. hit: to each creature hit by the Spell attack.
 *   status (timed = until the end of its next Turn, endOnDamage), zones (pushed, a note), endConcentration, noReactions.
 * - buff: an effect on each targeted creature (or you, without targets). Values use Tier notation.
 *   It lasts while you keep Concentration, until the end of the target's next Turn (timed), or until the combat ends.
 * - target: a Spell with its own steps (cleanse, restoreVigor). self: damage you take (a damage category).
 */
const SPELL_EFFECTS = {
  "Frost Thrower": { fail: { status: "chilled" } },
  "Shockwave": { fail: { status: "prone" } },
  "Mana Recoil": { fail: { status: "prone", zones: "2 > 2 > 3 > 3" } },
  "Thunderclap": { fail: { zones: "2" } },
  "Flare": { fail: { status: "blinded", timed: true } },
  "Soothe": { fail: { status: "incapacitated", timed: true, endOnDamage: true } },
  "Mana Rupture": { fail: { endConcentration: true } },
  "Arcane Fist": { hit: { zones: "1" } },
  "Shocking Grasp": { hit: { noReactions: true } },
  "Arcane Nova": { self: { damage: "weak" } },
  "Protective Ward": { buff: { defense: "1 > 1 > 2 > 2" } },
  "Inspire": { buff: { roll: "1" } },
  "Quicken": { buff: { speed: "2 > 2 > 3 > 3", timed: true } },
  "Barrier": { buff: { cover: true } },
  "Sanctuary": { buff: { sanctuary: true } },
  "Rejuvenation": { buff: { regen: "weak" }, noRoll: true },
  "Elemental Ward": { buff: { ward: true } },
  "Cleanse": { target: "cleanse" },
  "Restore Vigor": { target: "restoreVigor" }
};

class TTETokenDocument extends TokenDocument {
  /** Derive token vision from the actor's senses (Darkvision, Blindsight). */
  prepareBaseData() {
    this.#applySenses();
    super.prepareBaseData();
  }

  #applySenses() {
    const senses = this.actor?.system?.senses;
    if ( !senses ) return;
    for ( const [key, config] of Object.entries(TTE.senses) ) {
      const range = senses[key];
      if ( !range ) continue;

      if ( config.visionMode ) {
        const defaults = CONFIG.Canvas.visionModes[config.visionMode]?.vision?.defaults ?? {};
        Object.assign(this.sight, {
          enabled: true, range: Math.max(this.sight.range ?? 0, range), visionMode: config.visionMode
        });
        for ( const [k, v] of Object.entries(defaults) ) if ( v !== undefined ) this.sight[k] = v;
      }

      const mode = config.detectionMode;
      if ( mode && CONFIG.Canvas.detectionModes[mode] ) {
        const modes = this.detectionModes;
        if ( Array.isArray(modes) ) {
          const existing = modes.find(m => m.id === mode);
          if ( existing ) Object.assign(existing, { enabled: true, range: Math.max(existing.range ?? 0, range) });
          else modes.push({ id: mode, enabled: true, range });
        } else if ( modes ) {
          if ( modes[mode] ) Object.assign(modes[mode], { enabled: true, range: Math.max(modes[mode].range ?? 0, range) });
          else modes[mode] = { enabled: true, range };
        }
      }
    }
  }
}

class TTEItem extends Item {
  /** Show the item's description in chat. */
  async toChat({ outcome = "", buttons = true } = {}) {
    const TextEditor = foundry.applications.ux.TextEditor.implementation;
    const description = await TextEditor.enrichHTML(monsterText(this.system.description ?? "", this.actor), { relativeTo: this });
    const actions = [];
    const action = this.chatAction;
    if ( buttons && this.actor && action ) {
      actions.push(`<button type="button" class="tte-chat-button" data-tte-action="itemUse" data-item-id="${this.id}">`
        + `<i class="fa-solid ${action.icon}"></i> ${action.label}</button>`);
    }
    const content = itemCardHTML(this, { details: this.chatDetails(), description, outcome, buttons: actions });
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content });
  }

  /** The button a chat card offers to use this item, if any. */
  get chatAction() {
    if ( this.type === "feature" ) {
      return ((this.name in FEATURE_ACTIONS) || MONSTER_ABILITIES[abilityName(this.name)] || this.system.uses.total)
        ? { icon: "fa-bolt", label: loc("TTE.Card.Use") } : null;
    }
    if ( !this.isUsable ) return null;
    if ( this.lightSource ) return { icon: "fa-fire-flame-simple", label: loc("TTE.Card.Light") };
    if ( this.type === "spell" ) return { icon: "fa-wand-sparkles", label: loc("TTE.Spell.Conjure") };
    if ( this.type === "equipment" ) return { icon: "fa-flask", label: loc("TTE.Item.Drink") };
    if ( this.plantable ) return { icon: "fa-shield-halved", label: loc(this.getFlag(SYSTEM_ID, "planted") ? "TTE.Shield.PickUp" : "TTE.Shield.Plant") };
    return { icon: "fa-dice-d20", label: loc("TTE.Card.Attack") };
  }

  /**
   * What a chat card shows: a subtitle, label/value rows and tags.
   * @param {object} [options]
   * @param {number} [options.tier]  Tier for damage, Defense and Spells (the owner's by default).
   * @param {boolean} [options.conjured]  A Spell being Conjured: show its cost.
   * @returns {{subtitle: string, rows: {label: string, value: string}[], tags: string[]}}
   */
  chatDetails({ tier = null, conjured = false, formula: rolled = null } = {}) {
    const s = this.system;
    tier ??= this.actor?.system?.details?.tier ?? 1;
    const rows = [];
    const tags = [];
    const row = (label, value) => {
      if ( (value !== "") && (value !== null) && (value !== undefined) ) rows.push({ label, value: String(value) });
    };
    const attr = key => loc(`TTE.Attribute.${cap(key)}`);
    const damage = (category, type, formula) => `${loc(`TTE.DamageCategory.${category}`)} ${loc(`TTE.DamageType.${type}`)} (${formula})`;
    let subtitle = "";
    switch ( this.type ) {
      case "weapon": {
        subtitle = this.categoryLabel;
        row(loc("TTE.Damage"), `${s.damageLabel} (${s.damageFormula(tier)})`);
        row(loc("TTE.Card.AttackWith"), s.properties.flexible ? `${attr(s.attribute)} / ${attr(s.properties.flexible)}` : attr(s.attribute));
        if ( s.properties.range ) row(loc("TTE.Card.Range"), fmt("TTE.Card.Zones", { range: s.properties.range }));
        else if ( s.properties.thrown ) row(loc("TTE.Card.Thrown"), fmt("TTE.Card.Zones", { range: s.properties.thrown }));
        for ( const [key, config] of Object.entries(TTE.weaponProperties) ) {
          const value = s.properties[key];
          if ( !value || ["range", "thrown", "flexible"].includes(key) ) continue;
          tags.push(config.value ? `${loc(`TTE.WeaponProperty.${key}`)} (${value})` : loc(`TTE.WeaponProperty.${key}`));
        }
        break;
      }
      case "armor":
        subtitle = this.categoryLabel;
        row(loc("TTE.Defense"), s.isShield ? signed(s.shieldBonus) : s.defenseAt(tier));
        if ( s.isShield && s.properties.bashing ) {
          const bash = TTE.bashingDamage;
          row(loc("TTE.Damage"), damage(bash.category, bash.type, TTE.damageDice[bash.category][tier - 1]));
        }
        tags.push(...s.propertyLabels);
        break;
      case "equipment":
        subtitle = this.categoryLabel;
        if ( s.category === "potion" ) {
          const table = s.potion.kind === "mana" ? TTE.manaDice : TTE.damageDice;
          row(loc("TTE.Potion.Kind"), `${table[s.potion.potency][tier - 1]} ${loc(`TTE.Potion.${s.potion.kind}`)}`);
        }
        if ( s.category === "ammunition" ) row(loc("TTE.Card.Left"), s.ammoLeft);
        if ( s.contents?.length ) row(loc("TTE.Card.Contains"), s.contents.map(e => (e.quantity > 1 ? `${e.quantity} × ${e.name}` : e.name)).join(", "));
        if ( this.lightSource ) {
          const light = this.lightSource;
          row(loc("TTE.Card.Light"), fmt("TTE.Card.LightValue", { bright: light.bright, dim: light.dim, hours: light.seconds / 3600 }));
        }
        break;
      case "container":
        subtitle = this.categoryLabel;
        if ( s.capacity.value ) row(loc("TTE.Container.Capacity"), `${s.capacity.value} ${loc(`TTE.Container.Unit.${s.capacity.type}`)}`);
        if ( s.loadBonus ) row(loc("TTE.Load"), fmt("TTE.Container.LoadBonusShort", { bonus: s.loadBonus }));
        if ( s.weightless ) tags.push(loc("TTE.Container.Weightless"));
        break;
      case "spell": {
        subtitle = [loc(`TTE.Spell.School.${s.school}`), s.componentLabel].filter(Boolean).join(" · ");
        if ( conjured ) row(loc("TTE.Tier"), `${tier} (${fmt("TTE.Spell.Cost", { cost: tier })})`);
        row(loc("TTE.Card.Action"), s.trigger ? `${loc(`TTE.Spell.Action.${s.action}`)}, ${s.trigger}` : loc(`TTE.Spell.Action.${s.action}`));
        row(loc("TTE.Card.Range"), s.range);
        row(loc("TTE.Card.Duration"), s.concentration ? `${loc("TTE.Condition.concentrating")}, ${s.duration}` : s.duration);
        const dice = rolled ?? s.formulaAt(tier);
        const shown = String(dice ?? "").replace(/^1d/, "d");
        const formula = (shown && s.roll.category) ? `${loc(`TTE.DamageCategory.${s.roll.category}`)} ${shown}` : shown;
        const type = s.roll.damageType ? ` ${loc(`TTE.DamageType.${s.roll.damageType}`)}` : "";
        const dc = this.actor?.system?.spellDC;
        if ( s.roll.type === "attack" ) row(loc("TTE.Card.Roll"), fmt("TTE.Card.SpellAttack", { damage: formula ? `${formula}${type}` : "—" }));
        else if ( s.roll.type === "test" ) {
          const test = fmt("TTE.Card.SpellTest", { attribute: s.roll.attribute ? attr(s.roll.attribute) : "—", dc: dc ?? "10 + X" });
          row(loc("TTE.Card.Roll"), formula ? `${test}; ${formula}${type}` : test);
        }
        else if ( s.roll.type === "healing" ) row(loc("TTE.Card.Roll"), `${formula} ${loc("TTE.Life")}`);
        if ( s.concentration ) tags.push(loc("TTE.Condition.concentrating"));
        break;
      }
      case "feature": {
        subtitle = [loc(`TTE.Feature.${s.featureType}`), (s.featureType === "race") ? "" : `${loc("TTE.Level")} ${s.level}`].filter(Boolean).join(" · ");
        const uses = s.uses;
        if ( uses.total ) row(loc("TTE.Uses.Label"), fmt("TTE.Uses.Short", { value: uses.value, max: uses.total, per: loc(`TTE.Uses.Per.${uses.per || "rest"}`) }));
        if ( (this.name === "Mark Prey") && this.actor?.markedPrey ) row(loc("TTE.Card.Marked"), this.actor.markedPrey.name);
        break;
      }
      case "race":
        subtitle = loc("TYPES.Item.race");
        row(loc("TTE.Size.Label"), loc(`TTE.Size.${s.size}`));
        row(loc("TTE.Speed"), s.speed);
        row(loc("TTE.Languages"), [...s.languages].map(l => loc(`TTE.Language.${l}`)).join(", "));
        break;
      case "class":
        subtitle = loc("TYPES.Item.class");
        row(loc("TTE.Life"), loc(`TTE.LifeCategory.${s.life}`));
        row(loc("TTE.Skills"), s.skills);
        if ( s.mana !== "none" ) row(loc("TTE.Mana"), loc(`TTE.ManaType.${s.mana}`));
        if ( s.resource.label ) row(s.resource.label, s.resource.max);
        break;
      case "specialization":
        subtitle = `${loc("TYPES.Item.specialization")} · ${s.class}`;
        break;
    }
    if ( TTE.physicalTypes.includes(this.type) ) {
      if ( s.quantity > 1 ) row(loc("TTE.Card.Quantity"), s.quantity);
      row(loc("TTE.Load"), s.load);
      if ( s.value ) row(loc("TTE.Card.Value"), `${s.value} ${loc("TTE.Currency")}`);
    }
    if ( s.source ) subtitle = [subtitle, s.source].filter(Boolean).join(" · ");
    return { subtitle, rows, tags };
  }

  /** Category shown in lists, e.g. "Weapon (Sword)", "Armor (Light)" or "Potion". */
  get categoryLabel() {
    const system = this.system;
    switch ( this.type ) {
      case "weapon": return system.group ? `${loc("TYPES.Item.weapon")} (${system.group})` : loc("TYPES.Item.weapon");
      case "armor": return system.isShield ? loc("TTE.ArmorCategory.shield")
        : `${loc("TYPES.Item.armor")} (${loc(`TTE.ArmorCategory.${system.category}`)})`;
      case "container": return loc("TYPES.Item.container");
      case "equipment": return loc(`TTE.GearCategory.${system.category}`);
      default: return loc(`TYPES.Item.${this.type}`);
    }
  }

  /** Whether this item does something when used (attack, drink), besides showing it in chat. */
  /** Light this item gives when used (see TTE.lightSources). */
  get lightSource() {
    return (this.type === "equipment") ? (TTE.lightSources[this.name.toLowerCase()] ?? null) : null;
  }

  /** A Covering shield (without Bashing) is used by planting it in the ground. */
  get plantable() {
    return (this.type === "armor") && this.system.isShield && !!this.system.properties.covering && !this.system.properties.bashing;
  }

  get isUsable() {
    if ( ["weapon", "spell"].includes(this.type) ) return true;
    if ( this.lightSource ) return true;
    if ( this.type === "armor" ) return this.system.isShield && (this.system.properties.bashing || this.system.properties.covering);
    return (this.type === "equipment") && (this.system.category === "potion");
  }

  /** Use the item: attack with a weapon (or a Bashing shield), drink a potion, or show it in chat. */
  async use(options = {}) {
    const actor = this.actor;
    if ( !actor || !this.isUsable ) return this.toChat();
    if ( this.lightSource ) return actor.toggleLight(this);
    if ( this.type === "equipment" ) return actor.drinkPotion(this);
    if ( this.type === "spell" ) return actor.conjure(this, options);
    if ( this.plantable ) return actor.plantShield(this);
    return actor.rollWeaponAttack(this, options);
  }

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
    if ( !data.img || (data.img === this.constructor.DEFAULT_ICON) ) {
      const img = TTE_DEFAULT_ICONS[this.type];
      if ( img ) this.updateSource({ img });
    }
    // An item can't stay inside a container of another actor.
    if ( this.system.container && !this.actor?.items.has(this.system.container) ) {
      this.updateSource({ "system.container": null });
    }
  }

  /**
   * A race, class or specialization added to a character replaces the old one of the same kind
   * and grants its features. A race also sets Size, Speed, Languages and Senses.
   */
  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    if ( (userId !== game.user.id) || !this.actor ) return;
    if ( (this.type === "equipment") && this.system.contents?.length && !options.tteNoUnpack ) {
      this.actor.unpackKit(this);
      return;
    }
    if ( !GRANTING_TYPES.includes(this.type) || (this.actor.type !== "character") || options.tteNoGrant ) return;
    this.#applyGrant();
  }

  async #applyGrant() {
    const actor = this.actor;
    const system = this.system;
    const old = actor.items.filter(i => (i.type === this.type) && (i.id !== this.id));
    if ( old.length ) await actor.deleteEmbeddedDocuments("Item", old.map(i => i.id));

    const update = {};
    if ( this.type === "race" ) {
      Object.assign(update, {
        "system.size": system.size,
        "system.speed": system.speed,
        "system.languages.value": [...new Set([...actor.system.languages.value, ...system.languages])]
      });
      for ( const key of Object.keys(TTE.senses) ) {
        if ( system.senses[key] > actor.system.senses[key] ) update[`system.senses.${key}`] = system.senses[key];
      }
    }
    else update[`system.details.${this.type}`] = this.name;
    await actor.update(update);
    await actor.syncGrantedFeatures();
  }

  /** The features this race, class or specialization gives, as Feature item data, by key. */
  grantedFeatures() {
    const system = this.system;
    const featureType = this.type;
    const html = text => (!text || text.startsWith("<")) ? text : text.split(/\n+/).map(p => `<p>${p}</p>`).join("");
    return system.features.map((f, index) => ({ f, index })).filter(({ f }) => f.name).map(({ f, index }) => ({
      key: `${this.id}.${index}`,
      level: featureType === "race" ? 1 : f.level,
      data: {
        name: f.name,
        type: "feature",
        img: tteIcon(f.name) ?? this.img,
        system: {
          featureType,
          level: featureType === "race" ? 1 : f.level,
          description: html(f.description),
          uses: { spent: 0, max: f.uses?.max ?? "", per: f.uses?.per ?? "" },
          source: system.source
        },
        flags: { [SYSTEM_ID]: { granted: this.id, grantKey: `${this.id}.${index}` } }
      }
    }));
  }

  /** Items inside a deleted container fall out of it. A deleted race, class or specialization takes its features. */
  _onDelete(options, userId) {
    super._onDelete(options, userId);
    if ( GRANTING_TYPES.includes(this.type) && this.actor && (userId === game.user.id) ) {
      const ids = this.actor.items.filter(i => [i.getFlag?.(SYSTEM_ID, "granted"), i.getFlag?.(SYSTEM_ID, "race")].includes(this.id))
        .map(i => i.id);
      if ( ids.length ) this.actor.deleteEmbeddedDocuments("Item", ids);
      if ( this.type !== "race" ) this.actor.update({ [`system.details.${this.type}`]: "" });
      return;
    }
    if ( (this.type !== "container") || !this.actor || (userId !== game.user.id) ) return;
    const updates = this.actor.items.filter(i => i.system.container === this.id)
      .map(i => ({ _id: i.id, "system.container": this.system.container ?? null }));
    if ( updates.length ) this.actor.updateEmbeddedDocuments("Item", updates);
  }
}

/** The documents of one of this system's compendiums ("items", "races", "classes", "spells"). */
async function systemPack(name) {
  const pack = game.packs.get(`${SYSTEM_ID}.${name}`);
  return pack ? pack.getDocuments() : [];
}

/**
 * Item data from {name, quantity} entries, looked up by name. Kits are opened: their first container
 * holds the rest of their contents. A new container is worn.
 * @param {{name: string, quantity: number}[]} entries
 * @param {Item[]} library                 The Items compendium documents.
 * @param {object} [options]
 * @param {string|null} [options.container]  Where loose items go.
 * @param {boolean} [options.equip]          Equip armor and shields.
 * @returns {object[]}  Data with ids, to create with keepId.
 */
function itemsFromEntries(entries, library, { container = null, equip = false } = {}) {
  const byName = new Map(library.map(i => [i.name, i]));
  const out = [];
  for ( const { name, quantity } of entries ) {
    const source = byName.get(name);
    if ( !source ) {
      console.warn(`${SYSTEM_ID} | No item named "${name}" in the Items compendium.`);
      continue;
    }
    if ( (source.type === "equipment") && source.system.contents?.length ) {
      const contents = source.system.contents.map(e => ({ ...e, quantity: e.quantity * quantity }));
      // A worn container (Backpack) only raises the Load limit, so the rest stays loose.
      out.push(...itemsFromEntries(contents, library, { container, equip }));
      continue;
    }
    const data = source.toObject();
    data._id = foundry.utils.randomID();
    data.system.container = container;
    if ( (data.type === "container") && !container && (data.system.loadBonus > 0) ) data.system.equipped = true;
    if ( (data.type === "armor") && equip ) data.system.equipped = true;
    // Several of the same weapon or armor are separate items; gear stacks.
    const separate = ["weapon", "armor", "container"].includes(data.type);
    data.system.quantity = separate ? 1 : quantity;
    out.push(data);
    for ( let i = 1; i < (separate ? quantity : 1); i++ ) out.push({ ...foundry.utils.deepClone(data), _id: foundry.utils.randomID() });
  }
  return out;
}

/** Item types that grant features to a character. */
const GRANTING_TYPES = ["race", "class", "specialization"];

/** Default item icons (Foundry's own) until there are TTE icons. */
const TTE_DEFAULT_ICONS = {
  weapon: "icons/svg/sword.svg",
  armor: "icons/svg/shield.svg",
  container: "icons/svg/chest.svg",
  equipment: "icons/svg/item-bag.svg",
  feature: "icons/svg/book.svg",
  race: `systems/${SYSTEM_ID}/icons/races.svg`,
  class: `systems/${SYSTEM_ID}/icons/classes.svg`,
  specialization: `systems/${SYSTEM_ID}/icons/specializations.svg`,
  spell: `systems/${SYSTEM_ID}/icons/spells.svg`
};

/** TTE icons (systems/tales-to-eternity/icons/<path>.svg), by the slug of what they show. */
const TTE_ICONS = {
  "adaptable": "races/features/adaptable",
  "adventurers-kit": "items/adventurers-kit",
  "arcane-blood": "races/features/arcane-blood",
  "arcane-bolt": "spells/arcane-bolt",
  "arcane-echo": "specializations/features/arcane-echo",
  "arcane-elf": "races/arcane-elf",
  "arcane-explosion": "spells/arcane-explosion",
  "arcane-fist": "spells/arcane-fist",
  "arcane-focus": "specializations/features/arcane-focus",
  "arcane-nova": "spells/arcane-nova",
  "arcane-torrent": "spells/arcane-torrent",
  "arcanist": "specializations/arcanist",
  "archer": "classes/archer",
  "arrows-20": "items/arrows-20",
  "aurel": "items/aurel",
  "backpack": "items/backpack",
  "barrel": "items/barrel",
  "barrier": "spells/barrier",
  "battleaxe": "items/battleaxe",
  "bedroll": "items/bedroll",
  "bell": "items/bell",
  "blanket": "items/blanket",
  "blinded": "conditions/blinded",
  "blood-casting": "classes/features/blood-casting",
  "bolts-20": "items/bolts-20",
  "bottle": "items/bottle",
  "brawler": "classes/techniques/brawler",
  "breastplate": "items/breastplate",
  "bretonic-human": "races/bretonic-human",
  "buckler": "items/buckler",
  "bulwark": "specializations/features/bulwark",
  "burned": "conditions/burned",
  "canteen": "items/canteen",
  "cataclysm": "classes/features/cataclysm",
  "chain-lightning": "spells/chain-lightning",
  "chain-mail": "items/chain-mail",
  "chain-shirt": "items/chain-shirt",
  "chest": "items/chest",
  "chilled": "conditions/chilled",
  "claymore": "items/claymore",
  "cleanse": "spells/cleanse",
  "club": "items/club",
  "combat-medic": "specializations/features/combat-medic",
  "combo": "classes/features/combo",
  "concentrating": "conditions/concentrating",
  "concussive-bolt": "spells/concussive-bolt",
  "crossbow": "items/crossbow",
  "dagger": "items/dagger",
  "deadeye": "specializations/features/deadeye",
  "deadshot": "specializations/deadshot",
  "deafened": "conditions/deafened",
  "defender": "specializations/defender",
  "deprived": "conditions/deprived",
  "destructive-mind": "classes/features/destructive-mind",
  "dirty-trick": "specializations/features/dirty-trick",
  "distant-mend": "spells/distant-mend",
  "double-edged-axe": "items/double-edged-axe",
  "double-shot": "classes/features/double-shot",
  "driven-to-conquer": "races/features/driven-to-conquer",
  "dual-wielding": "classes/techniques/dual-wielding",
  "dueling": "classes/techniques/dueling",
  "eagle-eye": "classes/features/eagle-eye",
  "early-riser": "races/features/early-riser",
  "elemental-ward": "spells/elemental-ward",
  "escape-artist": "classes/features/escape-artist",
  "evacuation": "specializations/features/evacuation",
  "extra-attack": "classes/techniques/extra-attack",
  "fainted": "conditions/fainted",
  "farmland-gnome": "races/farmland-gnome",
  "field-doctor": "specializations/field-doctor",
  "fire-explosion": "spells/fire-explosion",
  "first-aid": "classes/features/first-aid",
  "flamethrower": "spells/flamethrower",
  "flare": "spells/flare",
  "fleet-medic": "specializations/features/fleet-medic",
  "flow": "classes/features/flow",
  "force-break": "spells/force-break",
  "forest-orc": "races/forest-orc",
  "forest-stalker": "races/features/forest-stalker",
  "frost-nova": "spells/frost-nova",
  "frost-thrower": "spells/frost-thrower",
  "gambeson": "items/gambeson",
  "grappling-hook": "items/grappling-hook",
  "great-weapon-fighting": "classes/techniques/great-weapon-fighting",
  "greater-life-potion": "items/greater-life-potion",
  "greater-mana-potion": "items/greater-mana-potion",
  "guardian": "specializations/features/guardian",
  "half-plate": "items/half-plate",
  "hammer": "items/hammer",
  "hand-axe": "items/hand-axe",
  "hand-crossbow": "items/hand-crossbow",
  "hatchet": "items/hatchet",
  "healer": "classes/healer",
  "healing-circle": "spells/healing-circle",
  "healing-pulse": "spells/healing-pulse",
  "healing-touch": "spells/healing-touch",
  "heater-shield": "items/heater-shield",
  "hidden": "conditions/hidden",
  "hide": "items/hide",
  "hill-dwarf": "races/hill-dwarf",
  "hill-toughness": "races/features/hill-toughness",
  "ignite": "spells/ignite",
  "incapacitated": "conditions/incapacitated",
  "injured": "conditions/injured",
  "inspire": "spells/inspire",
  "javelin": "items/javelin",
  "kick-them-while-theyre-down": "specializations/features/kick-them-while-theyre-down",
  "killing-shot": "specializations/features/killing-shot",
  "kite-shield": "items/kite-shield",
  "last-resort": "classes/features/last-resort",
  "last-stand": "specializations/features/last-stand",
  "leaping-remedy": "spells/leaping-remedy",
  "leather": "items/leather",
  "life-link": "spells/life-link",
  "life-potion": "items/life-potion",
  "lightning-bolt": "spells/lightning-bolt",
  "lock": "items/lock",
  "longbow": "items/longbow",
  "longsword": "items/longsword",
  "low-blow": "specializations/features/low-blow",
  "mage": "classes/mage",
  "mana-disruption": "specializations/features/mana-disruption",
  "mana-lantern": "spells/mana-lantern",
  "mana-potion": "items/mana-potion",
  "mana-recoil": "spells/mana-recoil",
  "mana-rupture": "spells/mana-rupture",
  "mana-sense": "races/features/mana-sense",
  "mark-prey": "specializations/features/mark-prey",
  "master-thief": "classes/features/master-thief",
  "menders-step": "classes/features/menders-step",
  "mute": "conditions/mute",
  "never-too-late": "specializations/features/never-too-late",
  "no-honor-among-thieves": "specializations/features/no-honor-among-thieves",
  "opportunist": "classes/techniques/opportunist",
  "overcharge": "classes/features/overcharge",
  "padded": "items/padded",
  "plate": "items/plate",
  "point-blank": "classes/features/point-blank",
  "potent-healing": "classes/features/potent-healing",
  "prone": "conditions/prone",
  "protection": "classes/techniques/protection",
  "protective-ward": "spells/protective-ward",
  "pure-mana": "specializations/features/pure-mana",
  "quicken": "spells/quicken",
  "quillon-dagger": "items/quillon-dagger",
  "quiver": "items/quiver",
  "rapier": "items/rapier",
  "ration": "items/ration",
  "rejuvenation": "spells/rejuvenation",
  "relentless-aim": "specializations/features/relentless-aim",
  "restore-vigor": "spells/restore-vigor",
  "restrained": "conditions/restrained",
  "robes": "items/robes",
  "rope-15-m": "items/rope-15-m",
  "sanctuary": "spells/sanctuary",
  "scale-armor": "items/scale-armor",
  "scared": "conditions/scared",
  "scorching-touch": "spells/scorching-touch",
  "second-chance": "classes/features/second-chance",
  "second-wind": "classes/techniques/second-wind",
  "shield-fighting": "classes/techniques/shield-fighting",
  "shocking-grasp": "spells/shocking-grasp",
  "shockwave": "spells/shockwave",
  "shortbow": "items/shortbow",
  "shortsword": "items/shortsword",
  "soothe": "spells/soothe",
  "spear": "items/spear",
  "street-scoundrel": "specializations/street-scoundrel",
  "stunned": "conditions/stunned",
  "swift-mend": "spells/swift-mend",
  "swift-runner": "races/features/swift-runner",
  "taunt": "specializations/features/taunt",
  "technique": "classes/features/technique",
  "tent": "items/tent",
  "thief": "classes/thief",
  "thrown-weapon-fighting": "classes/techniques/thrown-weapon-fighting",
  "thunderclap": "spells/thunderclap",
  "tinderbox": "items/tinderbox",
  "torch": "items/torch",
  "tower-shield": "items/tower-shield",
  "trade-roads": "races/features/trade-roads",
  "veteran": "classes/techniques/veteran",
  "warrior": "classes/warrior",
  "way-with-animals": "races/features/way-with-animals",
  "withering-touch": "spells/withering-touch",
  "wooden-shield": "items/wooden-shield"
};

/** The TTE icon for a race, class, feature, item, spell or condition, by name (null if there is none). */
function tteIcon(name) {
  const slug = String(name ?? "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const path = TTE_ICONS[slug];
  return path ? `systems/${SYSTEM_ID}/icons/${path}.svg` : null;
}

/* -------------------------------------------- */
/*  Roll Dialog                                 */
/* -------------------------------------------- */

class TTERollDialog {
  /**
   * Ask for advantage/disadvantage, a situational bonus and (for skills and attacks) an attribute.
   * The default button follows what the conditions suggest; the player can still pick another one.
   * @param {object} options
   * @param {string} options.title
   * @param {boolean} [options.chooseAttribute]  Show the attribute picker.
   * @param {string} [options.attribute]         Attribute selected by default.
   * @param {object} [options.advice]            Result of TTEActor#getAdvice.
   * @returns {Promise<{mode: string, bonus: string, attribute?: string}|null>}
   */
  static async prompt({ title, chooseAttribute = false, attribute = "", advice = null, twoHands = null, spell = null, fields = [] }) {
    const attributeOptions = TTE.attributes.map(key => {
      const selected = key === attribute ? "selected" : "";
      return `<option value="${key}" ${selected}>${loc(`TTE.Attribute.${cap(key)}`)}</option>`;
    }).join("");
    const suggested = advice ? netMode(advice) : "normal";
    const adviceLines = [];
    if ( advice ) {
      for ( const mode of ["advantage", "disadvantage"] ) {
        if ( !advice[mode].length ) continue;
        adviceLines.push(`<li class="${mode}"><i class="fa-solid ${mode === "advantage" ? "fa-angles-up" : "fa-angles-down"}"></i>
          ${fmt("TTE.Roll.Because", { mode: loc(`TTE.Roll.${cap(mode)}`), reasons: advice[mode].join(", ") })}</li>`);
      }
      if ( advice.autoFail.length ) {
        adviceLines.push(`<li class="disadvantage"><i class="fa-solid fa-ban"></i>
          ${loc("TTE.Roll.AutoFail")}: ${advice.autoFail.join(", ")}</li>`);
      }
      for ( const note of advice.notes ) adviceLines.push(`<li><i class="fa-solid fa-circle-info"></i> ${note}</li>`);
    }
    const content = `<div class="tte-roll-dialog">
      ${adviceLines.length ? `<ul class="tte-roll-advice">${adviceLines.join("")}</ul>` : ""}
      ${chooseAttribute ? `<div class="form-group"><label>${loc("TTE.Roll.Attribute")}</label>
        <select name="attribute"><option value="">${loc("TTE.Roll.None")}</option>${attributeOptions}</select></div>` : ""}
      ${twoHands === null ? "" : `<div class="form-group"><label>${loc("TTE.Roll.TwoHands")}</label>
        <input type="checkbox" name="twoHands" ${twoHands ? "checked" : ""}></div>`}
      ${spell ? `<div class="form-group"><label>${loc("TTE.Spell.Tier")}</label>
        <select name="tier">${Array.from({ length: spell.maxTier }, (_, i) => `<option value="${i + 1}" ${i + 1 === spell.maxTier ? "selected" : ""}>
          ${loc("TTE.Tier")} ${i + 1} (${fmt("TTE.Spell.Cost", { cost: i + 1 })})</option>`).join("")}</select></div>
        ${spell.mana ? `<div class="form-group"><label>${fmt("TTE.Spell.SpendMana", { value: spell.mana.value, max: spell.mana.max })}</label>
        <input type="checkbox" name="spendMana" checked></div>` : ""}` : ""}
      ${fields.map(f => TTERollDialog.#field(f)).join("")}
      ${(spell && !spell.attack) ? "" : `<div class="form-group"><label>${loc("TTE.Roll.Bonus")}</label>
        <input type="text" name="bonus" placeholder="+0"></div>`}
    </div>`;
    const read = mode => (event, button) => {
      const form = button.form;
      return {
        mode,
        bonus: form.elements.bonus?.value ?? "",
        attribute: form.elements.attribute?.value || undefined,
        twoHands: form.elements.twoHands?.checked ?? false,
        tier: Number(form.elements.tier?.value) || 1,
        spendMana: form.elements.spendMana?.checked ?? false,
        extra: Object.fromEntries(fields.map(f => {
          const input = form.elements[`x-${f.name}`];
          if ( !input ) return [f.name, f.value];
          if ( f.type === "checkbox" ) return [f.name, input.checked];
          if ( f.type === "number" ) return [f.name, Math.max(f.min ?? 0, Math.min(Number(input.value) || 0, f.max ?? Infinity))];
          return [f.name, input.value];
        }))
      };
    };
    const button = (action, icon) => ({
      action,
      label: `TTE.Roll.${cap(action)}`,
      icon: `fa-solid ${icon}`,
      default: action === suggested,
      callback: read(action)
    });
    return foundry.applications.api.DialogV2.wait({
      window: { title },
      classes: ["tte-dialog"],
      position: { width: 420 },
      content,
      rejectClose: false,
      buttons: (spell && !spell.attack) ? [{
        action: "conjure", label: "TTE.Spell.Conjure", icon: "fa-solid fa-wand-sparkles", default: true, callback: read("normal")
      }] : [
        button("advantage", "fa-angles-up"),
        button("normal", "fa-dice-d20"),
        button("disadvantage", "fa-angles-down")
      ]
    });
  }

  /** One extra choice in the dialog: a checkbox, a number or a select. */
  static #field(f) {
    const name = `x-${f.name}`;
    let input;
    if ( f.type === "select" ) {
      input = `<select name="${name}">${f.options.map(o => `<option value="${o.value}" ${o.value === f.value ? "selected" : ""}>${o.label}</option>`).join("")}</select>`;
    }
    else if ( f.type === "checkbox" ) input = `<input type="checkbox" name="${name}" ${f.value ? "checked" : ""}>`;
    else input = `<input type="number" name="${name}" value="${f.value ?? 0}" min="${f.min ?? 0}" ${f.max !== undefined ? `max="${f.max}"` : ""} step="1">`;
    return `<div class="form-group tte-roll-extra"><label>${f.label}</label>${input}${f.hint ? `<p class="hint">${f.hint}</p>` : ""}</div>`;
  }
}

/* -------------------------------------------- */
/*  Sheets                                      */
/* -------------------------------------------- */

const { HandlebarsApplicationMixin } = foundry.applications.api;

/** Shared helpers for TTE sheets. */
async function editImage(sheet) {
  const FilePicker = foundry.applications.apps.FilePicker.implementation;
  const picker = new FilePicker({
    type: "image",
    current: sheet.document.img,
    callback: path => sheet.document.update({ img: path }),
    top: sheet.position.top + 40,
    left: sheet.position.left + 10
  });
  return picker.browse();
}

class TTECharacterSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["tte", "tte-sheet", "tte-character"],
    position: { width: 720, height: 700 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      tteTab: TTECharacterSheet.#onTab,
      tteEditImage: TTECharacterSheet.#onEditImage,
      rollAttribute: TTECharacterSheet.#onRollAttribute,
      rollSkill: TTECharacterSheet.#onRollSkill,
      setRank: TTECharacterSheet.#onSetRank,
      setWounds: TTECharacterSheet.#onSetWounds,
      toggleCondition: TTECharacterSheet.#onToggleCondition,
      changeDeprived: TTECharacterSheet.#onChangeDeprived,
      itemUse: TTECharacterSheet.#onItemUse,
      itemEquip: TTECharacterSheet.#onItemEquip,
      itemCarry: TTECharacterSheet.#onItemCarry,
      containerToggle: TTECharacterSheet.#onContainerToggle,
      unarmedAttack: TTECharacterSheet.#onUnarmedAttack,
      effectCreate: TTECharacterSheet.#onEffectCreate,
      effectEdit: TTECharacterSheet.#onEffectEdit,
      effectToggle: TTECharacterSheet.#onEffectToggle,
      effectDelete: TTECharacterSheet.#onEffectDelete,
      recovery: TTECharacterSheet.#onRecovery,
      rollFlat: TTECharacterSheet.#onRollFlat,
      downtime: TTECharacterSheet.#onDowntime,
      itemCreate: TTECharacterSheet.#onItemCreate,
      itemEdit: TTECharacterSheet.#onItemEdit,
      itemDelete: TTECharacterSheet.#onItemDelete,
      itemChat: TTECharacterSheet.#onItemChat,
      toggleLanguage: TTECharacterSheet.#onToggleLanguage,
      raceBrowse: TTECharacterSheet.#onRaceBrowse,
      featureSpend: TTECharacterSheet.#onFeatureSpend,
      featureRestore: TTECharacterSheet.#onFeatureRestore,
      openCreator: TTECharacterSheet.#onOpenCreator,
      toggleEditMode: TTECharacterSheet.#onToggleEditMode,
      toggleSection: TTECharacterSheet.#onToggleSection,
      itemQuantity: TTECharacterSheet.#onItemQuantity,
      levelUp: TTECharacterSheet.#onLevelUp,
      openLevelUp: TTECharacterSheet.#onOpenLevelUp,
      containerOpen: TTECharacterSheet.#onContainerOpen,
      itemMove: TTECharacterSheet.#onItemMove
    }
  };

  /** Open the step by step character creation. */
  static #onOpenCreator() {
    if ( !this.isEditable ) return;
    const id = `tte-creator-${this.document.id}`;
    const open = foundry.applications.instances.get(id);
    if ( open ) return open.bringToFront();
    new TTECharacterCreator({ id, actor: this.document }).render(true);
  }

  static PARTS = {
    sheet: { template: `${SYSTEM_PATH}/templates/character-sheet.hbs`, scrollable: [".tte-body"] }
  };

  /** The currently visible tab. */
  _activeTab = "main";

  /** Edit mode shows every field; play mode shows only what the character has. */
  _editMode = false;

  /** Sections (inventory, features, spells, effects) that are collapsed. Kept while the sheet is open. */
  _collapsedSections = new Set();

  static #onToggleSection(event, target) {
    const section = target.closest("[data-section-key]");
    const key = section?.dataset.sectionKey;
    if ( !key ) return;
    if ( this._collapsedSections.has(key) ) this._collapsedSections.delete(key);
    else this._collapsedSections.add(key);
    section.classList.toggle("is-collapsed", this._collapsedSections.has(key));
  }

  /** Put an item in a container, or take it out, from a list of the character's containers. */
  static async #onItemMove(event, target) {
    const item = this.#getItem(target);
    if ( !this.isEditable || !item ) return;
    const actor = this.document;
    // Not into itself or into a container it holds.
    const holds = c => {
      let parent = c;
      while ( parent ) {
        if ( parent.id === item.id ) return true;
        parent = actor.items.get(parent.system.container);
      }
      return false;
    };
    const containers = actor.items.filter(i => (i.type === "container") && !holds(i)).sort((a, b) => a.name.localeCompare(b.name));
    const buttons = containers.map(c => ({
      action: c.id, label: c.name, icon: "fa-solid fa-box", default: false, disabled: c.id === item.system.container
    }));
    if ( item.system.container ) buttons.unshift({ action: "none", label: loc("TTE.Container.TakeOut"), icon: "fa-solid fa-arrow-up-from-bracket" });
    const choice = await foundry.applications.api.DialogV2.wait({
      window: { title: fmt("TTE.Container.MoveTitle", { name: item.name }) },
      classes: ["tte-dialog", "tte-move-dialog"],
      content: `<p>${loc("TTE.Container.MoveHint")}</p>`,
      buttons,
      rejectClose: false
    });
    if ( !choice ) return;
    return item.update({ "system.container": choice === "none" ? null : choice });
  }

  static #onContainerOpen(event, target) {
    const id = target.closest("[data-container-id]").dataset.containerId;
    if ( this._openContainers.has(id) ) this._openContainers.delete(id);
    else this._openContainers.add(id);
    this.render();
  }

  static #onOpenLevelUp() {
    if ( this.isEditable ) this.document.openLevelUp();
  }

  /** Enough XP: go up one level (the XP starts over). */
  static #onLevelUp() {
    const details = this.document.system.details;
    if ( !this.isEditable || (details.level >= TTE.maxLevel) ) return;
    return this.document.update({ "system.details.level": details.level + 1, "system.details.xp": 0 });
  }

  static #onItemQuantity(event, target) {
    const item = this.#getItem(target);
    if ( !this.isEditable || !item ) return;
    const quantity = Math.max(0, item.system.quantity + Number(target.dataset.delta));
    return item.update({ "system.quantity": quantity });
  }

  /** Inventory search text, kept between renders. */
  _search = "";

  /** Hide inventory rows whose name doesn't match the search (containers stay if something inside matches). */
  #applySearch() {
    const query = this._search.trim().toLowerCase();
    const tab = this.element.querySelector('.tte-tab[data-tab="inventory"]');
    if ( !tab ) return;
    for ( const row of tab.querySelectorAll(".tte-item-row[data-item-id]") ) {
      const name = row.querySelector(".tte-item-name")?.textContent.toLowerCase() ?? "";
      row.classList.toggle("is-filtered", !!query && !name.includes(query));
    }
    for ( const section of tab.querySelectorAll(".tte-inventory-section") ) {
      const rows = section.querySelectorAll(".tte-item-row[data-item-id]");
      const shown = [...rows].some(r => !r.classList.contains("is-filtered"));
      section.classList.toggle("is-filtered", !!query && !shown);
    }
  }

  static #onToggleEditMode() {
    this._editMode = !this._editMode;
    this.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.document;
    const system = actor.system;
    const TextEditor = foundry.applications.ux.TextEditor.implementation;

    const attributes = TTE.attributes.map(key => ({
      key,
      label: loc(`TTE.Attribute.${cap(key)}`),
      abbr: loc(`TTE.AttributeAbbr.${cap(key)}`),
      hint: loc(`TTE.AttributeHint.${cap(key)}`),
      value: system.attributes[key],
      signed: signed(system.attributes[key])
    }));

    const skills = TTE.skills.map(key => {
      const rank = system.skills[key].rank;
      return {
        key,
        label: loc(`TTE.Skill.${cap(key)}`),
        hint: loc(`TTE.SkillHint.${cap(key)}`),
        rank,
        rankLabel: loc(`TTE.Rank.${TTE.ranks[rank]}`),
        signed: signed(rank),
        trained: rank > 0,
        pips: [1, 2, 3].map(n => ({
          n,
          filled: n <= rank,
          locked: n > system.skillRankLimit,
          tooltip: n > system.skillRankLimit
            ? fmt("TTE.Rank.Locked", { tier: n })
            : loc(`TTE.Rank.${TTE.ranks[n]}`)
        }))
      };
    });

    const items = actor.items.contents;
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    const featureOrder = TTE.featureTypes;
    const features = items.filter(i => i.type === "feature")
      .sort((a, b) => (featureOrder.indexOf(a.system.featureType) - featureOrder.indexOf(b.system.featureType)) || sortByName(a, b))
      .map(item => ({
        item,
        typeLabel: loc(`TTE.Feature.${item.system.featureType}`),
        typeClass: item.system.featureType,
        meta: ["race", "technique"].includes(item.system.featureType) ? "" : `${loc("TTE.Level")} ${item.system.level}`,
        usable: item.name in FEATURE_ACTIONS,
        marked: (item.name === "Mark Prey") ? actor.markedPrey?.name ?? "" : "",
        uses: item.system.uses.total ? {
          value: item.system.uses.value,
          max: item.system.uses.total,
          per: loc(`TTE.Uses.Per.${item.system.uses.per || "rest"}`)
        } : null
      }));
    const race = system.race;
    // One section per origin: race, class, specialization, techniques, other.
    const origins = { race, class: system.class, specialization: system.specialization };
    const featureGroups = TTE.featureTypes.map(type => ({
      type,
      icon: { race: "fa-users", class: "fa-shield-halved", specialization: "fa-code-branch", technique: "fa-hand-fist", other: "fa-star" }[type],
      label: loc(`TTE.FeatureGroup.${type}`),
      origin: origins[type]?.name ?? "",
      key: `feat-${type}`,
      collapsed: this._collapsedSections.has(`feat-${type}`),
      features: features.filter(f => f.typeClass === type)
    })).filter(g => g.features.length || ((g.type === "other") && this.isEditable));
    const inventory = this.#prepareInventory();
    const spellData = this.#prepareSpells();

    const lifePct = system.life.max ? Math.round((system.life.value / system.life.max) * 100) : 0;
    const xpNext = system.details.xpNext;

    Object.assign(context, {
      actor,
      system,
      source: actor._source.system,
      editable: this.isEditable,
      owner: actor.isOwner,
      attributes,
      skills,
      features,
      featureGroups,
      inventory: inventory.sections,
      containers: inventory.containers,
      collapsed: Object.fromEntries([...this._collapsedSections].map(k => [k, true])),
      hasContainers: actor.items.some(i => i.type === "container"),
      race: race ? { id: race.id, name: race.name, img: race.img } : null,
      classItem: system.class ? { id: system.class.id, name: system.class.name } : null,
      isBlank: !race && !system.class,
      specItem: system.specialization ? { id: system.specialization.id, name: system.specialization.name } : null,
      specAvailable: system.details.level >= TTE.specializationLevel,
      lifeFromClass: !!system.class,
      mana: { value: system.mana.value, max: system.mana.max, pct: system.mana.max ? Math.round((system.mana.value / system.mana.max) * 100) : 0 },
      resourceFromClass: system.resourceFromClass,
      sizeOptions: Object.fromEntries(Object.keys(TTE.sizes).map(k => [k, `TTE.Size.${k}`])),
      reach: system.reach,
      languages: Object.entries(TTE.languages).map(([key, family]) => ({
        key,
        label: loc(`TTE.Language.${key}`),
        hint: fmt("TTE.LanguageFamily", { language: loc(`TTE.LanguageGroup.${family}`) }),
        active: system.languages.value.has(key)
      })),
      unarmed: {
        label: loc("TTE.Attack.Unarmed"),
        damage: `${loc("TTE.DamageCategory.weak")} ${loc("TTE.DamageType.blunt")} · ${TTE.damageDice.weak[system.details.tier - 1]}`
      },
      tier: system.details.tier,
      rankLimitLabel: loc(`TTE.Rank.${TTE.ranks[system.skillRankLimit]}`),
      // Outside edit mode the level only goes up.
      levels: Array.from({ length: TTE.maxLevel }, (_, i) => ({ n: i + 1, selected: i + 1 === system.details.level }))
        .filter(l => (this._editMode && this.isEditable) || (l.n >= system.details.level)),
      levelChoicesPending: actor.isOwner && (TTELevelUp.choicesFor(actor, actor.levelChoicesDone, system.details.level).length > 0),
      lifeCategoryOptions: Object.fromEntries(TTE.lifeCategories.map(c => [c, `TTE.LifeCategory.${c}`])),
      life: {
        value: system.life.value,
        max: system.life.max,
        pct: Math.max(0, Math.min(lifePct, 100)),
        low: lifePct <= 25
      },
      xp: {
        value: system.details.xp,
        next: xpNext,
        pct: xpNext ? Math.max(0, Math.min(Math.round((system.details.xp / xpNext) * 100), 100)) : 100,
        ready: xpNext ? system.details.xp >= xpNext : false
      },
      // One pip per Wound, plus a last one for death.
      wounds: Array.from({ length: TTE.maxWounds + 1 }, (_, i) => {
        const death = i === TTE.maxWounds;
        return {
          n: i + 1,
          death,
          filled: death ? system.dead : i < system.wounds,
          tooltip: death ? loc("TTE.Dead") : `${loc("TTE.Pips.Wound")}: ${i + 1}`
        };
      }),
      hasResource: !!(system.resource.label || system.resource.max),
      showResource: !!(system.resource.label || system.resource.max) || (this._editMode && this.isEditable),
      editMode: this._editMode && this.isEditable,
      speeds: Object.entries(TTE.speeds).map(([key, config]) => ({
        key, icon: config.icon, label: loc(`TTE.Speed${cap(key)}`), hint: loc(`TTE.Speed${cap(key)}Hint`), value: system.speeds[key]
      })),
      sizeLabel: loc(`TTE.Size.${system.size}`),
      languageList: [...Object.keys(TTE.languages).filter(k => system.languages.value.has(k)).map(k => loc(`TTE.Language.${k}`)),
        system.languages.custom].filter(Boolean).join(", "),
      passivePerception: system.passivePerception,
      load: { ...system.load, over: system.load.value > system.load.max },
      senses: Object.keys(TTE.senses).map(key => ({
        key, label: loc(`TTE.Sense.${cap(key)}`), hint: loc(`TTE.SenseHint.${cap(key)}`), value: system.senses[key]
      })),
      fainted: system.fainted,
      dead: system.dead,
      defense: system.defense,
      movement: system.movement,
      speedReduced: system.movement < system.speed,
      armorName: [system.gear.armor?.name, system.gear.shield?.name].filter(Boolean).join(" + "),
      damageTypeOptions: TTE.damageTypes.map(k => ({ key: k, label: loc(`TTE.DamageType.${k}`) })),
      conditions: this.#prepareConditions(),
      passiveEffects: this.#prepareEffects(),
      affinities: TTE.damageTypes.map(key => ({
        key,
        label: loc(`TTE.DamageType.${key}`),
        hint: loc(`TTE.DamageTypeHint.${key}`),
        value: system.affinities[key],
        active: system.affinities[key] !== "none"
      })).sort((a, b) => a.label.localeCompare(b.label)),
      affinityOptions: Object.fromEntries(TTE.affinities.map(k => [k, `TTE.Affinity.${k}`])),
      profile: TTE.profileFields.map(key => ({ key, label: loc(`TTE.Profile.${key}`), value: system.profile[key] })),
      enrichedAppearance: await TextEditor.enrichHTML(system.appearance, { secrets: actor.isOwner, relativeTo: actor }),
      enrichedBiography: await TextEditor.enrichHTML(system.biography, {
        secrets: actor.isOwner, relativeTo: actor
      }),
      activeTab: ((this._activeTab === "spells") && !spellData.show) ? "main" : this._activeTab,
      spells: spellData,
      tabs: ["main", "inventory", "features", ...(spellData.show ? ["spells"] : []), "effects", "biography"].map(id => ({
        id,
        label: loc(`TTE.Tab.${id}`),
        active: id === this._activeTab,
        icon: {
          main: "fa-user", effects: "fa-bolt", features: "fa-star", spells: "fa-wand-sparkles",
          inventory: "fa-box-open", biography: "fa-feather"
        }[id]
      }))
    });
    return context;
  }

  /** Containers whose contents are hidden on the Inventory tab. */
  _collapsed = new Set();

  /** Inventory sections, like dnd5e: weapons, armor and shields, gear, and containers with what is inside. */
  #prepareInventory() {
    const actor = this.document;
    const items = actor.items;
    const tier = actor.system.details.tier;
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    const inside = item => !!(item.system.container && items.has(item.system.container));

    const row = (item, depth = 0) => {
      const system = item.system;
      const data = {
        id: item.id,
        name: item.name,
        img: item.img,
        depth,
        quantity: system.quantity,
        load: system.load,
        value: system.value,
        category: item.categoryLabel,
        usable: item.isUsable,
        useIcon: item.lightSource ? "fa-fire" : item.type === "equipment" ? "fa-flask" : item.plantable ? "fa-shield-halved" : "fa-dice-d20",
        useLabel: item.plantable ? item.chatAction.label
          : loc(item.lightSource ? "TTE.Light.Use" : item.type === "equipment" ? "TTE.Item.Drink" : "TTE.Attack.Title"),
        equippable: ["weapon", "armor"].includes(item.type) || ((item.type === "container") && (system.loadBonus > 0)),
        equipped: !!system.equipped,
        inContainer: inside(item),
        ammo: (item.type === "equipment") && (system.category === "ammunition") && (system.bundleSize > 1)
          ? fmt("TTE.Ammo.Left", { n: system.ammoLeft }) : "",
        detail: ""
      };
      if ( item.type === "weapon" ) {
        data.detail = `${system.damageLabel} · ${system.damageFormula(tier)}`;
        data.properties = system.propertyLabels.join(", ");
      }
      else if ( item.type === "armor" ) {
        data.detail = system.isShield ? `${loc("TTE.Defense")} +${system.shieldBonus}` : `${loc("TTE.Defense")} ${system.defenseAt(tier)}`;
        data.properties = system.propertyLabels.join(", ");
      }
      else if ( item.type === "container" ) {
        data.isContainer = true;
        data.carried = system.carried;
        data.expanded = !this._collapsed.has(item.id);
        const unit = loc(`TTE.Container.Unit.${system.capacity.type}`);
        const used = Math.round(system.used * 100) / 100;
        data.capacity = system.capacity.value ? `${used} / ${system.capacity.value} ${unit}` : "";
        data.over = system.capacity.value ? used > system.capacity.value : false;
        if ( system.loadBonus ) data.detail = fmt("TTE.Container.LoadBonusShort", { bonus: system.loadBonus });
      }
      return data;
    };

    // A container row is followed by its contents (nested containers included).
    const tree = (list, rows) => {
      const seen = new Set();
      const add = (container, depth) => {
        if ( seen.has(container.id) ) return;
        seen.add(container.id);
        const data = row(container, depth);
        rows.push(data);
        if ( !data.expanded ) return;
        for ( const item of items.filter(i => i.system.container === container.id).sort(sortByName) ) {
          if ( item.type === "container" ) add(item, depth + 1);
          else rows.push(row(item, depth + 1));
        }
      };
      for ( const item of list ) {
        if ( item.type === "container" ) add(item, 0);
        else rows.push(row(item));
      }
      return rows;
    };

    // What you wear and wield comes first; the rest is sorted by kind, always in alphabetical order.
    const loose = items.filter(i => TTE.physicalTypes.includes(i.type) && !inside(i)).sort(sortByName);
    const isWorn = i => i.system.equipped && ((i.type !== "container") || (i.system.loadBonus > 0));
    const worn = loose.filter(isWorn);
    const unworn = loose.filter(i => !isWorn(i));
    const section = (id, label, icon, list, extra = {}) => ({
      id, label, icon, key: `inv-${id}`, collapsed: this._collapsedSections.has(`inv-${id}`), create: true,
      items: tree(list, []), ...extra
    });
    // Containers are buttons in the bar; an open one shows its contents in its own panel on top.
    const containers = loose.filter(i => i.type === "container").map(c => ({
      id: c.id, name: c.name, img: c.img,
      open: this._openContainers.has(c.id),
      equipped: isWorn(c),
      count: items.filter(i => i.system.container === c.id).length
    }));
    const panels = loose.filter(i => (i.type === "container") && this._openContainers.has(i.id)).map(c => {
      const data = row(c);
      return {
        ...data, id: `container-${c.id}`, containerId: c.id, label: c.name, panel: true, create: false,
        key: `inv-c-${c.id}`, collapsed: false,
        items: tree(items.filter(i => i.system.container === c.id).sort(sortByName), [])
      };
    });
    const sections = [
      ...panels,
      section("equipped", loc("TTE.Inventory.Equipped"), "fa-user-shield", worn.filter(i => i.type !== "container"), { create: false }),
      section("weapon", loc("TTE.Inventory.Weapons"), "fa-khanda", unworn.filter(i => i.type === "weapon")),
      section("armor", loc("TTE.Inventory.Armor"), "fa-shield-halved", unworn.filter(i => i.type === "armor")),
      section("equipment", loc("TTE.Inventory.Gear"), "fa-toolbox", unworn.filter(i => i.type === "equipment"))
    ];
    return { sections, containers };
  }

  /** Containers whose contents are shown. */
  _openContainers = new Set();

  /** Spells tab: known Spells grouped by Action, with Spell attack and Difficulty. */
  #prepareSpells() {
    const system = this.document.system;
    const spells = this.document.items.filter(i => i.type === "spell").sort((a, b) => a.name.localeCompare(b.name));
    const row = item => {
      const s = item.system;
      const tier = system.details.tier;
      const formula = s.formulaAt(tier);
      let roll = "";
      if ( s.roll.type === "attack" ) roll = loc("TTE.Spell.Roll.attack");
      else if ( s.roll.type === "test" ) roll = s.roll.attribute ? fmt("TTE.Spell.TestShort", { attribute: loc(`TTE.AttributeAbbr.${cap(s.roll.attribute)}`) }) : loc("TTE.Spell.Roll.test");
      else if ( s.roll.type === "healing" ) roll = loc("TTE.Spell.Roll.healing");
      const effect = formula ? `${formula}${s.roll.damageType ? ` ${loc(`TTE.DamageType.${s.roll.damageType}`)}` : ""}` : "";
      return {
        id: item.id, name: item.name, img: item.img,
        school: loc(`TTE.Spell.School.${s.school}`), schoolClass: s.school,
        range: s.range, concentration: s.concentration, duration: s.duration, components: s.componentLabel,
        roll, effect, trigger: s.trigger
      };
    };
    const groups = TTE.spellActions.map(action => ({
      action, label: loc(`TTE.Spell.Action.${action}`), spells: spells.filter(i => i.system.action === action).map(row),
      key: `spell-${action}`, collapsed: this._collapsedSections.has(`spell-${action}`)
    })).filter(g => g.spells.length);
    return {
      // Only for characters who conjure (or already know a Spell).
      show: (system.mana.max > 0) || (spells.length > 0),
      groups,
      count: spells.length,
      max: system.spellsKnownMax,
      over: spells.length > system.spellsKnownMax,
      attack: signed(system.spellAttack),
      dc: system.spellDC,
      conjuring: system.conjuring ? loc(`TTE.Attribute.${cap(system.conjuring)}`) : null,
      tier: system.details.tier
    };
  }

  /** Conditions grid for the Effects tab. */
  #prepareConditions() {
    const actor = this.document;
    const system = actor.system;
    const grid = Object.fromEntries(Object.entries(TTE.extraStatuses).filter(([, c]) => c.grid));
    return Object.entries({ ...TTE.conditions, ...grid }).map(([id, config]) => {
      const active = config.levels ? system.deprived > 0 : config.automatic ? system.conditions.has(id) : actor.statuses.has(id);
      return {
        id,
        label: loc(`TTE.Condition.${id}`),
        hint: loc(`TTE.ConditionHint.${id}`),
        img: CONFIG.statusEffects.find(e => e.id === id)?.img ?? "icons/svg/aura.svg",
        active,
        implied: !active && system.conditions.has(id),
        automatic: !!config.automatic,
        levels: config.levels ? { value: system.deprived, max: config.levels } : null,
        tier: config.tiered ? { value: system.conditionTier[id], name: `system.conditionTier.${id}` } : null
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }

  /** Active effects that are not conditions, including the ones items transfer. */
  #prepareEffects() {
    const statusIds = new Set([...Object.keys(TTE.conditions), ...Object.keys(TTE.extraStatuses)]);
    const effects = [];
    for ( const effect of this.document.allApplicableEffects() ) {
      if ( [...effect.statuses].some(s => statusIds.has(s)) ) continue;
      effects.push({
        uuid: effect.uuid,
        name: effect.name,
        img: effect.img,
        disabled: effect.disabled,
        source: effect.parent === this.document ? "" : effect.parent?.name,
        duration: effect.duration?.label ?? ""
      });
    }
    return effects.sort((a, b) => a.name.localeCompare(b.name));
  }

  /* -------------------------------------------- */

  static #onTab(event, target) {
    this._activeTab = target.dataset.tab;
    for ( const el of this.element.querySelectorAll("[data-tab]") ) {
      el.classList.toggle("active", el.dataset.tab === this._activeTab);
    }
  }

  static #onEditImage() {
    if ( this.isEditable ) return editImage(this);
  }

  static #onRollAttribute(event, target) {
    return this.document.rollAttribute(target.dataset.key, { dialog: !event.shiftKey });
  }

  static #onRollSkill(event, target) {
    return this.document.rollSkill(target.closest("[data-key]").dataset.key, { dialog: !event.shiftKey });
  }

  static #onSetRank(event, target) {
    if ( !this.isEditable ) return;
    const key = target.closest("[data-key]").dataset.key;
    const n = Number(target.dataset.n);
    const current = this.document.system.skills[key].rank;
    const rank = n === current ? n - 1 : n;
    const limit = this.document.system.skillRankLimit;
    if ( rank > limit ) {
      ui.notifications.warn(fmt("TTE.Warn.RankLocked", {
        skill: loc(`TTE.Skill.${cap(key)}`), rank: loc(`TTE.Rank.${TTE.ranks[limit]}`), tier: rank
      }));
      return;
    }
    return this.document.update({ [`system.skills.${key}.rank`]: rank });
  }

  static #onSetWounds(event, target) {
    if ( !this.isEditable ) return;
    const n = Number(target.dataset.n);
    // The last pip is death.
    if ( n > TTE.maxWounds ) return this.document.toggleStatusEffect("dead", { overlay: true });
    const wounds = n === this.document.system.wounds ? n - 1 : n;
    return this.document.update({ "system.wounds": wounds });
  }

  static #onToggleCondition(event, target) {
    if ( this.isEditable ) return this.document.toggleCondition(target.closest("[data-condition]").dataset.condition);
  }

  static #onChangeDeprived(event, target) {
    if ( this.isEditable ) return this.document.setDeprived(this.document.system.deprived + Number(target.dataset.delta));
  }

  static #onItemUse(event, target) {
    return this.#getItem(target)?.use({ dialog: !event.shiftKey });
  }

  static #onItemEquip(event, target) {
    const item = this.#getItem(target);
    if ( this.isEditable && item ) return item.update({ "system.equipped": !item.system.equipped });
  }

  static #onItemCarry(event, target) {
    const item = this.#getItem(target);
    if ( this.isEditable && item ) return item.update({ "system.carried": !item.system.carried });
  }

  static #onContainerToggle(event, target) {
    const id = target.closest("[data-item-id]").dataset.itemId;
    if ( this._collapsed.has(id) ) this._collapsed.delete(id);
    else this._collapsed.add(id);
    this.render();
  }

  static #onUnarmedAttack(event) {
    return this.document.rollUnarmedAttack({ dialog: !event.shiftKey });
  }

  static #onEffectCreate() {
    if ( !this.isEditable ) return;
    const cls = getDocumentClass("ActiveEffect");
    return cls.create({ name: loc("TTE.Effects.New"), img: "icons/svg/aura.svg" }, { parent: this.document, renderSheet: true });
  }

  #getEffect(target) {
    return fromUuidSync(target.closest("[data-effect-uuid]").dataset.effectUuid);
  }

  static #onEffectEdit(event, target) {
    return this.#getEffect(target)?.sheet.render(true);
  }

  static #onEffectToggle(event, target) {
    const effect = this.#getEffect(target);
    if ( this.isEditable && effect ) return effect.update({ disabled: !effect.disabled });
  }

  static #onEffectDelete(event, target) {
    if ( this.isEditable ) return this.#getEffect(target)?.deleteDialog();
  }

  static #onRollFlat(event) {
    return this.document.rollFlat({ dialog: !event.shiftKey });
  }

  static #onDowntime(event, target) {
    if ( this.isEditable ) return this.document.downtime(target.dataset.type);
  }

  static #onRecovery() {
    return this.document.rollRecovery();
  }

  static #onItemCreate(event, target) {
    const type = target.dataset.type;
    const name = fmt("TTE.Item.New", { type: loc(`TYPES.Item.${type}`) });
    const system = type === "feature"
      ? { level: this.document.system.details.level, featureType: target.dataset.featureType || "other" } : {};
    return this.document.createEmbeddedDocuments("Item", [{ name, type, system }], { renderSheet: true });
  }

  static #onToggleLanguage(event, target) {
    if ( !this.isEditable ) return;
    const languages = new Set(this.document.system.languages.value);
    const key = target.dataset.language;
    if ( languages.has(key) ) languages.delete(key);
    else languages.add(key);
    return this.document.update({ "system.languages.value": [...languages] });
  }

  /** Open a compendium (races or classes) so its items can be dragged onto the sheet. */
  static #onRaceBrowse(event, target) {
    const pack = game.packs.get(`${SYSTEM_ID}.${target.dataset.pack ?? "races"}`);
    if ( pack ) return pack.render(true);
  }

  static #onFeatureSpend(event, target) {
    const item = this.#getItem(target);
    if ( this.isEditable && item ) return this.document.useFeature(item);
  }

  static #onFeatureRestore(event, target) {
    const item = this.#getItem(target);
    if ( this.isEditable && item?.system.uses.spent ) return item.update({ "system.uses.spent": item.system.uses.spent - 1 });
  }

  #getItem(target) {
    return this.document.items.get(target.closest("[data-item-id]").dataset.itemId);
  }

  static #onItemEdit(event, target) {
    return this.#getItem(target)?.sheet.render(true);
  }

  static #onItemDelete(event, target) {
    return this.#getItem(target)?.deleteDialog();
  }

  static #onItemChat(event, target) {
    return this.#getItem(target)?.toChat();
  }

  /** Stop the damage/heal amount box from submitting the form. */
  /**
   * Dropping an item on a container row puts it inside that container;
   * dropping it anywhere else on the sheet takes it out of its container.
   */
  async _onDropItem(event, item) {
    if ( !this.isEditable ) return;
    const actor = this.document;
    const row = event.target.closest?.("[data-container-id]");
    const container = row ? actor.items.get(row.dataset.containerId) : null;
    const physical = TTE.physicalTypes.includes(item.type);

    if ( item.parent === actor ) {
      if ( !physical ) return super._onDropItem(event, item);
      const target = container?.id ?? null;
      if ( target === item.id ) return;
      // Don't put a container inside itself or one of its own containers.
      let parent = container;
      while ( parent ) {
        if ( parent.id === item.id ) return ui.notifications.warn(loc("TTE.Container.Recursive"));
        parent = actor.items.get(parent.system.container);
      }
      if ( (item.system.container ?? null) !== target ) return item.update({ "system.container": target });
      return super._onDropItem(event, item);
    }

    if ( !container || !physical ) return super._onDropItem(event, item);
    const data = item.toObject();
    delete data._id;
    data.system.container = container.id;
    return actor.createEmbeddedDocuments("Item", [data]);
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const search = this.element.querySelector("input.tte-search");
    if ( search ) {
      search.value = this._search;
      search.addEventListener("input", () => {
        this._search = search.value;
        this.#applySearch();
      });
      this.#applySearch();
    }
    // Item rows can be dragged (to containers, other sheets or the sidebar).
    for ( const row of this.element.querySelectorAll(".tte-item-row[data-item-id]") ) {
      row.setAttribute("draggable", "true");
      row.addEventListener("dragstart", event => {
        const item = this.document.items.get(row.dataset.itemId);
        if ( item && !event.dataTransfer.getData("text/plain") ) {
          event.dataTransfer.setData("text/plain", JSON.stringify(item.toDragData()));
        }
      });
    }
  }
}

/* -------------------------------------------- */
/*  Character Creator                           */
/* -------------------------------------------- */

/** Step by step character creation (FTC chapter 2): race, class, attributes, skills, spells, equipment. */
/**
 * Monster sheet: Level, Role and live Power points in the header; Traits, Actions (attacks first), Reactions and
 * Boss Actions with their numbers at the monster's level; conditions and affinities like the character sheet.
 * Edit mode shows the concept: type, size, Life category, Tier 1 Defense and Attributes (and which ones scale).
 */
class TTENpcSheet extends TTECharacterSheet {
  static DEFAULT_OPTIONS = {
    classes: ["tte-npc"],
    position: { width: 640, height: 720 },
    actions: {
      toggleImmunity: TTENpcSheet.#onToggleImmunity,
      monsterSuggested: TTENpcSheet.#onSuggested,
      abilityUse: TTENpcSheet.#onAbilityUse
    }
  };

  static PARTS = {
    sheet: { template: `${SYSTEM_PATH}/templates/npc-sheet.hbs`, scrollable: [".tte-body"] }
  };

  static #onToggleImmunity(event, target) {
    if ( !this.isEditable ) return;
    const set = new Set(this.document.system.monster.conditionImmunities);
    const id = target.dataset.condition;
    if ( set.has(id) ) set.delete(id);
    else set.add(id);
    return this.document.update({ "system.monster.conditionImmunities": [...set] });
  }

  /** Back to the Level and Role the bestiary suggests (kept as flags by the compendium). */
  /** Use a monster ability: its Tests, attack or choice run on their own. */
  static #onAbilityUse(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]")?.dataset.itemId);
    if ( item ) return this.actor.useFeature(item);
  }

  static #onSuggested() {
    const suggested = this.document.getFlag(SYSTEM_ID, "suggested");
    if ( this.isEditable && suggested ) {
      return this.document.update({ "system.details.level": suggested.level, "system.monster.role": suggested.role });
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.document;
    const system = actor.system;
    const monster = system.monster;
    const tier = system.details.tier;
    const TextEditor = foundry.applications.ux.TextEditor.implementation;
    const text = async html => TextEditor.enrichHTML(monsterText(html ?? "", actor), { secrets: actor.isOwner, relativeTo: actor });
    const usesOf = item => (item.system.uses?.total ? {
      value: item.system.uses.value, max: item.system.uses.total, per: loc(`TTE.Uses.Per.${item.system.uses.per || "rest"}`)
    } : null);

    // Attacks (weapons) open the Actions; every other ability goes to its own section.
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    const attacks = await Promise.all(actor.items.filter(i => i.type === "weapon").sort(sortByName).map(async item => {
      const w = item.system;
      const bonus = system.attributes[w.attribute] ?? 0;
      return {
        item, attack: true, uses: null,
        summary: `${signed(bonus)} · ${w.damageFormula(tier)} ${loc(`TTE.DamageType.${w.damage.type}`)}`,
        text: await text(w.description)
      };
    }));
    const sections = await Promise.all(TTE.monsterAbilityTypes.map(async type => {
      const entries = await Promise.all(actor.items.filter(i => (i.type === "feature") && (i.system.featureType === type))
        .sort(sortByName).map(async item => ({
          item, uses: usesOf(item), added: !item.getFlag(SYSTEM_ID, "native") && (type !== "trait"),
          usable: !!MONSTER_ABILITIES[abilityName(item.name)] || (item.name in FEATURE_ACTIONS),
          text: await text(item.system.description)
        })));
      return {
        type, key: `npc-${type}`, label: loc(`TTE.Monster.Section.${type}`),
        collapsed: this._collapsedSections.has(`npc-${type}`),
        entries: type === "action" ? [...attacks, ...entries] : entries
      };
    }));
    const others = actor.items.filter(i => (i.type === "feature") && !TTE.monsterAbilityTypes.includes(i.system.featureType));
    const spells = actor.items.filter(i => i.type === "spell").sort(sortByName);
    const gear = actor.items.filter(i => !["feature", "weapon", "spell"].includes(i.type)).sort(sortByName);
    const editMode = this._editMode && this.isEditable;

    const roleKey = monster.role;
    const suggested = actor.getFlag(SYSTEM_ID, "suggested");
    const affinityText = TTE.affinities.filter(a => a !== "none").map(a => {
      const types = TTE.damageTypes.filter(k => system.affinities[k] === a).map(k => loc(`TTE.DamageType.${k}`));
      return types.length ? `${loc(`TTE.Affinity.${a}`)}: ${types.join(", ")}` : "";
    }).filter(Boolean).join(" · ");

    Object.assign(context, {
      editMode,
      monster,
      typeLabel: loc(`TTE.MonsterType.${monster.type}`),
      roleLabel: loc(`TTE.Role.${roleKey}`),
      isBoss: roleKey === "boss",
      levels: Array.from({ length: TTE.maxLevel }, (_, i) => ({ n: i + 1, selected: i + 1 === system.details.level })),
      roleOptions: Object.fromEntries(TTE.monsterRoles.map(r => [r, `TTE.Role.${r}`])),
      typeOptions: Object.fromEntries(TTE.monsterTypes.map(t => [t, `TTE.MonsterType.${t}`])),
      characterOptions: Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, String(n)])),
      conjuringOptions: { "": "TTE.None", ...Object.fromEntries(TTE.attributes.map(k => [k, `TTE.Attribute.${cap(k)}`])) },
      points: Math.round(system.power),
      pointsHint: fmt("TTE.Monster.PointsHint", { role: loc(`TTE.Role.${roleKey}`), base: TTE.rolePoints[roleKey] }),
      suggested: suggested && ((suggested.level !== system.details.level) || (suggested.role !== roleKey))
        ? fmt("TTE.Monster.Suggested", { level: suggested.level, role: loc(`TTE.Role.${suggested.role}`) }) : "",
      monsterAttributes: TTE.attributes.map(key => ({
        key,
        abbr: loc(`TTE.AttributeAbbr.${cap(key)}`),
        label: loc(`TTE.Attribute.${cap(key)}`),
        signed: signed(system.attributes[key]),
        base: monster.attributes[key].value,
        scale: monster.attributes[key].scale
      })),
      trainedSkills: TTE.skills.filter(k => system.skills[k].rank > 0)
        .map(k => ({ key: k, label: loc(`TTE.Skill.${cap(k)}`), signed: signed(system.skills[k].rank) })),
      skillRanks: TTE.skills.map(k => ({ key: k, label: loc(`TTE.Skill.${cap(k)}`), rank: system.skills[k].rank })),
      senseText: Object.keys(TTE.senses).filter(k => system.senses[k] > 0)
        .map(k => `${loc(`TTE.Sense.${cap(k)}`)} ${system.senses[k]}`).join(", "),
      affinityText,
      immunities: Object.keys(TTE.conditions).map(id => ({
        id, label: loc(`TTE.Condition.${id}`), active: monster.conditionImmunities.has(id)
      })),
      immunityText: [...monster.conditionImmunities].map(id => loc(`TTE.Condition.${id}`)).sort().join(", "),
      abilitySections: sections.filter(sec => sec.entries.length || editMode),
      otherFeatures: others,
      monsterSpells: spells,
      gear,
      spellDC: system.spellDC,
      tabs: ["main", "effects", "biography"].map(id => ({
        id, label: loc(id === "main" ? "TTE.Tab.monster" : `TTE.Tab.${id}`), active: id === this._activeTab,
        icon: { main: "fa-dragon", effects: "fa-bolt", biography: "fa-feather" }[id]
      })),
      activeTab: ["main", "effects", "biography"].includes(this._activeTab) ? this._activeTab : "main"
    });
    return context;
  }
}

class TTECharacterCreator extends HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.actor = options.actor;
    this.picks = {
      name: this.actor.name,
      race: null,
      class: null,
      attributes: Object.fromEntries(TTE.attributes.map(k => [k, null])),
      skills: new Set(),
      spells: new Set(),
      techniques: new Set(),
      options: [],
      weapons: []
    };
  }

  static DEFAULT_OPTIONS = {
    classes: ["tte", "tte-creator"],
    position: { width: 680, height: 720 },
    window: { icon: "fa-solid fa-hat-wizard", resizable: true },
    actions: {
      step: TTECharacterCreator.#onStep,
      next: TTECharacterCreator.#onNext,
      back: TTECharacterCreator.#onBack,
      pick: TTECharacterCreator.#onPick,
      toggle: TTECharacterCreator.#onToggle,
      option: TTECharacterCreator.#onOption,
      clearAttributes: TTECharacterCreator.#onClearAttributes,
      finish: TTECharacterCreator.#onFinish
    }
  };

  static PARTS = {
    main: { template: `${SYSTEM_PATH}/templates/character-creator.hbs`, scrollable: [".tte-creator-body"] }
  };

  /** Attribute values to distribute. */
  static ARRAY = [2, 1, 1, 0, 0, -1];

  /** The current step. */
  step = "race";

  get title() {
    return fmt("TTE.Creator.Title", { name: this.actor.name });
  }

  get race() {
    return this.library?.races.find(i => i.id === this.picks.race) ?? null;
  }

  get cls() {
    return this.library?.classes.find(i => i.id === this.picks.class) ?? null;
  }

  /** Steps in order. Spells only for classes that have Mana. */
  get steps() {
    const steps = ["race", "class", "attributes", "skills"];
    if ( this.techniqueCount ) steps.push("techniques");
    if ( this.spellCount ) steps.push("spells");
    steps.push("equipment", "review");
    return steps;
  }

  get skillCount() {
    return (this.cls?.system.skills ?? 0) + (this.race?.system.skills ?? 0);
  }

  /** Warrior: Techniques to learn at level 1. */
  get techniqueCount() {
    return techniqueLevels(this.cls).filter(l => l === 1).length;
  }

  get spellCount() {
    const mana = this.cls?.system.mana;
    return (mana && (mana !== "none")) ? (TTE.spellsPerLevel[mana] ?? 0) : 0;
  }

  /** Spells of the chosen class. */
  get classSpells() {
    const name = this.cls?.name;
    if ( !name ) return [];
    return this.library.spells.filter(s => s.system.classes.split(/\s*,\s*/).includes(name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Attribute values not used yet. */
  get remaining() {
    const pool = [...TTECharacterCreator.ARRAY];
    for ( const value of Object.values(this.picks.attributes) ) {
      const index = value === null ? -1 : pool.indexOf(value);
      if ( index >= 0 ) pool.splice(index, 1);
    }
    return pool;
  }

  /** What is missing in each step. */
  get problems() {
    const s = this.picks;
    const cls = this.cls;
    const problems = {};
    if ( !this.race ) problems.race = loc("TTE.Creator.NeedRace");
    if ( !cls ) problems.class = loc("TTE.Creator.NeedClass");
    if ( this.remaining.length ) problems.attributes = loc("TTE.Creator.NeedAttributes");
    if ( s.skills.size !== this.skillCount ) problems.skills = fmt("TTE.Creator.NeedSkills", { n: this.skillCount });
    const spells = Math.min(this.spellCount, this.classSpells.length);
    if ( this.spellCount && (s.spells.size !== spells) ) problems.spells = fmt("TTE.Creator.NeedSpells", { n: spells });
    if ( this.techniqueCount && (s.techniques.size !== this.techniqueCount) ) {
      problems.techniques = fmt("TTE.Creator.NeedTechniques", { n: this.techniqueCount });
    }
    if ( cls ) {
      const unchosen = cls.system.equipment.some((group, i) => (group.length > 1) && !Number.isInteger(s.options[i]));
      const weapons = s.weapons.slice(0, cls.system.weaponChoices).filter(Boolean).length;
      if ( unchosen || (weapons < cls.system.weaponChoices) ) problems.equipment = loc("TTE.Creator.NeedEquipment");
    }
    else problems.equipment = loc("TTE.Creator.NeedClass");
    if ( !s.name.trim() ) problems.review = loc("TTE.Creator.NeedName");
    return problems;
  }

  /** Load the compendiums once. Foundry prepares the context before the first render hooks run. */
  async #loadLibrary() {
    if ( this.library ) return;
    const [races, classes, spells, items] = await Promise.all(["races", "classes", "spells", "items"].map(systemPack));
    const byName = (a, b) => a.name.localeCompare(b.name);
    this.library = {
      races: races.filter(i => i.type === "race").sort(byName),
      classes: classes.filter(i => i.type === "class").sort(byName),
      spells: spells.filter(i => i.type === "spell"),
      techniques: classes.filter(i => (i.type === "feature") && (i.system.featureType === "technique")).sort(byName),
      items
    };
    const race = this.actor.items.find(i => i.type === "race");
    const cls = this.actor.items.find(i => i.type === "class");
    this.picks.race = this.library.races.find(r => r.name === race?.name)?.id ?? null;
    this.picks.class = this.library.classes.find(c => c.name === cls?.name)?.id ?? null;
  }

  _onFirstRender(context, options) {
    super._onFirstRender(context, options);
    this.element.addEventListener("change", this.#onChange.bind(this));
  }

  async _prepareContext(options) {
    await this.#loadLibrary();
    const context = await super._prepareContext(options);
    const s = this.picks;
    const race = this.race;
    const cls = this.cls;
    const problems = this.problems;
    const TextEditor = foundry.applications.ux.TextEditor.implementation;
    const steps = this.steps;
    const index = steps.indexOf(this.step);
    const plain = html => (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const card = (doc, type) => ({
      id: doc.id,
      name: doc.name,
      img: doc.img,
      selected: s[type] === doc.id,
      summary: type === "race"
        ? [loc(`TTE.Size.${doc.system.size}`), `${loc("TTE.Speed")} ${doc.system.speed}`,
          ...[...doc.system.languages].map(l => loc(`TTE.Language.${l}`))].join(" · ")
        : [`${loc("TTE.Life")} ${loc(`TTE.LifeCategory.${doc.system.life}`)}`,
          fmt("TTE.Creator.SkillsN", { n: doc.system.skills }),
          doc.system.mana !== "none" ? loc(`TTE.ManaType.${doc.system.mana}`) : null,
          doc.system.resource.label || null].filter(Boolean).join(" · "),
      features: type === "race" ? doc.system.features.filter(f => f.name).map(f => ({ name: f.name, text: plain(f.description) })) : [],
      // Classes: a short summary and the names of their features, with the full text on hover.
      blurb: type === "class" ? [loc(`TTE.ClassSummary.${doc.name}`)].find(t => t !== `TTE.ClassSummary.${doc.name}`) ?? "" : "",
      chips: type === "class" ? doc.system.features.filter((f, i, all) => f.name && (all.findIndex(g => g.name === f.name) === i))
        .map(f => ({ name: f.name, level: doc.system.features.filter(g => g.name === f.name).map(g => g.level).join(", "), text: plain(f.description) })) : []
    });

    // Attributes
    const remaining = this.remaining;
    const attributes = TTE.attributes.map(key => {
      const value = s.attributes[key];
      const free = [...new Set([...remaining, ...(value === null ? [] : [value])])].sort((a, b) => b - a);
      return {
        key,
        label: loc(`TTE.Attribute.${cap(key)}`),
        hint: loc(`TTE.AttributeHint.${cap(key)}`),
        options: free.map(v => ({ value: v, label: signed(v), selected: v === value }))
      };
    });

    // Skills
    const full = s.skills.size >= this.skillCount;
    const skills = TTE.skills.map(key => ({
      key,
      label: loc(`TTE.Skill.${cap(key)}`),
      hint: loc(`TTE.SkillHint.${cap(key)}`),
      checked: s.skills.has(key),
      disabled: full && !s.skills.has(key)
    }));

    // Techniques (Warrior)
    const techniquesFull = s.techniques.size >= this.techniqueCount;
    const techniques = this.library.techniques.filter(t => t.system.level <= 1).map(t => ({
      key: t.id,
      label: t.name,
      hint: plain(t.system.description),
      checked: s.techniques.has(t.id),
      disabled: techniquesFull && !s.techniques.has(t.id)
    }));

    // Spells
    const spellsFull = s.spells.size >= this.spellCount;
    const spells = this.classSpells.map(spell => ({
      id: spell.id,
      name: spell.name,
      img: spell.img,
      meta: [loc(`TTE.Spell.Action.${spell.system.action}`), spell.system.range, spell.system.duration,
        spell.system.concentration ? loc("TTE.Concentration.Title") : null].filter(Boolean).join(" · "),
      text: plain(spell.system.description),
      checked: s.spells.has(spell.id),
      disabled: spellsFull && !s.spells.has(spell.id)
    }));

    // Equipment
    const entryLabel = items => items.map(e => (e.quantity > 1 ? `${e.quantity} × ${e.name}` : e.name)).join(", ");
    const fixed = [];
    const choices = [];
    cls?.system.equipment.forEach((group, i) => {
      if ( group.length === 1 ) fixed.push(entryLabel(group[0]));
      else choices.push({ index: i, options: group.map((option, o) => ({ index: o, label: entryLabel(option), selected: s.options[i] === o })) });
    });
    const weaponList = this.library.items.filter(i => i.type === "weapon").sort((a, b) => a.name.localeCompare(b.name));
    const weapons = Array.from({ length: cls?.system.weaponChoices ?? 0 }, (_, i) => ({
      index: i,
      options: weaponList.map(w => ({ value: w.id, label: w.name, selected: s.weapons[i] === w.id }))
    }));

    // Review
    const level1 = cls ? TTE.lifeTable[cls.system.life][0] + (race?.system.lifeBonus ?? 0) : null;
    const mana = (cls && (cls.system.mana !== "none")) ? TTE.manaTable[cls.system.mana][0] : null;

    return Object.assign(context, {
      picks: s,
      step: this.step,
      steps: steps.map((key, i) => ({
        key,
        number: i + 1,
        label: loc(`TTE.Creator.Step.${cap(key)}`),
        active: key === this.step,
        done: !problems[key] && (key !== "review"),
        problem: problems[key]
      })),
      first: index === 0,
      last: index === steps.length - 1,
      problem: problems[this.step],
      ready: !Object.keys(problems).length,
      problems: Object.values(problems),
      races: this.library.races.map(r => card(r, "race")),
      classes: this.library.classes.map(c => card(c, "class")),
      raceItem: race,
      classItem: cls,
      attributes,
      remaining: remaining.map(signed),
      skills,
      skillCount: this.skillCount,
      skillChosen: s.skills.size,
      raceSkills: race?.system.skills ?? 0,
      spells,
      spellCount: this.spellCount,
      spellChosen: s.spells.size,
      techniques,
      techniqueCount: this.techniqueCount,
      techniqueChosen: s.techniques.size,
      fixed,
      choices,
      weapons,
      currency: cls?.system.currency.replace(/1?d12\s*\*\s*10/, "d12 × 10") ?? "",
      equipmentText: cls ? await TextEditor.enrichHTML(cls.system.startingEquipment) : "",
      review: {
        life: level1,
        mana,
        attributes: TTE.attributes.map(k => ({ label: loc(`TTE.AttributeAbbr.${cap(k)}`), value: signed(s.attributes[k] ?? 0) })),
        skills: [...s.skills].map(k => loc(`TTE.Skill.${cap(k)}`)).join(", "),
        spells: this.classSpells.filter(sp => s.spells.has(sp.id)).map(sp => sp.name).join(", "),
        techniques: this.library.techniques.filter(t => s.techniques.has(t.id)).map(t => t.name).join(", ")
      },
      replaces: this.actor.items.size > 0
    });
  }

  /** Inputs: name, attributes and weapons. */
  #onChange(event) {
    const input = event.target;
    const s = this.picks;
    if ( input.name === "name" ) {
      s.name = input.value;
      return;
    }
    if ( input.dataset.attribute ) s.attributes[input.dataset.attribute] = input.value === "" ? null : Number(input.value);
    else if ( input.dataset.weapon !== undefined ) s.weapons[Number(input.dataset.weapon)] = input.value || null;
    else return;
    this.render();
  }

  static #onStep(event, target) {
    this.step = target.dataset.step;
    this.render();
  }

  static #onNext() {
    const steps = this.steps;
    this.step = steps[Math.min(steps.indexOf(this.step) + 1, steps.length - 1)];
    this.render();
  }

  static #onBack() {
    const steps = this.steps;
    this.step = steps[Math.max(steps.indexOf(this.step) - 1, 0)];
    this.render();
  }

  /** Choose a race or class. A new class clears its skills, spells and equipment choices. */
  static #onPick(event, target) {
    const { type, id } = target.dataset;
    if ( (type === "class") && (this.picks.class !== id) ) {
      Object.assign(this.picks, { spells: new Set(), techniques: new Set(), options: [], weapons: [] });
    }
    this.picks[type] = id;
    // Fewer skills to choose (another race or class): keep the first ones.
    const skills = [...this.picks.skills];
    if ( skills.length > this.skillCount ) this.picks.skills = new Set(skills.slice(0, this.skillCount));
    this.render();
  }

  /** Toggle a skill or spell. */
  static #onToggle(event, target) {
    const { list, key } = target.dataset;
    const set = this.picks[list];
    const max = { skills: this.skillCount, spells: this.spellCount, techniques: this.techniqueCount }[list];
    if ( set.has(key) ) set.delete(key);
    else if ( set.size < max ) set.add(key);
    this.render();
  }

  /** Choose one option of a starting equipment group. */
  static #onOption(event, target) {
    this.picks.options[Number(target.dataset.group)] = Number(target.dataset.option);
    this.render();
  }

  static #onClearAttributes() {
    for ( const key of TTE.attributes ) this.picks.attributes[key] = null;
    this.render();
  }

  /** Build the character. Anything it had before is replaced. */
  static async #onFinish() {
    if ( Object.keys(this.problems).length ) return;
    const actor = this.actor;
    if ( actor.items.size ) {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: { title: loc("TTE.Creator.Finish") },
        content: `<p>${loc("TTE.Creator.ReplaceWarning")}</p>`
      });
      if ( !proceed ) return;
    }
    const s = this.picks;
    const race = this.race;
    const cls = this.cls;
    const library = this.library.items;
    this.element.classList.add("is-working");
    try {
      if ( actor.items.size ) await actor.deleteEmbeddedDocuments("Item", actor.items.map(i => i.id));

      const update = {
        name: s.name.trim(),
        "prototypeToken.name": s.name.trim(),
        "system.details.level": 1,
        "system.details.xp": 0,
        [`flags.${SYSTEM_ID}.levelChoices`]: 1,
        "system.details.class": cls.name,
        "system.details.specialization": "",
        "system.size": race.system.size,
        "system.speed": race.system.speed,
        "system.languages.value": [...race.system.languages]
      };
      for ( const key of TTE.attributes ) update[`system.attributes.${key}`] = s.attributes[key];
      for ( const key of TTE.skills ) update[`system.skills.${key}.rank`] = s.skills.has(key) ? 1 : 0;
      for ( const key of Object.keys(TTE.senses) ) update[`system.senses.${key}`] = race.system.senses[key];
      await actor.update(update);

      // Race and class, then their level 1 features in one go.
      const granting = [race, cls].map(doc => {
        const data = doc.toObject();
        delete data._id;
        return data;
      });
      await actor.createEmbeddedDocuments("Item", granting, { tteNoGrant: true });
      await actor.syncGrantedFeatures();

      // Starting equipment and spells.
      const entries = cls.system.equipment.flatMap((group, i) => group[group.length === 1 ? 0 : s.options[i]] ?? []);
      const weaponNames = s.weapons.slice(0, cls.system.weaponChoices).filter(Boolean)
        .map(id => library.find(i => i.id === id)?.name).filter(Boolean);
      for ( const name of weaponNames ) entries.push({ name, quantity: 1 });
      const gear = itemsFromEntries(entries, library, { equip: true });
      // Ammunition goes in the Quiver; weapons are equipped while there are free hands (a shield takes one).
      const quiver = gear.find(d => (d.type === "container") && !d.system.container && (d.name === "Quiver"));
      if ( quiver ) {
        for ( const d of gear ) if ( (d.type === "equipment") && (d.system.category === "ammunition") && !d.system.container ) d.system.container = quiver._id;
      }
      let hands = 2 - gear.filter(d => (d.type === "armor") && (d.system.category === "shield")).length;
      for ( const d of gear.filter(d => d.type === "weapon") ) {
        const need = d.system.properties?.twoHanded ? 2 : 1;
        if ( need > hands ) continue;
        d.system.equipped = true;
        hands -= need;
      }
      const spells = this.classSpells.filter(sp => s.spells.has(sp.id)).map(sp => {
        const data = sp.toObject();
        data._id = foundry.utils.randomID();
        return data;
      });
      const techniques = this.library.techniques.filter(t => s.techniques.has(t.id)).map(t => {
        const data = t.toObject();
        data._id = foundry.utils.randomID();
        return data;
      });
      await actor.createEmbeddedDocuments("Item", [...gear, ...spells, ...techniques], { keepId: true, tteNoUnpack: true });

      // Aurel, then full Life and Mana.
      const roll = await new Roll(cls.system.currency || "1d12 * 10").evaluate();
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: loc("TTE.Creator.StartingAurel") });
      await actor.update({ "system.currency": roll.total });
      await actor.update({ "system.life.value": actor.system.life.max, "system.mana.value": actor.system.mana.max, "system.wounds": 0 });
    }
    finally {
      this.element?.classList.remove("is-working");
    }
    ui.notifications.info(fmt("TTE.Creator.Done", { name: actor.name }));
    await this.close();
    actor.sheet.render(true);
  }
}

/* -------------------------------------------- */
/*  Level Up                                    */
/* -------------------------------------------- */

/** What new levels ask the player to choose: a Specialization, +1 to two attributes, new Spells. */
/**
 * Encounter Builder (Rupture Of The Cosmos, chapter 1): drop monsters, pick each one's Level, Role and quantity,
 * and see the points against the budget of the group, the difficulty and the XP. Points compare each monster
 * with a Standard Medium monster of the group's level. "Create" makes world actors at the chosen Level and Role.
 */
class TTEEncounterBuilder extends HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "tte-encounter-builder",
    classes: ["tte", "tte-encounter"],
    position: { width: 640, height: 620 },
    window: { title: "TTE.Encounter.Title", icon: "fa-solid fa-dragon", resizable: true },
    actions: {
      encMore: TTEEncounterBuilder.#onMore,
      encLess: TTEEncounterBuilder.#onLess,
      encRemove: TTEEncounterBuilder.#onRemove,
      encClear: TTEEncounterBuilder.#onClear,
      encParty: TTEEncounterBuilder.#onParty,
      encCreate: TTEEncounterBuilder.#onCreate,
      encOpen: TTEEncounterBuilder.#onOpen
    }
  };

  static PARTS = {
    main: { template: `${SYSTEM_PATH}/templates/encounter-builder.hbs`, scrollable: [".tte-encounter-rows"] }
  };

  /** Open the builder (one window). */
  static open() {
    const open = foundry.applications.instances.get(this.DEFAULT_OPTIONS.id);
    if ( open ) return open.bringToFront();
    return new this().render(true);
  }

  /** Monsters loaded by uuid (compendium monsters load on demand). */
  #docs = new Map();

  /** Drop listeners go on the window once. */
  #listening = false;

  get encounter() {
    return foundry.utils.mergeObject({ characters: 4, level: 1, rows: [] }, game.settings.get(SYSTEM_ID, "encounter") ?? {}, { inplace: false });
  }

  async #save(state) {
    await game.settings.set(SYSTEM_ID, "encounter", state);
    return this.render();
  }

  async #doc(uuid) {
    if ( !this.#docs.has(uuid) ) this.#docs.set(uuid, await fromUuid(uuid));
    return this.#docs.get(uuid);
  }

  async _prepareContext(options) {
    const state = this.encounter;
    let total = 0;
    const rows = [];
    for ( const row of state.rows ) {
      const actor = await this.#doc(row.uuid);
      if ( !actor ) continue;
      const each = monsterPower(actor, { level: row.level, role: row.role, characters: state.characters, groupLevel: state.level });
      total += each * row.qty;
      const t = tierOf(row.level);
      const life = Math.ceil(monsterLifeAt(actor.system.life.category, row.level)
        * (row.role === "boss" ? state.characters : TTE.roleLife[row.role]));
      rows.push({
        ...row, name: actor.name, img: actor.img, points: Math.round(each * 10) / 10, total: Math.round(each * row.qty),
        detail: `${loc(`TTE.MonsterType.${actor.system.monster.type}`)} · ${loc("TTE.Life")} ${life} · ${loc("TTE.Defense")} ${actor.system.monster.defense + t - 1}`,
        levels: Array.from({ length: TTE.maxLevel }, (_, i) => ({ n: i + 1, selected: i + 1 === row.level })),
        roles: TTE.monsterRoles.map(r => ({ key: r, label: loc(`TTE.Role.${r}`), selected: r === row.role }))
      });
    }
    const budgets = Object.entries(TTE.encounterBudget).map(([key, per]) => ({ key, label: loc(`TTE.Encounter.${key}`), points: per * state.characters }));
    let difficulty = "trivial";
    for ( const b of budgets ) if ( total >= b.points ) difficulty = b.key;
    for ( const b of budgets ) b.active = b.key === difficulty;
    const xpNormal = ((state.level + 1) * 100) / 4;
    return {
      rows,
      characters: state.characters,
      characterOptions: Array.from({ length: 8 }, (_, i) => ({ n: i + 1, selected: i + 1 === state.characters })),
      groupLevels: Array.from({ length: TTE.maxLevel }, (_, i) => ({ n: i + 1, selected: i + 1 === state.level })),
      total: Math.round(total),
      difficulty,
      difficultyLabel: loc(`TTE.Encounter.${difficulty}`),
      budgets,
      xp: Math.round(xpNormal * TTE.encounterXP[difficulty])
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const root = this.element;
    if ( !this.#listening ) {
      this.#listening = true;
      root.addEventListener("dragover", event => event.preventDefault());
      root.addEventListener("drop", event => this.#onDrop(event));
    }
    for ( const select of root.querySelectorAll("select[data-enc]") ) {
      select.addEventListener("change", () => this.#onChange(select));
    }
  }

  async #onDrop(event) {
    event.preventDefault();
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    if ( data?.type !== "Actor" || !data.uuid ) return;
    const actor = await this.#doc(data.uuid);
    if ( actor?.type !== "npc" ) return ui.notifications.warn(loc("TTE.Encounter.OnlyMonsters"));
    const state = this.encounter;
    const same = state.rows.find(r => (r.uuid === data.uuid) && (r.level === state.level) && (r.role === actor.system.monster.role));
    if ( same ) same.qty += 1;
    else state.rows.push({ key: foundry.utils.randomID(), uuid: data.uuid, qty: 1, level: state.level, role: actor.system.monster.role });
    return this.#save(state);
  }

  async #onChange(select) {
    const state = this.encounter;
    const value = select.dataset.enc === "role" ? select.value : Number(select.value);
    if ( select.dataset.enc === "characters" ) state.characters = value;
    else if ( select.dataset.enc === "groupLevel" ) {
      state.level = value;
      for ( const r of state.rows ) r.level = value;
    }
    else {
      const row = state.rows.find(r => r.key === select.closest("[data-key]")?.dataset.key);
      if ( !row ) return;
      row[select.dataset.enc] = value;
    }
    return this.#save(state);
  }

  #row(state, target) {
    return state.rows.find(r => r.key === target.closest("[data-key]")?.dataset.key);
  }

  static #onMore(event, target) {
    const state = this.encounter;
    const row = this.#row(state, target);
    if ( row ) row.qty += 1;
    return this.#save(state);
  }

  static #onLess(event, target) {
    const state = this.encounter;
    const row = this.#row(state, target);
    if ( row ) row.qty = Math.max(1, row.qty - 1);
    return this.#save(state);
  }

  static #onRemove(event, target) {
    const state = this.encounter;
    state.rows = state.rows.filter(r => r.key !== target.closest("[data-key]")?.dataset.key);
    return this.#save(state);
  }

  static #onClear() {
    const state = this.encounter;
    state.rows = [];
    return this.#save(state);
  }

  /** Take the number of characters and their average level from the player characters. */
  static #onParty() {
    // The characters on the current scene; otherwise the ones players own; otherwise every character.
    const onScene = [...new Set((canvas?.scene?.tokens ?? []).map(t => t.actor).filter(a => a?.type === "character"))];
    const owned = game.actors.filter(a => (a.type === "character") && a.hasPlayerOwner);
    const party = onScene.length ? onScene : owned.length ? owned : game.actors.filter(a => a.type === "character");
    if ( !party.length ) return ui.notifications.warn(loc("TTE.Encounter.NoParty"));
    const state = this.encounter;
    state.characters = Math.min(8, party.length);
    state.level = Math.round(party.reduce((n, a) => n + a.system.details.level, 0) / party.length);
    for ( const r of state.rows ) r.level = state.level;
    return this.#save(state);
  }

  static async #onOpen(event, target) {
    const row = this.#row(this.encounter, target);
    const actor = row ? await this.#doc(row.uuid) : null;
    actor?.sheet.render(true);
  }

  /** Create world actors for the encounter, at the chosen Level and Role, in a folder of their own. */
  static async #onCreate() {
    const state = this.encounter;
    if ( !state.rows.length ) return;
    const folder = await Folder.create({ name: fmt("TTE.Encounter.FolderName", { date: new Date().toLocaleString() }), type: "Actor" });
    const data = [];
    for ( const row of state.rows ) {
      const actor = await this.#doc(row.uuid);
      if ( !actor ) continue;
      const source = actor.toObject();
      delete source._id;
      const life = Math.ceil(monsterLifeAt(source.system.life.category, row.level)
        * (row.role === "boss" ? state.characters : TTE.roleLife[row.role]));
      foundry.utils.mergeObject(source, {
        folder: folder.id,
        "system.details.level": row.level,
        "system.monster.role": row.role,
        "system.monster.characters": state.characters,
        "system.life.value": life
      });
      for ( let i = 0; i < row.qty; i++ ) data.push(foundry.utils.deepClone(source));
    }
    await Actor.implementation.createDocuments(data);
    ui.notifications.info(fmt("TTE.Encounter.Created", { n: data.length, folder: folder.name }));
  }
}

class TTELevelUp extends HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.actor = options.actor;
    this.from = options.from;
    this.to = options.to;
    this.choices = TTELevelUp.choicesFor(this.actor, this.from, this.to);
    this.picks = { spec: null, attributes: {}, spells: new Set(), techniques: {} };
    for ( const c of this.choices ) if ( c.kind === "attributes" ) this.picks.attributes[c.level] = new Set();
  }

  static DEFAULT_OPTIONS = {
    classes: ["tte", "tte-creator", "tte-levelup"],
    position: { width: 620, height: 660 },
    window: { icon: "fa-solid fa-arrow-up", resizable: true },
    actions: {
      pickSpec: TTELevelUp.#onPickSpec,
      toggleAttribute: TTELevelUp.#onToggleAttribute,
      toggleSpell: TTELevelUp.#onToggleSpell,
      pickTechnique: TTELevelUp.#onPickTechnique,
      apply: TTELevelUp.#onApply,
      later: TTELevelUp.#onLater
    }
  };

  static PARTS = {
    main: { template: `${SYSTEM_PATH}/templates/level-up.hbs`, scrollable: [".tte-creator-body"] }
  };

  /**
   * The choices for going from one level to another.
   * @returns {{level: number, kind: "specialization"|"attributes"|"spells", n?: number}[]}
   */
  static choicesFor(actor, from, to) {
    const system = actor.system;
    const cls = system.class;
    const mana = cls?.system.mana ?? "none";
    const out = [];
    for ( let level = from + 1; level <= to; level++ ) {
      if ( (level === TTE.specializationLevel) && cls && !system.specialization ) out.push({ level, kind: "specialization" });
      if ( techniqueLevels(cls).includes(level) && (level > 1) ) out.push({ level, kind: "technique" });
      if ( TTE.attributeLevels.includes(level) ) out.push({ level, kind: "attributes" });
      if ( (mana !== "none") && TTE.spellLevels.includes(level) && (level > 1) ) out.push({ level, kind: "spells", n: TTE.spellsPerLevel[mana] });
    }
    return out;
  }

  get title() {
    return fmt("TTE.LevelUp.Title", { name: this.actor.name, level: this.to });
  }

  get spellCount() {
    return this.choices.filter(c => c.kind === "spells").reduce((n, c) => n + c.n, 0);
  }

  async #loadLibrary() {
    if ( this.library ) return;
    const cls = this.actor.system.class;
    const known = new Set(this.actor.items.filter(i => i.type === "spell").map(i => i.name));
    const knownTechniques = new Set(this.actor.items.filter(i => (i.type === "feature") && (i.system.featureType === "technique")).map(i => i.name));
    const byName = (a, b) => a.name.localeCompare(b.name);
    const [classes, spells] = await Promise.all([systemPack("classes"), systemPack("spells")]);
    this.library = {
      specs: classes.filter(i => (i.type === "specialization") && (i.system.class === cls?.name)).sort(byName),
      techniques: classes.filter(i => (i.type === "feature") && (i.system.featureType === "technique") && !knownTechniques.has(i.name)).sort(byName),
      spells: spells.filter(i => (i.type === "spell") && i.system.classes.split(/\s*,\s*/).includes(cls?.name) && !known.has(i.name)).sort(byName)
    };
  }

  /** What is still missing. */
  get problems() {
    const out = [];
    for ( const c of this.choices ) {
      if ( (c.kind === "specialization") && !this.picks.spec && this.library?.specs.length ) out.push(loc("TTE.LevelUp.NeedSpec"));
      if ( (c.kind === "attributes") && (this.picks.attributes[c.level].size < 2) ) out.push(fmt("TTE.LevelUp.NeedAttributes", { level: c.level }));
      if ( (c.kind === "technique") && !this.picks.techniques[c.level] ) out.push(fmt("TTE.LevelUp.NeedTechnique", { level: c.level }));
    }
    const spells = Math.min(this.spellCount, this.library?.spells.length ?? 0);
    if ( this.spellCount && (this.picks.spells.size < spells) ) out.push(fmt("TTE.Creator.NeedSpells", { n: spells }));
    return out;
  }

  async _prepareContext(options) {
    await this.#loadLibrary();
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;
    const plain = html => (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const cls = system.class;
    const spec = this.library.specs.find(s => s.id === this.picks.spec) ?? system.specialization;

    // Features these levels bring (they are added on their own).
    const gained = [cls, spec].filter(Boolean).flatMap(source => source.system.features
      .filter(f => f.name && (f.name !== "Technique") && (f.level > this.from) && (f.level <= this.to))
      .map(f => ({ name: f.name, level: f.level, source: source.name, text: plain(f.description) })))
      .sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name));

    const spellsFull = this.picks.spells.size >= this.spellCount;
    const sections = this.choices.filter(c => c.kind !== "spells").map(c => {
      if ( c.kind === "specialization" ) return {
        ...c, title: fmt("TTE.LevelUp.SpecTitle", { level: c.level }),
        specs: this.library.specs.map(s => ({
          id: s.id, name: s.name, img: s.img, selected: s.id === this.picks.spec,
          features: s.system.features.filter(f => f.name && (f.level <= this.to)).map(f => ({ name: f.name, text: plain(f.description) }))
        }))
      };
      if ( c.kind === "technique" ) {
        const elsewhere = new Set(Object.entries(this.picks.techniques).filter(([l]) => Number(l) !== c.level).map(([, id]) => id));
        return {
          ...c, title: fmt("TTE.LevelUp.TechniqueTitle", { level: c.level }),
          techniques: this.library.techniques.filter(t => (t.system.level <= c.level) && !elsewhere.has(t.id)).map(t => ({
            id: t.id, level: c.level, name: t.name, text: plain(t.system.description),
            checked: this.picks.techniques[c.level] === t.id
          }))
        };
      }
      const chosen = this.picks.attributes[c.level];
      return {
        ...c, title: fmt("TTE.LevelUp.AttributesTitle", { level: c.level }),
        attributes: TTE.attributes.map(key => {
          // The value now, counting the +1s chosen for other levels in this window; +1 shows only when chosen here.
          const others = Object.entries(this.picks.attributes).filter(([l, set]) => (Number(l) !== c.level) && set.has(key)).length;
          const base = system.attributes[key] + others;
          const checked = chosen.has(key);
          return {
            key, level: c.level, label: loc(`TTE.Attribute.${cap(key)}`),
            value: signed(base + (checked ? 1 : 0)), checked,
            disabled: !checked && ((chosen.size >= 2) || (base >= TTE.attributeRange.max))
          };
        })
      };
    });

    return Object.assign(context, {
      from: this.from,
      to: this.to,
      life: system.life.max,
      mana: system.mana.max,
      tier: system.details.tier,
      gained,
      sections,
      spellCount: this.spellCount,
      spellChosen: this.picks.spells.size,
      spells: this.library.spells.map(sp => ({
        id: sp.id, name: sp.name,
        meta: [loc(`TTE.Spell.Action.${sp.system.action}`), sp.system.range, sp.system.duration].filter(Boolean).join(" · "),
        text: plain(sp.system.description),
        checked: this.picks.spells.has(sp.id),
        disabled: spellsFull && !this.picks.spells.has(sp.id)
      })),
      problems: this.problems,
      ready: !this.problems.length
    });
  }

  static #onPickSpec(event, target) {
    this.picks.spec = target.dataset.id;
    this.render();
  }

  static #onToggleAttribute(event, target) {
    const set = this.picks.attributes[target.dataset.level];
    const key = target.dataset.key;
    const value = this.actor.system.attributes[key] + Object.values(this.picks.attributes).filter(x => x.has(key)).length;
    if ( set.has(key) ) set.delete(key);
    else if ( (set.size < 2) && (value < TTE.attributeRange.max) ) set.add(key);
    this.render();
  }

  static #onPickTechnique(event, target) {
    const { level, key } = target.dataset;
    this.picks.techniques[level] = this.picks.techniques[level] === key ? null : key;
    this.render();
  }

  static #onToggleSpell(event, target) {
    const id = target.dataset.key;
    if ( this.picks.spells.has(id) ) this.picks.spells.delete(id);
    else if ( this.picks.spells.size < this.spellCount ) this.picks.spells.add(id);
    this.render();
  }

  static #onLater() {
    ui.notifications.info(loc("TTE.LevelUp.LaterHint"));
    return this.close();
  }

  static async #onApply() {
    if ( this.problems.length ) return;
    const actor = this.actor;
    const update = {};
    for ( const set of Object.values(this.picks.attributes) ) {
      for ( const key of set ) {
        const path = `system.attributes.${key}`;
        update[path] = Math.min(TTE.attributeRange.max, (update[path] ?? actor.system.attributes[key]) + 1);
      }
    }
    if ( Object.keys(update).length ) await actor.update(update);
    const create = [];
    const spec = this.library.specs.find(s => s.id === this.picks.spec);
    if ( spec ) create.push(spec.toObject());
    for ( const sp of this.library.spells.filter(s => this.picks.spells.has(s.id)) ) create.push(sp.toObject());
    const techniques = new Set(Object.values(this.picks.techniques).filter(Boolean));
    for ( const t of this.library.techniques.filter(t => techniques.has(t.id)) ) create.push(t.toObject());
    for ( const data of create ) delete data._id;
    if ( create.length ) await actor.createEmbeddedDocuments("Item", create);
    await actor.setFlag(SYSTEM_ID, "levelChoices", Math.max(this.to, actor.levelChoicesDone));
    ui.notifications.info(fmt("TTE.LevelUp.Done", { name: actor.name, level: this.to }));
    return this.close();
  }
}

class TTEItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["tte", "tte-sheet", "tte-item"],
    position: { width: 600, height: 620 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      tteEditImage: TTEItemSheet.#onEditImage,
      itemChat: TTEItemSheet.#onChat,
      toggleSetValue: TTEItemSheet.#onToggleSetValue,
      featureAdd: TTEItemSheet.#onFeatureAdd,
      featureRemove: TTEItemSheet.#onFeatureRemove,
      toggleEditMode: TTEItemSheet.#onToggleEditMode,
      openEntry: TTEItemSheet.#onOpenEntry,
      toggleClassName: TTEItemSheet.#onToggleClassName
    }
  };

  /** Item types whose sheet has a play mode (only what the item has) and an edit mode (every field). */
  static EDIT_MODE_TYPES = ["armor", "class", "feature", "container", "equipment", "race", "specialization", "weapon", "spell"];

  /** Lists with a "Custom" choice where the custom text field is open. */
  _custom = new Set();

  /**
   * A list with the book's values plus "Custom…", which opens a text field (weapon group, a specialization's class).
   * @returns {{path: string, options: {value: string, label: string, selected: boolean}[], custom: boolean, value: string}}
   */
  #customSelect(path, values) {
    const value = foundry.utils.getProperty(this.document, path) ?? "";
    const custom = this._custom.has(path) || (!!value && !values.includes(value));
    return {
      path, value, custom,
      options: [{ value: "", label: "—", selected: !custom && !value },
        ...values.map(v => ({ value: v, label: v, selected: !custom && (v === value) })),
        { value: "__custom", label: loc("TTE.Item.Custom"), selected: custom }]
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    for ( const select of this.element.querySelectorAll("select[data-custom-path]") ) {
      select.addEventListener("change", event => {
        event.stopPropagation();
        const path = select.dataset.customPath;
        if ( select.value === "__custom" ) {
          this._custom.add(path);
          return this.render();
        }
        this._custom.delete(path);
        return this.document.update({ [path]: select.value });
      });
    }
  }

  /** Spells: add or remove a class from the comma-separated list of classes. */
  static #onToggleClassName(event, target) {
    if ( !this.isEditable ) return;
    const name = target.dataset.value;
    const current = String(this.document.system.classes ?? "").split(/\s*,\s*/).filter(Boolean);
    const next = current.includes(name) ? current.filter(c => c !== name) : [...current, name];
    return this.document.update({ "system.classes": next.join(", ") });
  }

  /** Play mode: the item's details as read-only rows and tags. */
  #playInfo() {
    const item = this.document;
    const s = item.system;
    const rows = [];
    const chips = [];
    const row = (label, value) => { if ( (value !== "") && (value !== null) && (value !== undefined) ) rows.push({ label, value }); };
    const tier = item.actor?.system?.details?.tier ?? null;
    switch ( item.type ) {
      case "equipment":
        row(loc("TTE.Item.Category"), loc(`TTE.GearCategory.${s.category}`));
        if ( s.category === "potion" ) {
          const table = s.potion.kind === "mana" ? TTE.manaDice : TTE.damageDice;
          row(loc("TTE.Potion.Kind"), loc(`TTE.Potion.${s.potion.kind}`));
          row(loc("TTE.Potion.Potency"), `${loc(`TTE.DamageCategory.${s.potion.potency}`)} (${table[s.potion.potency].map(d => d.replace(/^1d/, "d")).join(" > ")})`);
        }
        if ( (s.category === "ammunition") && (s.bundleSize > 1) ) row(loc("TTE.Ammo.LeftLabel"), s.ammoLeft);
        if ( s.contents?.length ) row(loc("TTE.Item.Contents"), s.contents.map(e => (e.quantity > 1 ? `${e.name} ×${e.quantity}` : e.name)).join(", "));
        break;
      case "weapon": {
        const dice = TTE.damageCategories.includes(s.damage.category)
          ? TTE.damageDice[s.damage.category].map(d => d.replace(/^1d/, "d")).join(" > ") : s.damage.formula;
        row(loc("TTE.Weapon.Group"), s.group);
        row(loc("TTE.Weapon.Attribute"), loc(`TTE.Attribute.${cap(s.attribute)}`));
        row(loc("TTE.Weapon.Damage"), `${s.damageLabel} (${tier ? s.damageFormula(tier) : dice})`);
        for ( const label of s.propertyLabels ) chips.push({ label });
        break;
      }
      case "spell": {
        row(loc("TTE.Spell.SchoolLabel"), loc(`TTE.Spell.School.${s.school}`));
        row(loc("TTE.Card.Action"), s.trigger ? `${loc(`TTE.Spell.Action.${s.action}`)}, ${s.trigger}` : loc(`TTE.Spell.Action.${s.action}`));
        row(loc("TTE.Card.Range"), s.range);
        row(loc("TTE.Card.Duration"), s.duration);
        row(loc("TTE.Spell.Components"), s.componentLabel);
        row(loc("TTE.Spell.Classes"), s.classes);
        const type = s.roll.damageType ? ` ${loc(`TTE.DamageType.${s.roll.damageType}`)}` : "";
        const dice = s.diceLabel ? `${s.roll.category ? `${loc(`TTE.DamageCategory.${s.roll.category}`)} ` : ""}${s.diceLabel}` : "";
        if ( s.roll.type === "attack" ) row(loc("TTE.Card.Roll"), fmt("TTE.Card.SpellAttack", { damage: dice ? `${dice}${type}` : "—" }));
        else if ( s.roll.type === "test" ) {
          const test = fmt("TTE.Card.SpellTest", { attribute: s.roll.attribute ? loc(`TTE.Attribute.${cap(s.roll.attribute)}`) : "—", dc: "10 + X" });
          row(loc("TTE.Card.Roll"), dice ? `${test}; ${dice}${type}` : test);
        }
        else if ( s.roll.type === "healing" ) row(loc("TTE.Card.Roll"), `${dice} ${loc("TTE.Life")}`);
        if ( s.concentration ) chips.push({ label: loc("TTE.Condition.concentrating") });
        break;
      }
      case "race":
        row(loc("TTE.Size.Label"), loc(`TTE.Size.${s.size}`));
        row(loc("TTE.Speed"), s.speed);
        if ( s.lifeBonus ) row(loc("TTE.Race.LifeBonus"), signed(s.lifeBonus));
        for ( const key of Object.keys(TTE.senses) ) if ( s.senses[key] ) row(loc(`TTE.Sense.${cap(key)}`), s.senses[key]);
        if ( s.skills ) row(loc("TTE.Race.ExtraSkills"), s.skills);
        row(loc("TTE.Race.Height"), s.details.height);
        row(loc("TTE.Race.Weight"), s.details.weight);
        row(loc("TTE.Race.Lifespan"), s.details.lifespan);
        for ( const key of s.languages ) chips.push({ label: loc(`TTE.Language.${key}`) });
        break;
      case "specialization":
        row(loc("TTE.ClassLabel"), s.class);
        break;
      default:
        return null;
    }
    return { rows, chips };
  }

  /** Edit mode shows every field. */
  _editMode = false;

  static #onToggleEditMode() {
    this._editMode = !this._editMode;
    this.render();
  }

  /** Open a compendium item listed in the sheet (a class's starting equipment). */
  static async #onOpenEntry(event, target) {
    const doc = target.dataset.uuid ? await fromUuid(target.dataset.uuid) : null;
    doc?.sheet.render(true);
  }

  /**
   * A class's starting equipment as item rows: groups with one option are given,
   * groups with several are "choose 1". Then weapons of your choice and Aurel.
   */
  async #classEquipment() {
    const system = this.document.system;
    const pack = game.packs.get(`${SYSTEM_ID}.items`);
    const index = pack ? await pack.getIndex() : [];
    const entry = e => {
      const found = index.find?.(i => i.name === e.name);
      return { name: e.name, quantity: e.quantity, showQuantity: e.quantity > 1, img: found?.img ?? "icons/svg/item-bag.svg", uuid: found?.uuid ?? "" };
    };
    const groups = system.equipment.map(group => (group.length === 1)
      ? { given: true, entries: group[0].map(entry) }
      : { given: false, options: group.map((option, i) => ({ n: i + 1, entries: option.map(entry) })) });
    return {
      groups,
      weapons: system.weaponChoices ? fmt("TTE.Class.WeaponChoices", { n: system.weaponChoices }) : "",
      currency: system.currency ? fmt("TTE.Class.Currency", { formula: system.currency.replace(/1?d12\s*\*\s*10/, "d12 × 10") }) : ""
    };
  }

  static PARTS = {
    sheet: { template: `${SYSTEM_PATH}/templates/item-sheet.hbs`, scrollable: [".tte-body"] }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = this.document;
    const system = item.system;
    const TextEditor = foundry.applications.ux.TextEditor.implementation;
    const choices = (keys, prefix) => Object.fromEntries(keys.map(k => [k, `${prefix}.${k}`]));
    const attributeChoices = Object.fromEntries(TTE.attributes.map(k => [k, `TTE.Attribute.${cap(k)}`]));

    let weaponProperties = [];
    if ( item.type === "weapon" ) {
      weaponProperties = Object.entries(TTE.weaponProperties).map(([key, config]) => ({
        key,
        label: loc(`TTE.WeaponProperty.${key}`),
        hint: loc(`TTE.WeaponPropertyHint.${key}`),
        name: `system.properties.${key}`,
        value: system.properties[key],
        isFlag: !config.value,
        isNumber: config.value === "number",
        isText: (config.value === "text") || (config.value === "range"),
        isAttribute: config.value === "attribute",
        placeholder: config.value === "range" ? "X/Y" : ""
      }));
    }

    let armorProperties = [];
    if ( item.type === "armor" ) {
      armorProperties = Object.entries(TTE.armorProperties)
        .filter(([, config]) => !config.only || ((config.only === "shield") === system.isShield))
        .map(([key, config]) => {
          const data = {
            key,
            label: loc(`TTE.ArmorProperty.${key}`),
            hint: loc(`TTE.ArmorPropertyHint.${key}`),
            name: `system.properties.${key}`,
            isFlag: !config.value,
            value: system.properties[key]
          };
          if ( config.value ) {
            const keys = config.value === "damageTypes" ? TTE.damageTypes : Object.keys(TTE.conditions);
            const prefix = config.value === "damageTypes" ? "TTE.DamageType" : "TTE.Condition";
            data.options = keys.map(k => ({ key: k, label: loc(`${prefix}.${k}`), active: system.properties[key].has(k) }));
          }
          return data;
        });
    }

    // Play mode: only the properties the armor has.
    const armorActive = {
      flags: armorProperties.filter(p => p.isFlag && p.value).map(p => ({ label: p.label, hint: p.hint })),
      sets: armorProperties.filter(p => !p.isFlag && p.options.some(o => o.active))
        .map(p => ({ label: p.label, hint: p.hint, values: p.options.filter(o => o.active).map(o => o.label) }))
    };
    armorActive.none = !armorActive.flags.length && !armorActive.sets.length;
    const armorDefense = (item.type === "armor") && !system.isShield ? TTE.armor[system.category]?.join(" > ") : "";

    let classInfo = null;
    if ( item.type === "class" ) {
      const res = system.resource;
      classInfo = {
        rows: [
          { label: loc("TTE.LifeCategoryLabel"), value: loc(`TTE.LifeCategory.${system.life}`) },
          { label: loc("TTE.Class.Skills"), value: system.skills },
          { label: loc("TTE.Mana"), value: loc(`TTE.ManaType.${system.mana}`) },
          system.conjuring && { label: loc("TTE.Class.Conjuring"), value: loc(`TTE.Attribute.${cap(system.conjuring)}`) },
          res.label && { label: res.label, value: `${res.max || "—"} · ${loc(`TTE.Class.Reset.${res.reset}`)}` }
        ].filter(Boolean),
        tags: [system.noConcentration && { label: loc("TTE.Class.NoConcentration"), hint: loc("TTE.Class.NoConcentrationHint") }].filter(Boolean),
        equipment: await this.#classEquipment()
      };
    }
    const hasEditMode = TTEItemSheet.EDIT_MODE_TYPES.includes(item.type) && this.isEditable;

    let featureInfo = null;
    if ( item.type === "feature" ) {
      const uses = system.uses;
      const per = uses.per ? ` per ${loc(`TTE.Uses.Per.${uses.per}`).toLowerCase()}` : "";
      const book = TTE.featureValues[item.name] ?? "";
      featureInfo = {
        typeLabel: loc(`TTE.Feature.${system.featureType}`),
        uses: uses.total ? fmt("TTE.Uses.Summary", { value: uses.value, total: uses.total, per }) : "",
        value: system.value?.trim() ? fmt("TTE.Feature.ValueChanged", { value: system.value, book }) : book
      };
      featureInfo.show = !!(featureInfo.uses || book);
    }
    const containerInfo = (item.type === "container") ? {
      capacity: system.capacity.value ? `${system.capacity.value} ${loc(`TTE.Container.Unit.${system.capacity.type}`)}` : loc("TTE.Container.NoLimit")
    } : null;

    let race = {};
    if ( item.type === "race" ) race = {
      sizeOptions: Object.fromEntries(Object.keys(TTE.sizes).map(k => [k, `TTE.Size.${k}`])),
      languages: Object.entries(TTE.languages).map(([key, family]) => ({
        key,
        label: loc(`TTE.Language.${key}`),
        hint: fmt("TTE.LanguageFamily", { language: loc(`TTE.LanguageGroup.${family}`) }),
        active: system.languages.has(key)
      })),
      senses: Object.keys(TTE.senses).map(key => ({ key, label: loc(`TTE.Sense.${cap(key)}`), value: system.senses[key] }))
    };
    const granted = GRANTING_TYPES.includes(item.type) ? {
      title: loc(`TTE.Granted.Title.${item.type}`),
      hint: loc(`TTE.Granted.Hint.${item.type}`),
      showLevel: item.type !== "race",
      features: system.features.map((f, i) => ({ index: i, ...f,
        usesLabel: f.uses?.max ? `${f.uses.max}${f.uses.per ? ` · ${loc(`TTE.Uses.Per.${f.uses.per}`)}` : ""}` : "" }))
    } : null;

    Object.assign(context, {
      item,
      system,
      race,
      granted,
      isRace: item.type === "race",
      isClass: item.type === "class",
      isSpell: item.type === "spell",
      spellSchoolOptions: choices(TTE.spellSchools, "TTE.Spell.School"),
      spellActionOptions: choices(TTE.spellActions, "TTE.Spell.Action"),
      spellRollOptions: choices(TTE.spellRolls, "TTE.Spell.Roll"),
      spellDamageOptions: { "": "TTE.Roll.None", ...choices(TTE.damageTypes, "TTE.DamageType") },
      spellCategoryOptions: { "": "TTE.Spell.CategoryCustom", ...choices(TTE.damageCategories, "TTE.DamageCategory") },
      spellDice: item.type === "spell" ? system.diceLabel : "",
      isSpecialization: item.type === "specialization",
      lifeCategoryOptions: choices(TTE.lifeCategories, "TTE.LifeCategory"),
      manaTypeOptions: choices(TTE.manaTypes, "TTE.ManaType"),
      conjuringOptions: { "": "TTE.Roll.None", ...attributeChoices },
      resourceResetOptions: choices(TTE.resourceResets, "TTE.Class.Reset"),
      usePeriodOptions: { "": "TTE.Uses.Per.none", ...choices(TTE.usePeriods, "TTE.Uses.Per") },
      enrichedEquipment: item.type === "class" ? await TextEditor.enrichHTML(system.startingEquipment, { relativeTo: item }) : "",
      source: item._source.system,
      editable: this.isEditable,
      isFeature: item.type === "feature",
      featureValueDefault: TTE.featureValues[item.name] ?? "",
      isPhysical: TTE.physicalTypes.includes(item.type),
      isEquipment: item.type === "equipment",
      isPotion: (item.type === "equipment") && (system.category === "potion"),
      isWeapon: item.type === "weapon",
      isArmor: item.type === "armor",
      hasEditMode,
      editMode: hasEditMode && this._editMode,
      grantEditable: this.isEditable && (!hasEditMode || this._editMode),
      grantForm: !hasEditMode || this._editMode,
      armorActive,
      armorDefense,
      featureInfo,
      containerInfo,
      playInfo: this.#playInfo(),
      weaponGroup: item.type === "weapon" ? this.#customSelect("system.group", TTE.weaponGroups) : null,
      specClass: item.type === "specialization" ? this.#customSelect("system.class", TTE.classNames) : null,
      spellClasses: item.type === "spell" ? TTE.classNames.map(name => ({
        name, active: String(system.classes ?? "").split(/\s*,\s*/).includes(name) })) : null,
      weaponDice: (item.type === "weapon") && !system.damage.category,
      classInfo,
      isShield: (item.type === "armor") && system.isShield,
      isContainer: item.type === "container",
      typeLabel: loc(`TYPES.Item.${item.type}`),
      featureTypeOptions: choices(TTE.featureTypes, "TTE.Feature"),
      gearCategoryOptions: choices(TTE.gearCategories, "TTE.GearCategory"),
      armorCategoryOptions: choices(TTE.armorCategories, "TTE.ArmorCategory"),
      damageCategoryOptions: choices(TTE.damageCategories, "TTE.DamageCategory"),
      weaponDamageOptions: { ...choices(TTE.damageCategories, "TTE.DamageCategory"), "": "TTE.Spell.CategoryCustom" },
      damageTypeOptions: choices(TTE.damageTypes, "TTE.DamageType"),
      potionKindOptions: choices(TTE.potionKinds, "TTE.Potion"),
      capacityTypeOptions: choices(TTE.capacityTypes, "TTE.Container.Unit"),
      attributeOptions: attributeChoices,
      flexibleOptions: { "": "TTE.Roll.None", ...attributeChoices },
      weaponProperties,
      armorProperties,
      levels: Array.from({ length: TTE.maxLevel }, (_, i) => ({ n: i + 1, selected: i + 1 === system.level })),
      sourceOptions: TTE.sourceBooks,
      enrichedDescription: await TextEditor.enrichHTML(system.description, {
        secrets: item.isOwner, relativeTo: item
      })
    });
    return context;
  }

  static #onEditImage() {
    if ( this.isEditable ) return editImage(this);
  }

  static #onChat() {
    return this.document.toChat();
  }

  /** Add or remove one value of a list, such as Reinforced (Cut) or a race's Languages. */
  static #onToggleSetValue(event, target) {
    if ( !this.isEditable ) return;
    const { key, value } = target.dataset;
    const path = target.dataset.path ?? `system.properties.${key}`;
    const current = new Set(foundry.utils.getProperty(this.document, path));
    if ( current.has(value) ) current.delete(value);
    else current.add(value);
    return this.document.update({ [path]: [...current] });
  }

  static #onFeatureAdd() {
    if ( !this.isEditable ) return;
    const features = this.document.system.toObject().features;
    const last = features.at(-1);
    features.push({ name: loc("TTE.Race.NewFeature"), level: last?.level ?? 1, description: "", uses: { max: "", per: "" } });
    return this.document.update({ "system.features": features });
  }

  static #onFeatureRemove(event, target) {
    if ( !this.isEditable ) return;
    const features = this.document.system.toObject().features;
    features.splice(Number(target.dataset.index), 1);
    return this.document.update({ "system.features": features });
  }

  /** Race features are edited as a list of fields; turn them back into an array. */
  _processFormData(event, form, formData) {
    const data = super._processFormData(event, form, formData);
    const features = data.system?.features;
    if ( features && !Array.isArray(features) ) {
      const current = this.document.system.toObject().features;
      for ( const [i, f] of Object.entries(features) ) current[Number(i)] = { ...current[Number(i)], ...f };
      data.system.features = current;
    }
    return data;
  }
}

/* -------------------------------------------- */
/*  Initialization                              */
/* -------------------------------------------- */

/**
 * Give the TTE icons to what already exists in the world: items (on their own and on actors) and condition effects
 * that still use one of Foundry's default icons. Images someone picked are left alone. Runs once per world.
 */
async function migrateIcons() {
  if ( !game.user.isGM || (game.settings.get(SYSTEM_ID, "iconsVersion") >= 1) ) return;
  const core = img => !img || img.startsWith("icons/");
  const itemUpdates = items => items.map(i => ({ _id: i.id, img: core(i.img) && tteIcon(i.name) })).filter(u => u.img);
  const updates = itemUpdates(game.items);
  if ( updates.length ) await Item.updateDocuments(updates);
  for ( const actor of game.actors ) {
    const items = itemUpdates(actor.items);
    if ( items.length ) await actor.updateEmbeddedDocuments("Item", items);
    const effects = actor.effects.map(e => {
      const id = [...(e.statuses ?? [])].find(s => s in TTE.conditions);
      return { _id: e.id, img: id && core(e.img) && tteIcon(id) };
    }).filter(u => u.img);
    if ( effects.length ) await actor.updateEmbeddedDocuments("ActiveEffect", effects);
  }
  await game.settings.set(SYSTEM_ID, "iconsVersion", 1);
}

Hooks.once("ready", () => migrateIcons());

Hooks.once("init", () => {
  CONFIG.TTE = TTE;
  game.tte = { config: TTE, TTEActor, TTEItem, TTERollDialog, TTECharacterCreator, TTELevelUp, TTEEncounterBuilder,
    encounterBuilder: () => TTEEncounterBuilder.open(), monsterPower };

  game.settings.register(SYSTEM_ID, "autoDamage", {
    name: "TTE.Settings.AutoDamage.Name",
    hint: "TTE.Settings.AutoDamage.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
  game.settings.register(SYSTEM_ID, "encounter", { scope: "client", config: false, type: Object, default: {} });
  game.settings.register(SYSTEM_ID, "iconsVersion", { scope: "world", config: false, type: Number, default: 0 });
  game.settings.register(SYSTEM_ID, "reactionPrompts", {
    name: "TTE.Settings.ReactionPrompts.Name",
    hint: "TTE.Settings.ReactionPrompts.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  CONFIG.Actor.documentClass = TTEActor;
  CONFIG.Item.documentClass = TTEItem;
  CONFIG.Token.documentClass = TTETokenDocument;
  CONFIG.Actor.dataModels.character = CharacterData;
  CONFIG.Actor.dataModels.npc = NpcData;
  CONFIG.Item.dataModels.feature = FeatureData;
  CONFIG.Item.dataModels.race = RaceData;
  CONFIG.Item.dataModels.class = ClassData;
  CONFIG.Item.dataModels.spell = SpellData;
  CONFIG.Item.dataModels.specialization = SpecializationData;
  CONFIG.Item.dataModels.equipment = EquipmentData;
  CONFIG.Item.dataModels.weapon = WeaponData;
  CONFIG.Item.dataModels.armor = ArmorData;
  CONFIG.Item.dataModels.container = ContainerData;

  // Conditions as status effects: TTE icons, or Foundry's own for the extra statuses.
  const coreIcons = Object.fromEntries(CONFIG.statusEffects.map(e => [e.id, e.img]));
  CONFIG.statusEffects = Object.entries({ ...TTE.conditions, ...TTE.extraStatuses }).map(([id, config]) => ({
    id,
    name: `TTE.Condition.${id}`,
    img: (id in TTE.conditions ? tteIcon(id) : null) ?? config.img ?? coreIcons[config.core] ?? "icons/svg/aura.svg",
    description: id === "dead" ? undefined : `TTE.ConditionHint.${id}`,
    hud: config.hud ?? true
  }));
  CONFIG.specialStatusEffects.DEFEATED = "dead";
  CONFIG.specialStatusEffects.BLIND = "blinded";
  CONFIG.specialStatusEffects.INVISIBLE = "hidden";

  // Initiative: a d20. Ties compare Agility (kept as a small decimal).
  CONFIG.Combat.initiative = { formula: "1d20 + (@attributes.agility + 5) / 100", decimals: 2 };

  CONFIG.Actor.trackableAttributes = {
    character: { bar: ["life", "mana", "resource"], value: ["details.xp", "wounds", "passivePerception", "defense", "movement", "reach"] },
    npc: { bar: ["life"], value: ["passivePerception", "defense", "movement", "reach", "power"] }
  };

  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, TTENpcSheet, {
    types: ["npc"], makeDefault: true, label: "TTE.SheetNpc"
  });
  DocumentSheetConfig.registerSheet(Actor, SYSTEM_ID, TTECharacterSheet, {
    types: ["character"], makeDefault: true, label: "TTE.SheetCharacter"
  });
  DocumentSheetConfig.unregisterSheet(Item, "core", foundry.appv1.sheets.ItemSheet);
  DocumentSheetConfig.registerSheet(Item, SYSTEM_ID, TTEItemSheet, {
    types: ["race", "class", "specialization", "feature", "spell", ...TTE.physicalTypes], makeDefault: true, label: "TTE.SheetItem"
  });
});

/* -------------------------------------------- */
/*  Chat and combat automation                  */
/* -------------------------------------------- */

/** Tokens that take damage from a chat card: targeted tokens, or else the selected ones. */
function damageTargets() {
  const targeted = Array.from(game.user.targets ?? []);
  return targeted.length ? targeted : (canvas?.tokens?.controlled ?? []);
}

/** The Actors sidebar gets an Encounter Builder button for the GM. */
Hooks.on("renderActorDirectory", (app, html) => {
  if ( !game.user.isGM ) return;
  const root = html instanceof HTMLElement ? html : html[0];
  if ( !root || root.querySelector(".tte-encounter-open") ) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tte-encounter-open";
  button.innerHTML = `<i class="fa-solid fa-dragon"></i> ${loc("TTE.Encounter.Title")}`;
  button.addEventListener("click", () => TTEEncounterBuilder.open());
  const actions = root.querySelector(".header-actions") ?? root.querySelector(".directory-header");
  actions?.append(button);
});

Hooks.on("renderChatMessageHTML", (message, html) => {
  const flags = message.flags?.[SYSTEM_ID] ?? {};
  for ( const button of html.querySelectorAll("[data-tte-action]") ) {
    if ( (button.dataset.tteAction === "dealDamage") && flags.attack?.dealt ) button.disabled = true;
    button.addEventListener("click", async event => {
      event.preventDefault();
      const action = button.dataset.tteAction;
      if ( action === "rollDamage" ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        const attack = flags.attack;
        if ( !actor?.isOwner || !attack?.damage ) return;
        return actor.rollDamage({ ...attack.damage, critical: attack.critical, label: attack.label });
      }
      if ( action === "dealDamage" ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        const pending = flags.attack?.pending;
        if ( !actor?.isOwner || !pending || flags.attack.dealt ) return;
        button.disabled = true;
        await message.setFlag(SYSTEM_ID, "attack.dealt", true);
        return actor.dealPendingDamage(pending);
      }
      if ( action === "itemUse" ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        const item = actor?.items.get(button.dataset.itemId);
        if ( !actor?.isOwner || !item ) return;
        return item.type === "feature" ? actor.useFeature(item) : item.use();
      }
      if ( (action === "reroll") && flags.attack ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if ( !actor?.isOwner ) return;
        button.disabled = true;
        return actor.rerollAttack(flags.attack, button.dataset.feature);
      }
      if ( (action === "veteranTest") && flags.test ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if ( !actor?.isOwner ) return;
        button.disabled = true;
        return actor.rerollTest(flags.test);
      }
      const spell = flags.spell;
      if ( (action === "arcaneEcho") && spell ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if ( !actor?.isOwner ) return;
        return actor.arcaneEcho(spell.itemId);
      }
      if ( (action === "spellDamage") && spell ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if ( !actor?.isOwner ) return;
        return actor.rollDamage({ formula: spell.formula, type: spell.type, label: spell.label, halfOnSuccess: true });
      }
      if ( (action === "spellHeal") && spell ) {
        const actor = ChatMessage.getSpeakerActor(message.speaker);
        if ( !actor?.isOwner ) return;
        return actor.rollHealing({ formula: spell.formula, label: spell.label, spell: true });
      }
      if ( (action === "spellTest") && spell ) {
        const tokens = damageTargets().filter(t => t.actor?.isOwner);
        const actors = tokens.length ? tokens.map(t => t.actor) : [game.user.character].filter(a => a);
        if ( !actors.length ) return ui.notifications.warn(loc("TTE.Spell.NoTestTokens"));
        for ( const actor of actors ) if ( typeof actor.rollAttribute === "function" ) await actor.rollAttribute(spell.attribute, { dc: spell.dc });
        return;
      }
      if ( action === "applyHealing" ) {
        const amount = flags.healing?.amount;
        const tokens = damageTargets();
        if ( !amount ) return;
        if ( !tokens.length ) return ui.notifications.warn(loc("TTE.Attack.NoTokens"));
        for ( const token of tokens ) {
          if ( !token.actor?.isOwner ) {
            ui.notifications.warn(fmt("TTE.Attack.NotOwner", { name: token.name }));
            continue;
          }
          if ( typeof token.actor.applyHealing === "function" ) await token.actor.applyHealing(amount);
        }
        return;
      }
      if ( action === "applyDamage" ) {
        const damage = flags.damage ? { ...flags.damage } : null;
        if ( damage && button.dataset.half ) damage.amount = Math.ceil(damage.amount / 2);
        const tokens = damageTargets();
        if ( !damage ) return;
        if ( !tokens.length ) return ui.notifications.warn(loc("TTE.Attack.NoTokens"));
        for ( const token of tokens ) {
          const actor = token.actor;
          if ( !actor ) continue;
          if ( !actor.isOwner ) {
            ui.notifications.warn(fmt("TTE.Attack.NotOwner", { name: token.name }));
            continue;
          }
          if ( typeof actor.applyDamage !== "function" ) continue;
          const { taken } = await actor.applyDamage(damage.amount, { type: damage.type, critical: damage.critical });
          ui.notifications.info(fmt("TTE.Attack.Applied", {
            name: token.name, amount: taken, type: loc(`TTE.DamageType.${damage.type}`)
          }));
        }
      }
    });
  }
});

/** A light that goes out (put out or burned out) turns off the token's light. */
Hooks.on("deleteActiveEffect", (effect, options, userId) => {
  if ( (userId !== game.user.id) || !effect.getFlag(SYSTEM_ID, "light") ) return;
  const actor = effect.parent;
  if ( (actor instanceof Actor) && !actor.effects.some(e => e.getFlag(SYSTEM_ID, "light")) ) actor.setTokenLight?.(null);
});

/** Losing Concentration ends the effects of the Spell (Protective Ward, Inspire, Sanctuary...). */
Hooks.on("deleteActiveEffect", (effect, options, userId) => {
  if ( (userId !== game.user.id) || !effect.statuses?.has("concentrating") || !(effect.parent instanceof Actor) ) return;
  endSpellEffects(effect.parent.uuid);
});

/** Becoming Incapacitated (also Stunned or Fainted) ends Concentration. */
Hooks.on("createActiveEffect", (effect, options, userId) => {
  const actor = effect.parent;
  if ( (userId !== game.user.id) || !(actor instanceof Actor) || !actor.statuses?.has("concentrating") ) return;
  if ( ["incapacitated", "stunned", "fainted", "dead"].some(id => effect.statuses?.has(id)) ) actor.toggleStatusEffect("concentrating", { active: false });
});

/** Torches burn out when their time is up. */
Hooks.on("updateWorldTime", async worldTime => {
  if ( !isGM() ) return;
  const actors = new Set([...game.actors, ...(canvas?.scene?.tokens.map(t => t.actor).filter(a => a) ?? [])]);
  for ( const actor of actors ) {
    for ( const effect of actor.effects.filter(e => e.getFlag(SYSTEM_ID, "light")) ) {
      const { startTime, seconds } = effect.duration;
      if ( !seconds || ((startTime ?? 0) + seconds > worldTime) ) continue;
      await effect.delete();
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<div class="tte-chat-card"><header><i class="fa-solid fa-fire-flame-simple"></i><div>
          <h3>${fmt("TTE.Light.BurnedOut", { name: actor.name })}</h3></div></header></div>`
      });
    }
  }
});

Hooks.on("deleteCombat", async combat => {
  if ( !isGM() ) return;
  const actors = new Set(combat.combatants.map(c => c.actor).filter(a => a));
  for ( const actor of actors ) if ( typeof actor.processCombatEnd === "function" ) await actor.processCombatEnd();
});

/** Flow (Thief): start each combat with 1 Combo. */
Hooks.on("combatStart", async combat => {
  if ( !isGM() ) return;
  for ( const actor of new Set(combat.combatants.map(c => c.actor).filter(a => a)) ) {
    const start = actor.feature?.("Flow") ? actor.featureNumber("Flow") : 0;
    if ( start && (actor.system.resource.value < start) ) await actor.update({ "system.resource.value": start });
  }
});

/** Point Blank (Archer): remember that the creature moved during its own Turn. */
Hooks.on("updateToken", (token, changes, options, userId) => {
  if ( (userId !== game.user.id) || !(("x" in changes) || ("y" in changes)) ) return;
  const actor = token.actor;
  const combat = game.combat;
  if ( !combat?.started || !actor?.feature?.("Point Blank") || (combat.combatant?.tokenId !== token.id) ) return;
  const key = TTEActor.turnKey();
  if ( actor.getFlag(SYSTEM_ID, "moved") !== key ) actor.setFlag(SYSTEM_ID, "moved", key);
});

Hooks.on("combatTurnChange", async (combat, prior, current) => {
  if ( !isGM() ) return;
  const ended = combat.combatants.get(prior?.combatantId)?.actor;
  if ( typeof ended?.processTurnEnd === "function" ) await ended.processTurnEnd();
  const started = combat.combatants.get(current?.combatantId)?.actor;
  if ( typeof started?.processTurnStart === "function" ) await started.processTurnStart();
});

/** Warded (Condition): equipped armor or shields make you immune to the listed Condition. */
Hooks.on("preCreateActiveEffect", (effect, data, options, userId) => {
  const actor = effect.parent;
  const warded = actor?.system?.gear?.warded;
  if ( !warded?.size ) return;
  const blocked = [...(effect.statuses ?? [])].find(s => warded.has(s));
  if ( !blocked ) return;
  if ( userId === game.user.id ) {
    ui.notifications.info(fmt("TTE.Item.Warded", { name: actor.name, condition: loc(`TTE.Condition.${blocked}`) }));
  }
  return false;
});
