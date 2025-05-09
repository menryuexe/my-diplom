import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Cell {
  id: string;
  position: [number, number, number];
  color: string;
  rack: number;
  row: number;
  shelf: number;
}

interface Rack {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  row: number;
  index: number;
}

interface Warehouse3DProps {
  onBlockClick?: (cell: Cell) => void;
}

const CELL_COLORS = ['#ff7043', '#66bb6a', '#29b6f6', '#ffd600', '#d32f2f', '#8e24aa'];
const RACK_WIDTH = 2;
const RACK_HEIGHT = 4;
const RACK_DEPTH = 1.2;
const CELL_SIZE = 0.8;
const CELL_GAP = 0.2;
const ROW_GAP = 2.5;
const RACK_GAP = 1.2;
const NUM_ROWS = 3;
const RACKS_PER_ROW = 2;
const SHELVES_PER_RACK = 4;
const axisLetters = ['A', 'B', 'C'];

// Генерация стеллажей
function generateRacks() {
  const racks: Rack[] = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let i = 0; i < RACKS_PER_ROW; i++) {
      racks.push({
        id: `rack-${row}-${i}`,
        position: [
          (i - 0.5) * (RACK_WIDTH + RACK_GAP),
          RACK_HEIGHT / 2,
          row * (RACK_DEPTH + ROW_GAP)
        ],
        size: [RACK_WIDTH, RACK_HEIGHT, RACK_DEPTH],
        row,
        index: i
      });
    }
  }
  return racks;
}

// Генерация ячеек
function generateCells(racks: Rack[]) {
  const cells: Cell[] = [];
  racks.forEach((rack, rackIdx) => {
    for (let shelf = 0; shelf < SHELVES_PER_RACK; shelf++) {
      const y = -RACK_HEIGHT / 2 + (shelf + 0.5) * (RACK_HEIGHT / SHELVES_PER_RACK);
      cells.push({
        id: `cell-${rack.row}-${rack.index}-${shelf}`,
        position: [
          rack.position[0],
          y + rack.position[1],
          rack.position[2]
        ],
        color: CELL_COLORS[(rackIdx * SHELVES_PER_RACK + shelf) % CELL_COLORS.length],
        rack: rack.index,
        row: rack.row,
        shelf
      });
    }
  });
  return cells;
}

const racks = generateRacks();
const cells = generateCells(racks);

const axisNumbers = ['1', '2'];

const Warehouse3D: React.FC<Warehouse3DProps> = ({ onBlockClick }) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Формат подписи: C-1-4
  const getCellLabel = (cell: Cell) => {
    const rowLetter = axisLetters[cell.row] || '?';
    const rackNum = cell.rack + 1;
    const shelfNum = cell.shelf + 1;
    return `${rowLetter}-${rackNum}-${shelfNum}`;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [8, 8, 12], fov: 50 }} shadows>
        {/* Свет */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.7} castShadow />

        {/* Сетка на полу */}
        <Grid args={[20, 20]} cellSize={1} cellThickness={1} sectionSize={5} sectionThickness={2} sectionColor={'#bbb'} cellColor={'#ddd'} fadeDistance={30} fadeStrength={1} infiniteGrid />

        {/* Плита пола с бордюром */}
        <mesh receiveShadow position={[0, 0, (NUM_ROWS-1)*(RACK_DEPTH+ROW_GAP)/2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 10]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0.01, (NUM_ROWS-1)*(RACK_DEPTH+ROW_GAP)/2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.2, 10.2]} />
          <meshStandardMaterial color="#888" transparent opacity={0.18} />
        </mesh>

        {/* Подписи по осям */}
        {axisLetters.map((letter, i) => (
          <Text
            key={letter}
            position={[-4.2, 0.1, i * (RACK_DEPTH + ROW_GAP)]}
            fontSize={0.4}
            color="#b71c1c"
            rotation={[-Math.PI / 2, 0, 0]}
            anchorX="center"
            anchorY="middle"
          >
            {letter}
          </Text>
        ))}
        {axisNumbers.map((num, i) => (
          <Text
            key={num}
            position={[(i - 0.5) * (RACK_WIDTH + RACK_GAP), 0.1, -2]}
            fontSize={0.4}
            color="#b71c1c"
            rotation={[-Math.PI / 2, 0, 0]}
            anchorX="center"
            anchorY="middle"
          >
            {num}
          </Text>
        ))}

        {/* Wireframe-стеллажи */}
        {racks.map(rack => (
          <group key={rack.id} position={rack.position}>
            {/* Каркас */}
            <mesh>
              <boxGeometry args={rack.size} />
              <meshBasicMaterial color="#333" wireframe />
            </mesh>
            {/* Полки */}
            {[...Array(SHELVES_PER_RACK - 1)].map((_, shelfIdx) => (
              <mesh key={shelfIdx} position={[0, -RACK_HEIGHT/2 + (shelfIdx+1)*(RACK_HEIGHT/SHELVES_PER_RACK), 0]}>
                <boxGeometry args={[RACK_WIDTH, 0.05, RACK_DEPTH]} />
                <meshStandardMaterial color="#888" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Ячейки + подписи */}
        {cells.map(cell => (
          <group key={cell.id}>
            <mesh
              position={cell.position}
              onClick={() => {
                setSelectedCell(cell.id);
                onBlockClick?.(cell);
              }}
              castShadow
            >
              <boxGeometry args={[CELL_SIZE, (RACK_HEIGHT/SHELVES_PER_RACK)-CELL_GAP, RACK_DEPTH-0.2]} />
              <meshStandardMaterial
                color={cell.color}
                opacity={selectedCell === cell.id ? 1 : 0.8}
                transparent
                emissive={selectedCell === cell.id ? cell.color : '#000'}
                emissiveIntensity={selectedCell === cell.id ? 0.5 : 0}
              />
            </mesh>
            {/* Подпись ячейки сбоку (на передней грани) */}
            <Text
              position={[cell.position[0], cell.position[1], cell.position[2] + (RACK_DEPTH/2) + 0.13]}
              fontSize={0.22}
              color="#222"
              anchorX="center"
              anchorY="middle"
              outlineColor="#fff"
              outlineWidth={0.02}
              rotation={[0, 0, 0]}
            >
              {getCellLabel(cell)}
            </Text>
          </group>
        ))}

        {/* Управление камерой */}
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
};

export default Warehouse3D; 