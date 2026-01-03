import { useState } from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { aosImportService } from '../services/aosImportService';

interface ImportStats {
  imported: number;
  total: number;
  results: {
    factionName: string;
    unitCount: number;
  }[];
  errors?: {
    catalog: string;
    error: string;
  }[];
}

interface AoSDataImportProps {
  onImportComplete?: () => void;
}

export default function AoSDataImport({ onImportComplete }: AoSDataImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setImportStats(null);

    try {
      const result = await aosImportService.importAllFactions();
      setImportStats(result);
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import fehlgeschlagen');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            BSData Import
          </h2>
          <p className="text-sm text-gray-600">
            Offizielle AoS 4th Edition Daten von GitHub
          </p>
        </div>
      </div>

      {!importStats && !error && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Was wird importiert?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Alle verfügbaren AoS-Armeen</li>
                  <li>Offizielle Unit-Namen und Punktekosten</li>
                  <li>Daten aus dem BSData GitHub-Repository</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={isImporting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Importiere Daten...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Alle Armeen importieren
              </>
            )}
          </button>
        </div>
      )}

      {isImporting && (
        <div className="flex flex-col items-center justify-center py-8">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">
            Lade Daten von GitHub und importiere in die Datenbank...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dies kann einige Minuten dauern.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Fehler beim Import</p>
              <p className="text-sm text-red-800 mt-1">{error}</p>
              <button
                onClick={handleImport}
                className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium underline"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )}

      {importStats && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-900">
                  Import erfolgreich abgeschlossen!
                </p>
                <p className="text-sm text-green-800 mt-1">
                  {importStats.imported} von {importStats.total} Armeen importiert
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Importierte Armeen</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                      Armee
                    </th>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                      Units
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {importStats.results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {result.factionName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 text-right">
                        {result.unitCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {importStats.errors && importStats.errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Einige Fehler aufgetreten
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-800">
                    {importStats.errors.map((err, index) => (
                      <li key={index}>
                        <span className="font-medium">{err.catalog}:</span> {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Erneut importieren
          </button>
        </div>
      )}
    </div>
  );
}
