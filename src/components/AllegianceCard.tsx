import React from 'react';
import { Shield, Zap, Skull, Mountain, Sparkles, ChevronRight } from 'lucide-react';

interface AllegianceCardProps {
  allegiance: {
    name: string;
    description: string;
    color: string;
    icon: string;
    armies: string[];
  };
  armyCount: number;
}

export function AllegianceCard({ allegiance, armyCount }: AllegianceCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield': return <Shield className="w-8 h-8" />;
      case 'zap': return <Zap className="w-8 h-8" />;
      case 'skull': return <Skull className="w-8 h-8" />;
      case 'mountain': return <Mountain className="w-8 h-8" />;
      case 'sparkles': return <Sparkles className="w-8 h-8" />;
      default: return <Shield className="w-8 h-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-blue-600',
        hover: 'hover:bg-blue-500',
        border: 'hover:border-blue-500',
        text: 'group-hover:text-blue-400'
      };
      case 'red': return {
        bg: 'bg-red-600',
        hover: 'hover:bg-red-500',
        border: 'hover:border-red-500',
        text: 'group-hover:text-red-400'
      };
      case 'purple': return {
        bg: 'bg-purple-600',
        hover: 'hover:bg-purple-500',
        border: 'hover:border-purple-500',
        text: 'group-hover:text-purple-400'
      };
      case 'green': return {
        bg: 'bg-green-600',
        hover: 'hover:bg-green-500',
        border: 'hover:border-green-500',
        text: 'group-hover:text-green-400'
      };
      case 'gray': return {
        bg: 'bg-gray-600',
        hover: 'hover:bg-gray-500',
        border: 'hover:border-gray-500',
        text: 'group-hover:text-gray-400'
      };
      default: return {
        bg: 'bg-gray-600',
        hover: 'hover:bg-gray-500',
        border: 'hover:border-gray-500',
        text: 'group-hover:text-gray-400'
      };
    }
  };

  const colors = getColorClasses(allegiance.color);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-4 mb-4">
          <div className={`p-4 ${colors.bg} rounded-lg`}>
            {getIcon(allegiance.icon)}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">
              {allegiance.name}
            </h2>
            <p className="text-gray-400 text-sm mb-3">
              {armyCount} {armyCount === 1 ? 'Armee' : 'Armeen'}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {allegiance.description}
            </p>
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm text-white ${colors.bg}`}>
            {allegiance.name}
          </div>
      </div>
    </div>
  );
}