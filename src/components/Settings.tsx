import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import AoSDataImport from './AoSDataImport';
import AoSDataBrowser from './AoSDataBrowser';

interface SettingsProps {
  onBack: () => void;
  onDataUpdated?: () => void;
}

export default function Settings({ onBack, onDataUpdated }: SettingsProps) {
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
          <AoSDataImport onImportComplete={onDataUpdated} />
          <AoSDataBrowser />
        </div>
      </main>
    </div>
  );
}
