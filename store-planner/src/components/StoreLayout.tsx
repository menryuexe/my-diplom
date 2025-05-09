import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Store, Section } from '../types/store';
import { SHELF_SIZE } from '../utils/storeGenerator';

interface StoreLayoutProps {
  store: Store;
  onSectionClick: (section: Section) => void;
}

const STORE_WIDTH = 800;
const STORE_HEIGHT = 500;

// Цвета для секций
const SECTION_GRADIENTS = [
  'url(#sectionGrad1)',
  'url(#sectionGrad2)',
  'url(#sectionGrad3)',
  'url(#sectionGrad4)'
];
const SECTION_SHADOW = '0 4px 24px 0 rgba(60, 60, 120, 0.10)';
const SHELF_COLOR = '#e3eafc';
const SHELF_BORDER = '#90caf9';
const SHELF_SHADOW = '0 2px 8px 0 rgba(60, 60, 120, 0.10)';

// Функция для размещения стеллажей рядами внутри секции
function getShelvesRects(section: Section) {
  const shelvesCount = section.shelves.length;
  if (shelvesCount === 0) return [];
  const [p0, p1, p2, p3] = section.points;
  const minX = Math.min(p0.x, p1.x, p2.x, p3.x);
  const maxX = Math.max(p0.x, p1.x, p2.x, p3.x);
  const minY = Math.min(p0.y, p1.y, p2.y, p3.y);
  const maxY = Math.max(p0.y, p1.y, p2.y, p3.y);
  const width = maxX - minX;
  const height = maxY - minY;
  const shelfW = SHELF_SIZE.width;
  const shelfH = SHELF_SIZE.height;
  // Сколько стеллажей помещается в ряд
  const shelvesPerRow = Math.max(1, Math.floor(width / (shelfW + 24)));
  const rows = Math.ceil(shelvesCount / shelvesPerRow);
  const gapX = (width - shelvesPerRow * shelfW) / (shelvesPerRow + 1);
  const gapY = (height - rows * shelfH) / (rows + 1);
  const shelves = [];
  for (let i = 0; i < shelvesCount; i++) {
    const row = Math.floor(i / shelvesPerRow);
    const col = i % shelvesPerRow;
    const x = minX + gapX + col * (shelfW + gapX);
    const y = minY + gapY + row * (shelfH + gapY);
    shelves.push({ x, y, width: shelfW, height: shelfH });
  }
  return shelves;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ store, onSectionClick }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, position: 'relative', width: STORE_WIDTH + 32, height: STORE_HEIGHT + 80, background: '#f7fafd' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontFamily: 'Inter, Roboto, Arial' }}>
        {store.name}
      </Typography>
      <svg
        width={STORE_WIDTH}
        height={STORE_HEIGHT}
        viewBox={`0 0 ${STORE_WIDTH} ${STORE_HEIGHT}`}
        style={{ border: '1px solid #e3eafc', background: '#f7fafd', borderRadius: 18 }}
      >
        <defs>
          <linearGradient id="sectionGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e3f2fd" />
            <stop offset="100%" stopColor="#bbdefb" />
          </linearGradient>
          <linearGradient id="sectionGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f5e9" />
            <stop offset="100%" stopColor="#b2dfdb" />
          </linearGradient>
          <linearGradient id="sectionGrad3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffde7" />
            <stop offset="100%" stopColor="#ffe082" />
          </linearGradient>
          <linearGradient id="sectionGrad4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fce4ec" />
            <stop offset="100%" stopColor="#f8bbd0" />
          </linearGradient>
          <filter id="sectionShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#90caf9" floodOpacity="0.10" />
          </filter>
          <filter id="shelfShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#90caf9" floodOpacity="0.12" />
          </filter>
        </defs>
        {store.sections.map((section, idx) => {
          const points = section.points.map(p => `${p.x},${p.y}`).join(' ');
          const centerX = section.points.reduce((sum, p) => sum + p.x, 0) / section.points.length;
          const centerY = section.points.reduce((sum, p) => sum + p.y, 0) / section.points.length;
          const shelvesRects = getShelvesRects(section);
          return (
            <g
              key={section.id}
              onClick={() => onSectionClick(section)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                points={points}
                fill={SECTION_GRADIENTS[idx % SECTION_GRADIENTS.length]}
                stroke="#b0bec5"
                strokeWidth={2.5}
                opacity={1}
                filter="url(#sectionShadow)"
                style={{ transition: 'filter 0.2s' }}
              />
              {/* Стеллажи */}
              {shelvesRects.map((s, sidx) => (
                <rect
                  key={`shelf-${sidx}`}
                  x={s.x}
                  y={s.y}
                  width={s.width}
                  height={s.height}
                  fill={SHELF_COLOR}
                  opacity={1}
                  rx={10}
                  stroke={SHELF_BORDER}
                  strokeWidth={2}
                  filter="url(#shelfShadow)"
                  style={{ transition: 'filter 0.2s' }}
                />
              ))}
              <rect
                x={centerX - 60}
                y={centerY - 22}
                width={120}
                height={36}
                fill="#fff"
                opacity={0.96}
                rx={12}
                style={{ filter: 'drop-shadow(0 2px 8px rgba(60,60,120,0.08))' }}
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={22}
                fill="#222"
                pointerEvents="none"
                style={{ fontWeight: 700, fontFamily: 'Inter, Roboto, Arial' }}
              >
                {section.name}
              </text>
            </g>
          );
        })}
      </svg>
    </Paper>
  );
}; 