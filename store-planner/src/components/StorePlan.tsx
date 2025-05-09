import React, { useEffect, useRef } from 'react';
import { Store, Section, Shelf, Equipment } from '../types/store';
import { EQUIPMENT_TYPES } from '../utils/storeGenerator';

interface StorePlanProps {
  store: Store;
  onSectionClick?: (section: Section) => void;
  onShelfClick?: (shelf: Shelf) => void;
}

const StorePlan: React.FC<StorePlanProps> = ({ store, onSectionClick, onShelfClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Автоматическое масштабирование SVG
  useEffect(() => {
    const updateViewBox = () => {
      if (!svgRef.current) return;
      
      const svg = svgRef.current;
      const parent = svg.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const scale = Math.min(parentWidth / store.width, parentHeight / store.height);
      
      svg.setAttribute('viewBox', `0 0 ${store.width} ${store.height}`);
      svg.style.width = `${store.width * scale}px`;
      svg.style.height = `${store.height * scale}px`;
    };

    updateViewBox();
    window.addEventListener('resize', updateViewBox);
    return () => window.removeEventListener('resize', updateViewBox);
  }, [store.width, store.height]);

  // Рендеринг стеллажа
  const renderShelf = (shelf: Shelf) => (
    <g key={shelf.id} onClick={() => onShelfClick?.(shelf)} style={{ cursor: 'pointer' }}>
      <rect
        x={shelf.position.x}
        y={shelf.position.y}
        width={shelf.position.width}
        height={shelf.position.height}
        fill="#f5f5f5"
        stroke="#666"
        strokeWidth="2"
        rx="4"
      />
      <text
        x={shelf.position.x + (shelf.position.width || 0) / 2}
        y={shelf.position.y + (shelf.position.height || 0) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#333"
      >
        {shelf.name}
      </text>
    </g>
  );

  // Рендеринг оборудования
  const renderEquipment = (equipment: Equipment) => {
    const getEquipmentIcon = () => {
      switch (equipment.type) {
        case EQUIPMENT_TYPES.forklift:
          return (
            <path
              d="M0,0 L20,0 L20,10 L0,10 Z M5,10 L15,10 L15,20 L5,20 Z"
              fill="#666"
              transform={`translate(${equipment.position.x}, ${equipment.position.y})`}
            />
          );
        case EQUIPMENT_TYPES.pallet:
          return (
            <rect
              x={equipment.position.x}
              y={equipment.position.y}
              width="30"
              height="30"
              fill="#8d6e63"
              stroke="#5d4037"
              strokeWidth="2"
            />
          );
        default:
          return null;
      }
    };

    return <g key={equipment.id}>{getEquipmentIcon()}</g>;
  };

  // Рендеринг секции
  const renderSection = (section: Section) => {
    const points = section.points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
      <g key={section.id} onClick={() => onSectionClick?.(section)} style={{ cursor: 'pointer' }}>
        {/* Фон секции */}
        <polygon
          points={points}
          fill={section.color}
          stroke="#333"
          strokeWidth="3"
        />
        
        {/* Стеллажи */}
        {section.shelves.map(renderShelf)}
        
        {/* Оборудование */}
        {section.equipment.map(renderEquipment)}
        
        {/* Двери */}
        {section.doors.map((door, idx) => (
          <line
            key={`door-${idx}`}
            x1={door.x1}
            y1={door.y1}
            x2={door.x2}
            y2={door.y2}
            stroke="#333"
            strokeWidth="4"
            strokeDasharray="4"
          />
        ))}
        
        {/* Окна */}
        {section.windows.map((window, idx) => (
          <line
            key={`window-${idx}`}
            x1={window.x1}
            y1={window.y1}
            x2={window.x2}
            y2={window.y2}
            stroke="#333"
            strokeWidth="2"
            strokeDasharray="2"
          />
        ))}
        
        {/* Название секции */}
        <text
          x={section.points[0].x + 20}
          y={section.points[0].y + 30}
          fontSize="16"
          fontWeight="bold"
          fill="#333"
        >
          {section.name}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Фон (паттерн пола) */}
        <defs>
          <pattern
            id="floorPattern"
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
          >
            <rect width="40" height="40" fill="#fafafa" />
            <path
              d="M0,0 L40,40 M40,0 L0,40"
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width={store.width}
          height={store.height}
          fill="url(#floorPattern)"
        />
        
        {/* Секции */}
        {store.sections.map(renderSection)}
      </svg>
    </div>
  );
};

export default StorePlan; 