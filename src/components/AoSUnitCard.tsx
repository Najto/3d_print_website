import React, { useState } from 'react';
import { Download, FileText, Zap, Shield, Swords, Eye, Edit, Trash2 } from 'lucide-react';
import { AoSUnit } from '../types/AoSCollection';

interface AoSUnitCardProps {
  unit: AoSUnit;
  onViewDetails?: (unit: AoSUnit) => void;
  onEdit?: (unit: AoSUnit) => void;
  onDelete?: (unit: AoSUnit) => void;
}

export function AoSUnitCard({ unit, onViewDetails, onEdit, onDelete }: AoSUnitCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const totalSTLSize = unit.stlFiles?.reduce((acc, file) => {
    const size = parseFloat(file.size);
    return acc + size;
  }, 0) || 0;

  const getKeywordColor = (keyword: string) => {
    if (keyword.includes('Hero')) return 'bg-yellow-600';
    if (keyword.includes('Infantry')) return 'bg-blue-600';
    if (keyword.includes('Cavalry')) return 'bg-green-600';
    if (keyword.includes('Monster')) return 'bg-red-600';
    if (keyword.includes('War Machine')) return 'bg-purple-600';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-700 hover:border-yellow-500">
      {/* Preview Image */}
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        <img
          src={unit.previewImage || '/image.png'}
          alt={unit.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {unit.points} Punkte
        </div>
        {unit.stlFiles && unit.stlFiles.length > 0 && (
          <div className="absolute top-3 left-3 bg-green-600 bg-opacity-90 text-white px-2 py-1 rounded text-sm">
            STL verfügbar
          </div>
        )}
      </div>
      
      <div className="p-6">
        {/* Unit Name and Basic Stats */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-yellow-400 transition-colors">
            {unit.name}
          </h3>
          {unit.isCustom && (
            <div className="text-orange-500 text-sm font-semibold mb-2">
              -CUSTOM-
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="bg-gray-700 rounded p-2 text-center">
              <div className="text-gray-400">Move</div>
              <div className="text-white font-semibold">{unit.move}</div>
            </div>
            <div className="bg-gray-700 rounded p-2 text-center">
              <div className="text-gray-400">Health</div>
              <div className="text-white font-semibold">{unit.health}</div>
            </div>
            <div className="bg-gray-700 rounded p-2 text-center">
              <div className="text-gray-400">Save</div>
              <div className="text-white font-semibold">{unit.save}</div>
            </div>
            <div className="bg-gray-700 rounded p-2 text-center">
              <div className="text-gray-400">Control</div>
              <div className="text-white font-semibold">{unit.control}</div>
            </div>
          </div>
        </div>

        {/* Unit Size */}
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <Swords className="w-4 h-4 mr-1" />
          <span>Einheitengröße: {unit.unitSize}</span>
          {unit.reinforcement && (
            <span className="ml-2 text-green-400">(+{unit.reinforcement})</span>
          )}
        </div>

        {/* Keywords */}
        {unit.keywords && unit.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {unit.keywords.slice(0, 4).map((keyword, index) => (
              <span
                key={index}
                className={`${getKeywordColor(keyword)} text-white px-2 py-1 rounded-full text-xs`}
              >
                {keyword}
              </span>
            ))}
            {unit.keywords.length > 4 && (
              <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-xs">
                +{unit.keywords.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Weapons Preview */}
        {unit.weapons && unit.weapons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Waffen:</h4>
            <div className="space-y-1">
              {unit.weapons.slice(0, 2).map((weapon, index) => (
                <div key={index} className="text-sm text-gray-400">
                  <span className="text-white">{weapon.name}</span>
                  <span className="ml-2">
                    {weapon.range} • {weapon.attacks}A • {weapon.damage}D
                  </span>
                </div>
              ))}
              {unit.weapons.length > 2 && (
                <div className="text-sm text-gray-400">
                  +{unit.weapons.length - 2} weitere Waffen
                </div>
              )}
            </div>
          </div>
        )}

        {/* STL Files Info */}
        {unit.stlFiles && unit.stlFiles.length > 0 && (
          <div className="mb-4 p-3 bg-gray-700 rounded">
            <div className="flex items-center text-green-400 text-sm mb-2">
              <FileText className="w-4 h-4 mr-1" />
              <span>3D-Druckdateien ({unit.stlFiles.length})</span>
            </div>
            <div className="text-xs text-gray-400">
              Gesamt: {totalSTLSize.toFixed(1)} MB
            </div>
            {unit.printNotes && (
              <div className="text-xs text-gray-300 mt-1">
                💡 {unit.printNotes}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mb-2">
          <button 
            onClick={() => onViewDetails?.(unit)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
          
          {unit.stlFiles && unit.stlFiles.length > 0 && (
            <button className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>STL</span>
            </button>
          )}
          
          {(!unit.stlFiles || unit.stlFiles.length === 0) && (
            <button 
              disabled
              className="bg-gray-600 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Nicht verfügbar</span>
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}