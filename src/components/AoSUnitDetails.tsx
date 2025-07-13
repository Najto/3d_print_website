import React from 'react';
import { X, Download, FileText, Zap, Shield, Swords, Info, Edit, Trash2 } from 'lucide-react';
import { AoSUnit } from '../types/AoSCollection';
import { fileService } from '../services/fileService';

interface AoSUnitDetailsProps {
  unit: AoSUnit;
  onClose: () => void;
  onEdit?: (unit: AoSUnit) => void;
  onDelete?: (unit: AoSUnit) => void;
}

export function AoSUnitDetails({ unit, onClose, onEdit, onDelete }: AoSUnitDetailsProps) {
  const totalSTLSize = unit.stlFiles?.reduce((acc, file) => {
    const size = parseFloat(file.size);
    return acc + size;
  }, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{unit.name}</h2>
            <div className="text-yellow-400 font-semibold">{unit.points} Punkte</div>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(unit)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Bearbeiten</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(unit)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Löschen</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Preview Image */}
              {unit.previewImage && (
                <div className="mb-6">
                  <img
                    src={unit.previewImage.startsWith('http') ? unit.previewImage : fileService.getDownloadUrl(unit.previewImage)}
                    alt={unit.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Basic Stats */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Grundwerte</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Bewegung</div>
                    <div className="text-white font-semibold">{unit.move}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Lebenspunkte</div>
                    <div className="text-white font-semibold">{unit.health}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Rettungswurf</div>
                    <div className="text-white font-semibold">{unit.save}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Kontrolle</div>
                    <div className="text-white font-semibold">{unit.control}</div>
                  </div>
                </div>
              </div>

              {/* Unit Size */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Einheitengröße</h3>
                <div className="text-white">
                  {unit.unitSize}
                  {unit.reinforcement && (
                    <span className="text-green-400 ml-2">(Verstärkung: +{unit.reinforcement})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Weapons */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Waffen</h3>
                <div className="space-y-3">
                  {unit.weapons.map((weapon, index) => (
                    <div key={index} className="border border-gray-600 rounded p-3">
                      <div className="font-semibold text-white mb-2">{weapon.name}</div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <div className="text-gray-400">Reichweite</div>
                          <div className="text-white">{weapon.range}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Angriffe</div>
                          <div className="text-white">{weapon.attacks}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Treffer</div>
                          <div className="text-white">{weapon.hit}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Verwundung</div>
                          <div className="text-white">{weapon.wound}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <div className="text-gray-400">Durchschlag</div>
                          <div className="text-white">{weapon.rend || "-"}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Schaden</div>
                          <div className="text-white">{weapon.damage}</div>
                        </div>
                      </div>
                      {weapon.abilities && weapon.abilities.length > 0 && (
                        <div className="mt-2">
                          <div className="text-gray-400 text-sm">Fähigkeiten:</div>
                          <div className="text-white text-sm">{weapon.abilities.join(", ")}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Fähigkeiten</h3>
                <div className="space-y-2">
                  {unit.abilities.map((ability, index) => {
                    const isAbilityObject = typeof ability === 'object' && ability !== null;
                    const abilityName = isAbilityObject ? ability.name : ability;
                    const abilityDescription = isAbilityObject ? ability.description : null;
                    
                    return (
                      <div key={index} className="relative group">
                        <div className="text-white bg-gray-600 rounded p-3 flex items-center justify-between hover:bg-gray-500 transition-colors cursor-help">
                          <span className="font-medium">{abilityName}</span>
                          {abilityDescription && (
                            <Info className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                          )}
                        </div>
                        
                        {/* Tooltip */}
                        {abilityDescription && (
                          <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm text-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
                            <div className="font-semibold text-white mb-1">{abilityName}</div>
                            <div className="leading-relaxed">{abilityDescription}</div>
                            {/* Arrow pointing up */}
                            <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 border-l border-t border-gray-600 transform rotate-45"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Schlüsselwörter</h3>
                <div className="flex flex-wrap gap-2">
                  {unit.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STL Files Section */}
          {unit.stlFiles && unit.stlFiles.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-400" />
                3D-Druckdateien
              </h3>
              
              {unit.printNotes && (
                <div className="bg-blue-900 border border-blue-700 rounded p-3 mb-4">
                  <div className="text-blue-300 text-sm">
                    💡 <strong>Druckhinweise:</strong> {unit.printNotes}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {unit.stlFiles.map((file, index) => (
                  <div key={index} className="bg-gray-600 rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{file.name}</div>
                      <div className="text-gray-400 text-sm">
                        {file.compressedSize || file.size}
                        {file.isCompressed && (
                          <span className="ml-2 text-green-400">
                            📦 {file.preCompressed ? 'Pre-komprimiert' : `Komprimiert (${file.compressionRatio} gespart)`}
                          </span>
                        )}
                        {file.variant && (
                          <span className="ml-2 text-green-400">({file.variant})</span>
                        )}
                        {file.fileId && (
                          <span className="ml-2 text-blue-400">📁 Hochgeladen</span>
                        )}
                      </div>
                    </div>
                   <div className="flex space-x-1">
                     <button 
                       onClick={() => {
                         if (file.path || file.actualName) {
                           const fileName = file.actualName || file.name;
                           const downloadUrl = `/api/download/${getAllegianceFromArmy(armyId)}/${armyId}/${unit.name}/${fileName}`;
                           const link = document.createElement('a');
                           link.href = downloadUrl;
                           link.download = file.name.replace(/\.(xz|gz|zip|7z)$/i, '.stl');
                           document.body.appendChild(link);
                           link.click();
                           document.body.removeChild(link);
                         } else {
                           alert('Diese Datei ist nicht zum Download verfügbar.');
                         }
                       }}
                       className="bg-green-600 hover:bg-green-500 text-white p-2 rounded transition-colors"
                       title="STL herunterladen (dekomprimiert)"
                     >
                       <Download className="w-4 h-4" />
                     </button>
                     {file.isCompressed && (
                       <button 
                         onClick={() => {
                           if (file.path || file.actualName) {
                             const fileName = file.actualName || file.name;
                             const downloadUrl = `/api/download/${getAllegianceFromArmy(armyId)}/${armyId}/${unit.name}/${fileName}/compressed`;
                             const link = document.createElement('a');
                             link.href = downloadUrl;
                             link.download = fileName;
                             document.body.appendChild(link);
                             link.click();
                             document.body.removeChild(link);
                           }
                         }}
                         className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded transition-colors"
                         title="Komprimierte Datei herunterladen"
                       >
                         📦
                       </button>
                     )}
                   </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  Gesamt: {totalSTLSize.toFixed(1)} MB
                  {unit.stlFiles?.some(f => f.isCompressed) && (
                    <span className="ml-2 text-green-400">
                      💾 Speicher gespart durch Komprimierung
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    // Download all files as compressed archive
                    const downloadUrl = `/api/download-all/${getAllegianceFromArmy(armyId)}/${armyId}/${unit.name}`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${unit.name}_stl_files.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Alle als ZIP herunterladen</span>
                </button>
              </div>
            </div>
          )}

          {unit.notes && (
            <div className="bg-gray-700 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Notizen</h3>
              <div className="text-gray-300">{unit.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}