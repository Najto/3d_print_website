export interface FileItem {
  name: string;
  type: 'stl' | 'obj' | 'gcode' | 'zip';
  size: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  path: string;
  previewImage: string;
  files: FileItem[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: Category[];
  items?: CollectionItem[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string[];
}