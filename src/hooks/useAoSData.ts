import { useState, useEffect } from 'react';
import { AoSGameData, AoSUnit, AoSArmy } from '../types/AoSCollection';
import { aosGameData as initialData } from '../data/aosData';
import { aosDatabaseService } from '../services/aosDatabaseService';

const STORAGE_KEY = 'aos_custom_data';
const API_BASE_URL = '/api';

export function useAoSData() {
  const [gameData, setGameData] = useState<AoSGameData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const databaseData = await aosDatabaseService.loadArmiesFromDatabase();

      const response = await fetch(`${API_BASE_URL}/data`);
      if (response.ok) {
        const serverData = await response.json();
        const mergedData = mergeWithDatabaseData(databaseData, serverData);
        setGameData(mergedData);
        return;
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const customData = JSON.parse(savedData);
          const mergedData = mergeWithDatabaseData(databaseData, customData);
          setGameData(mergedData);
        } catch (error) {
          console.error('Error loading localStorage data:', error);
          setGameData(databaseData);
        }
      } else {
        setGameData(databaseData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setGameData(initialData);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeWithDatabaseData = (databaseData: AoSGameData, customData: any) => {
    return {
      ...databaseData,
      armies: databaseData.armies.map(army => {
        const customArmy = customData.armies?.find((a: AoSArmy) => a.id === army.id);
        if (customArmy && customArmy.units && customArmy.units.length > 0) {
          const mergedUnits = [...army.units];

          customArmy.units.forEach((customUnit: AoSUnit) => {
            const existingIndex = mergedUnits.findIndex(u => u.id === customUnit.id);
            if (existingIndex >= 0) {
              mergedUnits[existingIndex] = customUnit;
            } else {
              mergedUnits.push(customUnit);
            }
          });

          return {
            ...army,
            units: mergedUnits
          };
        }
        return army;
      }),
      otherCategories: databaseData.otherCategories?.map(category => {
        const customCategory = customData.otherCategories?.find((c: AoSArmy) => c.id === category.id);
        if (customCategory && customCategory.units && customCategory.units.length > 0) {
          const mergedUnits = [...category.units];

          customCategory.units.forEach((customUnit: AoSUnit) => {
            const existingIndex = mergedUnits.findIndex(u => u.id === customUnit.id);
            if (existingIndex >= 0) {
              mergedUnits[existingIndex] = customUnit;
            } else {
              mergedUnits.push(customUnit);
            }
          });

          return {
            ...category,
            units: mergedUnits
          };
        }
        return category;
      }) || []
    };
  };

  // Save custom data to both server and localStorage
  const saveCustomData = async (data: AoSGameData) => {
    const customData = {
      armies: data.armies.map(army => ({
        id: army.id,
        units: army.units
      })),
      otherCategories: data.otherCategories?.map(category => ({
        id: category.id,
        units: category.units
      })) || []
    };

    // Save to server
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customData),
      });

      if (response.ok) {
        console.log('✅ Data saved to server');
      } else {
        throw new Error('Server save failed');
      }
    } catch (error) {
      console.error('❌ Failed to save to server:', error);
      // Fallback to localStorage if server fails
    }

    // Always save to localStorage as backup
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
      console.log('✅ Data saved to localStorage (backup)');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
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
            // Update existing unit
            newUnits = army.units.map((u, index) => 
              index === existingUnitIndex ? unit : u
            );
          } else {
            // Add new unit
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
            // Update existing unit
            newUnits = category.units.map((u, index) => 
              index === existingUnitIndex ? unit : u
            );
          } else {
            // Add new unit
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
    saveCustomData(newGameData);
  };

  const deleteUnit = (armyId: string, unitId: string) => {
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
    saveCustomData(newGameData);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    // Also clear server data
    fetch(`${API_BASE_URL}/data`, { method: 'DELETE' }).catch(console.error);
    setGameData(initialData);
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
  const addScannedUnits = (armyId: string, newUnits: AoSUnit[]) => {
    if (newUnits.length === 0) return;
    
    const newGameData = {
      ...gameData,
      armies: gameData.armies.map(army => {
        if (army.id === armyId) {
          // Filter out units that already exist
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
          // Filter out units that already exist
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
    saveCustomData(newGameData);
  };

  const addAllScannedUnits = (allNewUnits: { [armyId: string]: AoSUnit[] }) => {
    let newGameData = { ...gameData };
    
    // Process each army's new units
    Object.entries(allNewUnits).forEach(([armyId, newUnits]) => {
      if (newUnits.length === 0) return;
      
      // Update armies
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
      
      // Update other categories
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
    saveCustomData(newGameData);
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