import { useState } from 'react';
import { Category, CollectionItem, BreadcrumbItem } from '../types/Collection';
import { collectionData } from '../data/mockData';

export function useNavigation() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getCurrentData = (): { categories: Category[]; items: CollectionItem[]; breadcrumbs: BreadcrumbItem[] } => {
    let current: any = { subcategories: collectionData };
    const breadcrumbs: BreadcrumbItem[] = [];
    
    for (const pathSegment of currentPath) {
      const next = current.subcategories?.find((cat: Category) => cat.id === pathSegment);
      if (next) {
        breadcrumbs.push({
          id: next.id,
          name: next.name,
          path: currentPath.slice(0, breadcrumbs.length + 1)
        });
        current = next;
      }
    }

    const categories = current.subcategories || [];
    const items = current.items || [];

    return { categories, items, breadcrumbs };
  };

  const navigateToCategory = (categoryId: string) => {
    setCurrentPath([...currentPath, categoryId]);
  };

  const navigateToPath = (path: string[]) => {
    setCurrentPath(path);
  };

  const searchAllItems = (term: string): CollectionItem[] => {
    if (!term) return [];
    
    const searchInCategory = (category: Category): CollectionItem[] => {
      let results: CollectionItem[] = [];
      
      if (category.items) {
        results = category.items.filter(item =>
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.tags?.some(tag => tag.toLowerCase().includes(term.toLowerCase())) ||
          item.files.some(file => file.name.toLowerCase().includes(term.toLowerCase()))
        );
      }
      
      if (category.subcategories) {
        for (const subCategory of category.subcategories) {
          results = [...results, ...searchInCategory(subCategory)];
        }
      }
      
      return results;
    };

    let allResults: CollectionItem[] = [];
    for (const category of collectionData) {
      allResults = [...allResults, ...searchInCategory(category)];
    }
    
    return allResults;
  };

  return {
    currentPath,
    searchTerm,
    setSearchTerm,
    getCurrentData,
    navigateToCategory,
    navigateToPath,
    searchAllItems
  };
}