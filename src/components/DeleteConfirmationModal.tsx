import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { AoSUnit } from '../types/AoSCollection';

interface DeleteConfirmationModalProps {
  unit: AoSUnit;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({ unit, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanConfirm(true);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full border border-red-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Einheit löschen</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Warning Message */}
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              Möchten Sie die Einheit <strong className="text-white">"{unit.name}"</strong> wirklich dauerhaft löschen?
            </p>
            
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-red-300 text-sm">
                  <p className="font-semibold mb-2">Diese Aktion kann nicht rückgängig gemacht werden!</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Alle Einheitendaten werden gelöscht</li>
                    <li>• Hochgeladene STL-Dateien bleiben erhalten</li>
                    <li>• Vorschaubilder bleiben erhalten</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Unit Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {unit.previewImage && (
                  <img 
                    src={unit.previewImage} 
                    alt={unit.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <div className="text-white font-semibold">{unit.name}</div>
                  <div className="text-gray-400 text-sm">{unit.points} Punkte</div>
                  {unit.stlFiles && unit.stlFiles.length > 0 && (
                    <div className="text-green-400 text-sm">
                      {unit.stlFiles.length} STL-Datei{unit.stlFiles.length !== 1 ? 'en' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg transition-colors font-medium"
            >
              Abbrechen
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium flex items-center justify-center space-x-2 ${
                canConfirm
                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {canConfirm ? 'Dauerhaft löschen' : `Warten (${countdown}s)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}