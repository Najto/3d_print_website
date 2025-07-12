import React, { useState } from 'react';
import { Download, FileText, Tag } from 'lucide-react';
import { CollectionItem } from '../types/Collection';

interface ItemCardProps {
  item: CollectionItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const totalSize = item.files.reduce((acc, file) => {
    const size = parseFloat(file.size);
    return acc + size;
  }, 0);

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'stl': return 'bg-green-600';
      case 'obj': return 'bg-blue-600';
      case 'gcode': return 'bg-orange-600';
      case 'zip': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-700 hover:border-green-500">
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        <img
          src={item.previewImage}
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {item.files.length} {item.files.length === 1 ? 'Datei' : 'Dateien'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
          {item.name}
        </h3>
        
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <FileText className="w-4 h-4 mr-1" />
          <span>Gesamt: {totalSize.toFixed(1)} MB</span>
        </div>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <Tag className="w-4 h-4 text-gray-400" />
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          {item.files.slice(0, 3).map((file, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getFileTypeColor(file.type)}`}></div>
                <span className="text-gray-300 truncate max-w-[200px]">{file.name}</span>
              </div>
              <span className="text-gray-400">{file.size}</span>
            </div>
          ))}
          {item.files.length > 3 && (
            <div className="text-gray-400 text-sm">
              +{item.files.length - 3} weitere Dateien
            </div>
          )}
        </div>
        
        <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 group">
          <Download className="w-4 h-4" />
          <span>Herunterladen</span>
        </button>
      </div>
    </div>
  );
}