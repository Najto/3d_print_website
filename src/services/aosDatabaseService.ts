import { supabase } from './supabaseClient';
import { AoSGameData, AoSArmy, AoSUnit } from '../types/AoSCollection';
import { aosGameData as initialData } from '../data/aosData';

export const aosDatabaseService = {
  async loadArmiesFromDatabase(): Promise<AoSGameData> {
    try {
      const { data: factions, error: factionsError } = await supabase
        .from('aos_factions')
        .select('*');

      if (factionsError) {
        console.error('Error loading factions:', factionsError);
        return initialData;
      }

      if (!factions || factions.length === 0) {
        console.log('No factions in database, using initial data');
        return initialData;
      }

      const { data: units, error: unitsError } = await supabase
        .from('aos_units')
        .select('*');

      if (unitsError) {
        console.error('Error loading units:', unitsError);
        return initialData;
      }

      const armiesMap = new Map<string, AoSArmy>();

      initialData.armies.forEach(army => {
        armiesMap.set(army.id, { ...army, units: [] });
      });

      initialData.otherCategories?.forEach(category => {
        armiesMap.set(category.id, { ...category, units: [] });
      });

      const factionIdToArmyId = new Map<number, string>();

      const factionNameMapping: Record<string, string> = {
        'blades-of-khorne': 'blades-of-khorne',
        'ironjawz': 'orruk-warclans',
        'kruleboyz': 'orruk-warclans',
        'bonesplitterz-[legends]': 'orruk-warclans',
        'beasts-of-chaos-[legends]': 'beasts-of-chaos'
      };

      factions.forEach(faction => {
        const normalizedName = faction.name.toLowerCase().replace(/\s+/g, '-');

        const mappedArmyId = factionNameMapping[normalizedName];
        if (mappedArmyId && armiesMap.has(mappedArmyId)) {
          factionIdToArmyId.set(faction.id, mappedArmyId);
          return;
        }

        for (const [armyId, army] of armiesMap.entries()) {
          const armyNormalizedName = army.name.toLowerCase().replace(/\s+/g, '-');
          if (normalizedName === armyNormalizedName ||
              armyNormalizedName.includes(normalizedName) ||
              normalizedName.includes(armyNormalizedName)) {
            factionIdToArmyId.set(faction.id, armyId);
            break;
          }
        }
      });

      if (units && units.length > 0) {
        units.forEach(unit => {
          const armyId = factionIdToArmyId.get(unit.faction_id);
          if (!armyId) return;

          const army = armiesMap.get(armyId);
          if (!army) return;

          const unitType = unit.unit_type || '';
          const keywords = unitType ? [unitType] : [];

          const aosUnit: AoSUnit = {
            id: unit.battlescribe_id,
            name: unit.name,
            points: unit.points,
            keywords,
            weapons: [],
            abilities: [{
              name: 'Offizielle Daten',
              description: `Diese Unit wurde aus den offiziellen BSData importiert. Punkte: ${unit.points}${unit.min_size ? `, Größe: ${unit.min_size}${unit.max_size && unit.max_size !== unit.min_size ? `-${unit.max_size}` : ''}` : ''}`
            }],
            stats: {
              move: 0,
              health: 0,
              save: 0,
              control: 0
            },
            imagePath: '',
            stlFiles: []
          };

          army.units.push(aosUnit);
        });
      }

      const updatedArmies = initialData.armies.map(army => {
        const updated = armiesMap.get(army.id);
        return updated || army;
      });

      const updatedOtherCategories = initialData.otherCategories?.map(category => {
        const updated = armiesMap.get(category.id);
        return updated || category;
      });

      return {
        ...initialData,
        armies: updatedArmies,
        otherCategories: updatedOtherCategories || []
      };
    } catch (error) {
      console.error('Error in loadArmiesFromDatabase:', error);
      return initialData;
    }
  }
};
