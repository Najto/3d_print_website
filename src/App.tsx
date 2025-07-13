import React from 'react';
import { Sword, Search, Home, ChevronRight, ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { AllegianceCard } from './components/AllegianceCard';
import { AoSArmyCard } from './components/AoSArmyCard';
import { AoSUnitCard } from './components/AoSUnitCard';
import { AoSUnitDetails } from './components/AoSUnitDetails';
import { AoSUnitEditor } from './components/AoSUnitEditor';
import { SearchBar } from './components/SearchBar';
import { useAoSData } from './hooks/useAoSData';
import { AoSUnit } from './types/AoSCollection';
import { useState } from 'react';
import { cleanupOldFiles } from './utils/fileUtils';

function App() {
  const { gameData: aosGameData, updateUnit, deleteUnit } = useAoSData();
  const [selectedArmy, setSelectedArmy] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<AoSUnit | null>(null);
  const [editingUnit, setEditingUnit] = useState<AoSUnit | null>(null);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDownloadable, setShowOnlyDownloadable] = useState(false);
  
  // Cleanup old files on app start
  React.useEffect(() => {
    cleanupOldFiles();
  }, []);
  
  const currentArmy = selectedArmy ? aosGameData.armies.find(army => army.id === selectedArmy) : null;
  const currentItem = currentArmy;
  
  // Filter units based on download availability
  const getFilteredUnits = (units: AoSUnit[]) => {
    if (!showOnlyDownloadable) return units;
    return units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0);
  };

  // Search functionality
  const searchResults = searchTerm ? [
    ...aosGameData.armies
  ].flatMap(army => {
    // Split search term into individual keywords and clean them
    const searchKeywords = searchTerm.toLowerCase()
      .split(/\s+/)
      .filter(keyword => keyword.length > 0);
    
    if (searchKeywords.length === 0) return [];
    
    return army.units.filter(unit => {
      // Check if ALL search keywords match somewhere in the unit data
      return searchKeywords.every(searchKeyword => {
        const unitName = unit.name.toLowerCase();
        const armyName = army.name.toLowerCase();
        const unitKeywords = unit.keywords.map(k => k.toLowerCase());
        const abilities = unit.abilities.map(ability => 
          typeof ability === 'string' ? ability.toLowerCase() : ability.name.toLowerCase()
        );
        
        // Check if the search keyword matches in any of these fields
        return unitName.includes(searchKeyword) ||
               armyName.includes(searchKeyword) ||
               unitKeywords.some(keyword => keyword.includes(searchKeyword)) ||
               abilities.some(ability => ability.includes(searchKeyword)) ||
               unit.weapons.some(weapon => weapon.name.toLowerCase().includes(searchKeyword));
      });
    });
  }) : [];
  
  const isSearchActive = searchTerm.length > 0;

  const handleArmyClick = (armyId: string) => {
    setSelectedArmy(armyId);
  };

  const handleBackToHome = () => {
    setSelectedArmy(null);
  };

  const handleUnitDetails = (unit: AoSUnit) => {
    setSelectedUnit(unit);
  };

  const handleEditUnit = (unit: AoSUnit) => {
    setEditingUnit(unit);
    setSelectedUnit(null);
  };

  const handleCreateUnit = () => {
    setIsCreatingUnit(true);
    setEditingUnit(null);
  };

  const handleSaveUnit = (unit: AoSUnit) => {
    if (selectedArmy) {
      updateUnit(selectedArmy, unit);
      setEditingUnit(null);
      setIsCreatingUnit(false);
    }
  };

  const handleCloseEditor = () => {
    setEditingUnit(null);
    setIsCreatingUnit(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Suche nach Einheiten, Armeen oder Schlüsselwörtern..."
          />
        </div>

        {/* Breadcrumb Navigation */}
        {!isSearchActive && currentArmy && (
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
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
              {currentArmy 
                allegiance.armies.includes(currentArmy.id)
                    allegiance.armies.includes(currentArmy.id)
                  )?.name
                : 'Others'
              }
            </button>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium">{currentArmy.name}</span>
          </nav>
        )}

        {/* Search Results Header */}
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

        {/* Content */}
        {/* Allegiance Overview with Listed Armies */}
        {!isSearchActive && !currentArmy && (
          <div className="space-y-12">
            {/* Main Allegiances */}
            {Object.entries(aosGameData.allegianceGroups).map(([key, allegiance]) => {
              const allegianceArmies = aosGameData.armies.filter(army => allegiance.armies.includes(army.id));
              return (
                <div key={key} className="space-y-6">
                  {/* Allegiance Header */}
                  <AllegianceCard
                    allegiance={allegiance}
                    armyCount={allegiance.armies.length}
                  />
                  
                  {/* Armies Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allegianceArmies.map((army) => (
                      <AoSArmyCard
                        key={army.id}
                        army={army}
                        onClick={() => handleArmyClick(army.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Others Category */}
            <div className="space-y-6">
              {/* Others Header */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-4 bg-gray-600 rounded-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Others
                    </h2>
                    <p className="text-gray-400 text-sm mb-3">
                      {aosGameData.otherCategories.length} {aosGameData.otherCategories.length === 1 ? 'Kategorie' : 'Kategorien'}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Universelle Elemente wie Endless Spells und Gebäude
                    </p>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm text-white bg-gray-600">
                    Universal
                  </div>
                </div>
              </div>
              
              {/* Others Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aosGameData.otherCategories.map((category) => (
                  <AoSArmyCard
                    key={category.id}
                    army={category}
                    onClick={() => handleArmyClick(category.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Units Grid */}
        {!isSearchActive && currentArmy && (
          <div>
            {/* Filter Buttons */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateUnit}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neue Einheit</span>
                </button>
                <button
                  onClick={() => setShowOnlyDownloadable(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !showOnlyDownloadable
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Alle anzeigen ({currentArmy.units.length})
                </button>
                <button
                  onClick={() => setShowOnlyDownloadable(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOnlyDownloadable
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Nur herunterladbar ({currentArmy.units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0).length})
                </button>
              </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredUnits(currentArmy.units).map((unit) => (
                <AoSUnitCard 
                  key={unit.id} 
                  unit={unit} 
                  onViewDetails={handleUnitDetails}
                  onEdit={handleEditUnit}
                />
              ))}
            </div>

            {/* No Results Message */}
            {showOnlyDownloadable && getFilteredUnits(currentArmy.units).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">
                  Keine herunterladbaren Einheiten verfügbar
                </div>
                <div className="text-gray-500 text-sm">
                  Für diese Kategorie sind noch keine STL-Dateien hinterlegt.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Results Grid */}
        {isSearchActive && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((unit) => (
              <AoSUnitCard 
                key={unit.id} 
                unit={unit} 
                onViewDetails={handleUnitDetails}
                onEdit={handleEditUnit}
              />
            ))}
          </div>
        )}

        {/* No Search Results */}
        {isSearchActive && searchResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">Keine Einheiten gefunden</h2>
            <p className="text-gray-500">
              Versuche andere Suchbegriffe oder durchsuche die Armeen.
            </p>
          </div>
        )}
      </main>

      {/* Unit Details Modal */}
      {selectedUnit && (
        <AoSUnitDetails
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onEdit={handleEditUnit}
        />
      )}

      {/* Unit Editor Modal */}
      {(editingUnit || isCreatingUnit) && selectedArmy && (
        <AoSUnitEditor
          unit={editingUnit}
          armyId={selectedArmy}
          onSave={handleSaveUnit}
          onClose={handleCloseEditor}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 Warhammer Age of Sigmar Collection. 4. Edition Regeln und 3D-Druckdateien.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{aosGameData.armies.length} Armeen • {aosGameData.armies.reduce((acc, army) => acc + army.units.length, 0)} Einheiten</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;