Here's the fixed version with added closing brackets:

import { AoSGameData } from '../types/AoSCollection';

export const aosGameData: AoSGameData = {
  edition: "4th Edition",
  coreRules: [
    {
      name: "Command Phase",
      description: "Gain command points and use command abilities",
      category: "core"
    },
    {
      name: "Movement Phase", 
      description: "Move units across the battlefield",
      category: "core"
    },
    {
      name: "Shooting Phase",
      description: "Attack with ranged weapons",
      category: "core"
    },
    {
      name: "Charge Phase",
      description: "Charge into combat",
      category: "core"
    },
    {
      name: "Combat Phase",
      description: "Fight in melee combat",
      category: "core"
    }
  ],
  battlepacks: [
    {
      id: "spearhead",
      name: "Spearhead",
      description: "Fast-paced games with pre-built armies",
      battleformations: ["Stormcast Eternals", "Maggotkin of Nurgle"],
      rules: [
        {
          name: "Spearhead Deployment",
          description: "Deploy within 9 inches of your edge",
          category: "battlepack"
        }
      ]
    }
  ],
  allegianceGroups: {
    order: {
      name: "Order",
      description: "Zivilisation, Gerechtigkeit und Ordnung",
      color: "blue",
      icon: "shield",
      armies: ["stormcast-eternals", "cities-of-sigmar", "daughters-of-khaine", "fyreslayers", "idoneth-deepkin", "kharadron-overlords", "lumineth-realm-lords", "seraphon", "sylvaneth"]
    },
    chaos: {
      name: "Chaos",
      description: "Zerstörung, Korruption und Anarchie", 
      color: "red",
      icon: "zap",
      armies: ["blades-of-khorne", "disciples-of-tzeentch", "hedonites-of-slaanesh", "maggotkin-of-nurgle", "skaven", "slaves-to-darkness", "beasts-of-chaos"]
    },
    death: {
      name: "Death",
      description: "Untod, Nekromantie und ewige Ruhe",
      color: "purple",
      icon: "skull",
      armies: ["flesh-eater-courts", "nighthaunt", "ossiarch-bonereapers", "soulblight-gravelords"]
    },
    destruction: {
      name: "Destruction",
      description: "Wilde Kraft, Chaos und Zerstörung",
      color: "green",
      icon: "mountain",
      armies: ["gloomspite-gitz", "ironjawz", "kruleboyz", "ogor-mawtribes", "orruk-warclans", "sons-of-behemat"]
    }
  },
  armies: [
    // All army entries...
  ],
  universalSpells: [
    "Arcane Bolt",
    "Mystic Shield", 
    "Dispel"
  ],
  universalPrayers: [
    "Heal",
    "Curse"
  ],
  terrainRules: [
    {
      name: "Defensible Terrain",
      description: "Provides cover and defensive bonuses",
      category: "core"
    }
  ]
};