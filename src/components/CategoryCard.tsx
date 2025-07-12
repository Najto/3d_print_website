import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import { Category } from '../types/Collection';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const itemCount = category.subcategories 
    ? category.subcategories.reduce((acc, sub) => acc + (sub.items?.length || 0), 0)
    : category.items?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-blue-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
      </div>
      
      {category.description && (
        <p className="text-gray-300 text-sm leading-relaxed">
          {category.description}
        </p>
      )}
    </div>
  );
}