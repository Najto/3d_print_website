import React from 'react';
import { ChevronRight, Users, Zap, Shield } from 'lucide-react';
import { AoSArmy } from '../types/AoSCollection';

interface AoSArmyCardProps {
  army: AoSArmy;
  onClick: () => void;
}

export function AoSArmyCard({ army, onClick }: AoSArmyCardProps) {
  const unitCount = army.units.length;
  const totalPoints = army.units.reduce((acc, unit) => acc + unit.points, 0);
  const stlCount = army.units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0).length;

  const getAllegianceColor = (allegiance: string) => {
    switch (allegiance) {
      case 'Order': return 'bg-blue-600';
      case 'Chaos': return 'bg-red-600';
      case 'Death': return 'bg-purple-600';
      case 'Destruction': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getAllegianceIcon = (allegiance: string) => {
    switch (allegiance) {
      case 'Order': return <Shield className="w-5 h-5" />;
      case 'Chaos': return <Zap className="w-5 h-5" />;
      case 'Death': return <Users className="w-5 h-5" />;
      case 'Destruction': return <Users className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-yellow-500"
    >
      <div className="flex items-center justify-between flex-wrap mb-4">
        <div className="flex items-center flex-wrap space-x-3">
          <div className={`p-3 ${getAllegianceColor(army.allegiance)} rounded-lg group-hover:opacity-90 transition-opacity`}>
            {getAllegianceIcon(army.allegiance)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
              {army.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{unitCount} Einheiten</span>
              <span>~{totalPoints} Punkte</span>
              {stlCount > 0 && (
                <span className="text-green-400">{stlCount} STL verfügbar</span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
      </div>
      
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm text-white ${getAllegianceColor(army.allegiance)}`}>
          {army.allegiance}
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {army.description}
      </p>

      {army.playstyle && (
        <div className="text-xs text-gray-400 italic">
          🎯 {army.playstyle}
        </div>
      )}
    </div>
  );
}