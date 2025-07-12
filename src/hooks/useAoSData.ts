import { useState, useEffect } from 'react';
import { AoSGameData, AoSUnit, AoSArmy } from '../types/AoSCollection';
import { aosGameData as initialData } from '../data/aosData';

const STORAGE_KEY = 'aos_custom_data';

export function useAoSData() {
  const [gameData, setGameData] = useState<AoSGameData>(initialData);

  // Load custom data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const customData = JSON.parse(savedData);
        // Merge custom data with initial data
        const mergedData = {
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
          })
        };
        setGameData(mergedData);
      } catch (error) {
        console.error('Error loading custom data:', error);
      }
    }
  }, []);

  // Save custom data to localStorage
  const saveCustomData = (data: AoSGameData) => {
    try {
      // Only save armies with their units (not the entire game data)
      const customData = {
        armies: data.armies.map(army => ({
          id: army.id,
          units: army.units
        }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
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
      })
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
      })
    };
    
    setGameData(newGameData);
    saveCustomData(newGameData);
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameData(initialData);
  };

  return {
    gameData,
    updateUnit,
    deleteUnit,
    resetToDefault
  };
}