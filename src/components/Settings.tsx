import { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Trash2, RefreshCw } from 'lucide-react';
import AoSDataImport from './AoSDataImport';
import AoSDataBrowser from './AoSDataBrowser';

interface SettingsProps {
  onBack: () => void;
  onDataUpdated?: () => void;
}

export default function Settings({ onBack, onDataUpdated }: SettingsProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  const handleClearCache = async () => {
    if (!confirm('Möchten Sie wirklich alle lokalen Daten löschen? Dadurch werden alte/doppelte Einheiten entfernt und die Daten werden aus der Datenbank neu geladen.')) {
      return;
    }

    setIsClearing(true);
    setClearMessage(null);

    try {
      localStorage.removeItem('aos_custom_data');

      try {
        await fetch('/api/data', { method: 'DELETE' });
      } catch (error) {
        console.log('Server data clear skipped');
      }

      setClearMessage('✓ Cache erfolgreich gelöscht! Die Seite wird neu geladen...');

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error clearing cache:', error);
      setClearMessage('✗ Fehler beim Löschen des Cache');
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="p-2 bg-blue-600 rounded-lg">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Einstellungen</h1>
                <p className="text-gray-400 text-sm">Datenbank-Import und Verwaltung</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-white">Cache leeren</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Löscht alle lokal gespeicherten Daten und lädt sie aus der Datenbank neu.
              Dies behebt Probleme mit doppelten oder veralteten Einheiten.
            </p>
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Wird gelöscht...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>Cache jetzt leeren</span>
                </>
              )}
            </button>
            {clearMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                clearMessage.startsWith('✓')
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-red-600/20 text-red-400'
              }`}>
                {clearMessage}
              </div>
            )}
          </div>

          <AoSDataImport onImportComplete={onDataUpdated} />
          <AoSDataBrowser />
        </div>
      </main>
    </div>
  );
}
