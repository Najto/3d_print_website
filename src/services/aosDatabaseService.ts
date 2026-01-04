import { supabase } from './supabaseClient';
import { AoSGameData, AoSArmy, AoSUnit, AllegianceGroup } from '../types/AoSCollection';

interface DbFaction {
  id: string;
  name: string;
  catalog_file: string;
  grand_alliance: string;
  description: string;
  color_scheme: string;
  icon_name: string;
  unit_count: number;
}

interface DbUnit {
  id: string;
  faction_id: string;
  battlescribe_id: string;
  name: string;
  points: number;
  unit_type: string | null;
  min_size: number | null;
  max_size: number | null;
  move: string | null;
  health: number | null;
  save: string | null;
  control: number | null;
  base_size: string | null;
  weapons: any[];
  abilities: any[];
  keywords: string[];
  raw_data: any;
}

// Minimal fallback for core rules (can be moved to DB later if needed)
const minimalCoreRules = [
  {
    name: "Command Phase",
    description: "Gain command points and use command abilities",
    category: "core" as const
  },
  {
    name: "Movement Phase",
    description: "Move units across the battlefield",
    category: "core" as const
  },
  {
    name: "Shooting Phase",
    description: "Attack with ranged weapons",
    category: "core" as const
  },
  {
    name: "Charge Phase",
    description: "Charge into combat",
    category: "core" as const
  },
  {
    name: "Combat Phase",
    description: "Fight in melee combat",
    category: "core" as const
  }
];

export const aosDatabaseService = {
  async loadArmiesFromDatabase(): Promise<AoSGameData> {
    try {
      // Load all factions from database
      const { data: factions, error: factionsError } = await supabase
        .from('aos_factions')
        .select('*')
        .order('name');

      if (factionsError) {
        console.error('Error loading factions:', factionsError);
        return this.getEmptyGameData();
      }

      if (!factions || factions.length === 0) {
        console.log('No factions in database. Please import data first.');
        return this.getEmptyGameData();
      }

      // Load all units from database
      const { data: units, error: unitsError } = await supabase
        .from('aos_units')
        .select('*');

      if (unitsError) {
        console.error('Error loading units:', unitsError);
      }

      console.log(`📊 Loaded ${factions.length} factions from database`);
      console.log(`📊 Loaded ${units?.length || 0} units from database`);

      // Log grand alliances for debugging
      const allianceCounts = new Map<string, number>();
      factions.forEach(f => {
        const alliance = f.grand_alliance || 'NONE';
        allianceCounts.set(alliance, (allianceCounts.get(alliance) || 0) + 1);
      });
      console.log('🏰 Grand Alliance distribution:', Object.fromEntries(allianceCounts));

      // Group units by faction_id for efficient lookup
      const unitsByFaction = new Map<string, DbUnit[]>();
      if (units) {
        units.forEach(unit => {
          if (!unitsByFaction.has(unit.faction_id)) {
            unitsByFaction.set(unit.faction_id, []);
          }
          unitsByFaction.get(unit.faction_id)!.push(unit);
        });
      }

      // Convert database factions to AoS armies
      const armies: AoSArmy[] = factions.map(faction =>
        this.convertFactionToArmy(faction, unitsByFaction.get(faction.id) || [])
      );

      // Generate allegiance groups dynamically from factions
      const allegianceGroups = this.generateAllegianceGroups(factions, armies);

      console.log('✅ Generated allegiance groups:', Object.keys(allegianceGroups));
      console.log('📦 Armies per alliance:', Object.entries(allegianceGroups).map(([key, group]) => `${group.name}: ${group.armies.length}`));

      return {
        edition: "4th Edition",
        coreRules: minimalCoreRules,
        battlepacks: [],
        allegianceGroups,
        armies,
        otherCategories: []
      };
    } catch (error) {
      console.error('Error in loadArmiesFromDatabase:', error);
      return this.getEmptyGameData();
    }
  },

  convertFactionToArmy(faction: DbFaction, units: DbUnit[]): AoSArmy {
    // Generate army ID from faction name
    const armyId = faction.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Convert database units to AoS units
    const aosUnits: AoSUnit[] = units.map(unit => {
      const unitType = unit.unit_type || '';
      const keywords = unit.keywords && unit.keywords.length > 0
        ? unit.keywords
        : (unitType ? [unitType] : []);

      const unitSize = unit.min_size
        ? (unit.max_size && unit.max_size !== unit.min_size
            ? `${unit.min_size}-${unit.max_size}`
            : `${unit.min_size}`)
        : '1';

      return {
        id: unit.battlescribe_id,
        name: unit.name,
        points: unit.points,
        move: unit.move || undefined,
        health: unit.health || undefined,
        save: unit.save || undefined,
        control: unit.control || undefined,
        baseSize: unit.base_size || undefined,
        unitSize,
        keywords,
        weapons: unit.weapons || [],
        abilities: unit.abilities || [],
        stlFiles: []
      };
    });

    return {
      id: armyId,
      name: faction.name,
      description: faction.description || `${faction.name} aus der ${faction.grand_alliance || 'Grand Alliance'}`,
      allegiance: faction.grand_alliance || 'Order',
      battleTraits: [],
      commandTraits: [],
      artefacts: [],
      spells: [],
      units: aosUnits
    };
  },

  generateAllegianceGroups(factions: DbFaction[], armies: AoSArmy[]): Record<string, AllegianceGroup> {
    const groups: Record<string, AllegianceGroup> = {};

    // Group factions by grand alliance
    const factionsByAlliance = new Map<string, string[]>();

    factions.forEach(faction => {
      const alliance = faction.grand_alliance || 'Order';
      if (!factionsByAlliance.has(alliance)) {
        factionsByAlliance.set(alliance, []);
      }
      const armyId = faction.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      factionsByAlliance.get(alliance)!.push(armyId);
    });

    // Create allegiance group for each grand alliance
    const allianceConfig = {
      'Order': { color: 'blue', icon: 'shield', description: 'Zivilisation, Gerechtigkeit und Ordnung' },
      'Chaos': { color: 'red', icon: 'zap', description: 'Zerstörung, Korruption und Anarchie' },
      'Death': { color: 'purple', icon: 'skull', description: 'Untod, Nekromantie und ewige Ruhe' },
      'Destruction': { color: 'green', icon: 'mountain', description: 'Wilde Kraft, Chaos und Zerstörung' }
    };

    factionsByAlliance.forEach((armyIds, alliance) => {
      const config = allianceConfig[alliance as keyof typeof allianceConfig] || allianceConfig['Order'];
      const groupKey = alliance.toLowerCase();

      groups[groupKey] = {
        name: alliance,
        description: config.description,
        color: config.color,
        icon: config.icon,
        armies: armyIds
      };
    });

    return groups;
  },

  getEmptyGameData(): AoSGameData {
    return {
      edition: "4th Edition",
      coreRules: minimalCoreRules,
      battlepacks: [],
      allegianceGroups: {},
      armies: [],
      otherCategories: []
    };
  },

  async saveCustomUnitData(factionId: string, unitId: string, customData: {
    stlFiles?: any[];
    previewImage?: string;
    printNotes?: string;
    notes?: string;
  }): Promise<boolean> {
    try {
      const { data: existing } = await supabase
        .from('aos_custom_unit_data')
        .select('id')
        .eq('faction_id', factionId)
        .eq('unit_id', unitId)
        .is('user_id', null)
        .maybeSingle();

      let result;
      if (existing) {
        result = await supabase
          .from('aos_custom_unit_data')
          .update({
            stl_files: customData.stlFiles || [],
            preview_image: customData.previewImage || null,
            print_notes: customData.printNotes || null,
            notes: customData.notes || null,
            is_custom: customData.isCustom || false,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        result = await supabase
          .from('aos_custom_unit_data')
          .insert({
            faction_id: factionId,
            unit_id: unitId,
            user_id: null,
            stl_files: customData.stlFiles || [],
            preview_image: customData.previewImage || null,
            print_notes: customData.printNotes || null,
            notes: customData.notes || null,
            is_custom: customData.isCustom || false
          });
      }

      if (result.error) {
        console.error('Error saving custom unit data:', result.error);
        return false;
      }

      console.log('✅ Custom unit data saved to Supabase');
      return true;
    } catch (error) {
      console.error('Error in saveCustomUnitData:', error);
      return false;
    }
  },

  async loadCustomUnitData(): Promise<Map<string, Map<string, any>>> {
    try {
      const { data, error } = await supabase
        .from('aos_custom_unit_data')
        .select('*')
        .is('user_id', null);

      if (error) {
        console.error('Error loading custom unit data:', error);
        return new Map();
      }

      const customDataMap = new Map<string, Map<string, any>>();

      if (data) {
        data.forEach(row => {
          if (!customDataMap.has(row.faction_id)) {
            customDataMap.set(row.faction_id, new Map());
          }

          customDataMap.get(row.faction_id)!.set(row.unit_id, {
            stlFiles: row.stl_files || [],
            previewImage: row.preview_image || '',
            printNotes: row.print_notes || '',
            notes: row.notes || '',
            isCustom: row.is_custom || false
          });
        });

        console.log(`✅ Loaded custom data for ${data.length} units from Supabase`);
      }

      return customDataMap;
    } catch (error) {
      console.error('Error in loadCustomUnitData:', error);
      return new Map();
    }
  },

  async deleteCustomUnitData(factionId: string, unitId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aos_custom_unit_data')
        .delete()
        .eq('faction_id', factionId)
        .eq('unit_id', unitId)
        .is('user_id', null);

      if (error) {
        console.error('Error deleting custom unit data:', error);
        return false;
      }

      console.log('✅ Custom unit data deleted from Supabase');
      return true;
    } catch (error) {
      console.error('Error in deleteCustomUnitData:', error);
      return false;
    }
  }
};
