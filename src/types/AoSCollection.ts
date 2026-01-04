export interface AoSRule {
  name: string;
  description: string;
  page?: number;
  category: 'core' | 'advanced' | 'battlepack' | 'faction';
}

export interface AoSWeapon {
  name: string;
  type: 'melee' | 'ranged';
  range?: string;
  attacks: string;
  hit: string;
  wound: string;
  rend: string;
  damage: string;
  ability?: string;
}

export interface AoSAbility {
  name: string;
  type: 'passive' | 'active' | 'reaction' | 'other';
  effect: string;
  keywords?: string;
  color?: string;
  defenseType?: string;
}

export interface AoSUnit {
  id: string;
  name: string;
  points?: number;
  move?: string;
  health?: number;
  save?: string;
  control?: number;
  baseSize?: string;
  weapons?: AoSWeapon[];
  abilities?: AoSAbility[];
  keywords?: string[];
  unitSize?: string;
  reinforcement?: string;
  notes?: string;
  isCustom?: boolean;
  // 3D Print Files
  stlFiles?: {
    name: string;
    size: string;
    variant?: string;
    path?: string;
  }[];
  previewImage?: string;
  printNotes?: string;
}

export interface AoSFormation {
  id: string;
  name: string;
  description: string;
  units: string[]; // Unit IDs
  abilities: string[];
  points?: number;
}

export interface AoSArmyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textureStyle: 'decay' | 'blood' | 'mist' | 'nature' | 'metal' | 'magic' | 'tribal' | 'ethereal' | 'none';
  symbolPath?: string;
  bannerGradient: string[];
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
  theme?: AoSArmyTheme;
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
  otherCategories: AoSArmy[];
}