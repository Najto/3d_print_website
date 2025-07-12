import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types/Collection';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string[]) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <button
        onClick={() => onNavigate([])}
        className="flex items-center hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <button
            onClick={() => onNavigate(item.path)}
            className={`hover:text-blue-400 transition-colors ${
              index === items.length - 1 ? 'text-white font-medium' : ''
            }`}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}