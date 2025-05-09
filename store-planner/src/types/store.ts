export interface Point {
  x: number;
  y: number;
}

export interface Door {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Window {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Shelf {
  id: string;
  name: string;
  products: Product[];
  position: Position;
}

export interface Equipment {
  id: string;
  type: string;
  position: Position;
}

export type ZoneType = 'storage' | 'loading' | 'office' | 'utility' | 'crossDock';

export interface Section {
  id: string;
  name: string;
  color: string;
  zoneType: ZoneType;
  shelves: Shelf[];
  points: Point[];
  doors: Door[];
  windows: Window[];
  equipment: Equipment[];
  isLShape?: boolean;
}

export interface Store {
  id: string;
  name: string;
  sections: Section[];
  width: number;
  height: number;
} 