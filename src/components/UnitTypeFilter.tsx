import React from 'react';
import { Shield, Users, Swords, Skull, Cog, Mountain, Sparkles, Layers } from 'lucide-react';
import { AoSUnit, AoSArmyTheme } from '../types/AoSCollection';

export type UnitType = 'ALLE' | 'HERO' | 'INFANTRY' | 'CAVALRY' | 'MONSTER' | 'WAR MACHINE' | 'FACTION TERRAIN' | 'ENDLESS SPELL';

interface UnitTypeFilterProps {
  units: AoSUnit[];
  selectedType: UnitType;
  onTypeChange: (type: UnitType) => void;
  theme: AoSArmyTheme;
}

const unitTypeConfig = [
  { type: 'ALLE' as UnitType, label: 'Alle', icon: Layers, keywords: [] },
  { type: 'HERO' as UnitType, label: 'Hero', icon: Shield, keywords: ['HERO', 'COMMANDER', 'LEADER'] },
  { type: 'INFANTRY' as UnitType, label: 'Infantry', icon: Users, keywords: ['INFANTRY'] },
  { type: 'CAVALRY' as UnitType, label: 'Cavalry', icon: Swords, keywords: ['CAVALRY'] },
  { type: 'MONSTER' as UnitType, label: 'Monster', icon: Skull, keywords: ['MONSTER'] },
  { type: 'WAR MACHINE' as UnitType, label: 'War Machine', icon: Cog, keywords: ['WAR MACHINE', 'WARMACHINE', 'ARTILLERY'] },
  { type: 'FACTION TERRAIN' as UnitType, label: 'Faction Terrain', icon: Mountain, keywords: ['FACTION TERRAIN', 'TERRAIN'] },
  { type: 'ENDLESS SPELL' as UnitType, label: 'Endless Spell', icon: Sparkles, keywords: ['ENDLESS SPELL', 'INVOCATION', 'MANIFESTATION'] }
];

export function getUnitTypeFromKeywords(unit: AoSUnit): UnitType[] {
  if (!unit.keywords || unit.keywords.length === 0) return ['ALLE'];

  const types: UnitType[] = [];
  const keywordsUpper = unit.keywords.map(k => k.toUpperCase());

  for (const config of unitTypeConfig.slice(1)) {
    if (config.keywords.some(keyword => keywordsUpper.includes(keyword))) {
      types.push(config.type);
    }
  }

  return types.length > 0 ? types : ['ALLE'];
}

export function filterUnitsByType(units: AoSUnit[], selectedType: UnitType): AoSUnit[] {
  if (selectedType === 'ALLE') return units;

  return units.filter(unit => {
    const unitTypes = getUnitTypeFromKeywords(unit);
    return unitTypes.includes(selectedType);
  });
}

export function UnitTypeFilter({ units, selectedType, onTypeChange, theme }: UnitTypeFilterProps) {
  const getUnitCountForType = (type: UnitType): number => {
    if (type === 'ALLE') return units.length;
    return filterUnitsByType(units, type).length;
  };

  return (
    <div className="mb-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-2">
        <div className="flex overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {unitTypeConfig.map(({ type, label, icon: Icon }) => {
            const count = getUnitCountForType(type);
            const isActive = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                disabled={count === 0 && type !== 'ALLE'}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-300 whitespace-nowrap flex-shrink-0
                  ${count === 0 && type !== 'ALLE'
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:scale-105 cursor-pointer'
                  }
                  ${isActive
                    ? 'text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                  }
                `}
                style={isActive ? {
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 0 20px ${theme.accentColor}40`
                } : {
                  backgroundColor: 'rgb(31, 41, 55)'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <span
                  className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-black/30' : 'bg-gray-700'}
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
