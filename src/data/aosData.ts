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
    // ORDER ARMIES
    {
      id: "stormcast-eternals",
      name: "Stormcast Eternals",
      description: "Sigmars unsterbliche Krieger aus Azyr",
      allegiance: "Order",
      battleTraits: ["Scions of the Storm", "Thunderstrike"],
      commandTraits: ["Heroic Stature", "Master of Magic"],
      artefacts: ["Dracothion's Talisman", "Obsidian Blade"],
      spells: ["Lightning Blast", "Celestial Blades"],
      units: [
        {
          id: "lord-imperatant",
          name: "Lord-Imperatant",
          points: 140,
          move: "5\"",
          health: 6,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Astral Hammers",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Lightning-fast Strikes", "Astral Teleportation"],
          keywords: ["Hero", "Stormcast Eternals", "Order"],
          unitSize: "1",
          stlFiles: [
            { name: "lord_imperatant.stl", size: "25.4 MB" },
            { name: "gryph_hound.stl", size: "12.1 MB" }
          ],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
          printNotes: "Drucke mit 0.2mm Schichthöhe für beste Details"
        },
        {
          id: "liberators",
          name: "Liberators",
          points: 120,
          move: "5\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Warhammer",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Warblades",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Shield Wall", "Lay Low the Tyrants"],
          keywords: ["Battleline", "Stormcast Eternals", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [
            { name: "liberator_warhammer.stl", size: "18.3 MB", variant: "Warhammer" },
            { name: "liberator_warblades.stl", size: "17.8 MB", variant: "Warblades" },
            { name: "liberator_prime.stl", size: "19.1 MB", variant: "Prime" }
          ],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "vindictors",
          name: "Vindictors",
          points: 130,
          move: "5\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Stormspear",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Shield Wall", "Spear Phalanx"],
          keywords: ["Battleline", "Stormcast Eternals", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "lord-celestant",
          name: "Lord-Celestant",
          points: 155,
          move: "5\"",
          health: 7,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Runeblade",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Inescapable Vengeance", "Lord of the Host"],
          keywords: ["Hero", "Stormcast Eternals", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "knight-incantor",
          name: "Knight-Incantor",
          points: 125,
          move: "5\"",
          health: 5,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Incantor's Staff",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Spirit Storm"],
          keywords: ["Hero", "Wizard", "Stormcast Eternals", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "retributors",
          name: "Retributors",
          points: 170,
          move: "4\"",
          health: 3,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Lightning Hammer",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Blast to Ashes", "Starsoul Mace"],
          keywords: ["Stormcast Eternals", "Order"],
          unitSize: "3",
          reinforcement: "2",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "prosecutors",
          name: "Prosecutors",
          points: 115,
          move: "12\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Celestial Hammers",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Stormsurge Trident",
              range: "18\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Fly", "Herald on High"],
          keywords: ["Fly", "Stormcast Eternals", "Order"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "lord-aquilor",
          name: "Lord-Aquilor",
          points: 180,
          move: "12\"",
          health: 7,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Starbound Blade",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            },
            {
              name: "Shock Handaxe",
              range: "12\"",
              attacks: "1",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Fly", "Ride the Winds Aetheric"],
          keywords: ["Hero", "Fly", "Stormcast Eternals", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Stormcast Eternals sind Sigmars auserwählte Krieger, wiedergeboren in Azyr.",
      playstyle: "Elite-Armee mit starken Einzelkämpfern und magischer Unterstützung"
    },
    {
      id: "cities-of-sigmar",
      name: "Cities of Sigmar",
      description: "Die großen Städte der Zivilisation",
      allegiance: "Order",
      battleTraits: ["Fortress City", "Unity of Purpose"],
      commandTraits: ["Strategic Genius", "Inspiring Presence"],
      artefacts: ["Runic Weapon", "Armour of Destiny"],
      units: [
        {
          id: "freeguild-general",
          name: "Freeguild General",
          points: 115,
          move: "5\"",
          health: 5,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "General's Weapon",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Hold the Line", "Inspiring Presence"],
          keywords: ["Hero", "Human", "Cities of Sigmar", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "freeguild-guard",
          name: "Freeguild Guard",
          points: 110,
          move: "5\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Freeguild Spear",
              range: "2\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Disciplined Formation", "Shield Wall"],
          keywords: ["Battleline", "Human", "Cities of Sigmar", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "freeguild-crossbowmen",
          name: "Freeguild Crossbowmen",
          points: 120,
          move: "5\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Freeguild Crossbow",
              range: "16\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Reload, Fire!", "Aimed Shot"],
          keywords: ["Human", "Cities of Sigmar", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "battlemage",
          name: "Battlemage",
          points: 105,
          move: "5\"",
          health: 4,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Wizard's Staff",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Elemental Blast"],
          keywords: ["Hero", "Wizard", "Human", "Cities of Sigmar", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "demigryph-knights",
          name: "Demigryph Knights",
          points: 180,
          move: "8\"",
          health: 4,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Cavalry Lance",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Demigryph Claws",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Charge", "Savage Ferocity"],
          keywords: ["Cavalry", "Human", "Cities of Sigmar", "Order"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Cities of Sigmar sind Bastionen der Zivilisation in den Mortal Realms.",
      playstyle: "Ausgewogene Armee mit starker Fernkampfunterstützung"
    },
    {
      id: "daughters-of-khaine",
      name: "Daughters of Khaine",
      description: "Khaines blutige Töchter",
      allegiance: "Order",
      battleTraits: ["Blood Rites", "Fanatical Faith"],
      commandTraits: ["Bathed in Blood", "Zealous Orator"],
      artefacts: ["Crown of Woe", "Crimson Shard"],
      units: [
        {
          id: "morathi",
          name: "Morathi",
          points: 680,
          move: "6\"",
          health: 12,
          save: "3+",
          control: 4,
          weapons: [
            {
              name: "Heartrender",
              range: "1\"",
              attacks: "6",
              hit: "3+",
              wound: "3+",
              rend: "-2",
              damage: "2"
            }
          ],
          abilities: ["Wizard (3)", "The Shadow Queen", "Commanding Presence"],
          keywords: ["Unique", "Hero", "Wizard", "Monster", "Daughters of Khaine", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "witch-aelves",
          name: "Witch Aelves",
          points: 120,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Paired Sciansá",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Frenzied Fervour", "Bladed Bucklers"],
          keywords: ["Battleline", "Aelf", "Daughters of Khaine", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "sisters-of-slaughter",
          name: "Sisters of Slaughter",
          points: 130,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Barbed Whip",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Dance of Death", "Serpentine Grace"],
          keywords: ["Battleline", "Aelf", "Daughters of Khaine", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "blood-sisters",
          name: "Blood Sisters",
          points: 140,
          move: "6\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Crystal Touch",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Turned to Crystal", "Gorgai"],
          keywords: ["Aelf", "Daughters of Khaine", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "hag-queen",
          name: "Hag Queen",
          points: 105,
          move: "6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Blade of Khaine",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Priestess", "Witchbrew"],
          keywords: ["Hero", "Priest", "Aelf", "Daughters of Khaine", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Daughters of Khaine verehren den Gott des Mordes durch Blut und Opfer.",
      playstyle: "Schnelle, aggressive Nahkampfarmee mit starken Buffs"
    },
    {
      id: "fyreslayers",
      name: "Fyreslayers",
      description: "Duardin-Krieger auf der Suche nach Ur-Gold",
      allegiance: "Order",
      battleTraits: ["Ur-Gold Runes", "Fierce Loyalty"],
      commandTraits: ["Spirit of Grimnir", "Warrior Indominate"],
      artefacts: ["Axe of Grimnir", "Draught of Magmadroth Ale"],
      units: [
        {
          id: "runefather",
          name: "Runefather",
          points: 110,
          move: "4\"",
          health: 6,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Latchkey Grandaxe",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Lodge Leader", "Oathbound Guardian"],
          keywords: ["Hero", "Duardin", "Fyreslayers", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "vulkite-berzerkers",
          name: "Vulkite Berzerkers",
          points: 140,
          move: "4\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Fyresteel Handaxe",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Berserk Fury", "Fyresteel Weapons"],
          keywords: ["Battleline", "Duardin", "Fyreslayers", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "hearthguard-berzerkers",
          name: "Hearthguard Berzerkers",
          points: 170,
          move: "4\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Berzerker Broadaxe",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Duty Unto Death", "Smouldering Braziers"],
          keywords: ["Duardin", "Fyreslayers", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "auric-runemaster",
          name: "Auric Runemaster",
          points: 120,
          move: "4\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Runic Iron",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Priest", "Forgefire"],
          keywords: ["Hero", "Priest", "Duardin", "Fyreslayers", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "magmadroth",
          name: "Magmadroth",
          points: 270,
          move: "8\"",
          health: 14,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Claws and Horns",
              range: "2\"",
              attacks: "4",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "3"
            },
            {
              name: "Roaring Fyrestream",
              range: "10\"",
              attacks: "D6",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Lashing Tail", "Volcanic Blood"],
          keywords: ["Monster", "Duardin", "Fyreslayers", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Fyreslayers sind Duardin-Krieger, die das Ur-Gold ihres toten Gottes Grimnir suchen.",
      playstyle: "Robuste Nahkampfarmee mit starken Monstern"
    },
    {
      id: "idoneth-deepkin",
      name: "Idoneth Deepkin",
      description: "Geheimnisvolle Meeresaelfen",
      allegiance: "Order",
      battleTraits: ["Tides of Death", "Forgotten Nightmares"],
      commandTraits: ["Merciless Raider", "Hunter of Souls"],
      artefacts: ["Coral Blade", "Abyssal Blade"],
      units: [
        {
          id: "eidolon-of-mathlann",
          name: "Eidolon of Mathlann",
          points: 380,
          move: "8\"",
          health: 12,
          save: "3+",
          control: 4,
          weapons: [
            {
              name: "Fuathtar",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "3"
            }
          ],
          abilities: ["Wizard (2)", "Aspect of the Sea", "Stormshoal"],
          keywords: ["Hero", "Wizard", "Monster", "Aelf", "Idoneth Deepkin", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "namarti-thralls",
          name: "Namarti Thralls",
          points: 130,
          move: "6\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Lanmari",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Swept Along", "Void Drum"],
          keywords: ["Battleline", "Aelf", "Namarti", "Idoneth Deepkin", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "namarti-reavers",
          name: "Namarti Reavers",
          points: 120,
          move: "6\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Keening Blade",
              range: "1\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Whisperbow",
              range: "18\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Swift Tide", "Fluid Form"],
          keywords: ["Aelf", "Namarti", "Idoneth Deepkin", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "akhelian-king",
          name: "Akhelian King",
          points: 230,
          move: "14\"",
          health: 8,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Bladed Polearm",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Akhelian Paragon", "Wave Rider"],
          keywords: ["Hero", "Aelf", "Akhelian", "Idoneth Deepkin", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "akhelian-guard",
          name: "Akhelian Guard",
          points: 140,
          move: "14\"",
          health: 4,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Voltspear",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Biovoltaic Blast", "Deepmare Charge"],
          keywords: ["Aelf", "Akhelian", "Idoneth Deepkin", "Order"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Idoneth Deepkin sind geheimnisvolle Meeresaelfen, die Seelen ernten.",
      playstyle: "Mobile Armee mit starken Kavallerie-Einheiten"
    },
    {
      id: "kharadron-overlords",
      name: "Kharadron Overlords",
      description: "Himmelfahrende Duardin-Händler",
      allegiance: "Order",
      battleTraits: ["Skyports", "Aether-Gold"],
      commandTraits: ["Master Commander", "Grudgebearer"],
      artefacts: ["Aethersight Loupe", "Rune of Mark"],
      units: [
        {
          id: "admiral",
          name: "Admiral",
          points: 130,
          move: "4\"",
          health: 6,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Aethermatic Saw",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Master of the Skies", "If You Want a Job Done..."],
          keywords: ["Hero", "Duardin", "Skyvessel", "Kharadron Overlords", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "arkanaut-company",
          name: "Arkanaut Company",
          points: 130,
          move: "4\"",
          health: 1,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Privateer Pistol",
              range: "12\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Arkanaut Cutter",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Glory-seekers", "Tough as Old Boots"],
          keywords: ["Battleline", "Duardin", "Kharadron Overlords", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "grundstok-thunderers",
          name: "Grundstok Thunderers",
          points: 120,
          move: "4\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Aethershot Rifle",
              range: "18\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Choking Fug", "Pin Them Down"],
          keywords: ["Duardin", "Kharadron Overlords", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "endrinmaster",
          name: "Endrinmaster",
          points: 100,
          move: "4\"",
          health: 5,
          save: "3+",
          control: 1,
          weapons: [
            {
              name: "Aethermatic Saw",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Emergency Repairs", "Endrincraft"],
          keywords: ["Hero", "Duardin", "Kharadron Overlords", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "arkanaut-frigate",
          name: "Arkanaut Frigate",
          points: 250,
          move: "12\"",
          health: 12,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Heavy Sky Cannon",
              range: "24\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Fly", "Transport", "Bomb Racks"],
          keywords: ["War Machine", "Fly", "Duardin", "Skyvessel", "Kharadron Overlords", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Kharadron Overlords sind Duardin-Händler, die die Himmel mit ihren Luftschiffen beherrschen.",
      playstyle: "Fernkampf-fokussierte Armee mit fliegenden Einheiten"
    },
    {
      id: "lumineth-realm-lords",
      name: "Lumineth Realm-Lords",
      description: "Erleuchtete Aelfen der Hysh",
      allegiance: "Order",
      battleTraits: ["Aetherquartz Reserve", "Shining Company"],
      commandTraits: ["Loremaster", "Grand Strategist"],
      artefacts: ["Sword of Judgement", "Waystone"],
      units: [
        {
          id: "teclis",
          name: "Teclis",
          points: 660,
          move: "6\"",
          health: 12,
          save: "4+",
          control: 4,
          weapons: [
            {
              name: "Sword of Teclis",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (4)", "Archmage", "Protection of Teclis"],
          keywords: ["Unique", "Hero", "Wizard", "Monster", "Aelf", "Lumineth Realm-Lords", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "vanari-auralan-wardens",
          name: "Vanari Auralan Wardens",
          points: 120,
          move: "6\"",
          health: 1,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Moonfire Spear",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Sunmetal Weapons", "Wall of Blades"],
          keywords: ["Battleline", "Aelf", "Vanari", "Lumineth Realm-Lords", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "vanari-auralan-sentinels",
          name: "Vanari Auralan Sentinels",
          points: 140,
          move: "6\"",
          health: 1,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Auralan Bow",
              range: "18\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Sunmetal Weapons", "Many-stringed Weapon"],
          keywords: ["Aelf", "Vanari", "Lumineth Realm-Lords", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "scinari-cathallar",
          name: "Scinari Cathallar",
          points: 140,
          move: "6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Despairing Touch",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Emotional Transference", "Darkness of the Soul"],
          keywords: ["Hero", "Wizard", "Aelf", "Scinari", "Lumineth Realm-Lords", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "alarith-stoneguard",
          name: "Alarith Stoneguard",
          points: 100,
          move: "4\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Stone Mallet",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Crushing Blow", "Stonemage Symbiosis"],
          keywords: ["Aelf", "Alarith", "Lumineth Realm-Lords", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Lumineth Realm-Lords sind erleuchtete Aelfen, die die Macht des Lichts nutzen.",
      playstyle: "Magisch fokussierte Elite-Armee mit starken Fernkampfoptionen"
    },
    {
      id: "seraphon",
      name: "Seraphon",
      description: "Sternengeborene Echsenwesen",
      allegiance: "Order",
      battleTraits: ["Lords of Space and Time", "Celestial Conjuration"],
      commandTraits: ["Great Rememberer", "Vast Intellect"],
      artefacts: ["Incandescent Rectrices", "Blade of Realities"],
      units: [
        {
          id: "slann-starmaster",
          name: "Slann Starmaster",
          points: 265,
          move: "5\"",
          health: 7,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Azure Lightning",
              range: "18\"",
              attacks: "D6",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (3)", "Masters of Order", "Contemplation of Azyr"],
          keywords: ["Hero", "Wizard", "Slann", "Seraphon", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "saurus-warriors",
          name: "Saurus Warriors",
          points: 90,
          move: "5\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Celestite Weapon",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Ordered Cohort", "Stardrake Icon"],
          keywords: ["Battleline", "Saurus", "Seraphon", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "skinks",
          name: "Skinks",
          points: 75,
          move: "8\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Meteoric Javelin",
              range: "8\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Moonstone Club",
              range: "1\"",
              attacks: "1",
              hit: "5+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Nimble", "Skirmishers"],
          keywords: ["Skinks", "Seraphon", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "saurus-oldblood",
          name: "Saurus Oldblood",
          points: 110,
          move: "5\"",
          health: 7,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Celestite Greatblade",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Wrath of the Seraphon", "Paragon of Order"],
          keywords: ["Hero", "Saurus", "Seraphon", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "carnosaur",
          name: "Carnosaur",
          points: 230,
          move: "8\"",
          health: 14,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Massive Jaws",
              range: "2\"",
              attacks: "3",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "3"
            },
            {
              name: "Clawed Forelimbs",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Blood Frenzy", "Pinned Down"],
          keywords: ["Monster", "Saurus", "Seraphon", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Seraphon sind sternengeborene Echsenwesen, die die Ordnung des Universums bewahren.",
      playstyle: "Vielseitige Armee mit starken Monstern und mächtiger Magie"
    },
    {
      id: "sylvaneth",
      name: "Sylvaneth",
      description: "Waldgeister und Baumhirten",
      allegiance: "Order",
      battleTraits: ["Forest Spirits", "Walk the Hidden Paths"],
      commandTraits: ["Gnarled Warrior", "Wisdom of the Ancients"],
      artefacts: ["Daith's Reaper", "The Oaken Armour"],
      units: [
        {
          id: "alarielle",
          name: "Alarielle the Everqueen",
          points: 600,
          move: "16\"",
          health: 16,
          save: "3+",
          control: 5,
          weapons: [
            {
              name: "Talon of Dwindling",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            }
          ],
          abilities: ["Wizard (3)", "Metamorphosis", "Ghyran's Wrath"],
          keywords: ["Unique", "Hero", "Wizard", "Monster", "Sylvaneth", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "dryads",
          name: "Dryads",
          points: 100,
          move: "7\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Wracking Talons",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Blessings of the Forest", "Enrapturing Song"],
          keywords: ["Battleline", "Sylvaneth", "Order"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "tree-revenants",
          name: "Tree-Revenants",
          points: 80,
          move: "7\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Enchanted Blade",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Martial Memories", "Waypipes"],
          keywords: ["Sylvaneth", "Order"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "branchwych",
          name: "Branchwych",
          points: 120,
          move: "7\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Greenwood Scythe",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Deadly Harvest", "Quick-tempered"],
          keywords: ["Hero", "Wizard", "Sylvaneth", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "treelord-ancient",
          name: "Treelord Ancient",
          points: 260,
          move: "6\"",
          health: 12,
          save: "3+",
          control: 5,
          weapons: [
            {
              name: "Doom Tendril Staff",
              range: "3\"",
              attacks: "3",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            },
            {
              name: "Sweeping Blows",
              range: "2\"",
              attacks: "3",
              hit: "4+",
              wound: "2+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Wizard (1)", "Spirit Paths", "Groundshaking Stomp"],
          keywords: ["Hero", "Wizard", "Monster", "Sylvaneth", "Order"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Sylvaneth sind Waldgeister, die die natürliche Ordnung der Welt beschützen.",
      playstyle: "Mobile Armee mit starker Magie und Geländekontrolle"
    },

    // CHAOS ARMIES
    {
      id: "blades-of-khorne",
      name: "Blades of Khorne",
      description: "Khorne's blutrünstige Krieger",
      allegiance: "Chaos",
      battleTraits: ["Blood for the Blood God", "Brass Stampede"],
      commandTraits: ["Arch-slaughterer", "Bloodsworn"],
      artefacts: ["Collar of Khorne", "The Crimson Crown"],
      units: [
        {
          id: "khorne-bloodthirster",
          name: "Bloodthirster of Unfettered Fury",
          points: 300,
          move: "12\"",
          health: 14,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Mighty Axe of Khorne",
              range: "2\"",
              attacks: "6",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "3"
            }
          ],
          abilities: ["Fly", "Rage Unbound", "Bloodthirsty Charge"],
          keywords: ["Hero", "Monster", "Fly", "Daemon", "Blades of Khorne", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "bloodreavers",
          name: "Bloodreavers",
          points: 80,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Reaver Blades",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Frenzied Devotion", "Reaver Blades"],
          keywords: ["Battleline", "Mortal", "Blades of Khorne", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "blood-warriors",
          name: "Blood Warriors",
          points: 110,
          move: "5\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Goreaxe",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Frenzied Devotion", "No Respite"],
          keywords: ["Mortal", "Blades of Khorne", "Chaos"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "bloodmaster",
          name: "Bloodmaster",
          points: 90,
          move: "6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Blade of Blood",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["The Slaughter Continues", "Bloodbound"],
          keywords: ["Hero", "Daemon", "Blades of Khorne", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "bloodletters",
          name: "Bloodletters",
          points: 110,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Hellblade",
              range: "1\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Decapitating Blow", "Locus of Fury"],
          keywords: ["Daemon", "Blades of Khorne", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "mighty-skullcrushers",
          name: "Mighty Skullcrushers",
          points: 170,
          move: "9\"",
          health: 5,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Ensorcelled Weapon",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Juggernaut's Bladed Horn",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Brass-clad Shield", "Murderous Charge"],
          keywords: ["Daemon", "Blades of Khorne", "Chaos"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Blades of Khorne leben nur für Krieg und Blutvergießen zu Ehren ihres Gottes.",
      playstyle: "Aggressive Nahkampfarmee mit starken Dämonen"
    },
    {
      id: "disciples-of-tzeentch",
      name: "Disciples of Tzeentch",
      description: "Tzeentchs wandelbare Diener",
      allegiance: "Chaos",
      battleTraits: ["Destiny Dice", "Masters of Destiny"],
      commandTraits: ["Arch-sorcerer", "Nexus of Fate"],
      artefacts: ["Warpfire Blade", "Changeblade"],
      units: [
        {
          id: "lord-of-change",
          name: "Lord of Change",
          points: 420,
          move: "12\"",
          health: 14,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Baleful Sword",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            },
            {
              name: "Staff of Tzeentch",
              range: "18\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (2)", "Fly", "Spell-thief", "Master of Magic"],
          keywords: ["Hero", "Wizard", "Monster", "Fly", "Daemon", "Disciples of Tzeentch", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "tzaangors",
          name: "Tzaangors",
          points: 150,
          move: "6\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Paired Savage Blade",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Arcanite Shield", "Savagery Unleashed"],
          keywords: ["Battleline", "Gor", "Arcanite", "Disciples of Tzeentch", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "pink-horrors",
          name: "Pink Horrors",
          points: 120,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Magical Flames",
              range: "18\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Split", "Locus of Conjuration"],
          keywords: ["Wizard", "Daemon", "Disciples of Tzeentch", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "gaunt-summoner",
          name: "Gaunt Summoner",
          points: 240,
          move: "6\"",
          health: 6,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Changestaff",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (2)", "Book of Profane Secrets", "Summon Horrors"],
          keywords: ["Hero", "Wizard", "Mortal", "Disciples of Tzeentch", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "kairic-acolytes",
          name: "Kairic Acolytes",
          points: 110,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Cursed Blade",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Warpflame Pistol",
              range: "9\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Arcanite Shield", "Gestalt Sorcery"],
          keywords: ["Mortal", "Arcanite", "Disciples of Tzeentch", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Disciples of Tzeentch sind Meister der Magie und des Wandels.",
      playstyle: "Magisch fokussierte Armee mit starken Zauberern"
    },
    {
      id: "hedonites-of-slaanesh",
      name: "Hedonites of Slaanesh",
      description: "Slaanesh's verführerische Anhänger",
      allegiance: "Chaos",
      battleTraits: ["Euphoric Killers", "Temptations of Slaanesh"],
      commandTraits: ["Strongest Alone", "Hunter of Godbeasts"],
      artefacts: ["Whip of Subversion", "The Rod of Misrule"],
      units: [
        {
          id: "keeper-of-secrets",
          name: "Keeper of Secrets",
          points: 340,
          move: "10\"",
          health: 14,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Ritual Knife",
              range: "1\"",
              attacks: "6",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            },
            {
              name: "Elegant Greatblade",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-2",
              damage: "3"
            }
          ],
          abilities: ["Wizard (1)", "Excess of Violence", "Sinistrous Hand"],
          keywords: ["Hero", "Wizard", "Monster", "Daemon", "Hedonites of Slaanesh", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "daemonettes",
          name: "Daemonettes",
          points: 110,
          move: "8\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Piercing Claws",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Lithe and Swift", "Locus of Diversion"],
          keywords: ["Battleline", "Daemon", "Hedonites of Slaanesh", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "blissbarb-archers",
          name: "Blissbarb Archers",
          points: 120,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Blissbarb Bow",
              range: "18\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Intoxicating Shots", "Light-footed"],
          keywords: ["Mortal", "Sybarite", "Hedonites of Slaanesh", "Chaos"],
          unitSize: "11",
          reinforcement: "11",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "herald-of-slaanesh",
          name: "Herald of Slaanesh",
          points: 90,
          move: "8\"",
          health: 4,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Ravaging Claws",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Siren Song", "Acquiescence"],
          keywords: ["Hero", "Wizard", "Daemon", "Hedonites of Slaanesh", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "seekers",
          name: "Seekers",
          points: 130,
          move: "14\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Piercing Claws",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Steed's Poisoned Tongue",
              range: "1\"",
              attacks: "1",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Quicksilver Speed", "Unholy Grace"],
          keywords: ["Daemon", "Hedonites of Slaanesh", "Chaos"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Hedonites of Slaanesh suchen Perfektion durch Exzess und Vergnügen.",
      playstyle: "Schnelle, mobile Armee mit starken Buffs und Debuffs"
    },
    {
      id: "maggotkin-of-nurgle",
      name: "Maggotkin of Nurgle",
      description: "Nurgles fäulniserregende Anhänger",
      allegiance: "Chaos",
      battleTraits: ["Cycle of Corruption", "Diseased"],
      commandTraits: ["Grandfather's Blessing", "Living Plague"],
      artefacts: ["The Splithorn Helm", "Tome of a Thousand Poxes"],
      units: [
        {
          id: "great-unclean-one",
          name: "Great Unclean One",
          points: 490,
          move: "7\"",
          health: 18,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Massive Bilesword",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "3"
            },
            {
              name: "Putrid Vomit",
              range: "7\"",
              attacks: "D6",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: [
            {
              name: "Diseased Claws and Teeth",
              description: "Add 1 to wound rolls for this unit's melee weapons if the target has any wounds allocated to it."
            },
            {
              name: "Grandfather's Blessing",
              description: "This unit has a ward of 5+."
            },
            {
              name: "Foul Regeneration",
              description: "At the end of each turn, heal D3 wounds allocated to this unit."
            }
          ],
          keywords: ["Hero", "Wizard", "Monster", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [
            { name: "great_unclean_one_01.stl", size: "45.2 MB" },
            { name: "great_unclean_one_02.stl", size: "38.7 MB" },
            { name: "base.stl", size: "5.1 MB" }
          ],
          previewImage: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400",
          printNotes: "Drucke mit 0.3mm Schichthöhe für beste Stabilität"
        },
        {
          id: "plaguebearers",
          name: "Plaguebearers",
          points: 120,
          move: "4\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Plaguesword",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: [
            {
              name: "Diseased",
              description: "At the end of any turn in which this unit charged, pick 1 enemy unit within 1\" of this unit and roll a dice. On a 4+, that unit suffers D3 mortal wounds."
            },
            {
              name: "Nurgle's Gift",
              description: "This unit has a ward of 5+."
            }
          ],
          keywords: ["Battleline", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "putrid-blightkings",
          name: "Putrid Blightkings",
          points: 250,
          move: "4\"",
          health: 4,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Blighted Weapon",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: [
            {
              name: "Disgustingly Resilient",
              description: "This unit has a ward of 5+."
            },
            {
              name: "Locus of Fecundity",
              description: "Add 1 to wound rolls for attacks made by friendly NURGLE DAEMON units while they are wholly within 12\" of this unit."
            }
          ],
          keywords: ["Mortal", "Rotbringer", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "lord-of-afflictions",
          name: "Lord of Afflictions",
          points: 210,
          move: "9\"",
          health: 8,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Festerspike",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: [
            {
              name: "Blighted Weapons",
              description: "If the unmodified hit roll for an attack made with a melee weapon by this unit is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends."
            },
            {
              name: "Disgustingly Resilient",
              description: "This unit has a ward of 5+."
            }
          ],
          keywords: ["Hero", "Fly", "Mortal", "Rotbringer", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "nurglings",
          name: "Nurglings",
          points: 105,
          move: "5\"",
          health: 3,
          save: "7+",
          control: 1,
          weapons: [
            {
              name: "Tiny Claws and Teeth",
              range: "1\"",
              attacks: "5",
              hit: "5+",
              wound: "5+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: [
            {
              name: "Mischievous Sprites",
              description: "This unit can move through other models and terrain features as if they were not there, and can end a move on top of another model or terrain feature."
            },
            {
              name: "Disease-ridden",
              description: "At the end of any turn in which this unit was within 3\" of any enemy units, roll a dice for each of those enemy units. On a 4+, that unit suffers 1 mortal wound."
            }
          ],
          keywords: ["Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [
            { name: "nurgling_swarm.stl", size: "15.6 MB" },
            { name: "nurgling_individual.stl", size: "3.2 MB" }
          ],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "rotbringer-sorcerer",
          name: "Rotbringer Sorcerer",
          points: 120,
          move: "4\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Rotwood Staff",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: [
            {
              name: "Diseased Weapons",
              description: "Add 1 to wound rolls for this unit's melee weapons if the target has any wounds allocated to it."
            },
            {
              name: "Nurgle's Rot",
              description: "This unit has a ward of 6+."
            }
          ],
          keywords: ["Hero", "Wizard", "Mortal", "Rotbringer", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "plague-drones",
          name: "Plague Drones",
          points: 160,
          move: "8\"",
          health: 4,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Death's Head",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Prehensile Proboscis",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "2+",
              rend: "",
              damage: "D3"
            }
          ],
          abilities: [
            {
              name: "Beast Handler",
              description: "Add 1 to charge rolls for friendly BEASTS OF NURGLE units while they are wholly within 12\" of this unit."
            },
            {
              name: "Nurgle's Blessing",
              description: "This unit has a ward of 5+."
            }
          ],
          keywords: ["Fly", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "beast-of-nurgle",
          name: "Beast of Nurgle",
          points: 110,
          move: "6\"",
          health: 7,
          save: "5+",
          control: 3,
          weapons: [
            {
              name: "Claws and Tentacles",
              range: "1\"",
              attacks: "4",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "2"
            }
          ],
          abilities: [
            {
              name: "Diseased Weapons",
              description: "Add 1 to wound rolls for this unit's melee weapons if the target has any wounds allocated to it."
            },
            {
              name: "Fly High",
              description: "This unit can fly. When this unit makes a move, it can pass across models and terrain features as if they were not there."
            }
          ],
          keywords: ["Monster", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "spoilpox-scrivener",
          name: "Spoilpox Scrivener",
          points: 95,
          move: "4\"",
          health: 5,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Disgusting Sneezes",
              range: "7\"",
              attacks: "D3",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            },
            {
              name: "Plaguesword",
              range: "1\"",
              attacks: "3",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Diseased", "Keep Counting!", "Recorded Atrocities"],
          keywords: ["Hero", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "sloppity-bilepiper",
          name: "Sloppity Bilepiper",
          points: 130,
          move: "4\"",
          health: 5,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Marotter",
              range: "1\"",
              attacks: "3",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Diseased", "Jolly Gutpipes", "Disease-ridden Demeanour"],
          keywords: ["Hero", "Daemon", "Maggotkin of Nurgle", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Maggotkin of Nurgle verbreiten Krankheit und Fäulnis im Namen ihres Gottes.",
      playstyle: "Zähe, widerstandsfähige Armee mit starken Debuffs"
    },
    {
      id: "skaven",
      name: "Skaven",
      description: "Rattenmensch-Imperium aus den Tunneln",
      allegiance: "Chaos",
      battleTraits: ["Scurry Away", "Overwhelming Mass"],
      commandTraits: ["Master of Ballistics", "Cunning"],
      artefacts: ["Warpstone Charm", "Skavenbrew"],
      units: [
        {
          id: "grey-seer",
          name: "Grey Seer",
          points: 140,
          move: "6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Warpstone Staff",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (2)", "Warpstone Tokens", "Dreaded Thirteenth Spell"],
          keywords: ["Hero", "Wizard", "Skaven", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "clanrats",
          name: "Clanrats",
          points: 90,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Rusty Spear",
              range: "2\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Scurry Away", "Strength in Numbers"],
          keywords: ["Battleline", "Skaven", "Chaos"],
          unitSize: "20",
          reinforcement: "20",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "stormvermin",
          name: "Stormvermin",
          points: 130,
          move: "6\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Halberd",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Elite", "Disciplined"],
          keywords: ["Skaven", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "warlock-engineer",
          name: "Warlock Engineer",
          points: 100,
          move: "6\"",
          health: 4,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Warplock Pistol",
              range: "9\"",
              attacks: "1",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["More-more Warp Power!", "Warpstone Sparks"],
          keywords: ["Hero", "Skaven", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "warpfire-thrower",
          name: "Warpfire Thrower",
          points: 70,
          move: "6\"",
          health: 2,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Warpfire Projector",
              range: "8\"",
              attacks: "D6",
              hit: "4+",
              wound: "3+",
              rend: "-2",
              damage: "1"
            }
          ],
          abilities: ["Warpfire", "More-more Fire!"],
          keywords: ["War Machine", "Skaven", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "hell-pit-abomination",
          name: "Hell Pit Abomination",
          points: 220,
          move: "6\"",
          health: 14,
          save: "5+",
          control: 5,
          weapons: [
            {
              name: "Gnashing Teeth",
              range: "2\"",
              attacks: "4",
              hit: "4+",
              wound: "2+",
              rend: "-1",
              damage: "3"
            },
            {
              name: "Flailing Fists",
              range: "2\"",
              attacks: "D6",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Regenerating Monstrosity", "Too Horrible to Die"],
          keywords: ["Monster", "Skaven", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Skaven sind ein heimtückisches Rattenmensch-Imperium aus den Tunneln unter der Welt.",
      playstyle: "Schwarm-Armee mit vielen Einheiten und Kriegsmaschinen"
    },
    {
      id: "slaves-to-darkness",
      name: "Slaves to Darkness",
      description: "Chaos-Krieger aller Götter",
      allegiance: "Chaos",
      battleTraits: ["Eye of the Gods", "Marks of Chaos"],
      commandTraits: ["Eternal Vendetta", "Favoured of the Pantheon"],
      artefacts: ["Sword of Judgement", "Helm of the Oppressor"],
      units: [
        {
          id: "chaos-lord",
          name: "Chaos Lord",
          points: 110,
          move: "5\"",
          health: 6,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Reaperblade",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Aura of Chaos", "Dark Blessing"],
          keywords: ["Hero", "Mortal", "Slaves to Darkness", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "chaos-warriors",
          name: "Chaos Warriors",
          points: 110,
          move: "5\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Chaos Hand Weapon",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Chaos Runeshields", "Legions of Chaos"],
          keywords: ["Battleline", "Mortal", "Slaves to Darkness", "Chaos"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "chaos-knights",
          name: "Chaos Knights",
          points: 180,
          move: "10\"",
          health: 3,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Chaos Lance",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Impaling Charge", "Chaos Runeshields"],
          keywords: ["Mortal", "Slaves to Darkness", "Chaos"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "chaos-sorcerer-lord",
          name: "Chaos Sorcerer Lord",
          points: 120,
          move: "5\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Reaperblade",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Oracular Visions", "Daemonic Power"],
          keywords: ["Hero", "Wizard", "Mortal", "Slaves to Darkness", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "chaos-spawn",
          name: "Chaos Spawn",
          points: 50,
          move: "2D6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Freakish Mutations",
              range: "1\"",
              attacks: "D6",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Writhing Tentacles", "Drawn to Power"],
          keywords: ["Mortal", "Slaves to Darkness", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Slaves to Darkness sind Chaos-Krieger, die allen dunklen Göttern dienen.",
      playstyle: "Vielseitige Armee mit starken Nahkampfeinheiten"
    },
    {
      id: "beasts-of-chaos",
      name: "Beasts of Chaos",
      description: "Wilde Bestien des Chaos",
      allegiance: "Chaos",
      battleTraits: ["Primal Instincts", "Brayherd Ambush"],
      commandTraits: ["Bestial Cunning", "Apex Predator"],
      artefacts: ["The Knowing Eye", "Blade of the Desecrator"],
      units: [
        {
          id: "great-bray-shaman",
          name: "Great Bray-Shaman",
          points: 100,
          move: "6\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Staff of Dark Wood",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Devolve", "Savage Dominion"],
          keywords: ["Hero", "Wizard", "Gor", "Beasts of Chaos", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "gors",
          name: "Gors",
          points: 70,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Gor Blades",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Anarchy and Mayhem", "Beastshields"],
          keywords: ["Battleline", "Gor", "Beasts of Chaos", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "bestigors",
          name: "Bestigors",
          points: 120,
          move: "6\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Despoiler Axe",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Anarchy and Mayhem", "Bestial Charge"],
          keywords: ["Gor", "Beasts of Chaos", "Chaos"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "beastlord",
          name: "Beastlord",
          points: 90,
          move: "6\"",
          health: 6,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Paired Man-ripper Claws",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Hatred of Heroes", "Call of Battle"],
          keywords: ["Hero", "Gor", "Beasts of Chaos", "Chaos"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "minotaurs",
          name: "Minotaurs",
          points: 150,
          move: "7\"",
          health: 4,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Paired Axes",
              range: "1\"",
              attacks: "3",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Bloodgreed", "Trampling Charge"],
          keywords: ["Bullgor", "Beasts of Chaos", "Chaos"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Beasts of Chaos sind wilde Bestien, die die Zivilisation hassen.",
      playstyle: "Aggressive Nahkampfarmee mit starken Monstern"
    },

    // DEATH ARMIES
    {
      id: "flesh-eater-courts",
      name: "Flesh-eater Courts",
      description: "Wahnsinnige Ghul-Königreiche",
      allegiance: "Death",
      battleTraits: ["Delusional Nobility", "Courts of Delusion"],
      commandTraits: ["Completely Delusional", "Savage Beyond Reason"],
      artefacts: ["The Grim Garland", "Decrepit Coronet"],
      units: [
        {
          id: "abhorrant-ghoul-king",
          name: "Abhorrant Ghoul King",
          points: 180,
          move: "6\"",
          health: 7,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Gory Talons and Fangs",
              range: "1\"",
              attacks: "5",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Wizard (1)", "Summon Men-at-arms", "Royal Blood"],
          keywords: ["Hero", "Wizard", "Abhorrant", "Flesh-eater Courts", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "crypt-ghouls",
          name: "Crypt Ghouls",
          points: 75,
          move: "6\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Sharpened Teeth and Filthy Claws",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Boundless Ferocity", "Royal Approval"],
          keywords: ["Battleline", "Serfs", "Flesh-eater Courts", "Death"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "crypt-horrors",
          name: "Crypt Horrors",
          points: 100,
          move: "6\"",
          health: 4,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Club and Septic Talons",
              range: "1\"",
              attacks: "3",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Noble Blood", "Chosen of the King"],
          keywords: ["Courtier", "Flesh-eater Courts", "Death"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "crypt-ghast-courtier",
          name: "Crypt Ghast Courtier",
          points: 75,
          move: "6\"",
          health: 4,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Sharpened Teeth and Filthy Claws",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Muster Royal Guard", "Loyal to the End"],
          keywords: ["Hero", "Courtier", "Flesh-eater Courts", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "terrorgheist",
          name: "Terrorgheist",
          points: 280,
          move: "14\"",
          health: 14,
          save: "5+",
          control: 5,
          weapons: [
            {
              name: "Fanged Maw",
              range: "2\"",
              attacks: "3",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            },
            {
              name: "Death Shriek",
              range: "10\"",
              attacks: "1",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D6"
            }
          ],
          abilities: ["Fly", "Gaping Maw", "Infested"],
          keywords: ["Monster", "Fly", "Flesh-eater Courts", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Flesh-eater Courts sind wahnsinnige Ghul-Königreiche, die sich für edle Ritter halten.",
      playstyle: "Schnelle Schwarm-Armee mit starken Monstern"
    },
    {
      id: "nighthaunt",
      name: "Nighthaunt",
      description: "Geister der Verdammten",
      allegiance: "Death",
      battleTraits: ["Ethereal", "Wave of Terror"],
      commandTraits: ["Hatred of the Living", "Terrifying Entity"],
      artefacts: ["Pendant of the Fell Wind", "Cloak of the Waxing Moon"],
      units: [
        {
          id: "knight-of-shrouds",
          name: "Knight of Shrouds",
          points: 100,
          move: "8\"",
          health: 5,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Sword of Stolen Hours",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Ethereal", "Spectral Summons", "Stolen Hours"],
          keywords: ["Hero", "Nighthaunt", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "chainrasps",
          name: "Chainrasps",
          points: 95,
          move: "8\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Malignant Weapon",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Ethereal", "Chilling Horde", "Dreadwarden"],
          keywords: ["Battleline", "Nighthaunt", "Death"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "grimghast-reapers",
          name: "Grimghast Reapers",
          points: 160,
          move: "8\"",
          health: 1,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Slasher Scythe",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Ethereal", "Reaped Like Corn", "For Whom the Bell Tolls"],
          keywords: ["Nighthaunt", "Death"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "guardian-of-souls",
          name: "Guardian of Souls",
          points: 150,
          move: "8\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Nightmare Lantern",
              range: "12\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Ethereal", "Spectral Lure", "Deathly Vigour"],
          keywords: ["Hero", "Wizard", "Nighthaunt", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "black-coach",
          name: "Black Coach",
          points: 280,
          move: "12\"",
          health: 12,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Spectral Scythes",
              range: "1\"",
              attacks: "6",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Cairn Wraith Scythe",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-2",
              damage: "2"
            }
          ],
          abilities: ["Ethereal", "Fly", "Evocation of Death", "Reaped Like Corn"],
          keywords: ["War Machine", "Fly", "Nighthaunt", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Nighthaunt sind Geister der Verdammten, die von Nagash zur ewigen Qual verdammt wurden.",
      playstyle: "Mobile Geisterarmee mit Ethereal-Fähigkeiten"
    },
    {
      id: "ossiarch-bonereapers",
      name: "Ossiarch Bonereapers",
      description: "Nagashs perfekte Knochenlegionen",
      allegiance: "Death",
      battleTraits: ["Relentless Discipline", "Bone Tithe"],
      commandTraits: ["Ancient Knowledge", "Mighty Archaeossian"],
      artefacts: ["Godbone Armour", "Nadirite Blade"],
      units: [
        {
          id: "mortisan-boneshaper",
          name: "Mortisan Boneshaper",
          points: 130,
          move: "5\"",
          health: 5,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Ossified Talons",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Boneshaper", "Shard-storm"],
          keywords: ["Hero", "Wizard", "Mortisan", "Ossiarch Bonereapers", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "mortek-guard",
          name: "Mortek Guard",
          points: 140,
          move: "4\"",
          health: 1,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Nadirite Blade",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Shieldwall", "Nadirite Weapons"],
          keywords: ["Battleline", "Hekatos", "Ossiarch Bonereapers", "Death"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "necropolis-stalkers",
          name: "Necropolis Stalkers",
          points: 180,
          move: "8\"",
          health: 4,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Dread Falchions",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Hunt and Kill", "Quadrarch"],
          keywords: ["Hekatos", "Ossiarch Bonereapers", "Death"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "liege-kavalos",
          name: "Liege-Kavalos",
          points: 185,
          move: "10\"",
          health: 8,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Commander's Blade",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Endless Duty", "Aviarch Spymaster"],
          keywords: ["Hero", "Kavalos", "Ossiarch Bonereapers", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "gothizzar-harvester",
          name: "Gothizzar Harvester",
          points: 200,
          move: "6\"",
          health: 10,
          save: "3+",
          control: 5,
          weapons: [
            {
              name: "Sickles and Claws",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Bone Harvest", "Repair Construct"],
          keywords: ["War Machine", "Ossiarch Bonereapers", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Ossiarch Bonereapers sind Nagashs perfekte Knochenlegionen, geschaffen aus den Toten.",
      playstyle: "Elite-Armee mit starken Konstrukten und Magie"
    },
    {
      id: "soulblight-gravelords",
      name: "Soulblight Gravelords",
      description: "Vampirfürsten und ihre Untoten",
      allegiance: "Death",
      battleTraits: ["Deathless Minions", "The Hunger"],
      commandTraits: ["Dread Knight", "Master of the Black Arts"],
      artefacts: ["Vial of the Pure Blood", "Sangsyron"],
      units: [
        {
          id: "vampire-lord",
          name: "Vampire Lord",
          points: 140,
          move: "6\"",
          health: 7,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Deathlance",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Wizard (1)", "The Hunger", "Undead Resilience"],
          keywords: ["Hero", "Wizard", "Vampire", "Soulblight Gravelords", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "skeleton-warriors",
          name: "Skeleton Warriors",
          points: 85,
          move: "4\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Ancient Blade",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Deathless Minions", "Skeleton Legion"],
          keywords: ["Battleline", "Deadwalkers", "Soulblight Gravelords", "Death"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "zombies",
          name: "Zombies",
          points: 115,
          move: "4\"",
          health: 1,
          save: "7+",
          control: 1,
          weapons: [
            {
              name: "Crude Weapons",
              range: "1\"",
              attacks: "1",
              hit: "5+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Deathless Minions", "Shambling Horde"],
          keywords: ["Battleline", "Deadwalkers", "Soulblight Gravelords", "Death"],
          unitSize: "20",
          reinforcement: "20",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "necromancer",
          name: "Necromancer",
          points: 125,
          move: "5\"",
          health: 4,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Osseous Dagger",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Deathly Invocation", "Undead Minions"],
          keywords: ["Hero", "Wizard", "Deadwalkers", "Soulblight Gravelords", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "terrorgheist",
          name: "Terrorgheist",
          points: 280,
          move: "14\"",
          health: 14,
          save: "5+",
          control: 5,
          weapons: [
            {
              name: "Fanged Maw",
              range: "2\"",
              attacks: "3",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            },
            {
              name: "Death Shriek",
              range: "10\"",
              attacks: "1",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D6"
            }
          ],
          abilities: ["Fly", "Gaping Maw", "Infested"],
          keywords: ["Monster", "Fly", "Deadwalkers", "Soulblight Gravelords", "Death"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Soulblight Gravelords sind Vampirfürsten, die Armeen von Untoten befehligen.",
      playstyle: "Schwarm-Armee mit starken Vampir-Helden"
    },

    // DESTRUCTION ARMIES
    {
      id: "gloomspite-gitz",
      name: "Gloomspite Gitz",
      description: "Wahnsinnige Grots und Troggoth",
      allegiance: "Destruction",
      battleTraits: ["Bad Moon Rising", "Lunar Squigs"],
      commandTraits: ["Cunning Plans", "Low Cunning"],
      artefacts: ["Moonface Mommet", "Spiteful Prodder"],
      units: [
        {
          id: "loonboss",
          name: "Loonboss",
          points: 70,
          move: "5\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Moon-cutta",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["I'm Da Boss, Now Stab 'Em Good!", "Dead Tricksy"],
          keywords: ["Hero", "Grot", "Gloomspite Gitz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "stabbas",
          name: "Stabbas",
          points: 130,
          move: "5\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Stabba",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Backstabbing Mob", "Moonshields"],
          keywords: ["Battleline", "Grot", "Gloomspite Gitz", "Destruction"],
          unitSize: "20",
          reinforcement: "20",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "squig-hoppers",
          name: "Squig Hoppers",
          points: 90,
          move: "10\"",
          health: 2,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Fang-filled Gob",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            },
            {
              name: "Stabba",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Boing! Boing! Boing!", "Squigs Go Wild"],
          keywords: ["Grot", "Squig", "Gloomspite Gitz", "Destruction"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "fungoid-cave-shaman",
          name: "Fungoid Cave-Shaman",
          points: 90,
          move: "5\"",
          health: 4,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Moon Staff",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Spore Maws", "Deffcap Mushroom"],
          keywords: ["Hero", "Wizard", "Grot", "Gloomspite Gitz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "dankhold-troggoth",
          name: "Dankhold Troggoth",
          points: 200,
          move: "6\"",
          health: 12,
          save: "5+",
          control: 5,
          weapons: [
            {
              name: "Massive Club",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "4"
            }
          ],
          abilities: ["Regeneration", "Crushing Grip", "Magical Resistance"],
          keywords: ["Monster", "Troggoth", "Gloomspite Gitz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Gloomspite Gitz sind wahnsinnige Grots, die dem Bad Moon folgen.",
      playstyle: "Chaotische Schwarm-Armee mit unvorhersagbaren Fähigkeiten"
    },
    {
      id: "ironjawz",
      name: "Ironjawz",
      description: "Brutale Orruk-Krieger",
      allegiance: "Destruction",
      battleTraits: ["Waaagh!", "Smashing and Bashing"],
      commandTraits: ["Hulking Muscle-bound Brute", "Live to Fight"],
      artefacts: ["Armour of Gork", "Destroyer"],
      units: [
        {
          id: "megaboss",
          name: "Megaboss",
          points: 140,
          move: "5\"",
          health: 7,
          save: "3+",
          control: 2,
          weapons: [
            {
              name: "Boss Choppa and Rip-tooth Fist",
              range: "1\"",
              attacks: "5",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Waaagh!", "Go on Then, Hit Me!", "Strength from Victory"],
          keywords: ["Hero", "Orruk", "Ironjawz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "ardboys",
          name: "'Ardboys",
          points: 180,
          move: "4\"",
          health: 2,
          save: "4+",
          control: 1,
          weapons: [
            {
              name: "Choppa",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "'Ere We Go, 'Ere We Go, 'Ere We Go!", "Paired Choppas"],
          keywords: ["Battleline", "Orruk", "Ironjawz", "Destruction"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "brutes",
          name: "Brutes",
          points: 160,
          move: "4\"",
          health: 3,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Brute Choppas",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "Duff Up da Big Thing", "Brute Smasha"],
          keywords: ["Orruk", "Ironjawz", "Destruction"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "weirdnob-shaman",
          name: "Weirdnob Shaman",
          points: 90,
          move: "5\"",
          health: 5,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Waaagh! Staff",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Waaagh!", "Brutal Power", "Green Puke"],
          keywords: ["Hero", "Wizard", "Orruk", "Ironjawz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "maw-krusha",
          name: "Maw-krusha",
          points: 480,
          move: "10\"",
          health: 18,
          save: "3+",
          control: 5,
          weapons: [
            {
              name: "Massive Jaws",
              range: "2\"",
              attacks: "2",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "6"
            },
            {
              name: "Fists and Tail",
              range: "3\"",
              attacks: "4",
              hit: "4+",
              wound: "2+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Fly", "Waaagh!", "Destructive Bulk", "Sound of Gork"],
          keywords: ["Hero", "Monster", "Fly", "Orruk", "Ironjawz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Ironjawz sind die brutalsten und stärksten aller Orruk-Klans.",
      playstyle: "Aggressive Nahkampfarmee mit starken Monstern"
    },
    {
      id: "kruleboyz",
      name: "Kruleboyz",
      description: "Hinterlistige Sumpf-Orruks",
      allegiance: "Destruction",
      battleTraits: ["Venom-encrusted Weapons", "Dirty Tricks"],
      commandTraits: ["Supa Sneaky", "Egomaniak"],
      artefacts: ["Amulet of Destiny", "Arcane Tome"],
      units: [
        {
          id: "killaboss",
          name: "Killaboss",
          points: 110,
          move: "5\"",
          health: 6,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Boss-hacka and Skareshield",
              range: "1\"",
              attacks: "4",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Venom-encrusted Weapons", "Dirty Fighting", "Scare Tactics"],
          keywords: ["Hero", "Orruk", "Kruleboyz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "gutrippaz",
          name: "Gutrippaz",
          points: 180,
          move: "5\"",
          health: 2,
          save: "5+",
          control: 1,
          weapons: [
            {
              name: "Wicked Hacka",
              range: "1\"",
              attacks: "2",
              hit: "3+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Venom-encrusted Weapons", "Skareshields", "Wicked Hacka"],
          keywords: ["Battleline", "Orruk", "Kruleboyz", "Destruction"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "hobgrot-slittaz",
          name: "Hobgrot Slittaz",
          points: 80,
          move: "5\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Slitta-knives",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Venom-encrusted Weapons", "Scrap Shields", "Slitta-knives"],
          keywords: ["Hobgrot", "Kruleboyz", "Destruction"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "swampcalla-shaman",
          name: "Swampcalla Shaman",
          points: 105,
          move: "5\"",
          health: 4,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Bogbeast Fangs and Claws",
              range: "1\"",
              attacks: "3",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Wizard (1)", "Venom-encrusted Weapons", "Elixir of Life", "Poison Brew"],
          keywords: ["Hero", "Wizard", "Orruk", "Kruleboyz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "marshcrawla-sloggoth",
          name: "Marshcrawla Sloggoth",
          points: 150,
          move: "5\"",
          health: 10,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Massive Jaws",
              range: "2\"",
              attacks: "4",
              hit: "4+",
              wound: "2+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Venom-encrusted Weapons", "Regeneration", "Poison Belch"],
          keywords: ["Monster", "Kruleboyz", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Kruleboyz sind hinterlistige Sumpf-Orruks, die Gift und Tricks einsetzen.",
      playstyle: "Taktische Armee mit Gift-Waffen und Tricks"
    },
    {
      id: "ogor-mawtribes",
      name: "Ogor Mawtribes",
      description: "Hungrige Ogor-Nomaden",
      allegiance: "Destruction",
      battleTraits: ["Trampling Charge", "Ravenous Brutes"],
      commandTraits: ["Gastromancer", "Rolls of Fat"],
      artefacts: ["Greasy Cleaver", "Shrunken Priest Head"],
      units: [
        {
          id: "tyrant",
          name: "Tyrant",
          points: 160,
          move: "6\"",
          health: 8,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Massive Weapon",
              range: "2\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-1",
              damage: "3"
            }
          ],
          abilities: ["Trampling Charge", "Bully of the First Degree", "Big Name"],
          keywords: ["Hero", "Ogor", "Ogor Mawtribes", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "ogors",
          name: "Ogors",
          points: 230,
          move: "6\"",
          health: 4,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Clubs or Blades",
              range: "1\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Trampling Charge", "Bellower", "Standard Bearer"],
          keywords: ["Battleline", "Ogor", "Ogor Mawtribes", "Destruction"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "ironguts",
          name: "Ironguts",
          points: 270,
          move: "6\"",
          health: 4,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Gutripper",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "2"
            }
          ],
          abilities: ["Trampling Charge", "Down to the Ironguts", "Rune Maws"],
          keywords: ["Ogor", "Ogor Mawtribes", "Destruction"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "butcher",
          name: "Butcher",
          points: 130,
          move: "6\"",
          health: 7,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Tenderiser",
              range: "2\"",
              attacks: "3",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Trampling Charge", "Bloodgruel", "Voracious Maw"],
          keywords: ["Hero", "Wizard", "Ogor", "Ogor Mawtribes", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "stonehorn",
          name: "Stonehorn",
          points: 290,
          move: "8\"",
          health: 13,
          save: "4+",
          control: 5,
          weapons: [
            {
              name: "Rock-hard Horns",
              range: "2\"",
              attacks: "2",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            },
            {
              name: "Crushing Hooves",
              range: "1\"",
              attacks: "4",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Trampling Charge", "Stone Skeleton", "Earth-shaking Charge"],
          keywords: ["Monster", "Ogor Mawtribes", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Ogor Mawtribes sind hungrige Nomaden, die alles verschlingen, was ihnen in den Weg kommt.",
      playstyle: "Schwere Kavallerie-Armee mit starken Monstern"
    },
    {
      id: "orruk-warclans",
      name: "Orruk Warclans",
      description: "Vereinte Orruk-Stämme",
      allegiance: "Destruction",
      battleTraits: ["Waaagh!", "Savage Orruks"],
      commandTraits: ["Brutal but Kunnin'", "Kunnin' but Brutal"],
      artefacts: ["Choppa of the Beast", "Gryph-feather Charm"],
      units: [
        {
          id: "orruk-warboss",
          name: "Orruk Warboss",
          points: 110,
          move: "5\"",
          health: 7,
          save: "4+",
          control: 2,
          weapons: [
            {
              name: "Choppa or Stikka",
              range: "1\"",
              attacks: "5",
              hit: "3+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "Warboss", "Go on Then, Hit Me!"],
          keywords: ["Hero", "Orruk", "Orruk Warclans", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "orruk-boyz",
          name: "Orruk Boyz",
          points: 180,
          move: "5\"",
          health: 1,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Choppa or Stikka",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "Mob Rule", "Choppa or Stikka"],
          keywords: ["Battleline", "Orruk", "Orruk Warclans", "Destruction"],
          unitSize: "10",
          reinforcement: "10",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "orruk-boar-boyz",
          name: "Orruk Boar Boyz",
          points: 130,
          move: "9\"",
          health: 2,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Choppa or Stikka",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            },
            {
              name: "Tusks and Hooves",
              range: "1\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "Tusker Charge", "Boar Boyz"],
          keywords: ["Orruk", "Orruk Warclans", "Destruction"],
          unitSize: "5",
          reinforcement: "5",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "orruk-shaman",
          name: "Orruk Shaman",
          points: 70,
          move: "5\"",
          health: 4,
          save: "6+",
          control: 1,
          weapons: [
            {
              name: "Bone Staff",
              range: "2\"",
              attacks: "1",
              hit: "4+",
              wound: "4+",
              rend: "",
              damage: "D3"
            }
          ],
          abilities: ["Wizard (1)", "Waaagh!", "Power of the Waaagh!", "Brutal Power"],
          keywords: ["Hero", "Wizard", "Orruk", "Orruk Warclans", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "orruk-gore-gruntas",
          name: "Orruk Gore-gruntas",
          points: 170,
          move: "9\"",
          health: 4,
          save: "5+",
          control: 2,
          weapons: [
            {
              name: "Pig-iron Choppa",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "-1",
              damage: "1"
            },
            {
              name: "Tusks and Hooves",
              range: "1\"",
              attacks: "2",
              hit: "4+",
              wound: "3+",
              rend: "",
              damage: "1"
            }
          ],
          abilities: ["Waaagh!", "Tusker Charge", "Gore-grunta Charge"],
          keywords: ["Orruk", "Orruk Warclans", "Destruction"],
          unitSize: "3",
          reinforcement: "3",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Orruk Warclans sind vereinte Orruk-Stämme unter einem mächtigen Warboss.",
      playstyle: "Ausgewogene Orruk-Armee mit Kavallerie und Infanterie"
    },
    {
      id: "sons-of-behemat",
      name: "Sons of Behemat",
      description: "Gigantische Mega-Garganten",
      allegiance: "Destruction",
      battleTraits: ["Stomping Charge", "Mightier Makes Righter"],
      commandTraits: ["Old and Gnarly", "Extremely Bitter"],
      artefacts: ["Glowy Lantern", "Wallopin' Tentacle"],
      units: [
        {
          id: "mega-gargant",
          name: "Mega-Gargant",
          points: 500,
          move: "10\"",
          health: 35,
          save: "4+",
          control: 10,
          weapons: [
            {
              name: "Almighty Stomp",
              range: "3\"",
              attacks: "1",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            },
            {
              name: "Massive Club",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "4"
            }
          ],
          abilities: ["Stomping Charge", "Timber!", "Son of Behemat"],
          keywords: ["Hero", "Monster", "Mega-Gargant", "Sons of Behemat", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "mancrusher-gargants",
          name: "Mancrusher Gargants",
          points: 170,
          move: "8\"",
          health: 12,
          save: "5+",
          control: 5,
          weapons: [
            {
              name: "Massive Club",
              range: "2\"",
              attacks: "3",
              hit: "4+",
              wound: "2+",
              rend: "-1",
              damage: "3"
            },
            {
              name: "Mighty Kick",
              range: "1\"",
              attacks: "1",
              hit: "3+",
              wound: "2+",
              rend: "-1",
              damage: "D3"
            }
          ],
          abilities: ["Stomping Charge", "Stuff 'Em In Me Bag", "Hurled Body"],
          keywords: ["Battleline", "Monster", "Mancrusher Gargant", "Sons of Behemat", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "warstomper-mega-gargant",
          name: "Warstomper Mega-Gargant",
          points: 470,
          move: "10\"",
          health: 35,
          save: "4+",
          control: 10,
          weapons: [
            {
              name: "Titanic Boulderclub",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "4"
            },
            {
              name: "Hurled Boulder",
              range: "18\"",
              attacks: "1",
              hit: "4+",
              wound: "2+",
              rend: "-2",
              damage: "D6"
            }
          ],
          abilities: ["Stomping Charge", "Hurled Boulder", "Almighty Stomp"],
          keywords: ["Hero", "Monster", "Mega-Gargant", "Sons of Behemat", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "gatebreaker-mega-gargant",
          name: "Gatebreaker Mega-Gargant",
          points: 490,
          move: "10\"",
          health: 35,
          save: "4+",
          control: 10,
          weapons: [
            {
              name: "Fortcrusha Flail",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "4"
            }
          ],
          abilities: ["Stomping Charge", "Smash Down", "Grievous Halitosis"],
          keywords: ["Hero", "Monster", "Mega-Gargant", "Sons of Behemat", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/2128817/pexels-photo-2128817.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: "kraken-eater-mega-gargant",
          name: "Kraken-eater Mega-Gargant",
          points: 520,
          move: "10\"",
          health: 35,
          save: "4+",
          control: 10,
          weapons: [
            {
              name: "Shipwrecka Warclub",
              range: "3\"",
              attacks: "4",
              hit: "3+",
              wound: "2+",
              rend: "-2",
              damage: "4"
            },
            {
              name: "Massive Anchor",
              range: "12\"",
              attacks: "1",
              hit: "4+",
              wound: "2+",
              rend: "-3",
              damage: "D6"
            }
          ],
          abilities: ["Stomping Charge", "Stuff 'Em In Me Net", "Dead Cunning for a Gargant"],
          keywords: ["Hero", "Monster", "Mega-Gargant", "Sons of Behemat", "Destruction"],
          unitSize: "1",
          stlFiles: [],
          previewImage: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      lore: "Die Sons of Behemat sind gigantische Garganten, die alles zertrampeln.",
      playstyle: "Elite-Monster-Armee mit wenigen, aber extrem starken Einheiten"
    }
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
    },
    {
  terrainRules: []
};