export interface AoSRule {
  name: string;
  description: string;
  page?: number;
  category: 'core' | 'advanced' | 'battlepack' | 'faction';
}

export interface AoSWeapon {
  name: string;
  range: string;
  attacks: string;
  hit: string;
  wound: string;
  rend: string;
  damage: string;
  abilities?: string[];
}

export interface AoSUnit {
  id: string;
  name: string;
  points: number;
  move: string;
  health: number;
  save: string;
  control: number;
  weapons: AoSWeapon[];
  abilities: (string | { name: string; description: string })[];
  keywords: string[];
  unitSize: string;
  reinforcement?: string;
  notes?: string;
  // 3D Print Files
  stlFiles?: {
    name: string;
    size: string;
    variant?: string; // z.B. "weapon_variant", "pose_1"
    path?: string; // Path to file in public folder structure
  }[];
  previewImage?: string; // Pfad zu preview.jpg
  printNotes?: string; // Druckhinweise, Skalierung etc.
}

export interface AoSFormation {
  id: string;
  name: string;
  description: string;
  units: string[]; // Unit IDs
  abilities: string[];
  points?: number;
}

export interface AoSArmy {
  id: string;
  name: string;
  description: string;
  allegiance: string;
  battleTraits: string[];
  commandTraits: string[];
  artefacts: string[];
  spells?: string[];
  prayers?: string[];
  units: AoSUnit[];
  formations?: AoSFormation[];
  lore?: string;
  playstyle?: string;
}

export interface AoSBattlepack {
  id: string;
  name: string;
  description: string;
  battleformations: string[];
  rules: AoSRule[];
  scenarios?: {
    name: string;
    description: string;
    specialRules: string[];
  }[];
}

export interface AoSGameData {
  edition: string;
  coreRules: AoSRule[];
  battlepacks: AoSBattlepack[];
  allegianceGroups: {
    [key: string]: {
      name: string;
      description: string;
      color: string;
      icon: string;
      armies: string[]; // Army IDs
    };
  };
  armies: AoSArmy[];
  universalSpells: string[];
  universalPrayers: string[];
  terrainRules: AoSRule[];
  otherCategories?: AoSArmy[];
}