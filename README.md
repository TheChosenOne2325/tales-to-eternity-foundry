# Tales To Eternity

Tales To Eternity is a tabletop RPG system that seeks a balance between complexity and simplicity, so that everything works as well as possible. It also standardizes many rules and mechanics to make future content easier to create.

This repository holds the system for Foundry VTT: character and monster sheets, compendiums, and the automation of the rules.

## Books

| Source | Book | |
|---|---|---|
| FTC | Fragments Of The Cosmos | Player's Book |
| COC | Creation Of The Cosmos | Game Master's Book |
| ROC | Rupture Of The Cosmos | Monster Book |

## What's inside

- **Character sheet:** attributes, skills, Life and Wounds, conditions, affinities, inventory with containers and load, spells and features. Edit mode with the pen button.
- **Character creator and level up:** race, class, attributes, skills, spells and starting equipment, then the choices of each new level.
- **Monster sheet:** pick any Level (1 to 12) and Role (Minion, Standard, Elite, or Boss) and the attributes, Life, Defense, damage and ability texts adjust on their own. The power points show live.
- **Encounter Builder:** a button in the Actors sidebar (Game Master only). Drag monsters in, set their Level, Role and quantity, and see the points, difficulty and XP. It can create all the monsters as actors.
- **Compendiums:** Races, Classes, Spells, Items, Monsters and Monster Abilities.
- **Automation:**
  - Attacks check hit and critical against each target. Damage is rolled with the card's button and applied with affinities.
  - Spells charge Mana and roll the targets' Tests.
  - Conditions and timed effects end on their own.
  - Reactions ask the right creature when they apply.
  - Class features and monster abilities run their Tests and effects.

## How to install

Copy the `tales-to-eternity` folder into Foundry's `Data/systems/` folder and restart Foundry. It needs Foundry VTT 13 or newer (verified on 14).

To update, extract the update zip over the folder, replacing the files. If the update has compendiums (`packs/`), close Foundry first and delete those pack folders before extracting. If `system.json` changed, restart Foundry fully.

## Versions

The version number is **X.Y**: X goes up with big changes (like a new book), and Y goes up with corrections. Each version is a tag in this repository.

Current version: **1.0**

## Credits

Icons by Lorc, Delapouite and the other contributors of [game-icons.net](https://game-icons.net), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Colors and backgrounds were adapted for Tales To Eternity.
