import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, FileText } from 'lucide-react';
import { AoSUnit, AoSWeapon } from '../types/AoSCollection';
import { FileUpload } from './FileUpload';
import { getAllegianceFromArmy } from '../utils/fileUtils';
import { fileService } from '../services/fileService';

interface AoSUnitEditorProps {
  unit?: AoSUnit | null;
  armyId: string;
  onSave: (unit: AoSUnit) => void;
  onClose: () => void;
}

export function AoSUnitEditor({ unit, armyId, onSave, onClose }: AoSUnitEditorProps) {
  const [formData, setFormData] = useState<AoSUnit>({
    id: '',
    name: '',
    points: 0,
    move: '',
    health: 0,
    save: '',
    control: 0,
    weapons: [],
    abilities: [],
    keywords: [],
    unitSize: '',
    reinforcement: '',
    notes: '',
    stlFiles: [],
    previewImage: '',
    printNotes: '',
    isCustom: !unit
  });

  // Get folder path for this unit
  const allegiance = getAllegianceFromArmy(armyId);

  const [newKeyword, setNewKeyword] = useState('');
  const [newAbility, setNewAbility] = useState({ name: '', description: '' });
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (unit) {
      setFormData(unit);
      // Load existing files from server
      loadExistingFiles();
    } else {
      // Reset form for new unit
      setFormData({
        id: '',
        name: '',
        points: 0,
        move: '',
        health: 0,
        save: '',
        control: 0,
        weapons: [],
        abilities: [],
        keywords: [],
        unitSize: '',
        reinforcement: '',
        notes: '',
        stlFiles: [],
        previewImage: '',
        printNotes: '',
        isCustom: true
      });
    }
  }, [unit]);

  const loadExistingFiles = async () => {
    if (!unit || !unit.name) return;

    setLoadingFiles(true);
    try {
      setFormData(prev => ({
        ...prev,
        previewImage: unit.previewImage || '',
        stlFiles: unit.stlFiles || []
      }));
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };
  const handleInputChange = (field: keyof AoSUnit, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addWeapon = () => {
    const newWeapon: AoSWeapon = {
      name: 'Neue Waffe',
      range: '1"',
      attacks: '1',
      hit: '4+',
      wound: '4+',
      rend: '-',
      damage: '1',
      abilities: []
    };
    setFormData(prev => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon]
    }));
  };

  const updateWeapon = (index: number, field: keyof AoSWeapon, value: any) => {
    setFormData(prev => ({
      ...prev,
      weapons: prev.weapons.map((weapon, i) => 
        i === index ? { ...weapon, [field]: value } : weapon
      )
    }));
  };

  const removeWeapon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      weapons: prev.weapons.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addAbility = () => {
    if (newAbility.name.trim()) {
      const ability = newAbility.description.trim() 
        ? { name: newAbility.name.trim(), description: newAbility.description.trim() }
        : newAbility.name.trim();
      
      setFormData(prev => ({
        ...prev,
        abilities: [...prev.abilities, ability]
      }));
      setNewAbility({ name: '', description: '' });
    }
  };

  const removeAbility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== index)
    }));
  };

  const addSTLFile = () => {
    setFormData(prev => ({
      ...prev,
      stlFiles: [...(prev.stlFiles || []), { name: 'neue_datei.stl', size: '0 MB', variant: '' }]
    }));
  };

  const updateSTLFile = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      stlFiles: prev.stlFiles?.map((file, i) => 
        i === index ? { ...file, [field]: value } : file
      ) || []
    }));
  };

  const removeSTLFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stlFiles: prev.stlFiles?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    // Generate ID if it's a new unit
    if (!formData.id) {
      const id = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, id }));
    }

    // Validate required fields
    if (!formData.name || !formData.points || !formData.move || !formData.health || !formData.save || !formData.control || !formData.unitSize) {
      alert('Bitte fülle alle Pflichtfelder aus.');
      return;
    }

    const finalUnit = {
      ...formData,
      id: formData.id || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    };

    onSave(finalUnit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {unit ? 'Einheit bearbeiten' : 'Neue Einheit erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Grundinformationen</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      placeholder="Einheitenname"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Punkte *</label>
                      <input
                        type="number"
                        value={formData.points}
                        onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Bewegung *</label>
                      <input
                        type="text"
                        value={formData.move}
                        onChange={(e) => handleInputChange('move', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                        placeholder='z.B. 6"'
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Lebenspunkte *</label>
                      <input
                        type="number"
                        value={formData.health}
                        onChange={(e) => handleInputChange('health', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Rettungswurf *</label>
                      <input
                        type="text"
                        value={formData.save}
                        onChange={(e) => handleInputChange('save', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                        placeholder="z.B. 4+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Kontrolle *</label>
                      <input
                        type="number"
                        value={formData.control}
                        onChange={(e) => handleInputChange('control', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Einheitengröße *</label>
                      <input
                        type="text"
                        value={formData.unitSize}
                        onChange={(e) => handleInputChange('unitSize', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                        placeholder="z.B. 1 oder 5-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Verstärkung</label>
                      <input
                        type="text"
                        value={formData.reinforcement || ''}
                        onChange={(e) => handleInputChange('reinforcement', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                        placeholder="z.B. +5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Schlüsselwörter</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => removeKeyword(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    placeholder="Neues Schlüsselwort"
                  />
                  <button
                    onClick={addKeyword}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Images and Files */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Bilder & Dateien</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vorschaubild</label>
                    <FileUpload
                      type="image"
                      accept="image/*"
                      currentValue={formData.previewImage}
                      allegiance={allegiance}
                      faction={armyId}
                      unit={formData.name}
                      autoUpload={true}
                      onUploadComplete={(filePath) => {
                        handleInputChange('previewImage', filePath);
                      }}
                      onRemove={() => handleInputChange('previewImage', '')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Druckhinweise</label>
                    <textarea
                      value={formData.printNotes || ''}
                      onChange={(e) => handleInputChange('printNotes', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                      rows={2}
                      placeholder="Hinweise zum 3D-Druck..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Weapons, Abilities, STL Files */}
            <div className="space-y-6">
              {/* Weapons */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Waffen</h3>
                  <button
                    onClick={addWeapon}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Waffe hinzufügen</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.weapons.map((weapon, index) => (
                    <div key={index} className="border border-gray-600 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={weapon.name}
                          onChange={(e) => updateWeapon(index, 'name', e.target.value)}
                          className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-sm font-medium"
                          placeholder="Waffenname"
                        />
                        <button
                          onClick={() => removeWeapon(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-gray-400">Reichweite</label>
                          <input
                            type="text"
                            value={weapon.range}
                            onChange={(e) => updateWeapon(index, 'range', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400">Angriffe</label>
                          <input
                            type="text"
                            value={weapon.attacks}
                            onChange={(e) => updateWeapon(index, 'attacks', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400">Treffer</label>
                          <input
                            type="text"
                            value={weapon.hit}
                            onChange={(e) => updateWeapon(index, 'hit', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400">Verwundung</label>
                          <input
                            type="text"
                            value={weapon.wound}
                            onChange={(e) => updateWeapon(index, 'wound', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                        <div>
                          <label className="text-gray-400">Durchschlag</label>
                          <input
                            type="text"
                            value={weapon.rend}
                            onChange={(e) => updateWeapon(index, 'rend', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400">Schaden</label>
                          <input
                            type="text"
                            value={weapon.damage}
                            onChange={(e) => updateWeapon(index, 'damage', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Fähigkeiten</h3>
                <div className="space-y-2 mb-4">
                  {formData.abilities.map((ability, index) => {
                    const isAbilityObject = typeof ability === 'object' && ability !== null;
                    const abilityName = isAbilityObject ? ability.name : ability;
                    
                    return (
                      <div key={index} className="bg-gray-600 rounded p-2 flex items-center justify-between">
                        <span className="text-white text-sm">{abilityName}</span>
                        <button
                          onClick={() => removeAbility(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newAbility.name}
                    onChange={(e) => setNewAbility(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    placeholder="Fähigkeitsname"
                  />
                  <textarea
                    value={newAbility.description}
                    onChange={(e) => setNewAbility(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    rows={2}
                    placeholder="Beschreibung (optional)"
                  />
                  <button
                    onClick={addAbility}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Fähigkeit hinzufügen</span>
                  </button>
                </div>
              </div>

              {/* STL Files */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">STL-Dateien</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={addSTLFile}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Manuell hinzufügen</span>
                    </button>
                  </div>
                </div>
                
                {/* File Upload Area */}
                <div className="mb-4">
                  <FileUpload
                    type="stl"
                   accept=".stl,.xz,.gz,.zip,.7z"
                    allegiance={allegiance}
                    faction={armyId}
                    unit={formData.name}
                    autoUpload={true}
                    onUploadComplete={(filePath) => {
                      // Add the uploaded file to the list
                      const fileName = filePath.split('/').pop() || 'unknown.stl';
                      const newSTLFile = {
                        name: fileName,
                        size: '0 MB', // Will be updated by server
                        path: filePath
                      };
                      setFormData(prev => ({
                        ...prev,
                        stlFiles: [...(prev.stlFiles || []), newSTLFile]
                      }));
                      
                      // Reload files to get accurate size info
                      setTimeout(loadExistingFiles, 1000);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  {formData.stlFiles?.map((file, index) => (
                    <div key={index} className="bg-gray-600 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={file.name}
                          onChange={(e) => updateSTLFile(index, 'name', e.target.value)}
                          className="flex-1 bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm mr-2"
                          placeholder="Dateiname.stl"
                        />
                        <button
                          onClick={() => removeSTLFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={file.size}
                          onChange={(e) => updateSTLFile(index, 'size', e.target.value)}
                          className="bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                          placeholder="Größe"
                          readOnly={file.path ? true : false}
                        />
                        <input
                          type="text"
                          value={file.variant || ''}
                          onChange={(e) => updateSTLFile(index, 'variant', e.target.value)}
                          className="bg-gray-500 border border-gray-400 rounded px-2 py-1 text-white text-sm"
                          placeholder="Variante (optional)"
                        />
                      </div>
                      {file.path && (
                        <div className="mt-2 text-xs text-green-400">
                          ✓ Auf Server: {file.path}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Notizen</h3>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                  rows={3}
                  placeholder="Zusätzliche Notizen zur Einheit..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{unit ? 'Speichern' : 'Erstellen'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}