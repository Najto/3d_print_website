import React, { useState } from 'react';
import { Sword, Search, Home, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { AllegianceCard } from './components/AllegianceCard';
import { AoSArmyCard } from './components/AoSArmyCard';
import { AoSUnitCard } from './components/AoSUnitCard';
import { AoSUnitDetails } from './components/AoSUnitDetails';
import { AoSUnitEditor } from './components/AoSUnitEditor';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { SearchBar } from './components/SearchBar';
import { ArmyPageHeader } from './components/ArmyPageHeader';
import { UnitTypeFilter, filterUnitsByType, UnitType } from './components/UnitTypeFilter';
import Settings from './components/Settings';
import { useAoSData } from './hooks/useAoSData';
import { AoSUnit } from './types/AoSCollection';
import { getFactionTheme } from './utils/factionThemes';

function App() {
  const { gameData, isLoading, updateUnit, deleteUnit, reloadData } = useAoSData();
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<AoSUnit | null>(null);
  const [editingUnit, setEditingUnit] = useState<AoSUnit | null>(null);
  const [editingArmyId, setEditingArmyId] = useState<string>('');
  const [deletingUnit, setDeletingUnit] = useState<AoSUnit | null>(null);
  const [deletingArmyId, setDeletingArmyId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType>('ALLE');

  const selectedFaction = selectedFactionId
    ? gameData.armies.find(army => army.id === selectedFactionId)
    : null;

  const isSearchActive = searchTerm.length > 0;

  const searchResults = isSearchActive
    ? gameData.armies.flatMap(army =>
        army.units
          .filter(unit => {
            const searchLower = searchTerm.toLowerCase();
            return (
              unit.name.toLowerCase().includes(searchLower) ||
              army.name.toLowerCase().includes(searchLower) ||
              unit.keywords.some(k => k.toLowerCase().includes(searchLower))
            );
          })
          .map(unit => ({ ...unit, factionName: army.name }))
      )
    : [];

  const handleFactionClick = (factionId: string) => {
    setSelectedFactionId(factionId);
    setSelectedUnitType('ALLE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedFactionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnitClick = (unit: AoSUnit) => {
    setSelectedUnit(unit);
  };

  const handleEditUnit = (unit: AoSUnit, armyId: string) => {
    setEditingUnit(unit);
    setEditingArmyId(armyId);
    setSelectedUnit(null);
  };

  const handleSaveUnit = (unit: AoSUnit) => {
    updateUnit(editingArmyId, unit);
    setEditingUnit(null);
    setEditingArmyId('');
  };

  const handleCloseEditor = () => {
    setEditingUnit(null);
    setEditingArmyId('');
  };

  const handleCreateCustomUnit = (armyId: string) => {
    setEditingUnit(null);
    setEditingArmyId(armyId);
  };

  const handleDeleteUnit = (unit: AoSUnit, armyId: string) => {
    if (!unit.isCustom) {
      alert('Nur Custom Units können gelöscht werden!');
      return;
    }
    setDeletingUnit(unit);
    setDeletingArmyId(armyId);
    setSelectedUnit(null);
  };

  const confirmDeleteUnit = async () => {
    if (deletingUnit && deletingArmyId) {
      await deleteUnit(deletingArmyId, deletingUnit.id);
      setDeletingUnit(null);
      setDeletingArmyId('');
    }
  };

  const cancelDeleteUnit = () => {
    setDeletingUnit(null);
    setDeletingArmyId('');
  };

  if (showSettings) {
    return (
      <Settings
        onBack={() => setShowSettings(false)}
        onDataUpdated={() => reloadData()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Lade Daten aus der Datenbank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Warhammer Age of Sigmar</h1>
                <p className="text-gray-400 text-sm">4. Edition - Armeen & 3D-Druckdateien</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Einstellungen</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Suche nach Einheiten, Armeen oder Schlüsselwörtern..."
          />
        </div>

        {!isSearchActive && selectedFaction && (
          <nav className="sticky top-16 z-20 bg-gray-900 py-4 mb-6 border-b border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <button
                onClick={handleBackToHome}
                className="flex items-center hover:text-yellow-400 transition-colors"
              >
                <Home className="w-4 h-4" />
              </button>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <button
                onClick={handleBackToHome}
                className="hover:text-yellow-400 transition-colors"
              >
                {Object.values(gameData.allegianceGroups).find(allegiance =>
                  allegiance.armies.includes(selectedFaction.id)
                )?.name || 'Factions'}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white font-medium">{selectedFaction.name}</span>
            </div>
          </nav>
        )}

        {isSearchActive && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <Search className="w-5 h-5" />
              <span>
                {searchResults.length} {searchResults.length === 1 ? 'Einheit' : 'Einheiten'} gefunden für "{searchTerm}"
              </span>
            </div>
          </div>
        )}

        {!isSearchActive && !selectedFaction && (
          <>
            {Object.keys(gameData.allegianceGroups).length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto border border-gray-700">
                  <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Keine Daten gefunden</h2>
                  <p className="text-gray-400 mb-6">
                    Es sind noch keine Fraktionen in der Datenbank vorhanden.
                  </p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Daten importieren</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(gameData.allegianceGroups).map(([key, allegiance]) => {
                  const allegianceFactions = gameData.armies.filter(army =>
                    allegiance.armies.includes(army.id)
                  );

                  if (allegianceFactions.length === 0) return null;

                  return (
                    <div key={key} className="space-y-6">
                      <AllegianceCard
                        allegiance={allegiance}
                        armyCount={allegianceFactions.length}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allegianceFactions.map((army) => (
                          <AoSArmyCard
                            key={army.id}
                            army={army}
                            onClick={() => handleFactionClick(army.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!isSearchActive && selectedFaction && (
          <div>
            <ArmyPageHeader
              army={selectedFaction}
              onCreateCustomUnit={() => handleCreateCustomUnit(selectedFaction.id)}
            />

            <UnitTypeFilter
              units={selectedFaction.units}
              selectedType={selectedUnitType}
              onTypeChange={setSelectedUnitType}
              theme={selectedFaction.theme || getFactionTheme(selectedFaction.name)}
            />

            {selectedFaction.units.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-lg">Keine Einheiten für diese Fraktion verfügbar.</p>
              </div>
            ) : (
              <>
                {filterUnitsByType(selectedFaction.units, selectedUnitType).length === 0 ? (
                  <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-lg">Keine Einheiten für diesen Typ verfügbar.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterUnitsByType(selectedFaction.units, selectedUnitType)
                      .sort((a, b) => {
                        if (a.isCustom && !b.isCustom) return 1;
                        if (!a.isCustom && b.isCustom) return -1;
                        return 0;
                      })
                      .map((unit) => (
                        <AoSUnitCard
                          key={unit.id}
                          unit={unit}
                          onViewDetails={handleUnitClick}
                          onEdit={() => handleEditUnit(unit, selectedFaction.id)}
                          onDelete={() => handleDeleteUnit(unit, selectedFaction.id)}
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {isSearchActive && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((unit: any) => {
              const army = gameData.armies.find(a =>
                a.units.some(u => u.id === unit.id)
              );
              return (
                <AoSUnitCard
                  key={unit.id}
                  unit={unit}
                  onViewDetails={handleUnitClick}
                  onEdit={() => army && handleEditUnit(unit, army.id)}
                  onDelete={() => army && handleDeleteUnit(unit, army.id)}
                />
              );
            })}
          </div>
        )}

        {isSearchActive && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">Keine Einheiten gefunden</h2>
            <p className="text-gray-500">
              Versuche andere Suchbegriffe oder durchsuche die Fraktionen.
            </p>
          </div>
        )}
      </main>

      {selectedUnit && (
        <AoSUnitDetails
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onEdit={(unit) => {
            const armyId = selectedFactionId ||
              gameData.armies.find(army =>
                army.units.some(u => u.id === unit.id)
              )?.id || '';
            handleEditUnit(unit, armyId);
          }}
          onDelete={(unit) => {
            const armyId = selectedFactionId ||
              gameData.armies.find(army =>
                army.units.some(u => u.id === unit.id)
              )?.id || '';
            handleDeleteUnit(unit, armyId);
          }}
        />
      )}

      {editingArmyId && (
        <AoSUnitEditor
          unit={editingUnit}
          armyId={editingArmyId}
          onSave={handleSaveUnit}
          onClose={handleCloseEditor}
        />
      )}

      {deletingUnit && (
        <DeleteConfirmationModal
          unit={deletingUnit}
          onConfirm={confirmDeleteUnit}
          onCancel={cancelDeleteUnit}
        />
      )}

      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 Warhammer Age of Sigmar Collection. 4. Edition Regeln und 3D-Druckdateien.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>
                {Object.keys(gameData.allegianceGroups).length} Grand Alliances • {gameData.armies.length} Fraktionen • {gameData.armies.reduce((acc, army) => acc + army.units.length, 0)} Einheiten
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
