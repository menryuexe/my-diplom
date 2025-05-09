import { Store, Section, Shelf, Product, Equipment } from '../types/store';

const STORE_WIDTH = 1000;
const STORE_HEIGHT = 800;
const SHELF_SIZE = { width: 60, height: 200 };
const AISLE_WIDTH = 120;

// Цвета для секций
const SECTION_COLORS = {
  storage: '#e3f2fd',
  loading: '#e8f5e9',
  office: '#fffde7',
  utility: '#fce4ec',
  crossDock: '#f3e5f5'
};

// Типы оборудования
const EQUIPMENT_TYPES = {
  forklift: 'forklift',
  pallet: 'pallet',
  conveyor: 'conveyor',
  dock: 'dock'
};

const generateRandomProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 100,
    description: `Description for product ${i + 1}`
  }));
};

const generateRandomShelves = (sectionWidth: number, sectionHeight: number): Shelf[] => {
  const shelves: Shelf[] = [];
  const rows = Math.floor(sectionHeight / (SHELF_SIZE.height + AISLE_WIDTH));
  const cols = Math.floor(sectionWidth / (SHELF_SIZE.width + AISLE_WIDTH));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      shelves.push({
        id: `shelf-${row}-${col}`,
        name: `Стеллаж ${row + 1}-${col + 1}`,
        products: generateRandomProducts(Math.floor(Math.random() * 5) + 3),
        position: {
          x: col * (SHELF_SIZE.width + AISLE_WIDTH),
          y: row * (SHELF_SIZE.height + AISLE_WIDTH),
          width: SHELF_SIZE.width,
          height: SHELF_SIZE.height
        }
      });
    }
  }
  return shelves;
};

const generateEquipment = (section: Section): Equipment[] => {
  const equipment: Equipment[] = [];
  
  // Добавляем погрузчик
  equipment.push({
    id: 'forklift-1',
    type: EQUIPMENT_TYPES.forklift,
    position: {
      x: section.points[0].x + 50,
      y: section.points[0].y + 50
    }
  });

  // Добавляем паллеты
  for (let i = 0; i < 3; i++) {
    equipment.push({
      id: `pallet-${i}`,
      type: EQUIPMENT_TYPES.pallet,
      position: {
        x: section.points[0].x + 150 + i * 100,
        y: section.points[0].y + 50
      }
    });
  }

  return equipment;
};

// Генерация прямоугольной секции
function generateRectSection(idx: number, x: number, y: number, w: number, h: number, zoneType: keyof typeof SECTION_COLORS): Section {
  return {
    id: `section-${idx + 1}`,
    name: `Секция ${idx + 1}`,
    color: SECTION_COLORS[zoneType],
    zoneType,
    shelves: generateRandomShelves(w, h),
    points: [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ],
    doors: [
      { x1: x + w / 2 - 20, y1: y, x2: x + w / 2 + 20, y2: y },
    ],
    windows: [
      { x1: x + w - 40, y1: y + h / 2, x2: x + w, y2: y + h / 2 },
    ],
    equipment: generateEquipment({ points: [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }] } as Section)
  };
}

// Генерация L-образной секции
function generateLSection(idx: number, x: number, y: number, w: number, h: number, zoneType: keyof typeof SECTION_COLORS): Section {
  const lW = w * 0.6;
  const lH = h * 0.6;
  
  return {
    id: `section-${idx + 1}`,
    name: `Секция ${idx + 1}`,
    color: SECTION_COLORS[zoneType],
    zoneType,
    shelves: generateRandomShelves(w, h),
    isLShape: true,
    points: [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + lH },
      { x: x + lW, y: y + lH },
      { x: x + lW, y: y + h },
      { x, y: y + h },
    ],
    doors: [
      { x1: x + w - 20, y1: y + lH / 2, x2: x + w, y2: y + lH / 2 },
    ],
    windows: [
      { x1: x, y1: y + h / 2, x2: x + 40, y2: y + h / 2 },
    ],
    equipment: generateEquipment({ points: [{ x, y }, { x: x + w, y }, { x: x + w, y: y + lH }, { x: x + lW, y: y + lH }, { x: x + lW, y: y + h }, { x, y: y + h }] } as Section)
  };
}

export const generateRandomStore = (): Store => {
  const sections: Section[] = [];
  const w = STORE_WIDTH / 2;
  const h = STORE_HEIGHT / 2;

  // Основные секции хранения
  sections.push(generateRectSection(0, 0, 0, w, h, 'storage'));
  sections.push(generateRectSection(1, w, 0, w, h, 'storage'));
  
  // Зона погрузки/разгрузки
  sections.push(generateRectSection(2, 0, h, w, h, 'loading'));
  
  // L-образная секция для офиса и утилит
  sections.push(generateLSection(3, w, h, w, h, 'office'));

  return {
    id: 'store-1',
    name: 'Мой склад',
    sections,
    width: STORE_WIDTH,
    height: STORE_HEIGHT
  };
};

export { SHELF_SIZE, SECTION_COLORS, EQUIPMENT_TYPES }; 