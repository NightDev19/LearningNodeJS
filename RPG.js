import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function clearScreen() {
  console.clear();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function question(query) {
  const rl = readline.createInterface({ input, output });
  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

function close() {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  process.exit();
}

async function arrowMenu(options, title = "") {
  return new Promise((resolve) => {
    let selected = 0;

    const display = () => {
      clearScreen();
      if (title) console.log(title + "\n");
      options.forEach((opt, i) => {
        const prefix = i === selected ? "▶ " : "  ";
        console.log(`${prefix}${opt}`);
      });
      console.log("\n[Use ↑↓ arrows and Enter to select]");
    };

    const keyHandler = (str, key) => {
      if (key.name === "up") {
        selected = selected > 0 ? selected - 1 : options.length - 1;
        display();
      } else if (key.name === "down") {
        selected = selected < options.length - 1 ? selected + 1 : 0;
        display();
      } else if (key.name === "return") {
        process.stdin.removeListener("keypress", keyHandler);
        resolve(selected);
      } else if (key.ctrl && key.name === "c") {
        close();
      }
    };

    process.stdin.on("keypress", keyHandler);
    display();
  });
}

class Item {
  constructor(name, type, effect, value) {
    this.name = name;
    this.type = type;
    this.effect = effect;
    this.value = value;
  }
}

class Equipment {
  constructor() {
    this.weapon = null;
    this.armor = null;
  }

  equip(item, slot) {
    if (slot === "weapon") this.weapon = item;
    if (slot === "armor") this.armor = item;
  }

  getBonus(stat) {
    let bonus = 0;
    if (this.weapon && this.weapon.effect[stat])
      bonus += this.weapon.effect[stat];
    if (this.armor && this.armor.effect[stat]) bonus += this.armor.effect[stat];
    return bonus;
  }
}

class Inventory {
  constructor() {
    this.items = [];
    this.gold = 50;
  }

  addItem(item) {
    this.items.push(item);
    console.log(`✅ Added ${item.name} to inventory!`);
  }

  removeItem(itemName) {
    const idx = this.items.findIndex((i) => i.name === itemName);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  showInventory() {
    console.log("\n📦 Inventory:");
    console.log(`💰 Gold: ${this.gold}`);
    if (this.items.length === 0) {
      console.log("Empty.");
    } else {
      this.items.forEach((item, i) => {
        let details = "";
        if (item.type === "weapon" && item.effect.str) {
          details = `+${item.effect.str} STR`;
        } else if (item.type === "armor" && item.effect.vit) {
          details = `+${item.effect.vit} VIT`;
        } else if (item.type === "potion" && item.effect.hp) {
          details = `+${item.effect.hp} HP`;
        }
        console.log(`${i + 1}. ${item.name} (${item.type}) ${details}`);
      });
    }
  }
}

class Character {
  constructor(name, str, dex, vit, men, int) {
    this.name = name;
    this.str = str;
    this.dex = dex;
    this.vit = vit;
    this.men = men;
    this.int = int;
    this.maxHp = vit * 10;
    this.hp = this.maxHp;
  }

  getTotalStat(stat) {
    return this[stat];
  }
}

class Hero extends Character {
  constructor(name, str, dex, vit, men, int) {
    super(name, str, dex, vit, men, int);
    this.level = 1;
    this.xp = 0;
    this.inventory = new Inventory();
    this.equipment = new Equipment();

    this.inventory.addItem(new Item("Health Potion", "potion", { hp: 30 }, 20));
    this.inventory.addItem(new Item("Health Potion", "potion", { hp: 30 }, 20));
    this.inventory.addItem(new Item("Rusty Sword", "weapon", { str: 3 }, 15));
    this.inventory.addItem(new Item("Leather Armor", "armor", { vit: 2 }, 10));
  }

  getTotalStat(stat) {
    return this[stat] + this.equipment.getBonus(stat);
  }

  useItem(item) {
    if (item.type === "potion") {
      if (item.effect.hp) {
        const healed = Math.min(item.effect.hp, this.maxHp - this.hp);
        this.hp += healed;
        console.log(
          `💚 Restored ${healed} HP! Current HP: ${this.hp}/${this.maxHp}`,
        );
      }
      this.inventory.removeItem(item.name);
    }
  }

  equipItem(item) {
    if (item.type === "weapon") {
      if (this.equipment.weapon) {
        this.inventory.addItem(this.equipment.weapon);
        console.log(`📤 Unequipped ${this.equipment.weapon.name}`);
      }
      this.equipment.equip(item, "weapon");
      this.inventory.removeItem(item.name);
      console.log(`⚔️ Equipped ${item.name}! STR +${item.effect.str || 0}`);
    } else if (item.type === "armor") {
      if (this.equipment.armor) {
        this.inventory.addItem(this.equipment.armor);
        console.log(`📤 Unequipped ${this.equipment.armor.name}`);
      }
      this.equipment.equip(item, "armor");
      this.inventory.removeItem(item.name);
      console.log(`🛡️ Equipped ${item.name}! VIT +${item.effect.vit || 0}`);
    }
  }

  showStats() {
    console.log("\n📊 Character Stats:");
    console.log(
      `Name: ${this.name} | Level: ${this.level} | XP: ${this.xp}/${this.level * 20}`,
    );
    console.log(`HP: ${this.hp}/${this.maxHp}`);
    console.log(
      `STR: ${this.getTotalStat("str")} | DEX: ${this.getTotalStat("dex")} | VIT: ${this.getTotalStat("vit")}`,
    );
    console.log(`Weapon: ${this.equipment.weapon?.name || "None"}`);
    console.log(`Armor: ${this.equipment.armor?.name || "None"}`);
  }

  gainXP(amount) {
    this.xp += amount;
    const neededXP = this.level * 20;
    if (this.xp >= neededXP) {
      this.level++;
      this.xp = 0;
      this.str += 2;
      this.vit += 2;
      this.maxHp = this.vit * 10;
      this.hp = this.maxHp;
      console.log(`🎉 ${this.name} leveled up! Now level ${this.level}!`);
      console.log(`💪 Stats increased! HP fully restored!`);
    }
  }

  rest() {
    this.hp = this.maxHp;
    console.log("😴 You rest and recover to full HP.");
  }
}

class Enemy extends Character {
  constructor(name, level) {
    super(name, level + 3, level + 2, level + 1, 3, 2);
    this.level = level;
    this.hp = this.vit * 8;
    this.maxHp = this.hp;
  }

  dropLoot() {
    const lootTable = [
      new Item("Health Potion", "potion", { hp: 30 }, 20),
      new Item("Greater Health Potion", "potion", { hp: 50 }, 40),
      new Item("Steel Sword", "weapon", { str: 5 }, 50),
      new Item("Battle Axe", "weapon", { str: 7 }, 75),
      new Item("Legendary Blade", "weapon", { str: 10 }, 150),
      new Item("Iron Armor", "armor", { vit: 4 }, 45),
      new Item("Steel Plate", "armor", { vit: 6 }, 70),
      new Item("Dragon Scale Armor", "armor", { vit: 9 }, 120),
      new Item("Leather Gloves", "armor", { vit: 2 }, 25),
      new Item("Knight's Shield", "armor", { vit: 5 }, 60),
    ];

    const gold = randomInt(10 + this.level * 5, 30 + this.level * 10);
    const dropChance = Math.random();
    let item = null;

    if (dropChance > 0.7) {
      const maxRarity = Math.min(this.level, lootTable.length - 1);
      item = lootTable[randomInt(0, maxRarity)];
    }

    return { item, gold };
  }
}

class MapZone {
  constructor(id, name, minLevel, maxLevel, requiredLevel, story, encounters) {
    this.id = id;
    this.name = name;
    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
    this.requiredLevel = requiredLevel;
    this.story = story;
    this.encounters = encounters;
    this.completed = false;
  }
}

const maps = [
  new MapZone(
    1,
    "🌲 Greenwood Forest",
    1,
    3,
    1,
    "You enter a lush forest crawling with goblins.",
    ["Goblin", "Wild Wolf", "Forest Bandit"],
  ),
  new MapZone(
    2,
    "🔥 Crimson Plains",
    4,
    6,
    4,
    "A scorched land filled with bandits and fire wolves.",
    ["Fire Wolf", "Bandit", "Ember Spirit"],
  ),
  new MapZone(
    3,
    "🏰 Dark Citadel",
    7,
    10,
    7,
    "A cursed fortress, home of the Dark Lord.",
    ["Dark Knight", "Shadow Beast", "Dark Lord"],
  ),
];

const heroClasses = [
  new Hero("Ranger", 10, 15, 12, 8, 6),
  new Hero("Assassin", 12, 18, 10, 6, 7),
  new Hero("Warlock", 8, 10, 14, 12, 9),
  new Hero("Mage", 6, 8, 10, 16, 11),
];

async function useInventoryItem(hero) {
  if (hero.inventory.items.length === 0) {
    clearScreen();
    hero.inventory.showInventory();
    console.log("\nPress any key to continue...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
    return;
  }

  const itemOptions = hero.inventory.items.map((item, i) => {
    let details = "";
    if (item.type === "weapon" && item.effect.str)
      details = `+${item.effect.str} STR`;
    else if (item.type === "armor" && item.effect.vit)
      details = `+${item.effect.vit} VIT`;
    else if (item.type === "potion" && item.effect.hp)
      details = `+${item.effect.hp} HP`;
    return `${item.name} (${item.type}) ${details}`;
  });
  itemOptions.push("← Back");

  const title = `📦 Inventory (Gold: ${hero.inventory.gold})\nSelect item to use/equip:`;
  const choice = await arrowMenu(itemOptions, title);

  if (choice === itemOptions.length - 1) return;

  const item = hero.inventory.items[choice];

  if (item.type === "potion") {
    clearScreen();
    if (hero.hp >= hero.maxHp) {
      console.log("❌ HP is already full!");
    } else {
      hero.useItem(item);
    }
    console.log("\nPress any key to continue...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
  } else if (item.type === "weapon" || item.type === "armor") {
    const action = await arrowMenu(
      ["Equip", "Cancel"],
      `Selected: ${item.name}`,
    );
    if (action === 0) {
      clearScreen();
      hero.equipItem(item);
      console.log("\nPress any key to continue...");
      await new Promise((resolve) => {
        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          resolve();
        };
        process.stdin.once("keypress", handler);
      });
    }
  }
}

async function shop(hero) {
  const shopItems = [
    new Item("Health Potion", "potion", { hp: 30 }, 20),
    new Item("Greater Health Potion", "potion", { hp: 50 }, 40),
    new Item("Steel Sword", "weapon", { str: 5 }, 50),
    new Item("Battle Axe", "weapon", { str: 7 }, 75),
    new Item("Iron Armor", "armor", { vit: 4 }, 45),
    new Item("Steel Plate", "armor", { vit: 6 }, 70),
  ];

  while (true) {
    const shopOptions = shopItems.map((item) => {
      let details = "";
      if (item.effect.str) details = `+${item.effect.str} STR`;
      if (item.effect.vit) details = `+${item.effect.vit} VIT`;
      if (item.effect.hp) details = `+${item.effect.hp} HP`;
      return `${item.name} - ${item.value}g ${details}`;
    });
    shopOptions.push("← Exit Shop");

    const title = `🏪 SHOP\n💰 Your Gold: ${hero.inventory.gold}`;
    const choice = await arrowMenu(shopOptions, title);

    if (choice === shopOptions.length - 1) break;

    const item = shopItems[choice];
    if (hero.inventory.gold >= item.value) {
      hero.inventory.gold -= item.value;
      hero.inventory.addItem(
        new Item(item.name, item.type, item.effect, item.value),
      );
      clearScreen();
      console.log(`✅ Purchased ${item.name}!`);
    } else {
      clearScreen();
      console.log("❌ Not enough gold!");
    }

    console.log("\nPress any key to continue...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
  }
}

async function battle(hero, mapZone) {
  const enemyLevel = randomInt(mapZone.minLevel, mapZone.maxLevel);
  const enemyName =
    mapZone.encounters[randomInt(0, mapZone.encounters.length - 1)];
  const enemy = new Enemy(enemyName, enemyLevel);

  while (hero.hp > 0 && enemy.hp > 0) {
    const battleOptions = ["⚔️  Attack", "🛡️  Defend", "💚 Use Item", "🏃 Run"];

    const title = `⚔️  Battle: ${enemy.name} (Lv ${enemy.level})\n💚 Your HP: ${hero.hp}/${hero.maxHp} | 💀 Enemy HP: ${enemy.hp}/${enemy.maxHp}`;
    const action = await arrowMenu(battleOptions, title);

    if (action === 0) {
      const dmg = randomInt(
        hero.getTotalStat("str"),
        hero.getTotalStat("str") + 5,
      );
      enemy.hp -= dmg;
      clearScreen();
      console.log(`🗡️ You hit ${enemy.name} for ${dmg} damage!`);

      if (Math.random() > 0.8) {
        console.log("💥 Critical hit!");
        enemy.hp -= 5;
      }
    } else if (action === 1) {
      clearScreen();
      console.log("🛡️ You brace for an attack...");
      const dmg = Math.floor(randomInt(enemy.str / 3, enemy.str / 2));
      hero.hp -= Math.max(0, dmg);
      console.log(`Reduced damage to ${dmg}!`);

      console.log("\nPress any key to continue...");
      await new Promise((resolve) => {
        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          resolve();
        };
        process.stdin.once("keypress", handler);
      });
      continue;
    } else if (action === 2) {
      await useInventoryItem(hero);
      continue;
    } else if (action === 3) {
      if (Math.random() > 0.5) {
        clearScreen();
        console.log("🏃 You fled the battle!");
        console.log("\nPress any key to continue...");
        await new Promise((resolve) => {
          const handler = () => {
            process.stdin.removeListener("keypress", handler);
            resolve();
          };
          process.stdin.once("keypress", handler);
        });
        return false;
      } else {
        clearScreen();
        console.log("❌ Couldn't escape!");
      }
    }

    if (enemy.hp > 0) {
      const enemyDmg = randomInt(enemy.str / 2, enemy.str);
      hero.hp -= enemyDmg;
      console.log(`💥 ${enemy.name} hits you for ${enemyDmg} damage!`);
    }

    console.log("\nPress any key to continue...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
  }

  if (hero.hp <= 0) {
    clearScreen();
    console.log("\n💀 You were defeated...");
    console.log("Game Over.");
    console.log("\nPress any key to exit...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
    close();
  } else {
    clearScreen();
    console.log(`\n🏆 You defeated ${enemy.name}!`);
    const xpGain = randomInt(15, 25) * enemyLevel;
    hero.gainXP(xpGain);
    console.log(`✨ You gained ${xpGain} XP!`);

    const loot = enemy.dropLoot();
    hero.inventory.gold += loot.gold;
    console.log(`💰 Found ${loot.gold} gold!`);
    if (loot.item) {
      hero.inventory.addItem(loot.item);
    }

    console.log("\nPress any key to continue...");
    await new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("keypress", handler);
        resolve();
      };
      process.stdin.once("keypress", handler);
    });
    return true;
  }
}

async function exploreMap(hero, mapZone) {
  clearScreen();
  console.log(`\n📖 ${mapZone.story}`);
  console.log(`Entering ${mapZone.name}...`);
  console.log("\nPress any key to continue...");
  await new Promise((resolve) => {
    const handler = () => {
      process.stdin.removeListener("keypress", handler);
      resolve();
    };
    process.stdin.once("keypress", handler);
  });

  let battlesWon = 0;
  const battlesNeeded = 3;

  while (battlesWon < battlesNeeded) {
    const exploreOptions = [
      "🗡️  Continue exploring",
      "😴 Rest",
      "← Return to map selection",
    ];

    const title = `🗺️ Exploring ${mapZone.name}\nProgress: ${battlesWon}/${battlesNeeded} encounters`;
    const choice = await arrowMenu(exploreOptions, title);

    if (choice === 0) {
      const won = await battle(hero, mapZone);
      if (won) battlesWon++;
    } else if (choice === 1) {
      clearScreen();
      hero.rest();
      console.log("\nPress any key to continue...");
      await new Promise((resolve) => {
        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          resolve();
        };
        process.stdin.once("keypress", handler);
      });
    } else if (choice === 2) {
      return;
    }
  }

  mapZone.completed = true;
  clearScreen();
  console.log(`\n🎊 You have completed ${mapZone.name}!`);
  hero.inventory.gold += 100;
  console.log("💰 Bonus reward: 100 gold!");

  console.log("\nPress any key to continue...");
  await new Promise((resolve) => {
    const handler = () => {
      process.stdin.removeListener("keypress", handler);
      resolve();
    };
    process.stdin.once("keypress", handler);
  });
}

async function main() {
  clearScreen();
  console.log("═══════════════════════════════════");
  console.log("⚔️  REALM OF SHADOWS - RPG ADVENTURE");
  console.log("═══════════════════════════════════\n");

  const heroOptions = [
    "Ranger - Balanced fighter",
    "Assassin - High damage, low defense",
    "Warlock - Magic focused",
    "Mage - Pure magic",
  ];

  const choice = await arrowMenu(
    heroOptions,
    "Welcome, adventurer!\nChoose your hero:",
  );
  const hero = heroClasses[choice];

  clearScreen();
  console.log(`\n✨ You have chosen ${hero.name}!`);
  console.log("Your journey begins...\n");
  console.log("Press any key to continue...");
  await new Promise((resolve) => {
    const handler = () => {
      process.stdin.removeListener("keypress", handler);
      resolve();
    };
    process.stdin.once("keypress", handler);
  });

  while (true) {
    const mapOptions = [];

    for (const zone of maps) {
      const lock =
        hero.level < zone.requiredLevel ? "🔒" : zone.completed ? "✅" : "🗺️";
      mapOptions.push(
        `${lock} ${zone.name} (Lv ${zone.minLevel}-${zone.maxLevel})`,
      );
    }

    mapOptions.push("");
    mapOptions.push("📊 View Stats");
    mapOptions.push("📦 Inventory");
    mapOptions.push("😴 Rest (Restore HP)");
    mapOptions.push("🏪 Shop");
    mapOptions.push("🚪 Exit Game");

    const title =
      "═══════════════════════════════════\n🗺️  WORLD MAP\n═══════════════════════════════════";
    const mapChoice = await arrowMenu(mapOptions, title);

    if (mapChoice < maps.length) {
      const mapZone = maps[mapChoice];

      if (hero.level < mapZone.requiredLevel) {
        clearScreen();
        console.log(
          `🚫 You need to be level ${mapZone.requiredLevel} to enter this map.`,
        );
        console.log("\nPress any key to continue...");
        await new Promise((resolve) => {
          const handler = () => {
            process.stdin.removeListener("keypress", handler);
            resolve();
          };
          process.stdin.once("keypress", handler);
        });
        continue;
      }

      await exploreMap(hero, mapZone);
    } else if (mapChoice === maps.length + 1) {
      clearScreen();
      hero.showStats();
      console.log("\nPress any key to continue...");
      await new Promise((resolve) => {
        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          resolve();
        };
        process.stdin.once("keypress", handler);
      });
    } else if (mapChoice === maps.length + 2) {
      await useInventoryItem(hero);
    } else if (mapChoice === maps.length + 3) {
      clearScreen();
      hero.rest();
      console.log("\nPress any key to continue...");
      await new Promise((resolve) => {
        const handler = () => {
          process.stdin.removeListener("keypress", handler);
          resolve();
        };
        process.stdin.once("keypress", handler);
      });
    } else if (mapChoice === maps.length + 4) {
      await shop(hero);
    } else if (mapChoice === maps.length + 5) {
      break;
    }
  }

  clearScreen();
  console.log("\n═══════════════════════════════════");
  console.log("Thanks for playing! 🎮");
  console.log("═══════════════════════════════════");
  close();
}

main();
