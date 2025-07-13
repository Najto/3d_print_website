import React from 'react';
import { Sword, Search, Home, ChevronRight, ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { AllegianceCard } from './components/AllegianceCard';
import { AoSArmyCard } from './components/AoSArmyCard';
import { AoSUnitCard } from './components/AoSUnitCard';
import { AoSUnitDetails } from './components/AoSUnitDetails';
import { AoSUnitEditor } from './components/AoSUnitEditor';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { SearchBar } from './components/SearchBar';
import { StorageDisplay } from './components/StorageDisplay';
import { useAoSData } from './hooks/useAoSData';
import { AoSUnit } from './types/AoSCollection';
import { useState } from 'react';
import { cleanupOldFiles } from './utils/fileUtils';

function App() {
  const { gameData: aosGameData, updateUnit, deleteUnit, scanFoldersForNewUnits, scanAllFoldersForNewUnits, addScannedUnits, addAllScannedUnits } = useAoSData();
  const [selectedArmy, setSelectedArmy] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<AoSUnit | null>(null);
  const [editingUnit, setEditingUnit] = useState<AoSUnit | null>(null);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDownloadable, setShowOnlyDownloadable] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<AoSUnit | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGlobalScanning, setIsGlobalScanning] = useState(false);
  
  // Cleanup old files on app start
  React.useEffect(() => {
    cleanupOldFiles();
  }, []);
  
  const currentArmy = selectedArmy ? aosGameData.armies.find(army => army.id === selectedArmy) : null;
  const currentOtherCategory = selectedArmy ? aosGameData.otherCategories?.find(category => category.id === selectedArmy) : null;
  const currentItem = currentArmy || currentOtherCategory;
  
  // Filter units based on download availability
  const getFilteredUnits = (units: AoSUnit[]) => {
    if (!showOnlyDownloadable) return units;
    return units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0);
  };

  // Search functionality
  const searchResults = searchTerm ? [
    ...aosGameData.armies,
    ...(aosGameData.otherCategories || [])
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
    // Scroll to top when army is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedArmy(null);
    // Scroll to top when returning to home
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnitDetails = (unit: AoSUnit) => {
    setSelectedUnit(unit);
  };

  const handleEditUnit = (unit: AoSUnit) => {
    setEditingUnit(unit);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = (unit: AoSUnit) => {
    setUnitToDelete(unit);
  };

  const confirmDeleteUnit = () => {
    if (unitToDelete && selectedArmy) {
      deleteUnit(selectedArmy, unitToDelete.id);
      setUnitToDelete(null);
    }
  };

  const cancelDeleteUnit = () => {
    setUnitToDelete(null);
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

  const handleScanFolders = async () => {
    if (!selectedArmy) return;
    
    setIsScanning(true);
    try {
      const newUnits = await scanFoldersForNewUnits(selectedArmy);
      if (newUnits.length > 0) {
        addScannedUnits(selectedArmy, newUnits);
        alert(`${newUnits.length} neue Einheit${newUnits.length !== 1 ? 'en' : ''} aus Ordnern erstellt:\n${newUnits.map(u => `• ${u.name}`).join('\n')}`);
      } else {
        alert('Keine neuen Einheiten in Ordnern gefunden.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('Fehler beim Scannen der Ordner.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGlobalScanFolders = async () => {
    setIsGlobalScanning(true);
    try {
      const result = await scanAllFoldersForNewUnits();
      if (result.totalNewUnits > 0) {
        addAllScannedUnits(result.allNewUnits);
        
        // Create detailed summary message
        const summaryLines = [
          `🎉 ${result.totalNewUnits} neue Einheit${result.totalNewUnits !== 1 ? 'en' : ''} aus ${result.scannedArmies} Armeen gefunden!`,
          '',
          ...result.summary.map(army => 
            `📦 ${army.armyName}: ${army.newUnitsCount} Einheit${army.newUnitsCount !== 1 ? 'en' : ''}\n${army.unitNames.map(name => `   • ${name}`).join('\n')}`
          )
        ];
        
        alert(summaryLines.join('\n'));
      } else {
        alert(`🔍 Alle ${result.scannedArmies} Armeen gescannt - keine neuen Einheiten gefunden.`);
      }
    } catch (error) {
      console.error('Global scan error:', error);
      alert('Fehler beim globalen Ordner-Scan.');
    } finally {
      setIsGlobalScanning(false);
    }
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
            
            {/* Global Scan Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGlobalScanFolders}
                disabled={isGlobalScanning}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isGlobalScanning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>{isGlobalScanning ? 'Scanne alle...' : 'Alle Ordner scannen'}</span>
              </button>
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
        {!isSearchActive && currentItem && (
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
              {currentArmy 
                ? Object.values(aosGameData.allegianceGroups).find(allegiance => 
                    allegiance.armies.includes(currentArmy.id)
                  )?.name
                : 'Others'
              }
            </button>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white font-medium">{currentItem.name}</span>
            </div>
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
        {!isSearchActive && !currentItem && (
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
        {!isSearchActive && currentItem && (
          <div>
            {/* Filter Buttons */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between space-x-4">
                <button
                  onClick={handleCreateUnit}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neue Einheit</span>
                </button>
                <button
                  onClick={handleScanFolders}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isScanning ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{isScanning ? 'Scanne...' : 'Ordner scannen'}</span>
                </button>
                <button
                  onClick={() => setShowOnlyDownloadable(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !showOnlyDownloadable
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Alle anzeigen ({currentItem.units.length})
                </button>
                <button
                  onClick={() => setShowOnlyDownloadable(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOnlyDownloadable
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Nur herunterladbar ({currentItem.units.filter(unit => unit.stlFiles && unit.stlFiles.length > 0).length})
                </button>
              </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredUnits(currentItem.units).map((unit) => (
                <AoSUnitCard 
                  key={unit.id} 
                  unit={unit} 
                  onViewDetails={handleUnitDetails}
                  onEdit={handleEditUnit}
                  onDelete={handleDeleteUnit}
                />
              ))}
            </div>

            {/* No Results Message */}
            {showOnlyDownloadable && getFilteredUnits(currentItem.units).length === 0 && (
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
                onDelete={handleDeleteUnit}
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
          onDelete={handleDeleteUnit}
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

      {/* Delete Confirmation Modal */}
      {unitToDelete && (
        <DeleteConfirmationModal
          unit={unitToDelete}
          onConfirm={confirmDeleteUnit}
          onCancel={cancelDeleteUnit}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Storage Display */}
          <div className="mb-6">
            <StorageDisplay />
          </div>
          
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