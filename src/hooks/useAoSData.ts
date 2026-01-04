import { useState, useEffect } from 'react';
import { AoSGameData, AoSUnit, AoSArmy } from '../types/AoSCollection';
import { aosDatabaseService } from '../services/aosDatabaseService';

const STORAGE_KEY = 'aos_custom_data';
const API_BASE_URL = '/api';

export function useAoSData() {
  const [gameData, setGameData] = useState<AoSGameData>(aosDatabaseService.getEmptyGameData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const databaseData = await aosDatabaseService.loadArmiesFromDatabase();
      const customDataMap = await aosDatabaseService.loadCustomUnitData();

      const mergedData = mergeWithCustomData(databaseData, customDataMap);
      setGameData(mergedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setGameData(aosDatabaseService.getEmptyGameData());
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithCustomData = (databaseData: AoSGameData, customDataMap: Map<string, Map<string, any>>) => {
    return {
      ...databaseData,
      armies: databaseData.armies.map(army => {
        const armyCustomData = customDataMap.get(army.id);

        const enrichedUnits = army.units.map(dbUnit => {
          const unitCustomData = armyCustomData?.get(dbUnit.id);
          if (unitCustomData) {
            return {
              ...dbUnit,
              stlFiles: unitCustomData.stlFiles || dbUnit.stlFiles,
              previewImage: unitCustomData.previewImage || dbUnit.previewImage,
              printNotes: unitCustomData.printNotes || dbUnit.printNotes,
              notes: unitCustomData.notes || dbUnit.notes,
              isCustom: unitCustomData.isCustom || dbUnit.isCustom
            };
          }
          return dbUnit;
        });

        return {
          ...army,
          units: enrichedUnits
        };
      }),
      otherCategories: databaseData.otherCategories?.map(category => {
        const categoryCustomData = customDataMap.get(category.id);

        const enrichedUnits = category.units.map(dbUnit => {
          const unitCustomData = categoryCustomData?.get(dbUnit.id);
          if (unitCustomData) {
            return {
              ...dbUnit,
              stlFiles: unitCustomData.stlFiles || dbUnit.stlFiles,
              previewImage: unitCustomData.previewImage || dbUnit.previewImage,
              printNotes: unitCustomData.printNotes || dbUnit.printNotes,
              notes: unitCustomData.notes || dbUnit.notes,
              isCustom: unitCustomData.isCustom || dbUnit.isCustom
            };
          }
          return dbUnit;
        });

        return {
          ...category,
          units: enrichedUnits
        };
      }) || []
    };
  };

  const saveCustomData = async (factionId: string, unit: AoSUnit) => {
    try {
      const customData = {
        stlFiles: unit.stlFiles,
        previewImage: unit.previewImage,
        printNotes: unit.printNotes,
        notes: unit.notes,
        isCustom: unit.isCustom
      };

      await aosDatabaseService.saveCustomUnitData(factionId, unit.id, customData);
    } catch (error) {
      console.error('Error saving custom data:', error);
    }
  };

  const updateUnit = (armyId: string, unit: AoSUnit) => {
    const newGameData = {
      ...gameData,
      armies: gameData.armies.map(army => {
        if (army.id === armyId) {
          const existingUnitIndex = army.units.findIndex(u => u.id === unit.id);
          let newUnits;

          if (existingUnitIndex >= 0) {
            newUnits = army.units.map((u, index) =>
              index === existingUnitIndex ? unit : u
            );
          } else {
            newUnits = [...army.units, unit];
          }

          return {
            ...army,
            units: newUnits
          };
        }
        return army;
      }),
      otherCategories: gameData.otherCategories?.map(category => {
        if (category.id === armyId) {
          const existingUnitIndex = category.units.findIndex(u => u.id === unit.id);
          let newUnits;

          if (existingUnitIndex >= 0) {
            newUnits = category.units.map((u, index) =>
              index === existingUnitIndex ? unit : u
            );
          } else {
            newUnits = [...category.units, unit];
          }

          return {
            ...category,
            units: newUnits
          };
        }
        return category;
      }) || []
    };

    setGameData(newGameData);
    saveCustomData(armyId, unit);
  };

  const deleteUnit = async (armyId: string, unitId: string) => {
    const newGameData = {
      ...gameData,
      armies: gameData.armies.map(army => {
        if (army.id === armyId) {
          return {
            ...army,
            units: army.units.filter(u => u.id !== unitId)
          };
        }
        return army;
      }),
      otherCategories: gameData.otherCategories?.map(category => {
        if (category.id === armyId) {
          return {
            ...category,
            units: category.units.filter(u => u.id !== unitId)
          };
        }
        return category;
      }) || []
    };

    setGameData(newGameData);
    await aosDatabaseService.deleteCustomUnitData(armyId, unitId);
  };

  const resetToDefault = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await loadData();
  };

  const scanFoldersForNewUnits = async (armyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan-folders/${armyId}`);
      if (response.ok) {
        const result = await response.json();
        return result.newUnits || [];
      }
    } catch (error) {
      console.error('Error scanning folders:', error);
    }
    return [];
  };

  const scanAllFoldersForNewUnits = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan-all-folders`);
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error('Error scanning all folders:', error);
    }
    return { allNewUnits: {}, totalNewUnits: 0, scannedArmies: 0, summary: [] };
  };
  const addScannedUnits = async (armyId: string, newUnits: AoSUnit[]) => {
    if (newUnits.length === 0) return;

    const newGameData = {
      ...gameData,
      armies: gameData.armies.map(army => {
        if (army.id === armyId) {
          const existingUnitIds = army.units.map(u => u.id);
          const unitsToAdd = newUnits.filter(unit => !existingUnitIds.includes(unit.id));

          return {
            ...army,
            units: [...army.units, ...unitsToAdd]
          };
        }
        return army;
      }),
      otherCategories: gameData.otherCategories?.map(category => {
        if (category.id === armyId) {
          const existingUnitIds = category.units.map(u => u.id);
          const unitsToAdd = newUnits.filter(unit => !existingUnitIds.includes(unit.id));

          return {
            ...category,
            units: [...category.units, ...unitsToAdd]
          };
        }
        return category;
      }) || []
    };

    setGameData(newGameData);

    for (const unit of newUnits) {
      await saveCustomData(armyId, unit);
    }
  };

  const addAllScannedUnits = async (allNewUnits: { [armyId: string]: AoSUnit[] }) => {
    let newGameData = { ...gameData };

    Object.entries(allNewUnits).forEach(([armyId, newUnits]) => {
      if (newUnits.length === 0) return;

      newGameData.armies = newGameData.armies.map(army => {
        if (army.id === armyId) {
          const existingUnitIds = army.units.map(u => u.id);
          const unitsToAdd = newUnits.filter(unit => !existingUnitIds.includes(unit.id));

          return {
            ...army,
            units: [...army.units, ...unitsToAdd]
          };
        }
        return army;
      });

      newGameData.otherCategories = newGameData.otherCategories?.map(category => {
        if (category.id === armyId) {
          const existingUnitIds = category.units.map(u => u.id);
          const unitsToAdd = newUnits.filter(unit => !existingUnitIds.includes(unit.id));

          return {
            ...category,
            units: [...category.units, ...unitsToAdd]
          };
        }
        return category;
      }) || [];
    });

    setGameData(newGameData);

    for (const [armyId, newUnits] of Object.entries(allNewUnits)) {
      for (const unit of newUnits) {
        await saveCustomData(armyId, unit);
      }
    }
  };
  return {
    gameData,
    isLoading,
    updateUnit,
    deleteUnit,
    resetToDefault,
    scanFoldersForNewUnits,
    scanAllFoldersForNewUnits,
    addScannedUnits,
    addAllScannedUnits,
    reloadData: loadData
  };
}