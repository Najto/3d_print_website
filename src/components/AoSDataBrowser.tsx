import { useState, useEffect } from 'react';
import { Book, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { aosImportService } from '../services/aosImportService';

interface Faction {
  id: string;
  name: string;
  catalog_file: string;
  last_synced: string | null;
  unit_count: number;
}

interface Unit {
  id: string;
  name: string;
  points: number;
  unit_type: string | null;
}

export default function AoSDataBrowser() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFactions();
  }, []);

  const loadFactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aosImportService.getFactions();
      setFactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Armeen');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnitsForFaction = async (faction: Faction) => {
    setSelectedFaction(faction);
    setSearchTerm('');
    setSearchResults([]);
    try {
      const data = await aosImportService.getUnitsForFaction(faction.id);
      setUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Einheiten');
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await aosImportService.searchUnits(term);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (factions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">Keine Daten verfügbar. Bitte importiere zuerst die AoS-Daten.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Book className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Offizielle AoS-Daten
          </h2>
          <p className="text-sm text-gray-600">
            Durchsuche die importierten Unit-Daten
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Suche nach Unit-Namen..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Suchergebnisse ({searchResults.length})
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Unit</th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">Punkte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchResults.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{unit.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">{unit.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Faction List */}
      {!searchTerm && !selectedFaction && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Armeen ({factions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {factions.map((faction) => (
              <button
                key={faction.id}
                onClick={() => loadUnitsForFaction(faction)}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-gray-900">{faction.name}</div>
                  <div className="text-sm text-gray-600">{faction.unit_count} Units</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unit List */}
      {!searchTerm && selectedFaction && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              {selectedFaction.name} ({units.length} Units)
            </h3>
            <button
              onClick={() => setSelectedFaction(null)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Zurück
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Unit</th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">Punkte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{unit.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">{unit.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
