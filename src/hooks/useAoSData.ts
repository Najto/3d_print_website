import { useState, useEffect } from 'react';
import { AoSGameData, AoSUnit, AoSArmy } from '../types/AoSCollection';
import { aosGameData as initialData } from '../data/aosData';

const STORAGE_KEY = 'aos_custom_data';
const API_BASE_URL = '/api';

export function useAoSData() {
  const [gameData, setGameData] = useState<AoSGameData>(initialData);

  // Load custom data from server and localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from server first
      const response = await fetch(`${API_BASE_URL}/data`);
      if (response.ok) {
        const serverData = await response.json();
        const mergedData = mergeWithInitialData(serverData);
        setGameData(mergedData);
        return;
      }
    } catch (error) {
      console.log('Server data not available, trying localStorage...');
    }

    // Fallback to localStorage
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const customData = JSON.parse(savedData);
        const mergedData = mergeWithInitialData(customData);
        setGameData(mergedData);
      } catch (error) {
        console.error('Error loading localStorage data:', error);
      }
    }
  };

  const mergeWithInitialData = (customData: any) => {
    return {
      ...initialData,
      armies: initialData.armies.map(army => {
        const customArmy = customData.armies?.find((a: AoSArmy) => a.id === army.id);
        if (customArmy) {
          return {
            ...army,
            units: customArmy.units
          };
        }
        return army;
      }),
      otherCategories: initialData.otherCategories?.map(category => {
        const customCategory = customData.otherCategories?.find((c: AoSArmy) => c.id === category.id);
        if (customCategory) {
          return {
            ...category,
            units: customCategory.units
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

  return {
    gameData,
    updateUnit,
    deleteUnit,
    resetToDefault,
    scanFoldersForNewUnits,
    addScannedUnits
  };
}