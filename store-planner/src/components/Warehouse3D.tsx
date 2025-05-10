import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { Drawer, Descriptions, Tag } from 'antd';
import { useFrame, useThree } from '@react-three/fiber';

interface Section {
  _id: string;
  name: string;
  warehouse: string;
}

interface Rack {
  _id: string;
  name: string;
  section: Section;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

interface Shelf {
  _id: string;
  name: string;
  rack: Rack;
  level: number;
}

interface Product {
  _id: string;
  name: string;
  category: string | { _id: string; name: string };
  barcode: string;
  rfid: string;
  description?: string;
  quantity: number;
}

interface Cell {
  _id: string;
  name: string;
  shelf: Shelf;
  product: Product | null;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface Warehouse3DProps {
  onCellClick?: (cell: Cell) => void;
  highlightCellId?: string | null;
  categories?: Category[];
}

const RACK_WIDTH = 2;
const RACK_HEIGHT = 4;
const RACK_DEPTH = 1.2;
const CELL_SIZE = 0.8;
const CELL_GAP = 0.2;
const ROW_GAP = 2.5;
const RACK_GAP = 1.2;
const SHELVES_PER_RACK = 4;

const CameraController: React.FC<{ target: [number, number, number] | null; lookAt: [number, number, number] | null }> = ({ target, lookAt }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      camera.position.x = lerp(camera.position.x, target[0], 0.08);
      camera.position.y = lerp(camera.position.y, target[1], 0.08);
      camera.position.z = lerp(camera.position.z, target[2], 0.08);
      if (lookAt) {
        camera.lookAt(...lookAt);
      }
    }
  });
  return null;
};

const Warehouse3D: React.FC<Warehouse3DProps> = ({ onCellClick, highlightCellId, categories = [] }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [targetCameraPos, setTargetCameraPos] = useState<[number, number, number] | null>(null);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number] | null>(null);
  const [lastHighlightId, setLastHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sectionsRes, racksRes, shelvesRes, cellsRes] = await Promise.all([
          axios.get('/api/sections'),
          axios.get('/api/racks'),
          axios.get('/api/shelves'),
          axios.get('/api/cells')
        ]);

        console.log('Sections:', sectionsRes.data);
        console.log('Racks:', racksRes.data);
        console.log('Shelves:', shelvesRes.data);
        console.log('Cells:', cellsRes.data);

        // Проверяем и фильтруем некорректные данные
        const validCells = cellsRes.data.filter((cell: Cell) => {
          if (!cell || !cell.shelf || !cell.shelf.rack) {
            console.warn('Invalid cell data:', cell);
            return false;
          }
          return true;
        });

        setSections(sectionsRes.data);
        setRacks(racksRes.data);
        setShelves(shelvesRes.data);
        setCells(validCells);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (highlightCellId && cells.length) {
      const cell = cells.find(c => c._id === highlightCellId);
      if (cell) {
        setSelectedCell(cell);
        setDrawerOpen(true);
        setLastHighlightId(highlightCellId ?? null);
        // Фокусировка камеры: задаём целевую позицию
        const rack = racks.find(r => r._id === cell.shelf?.rack?._id);
        if (rack) {
          const pos = getCellPosition(cell, rack);
          setTargetCameraPos([pos.x + 3, pos.y + 3, pos.z + 5]);
          setTargetLookAt([pos.x, pos.y, pos.z]);
        }
      }
    }
    if (highlightCellId !== lastHighlightId) {
      setDrawerOpen(true);
      setLastHighlightId(highlightCellId ?? null);
    }
  }, [highlightCellId, cells, racks]);

  const getCellColor = (cell: Cell) => {
    if (!cell) return '#ffd600';
    if (selectedCell?._id === cell._id) return '#ff0000';
    if (highlightCellId && cell._id === highlightCellId) return '#ff0000';
    if (cell.product) return '#66bb6a';
    return '#ffd600';
  };

  const getCellPosition = (cell: Cell, rack: Rack) => {
    if (!cell || !rack) return { x: 0, y: 0, z: 0 };
    
    const rackPosition = rack.position || { x: 0, y: 0, z: 0 };
    const shelfLevel = cell.shelf?.level || 0;
    const y = -RACK_HEIGHT / 2 + (shelfLevel + 0.5) * (RACK_HEIGHT / SHELVES_PER_RACK);
    
    return {
      x: rackPosition.x,
      y: y + rackPosition.y,
      z: rackPosition.z
    };
  };

  // Функция для открытия Drawer с инфо о ячейке
  const handleCellClick = (cell: Cell) => {
    setSelectedCell(cell);
    setDrawerOpen(true);
    onCellClick?.(cell);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // Проверяем наличие данных перед рендерингом
  if (!racks.length || !cells.length) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [8, 8, 12], fov: 50 }} shadows>
        <CameraController target={targetCameraPos} lookAt={targetLookAt} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.7} castShadow />

        <Grid args={[20, 20]} cellSize={1} cellThickness={1} sectionSize={5} sectionThickness={2} sectionColor={'#bbb'} cellColor={'#ddd'} fadeDistance={30} fadeStrength={1} infiniteGrid />

        {/* Стеллажи */}
        {racks.map(rack => {
          if (!rack) return null;
          
          return (
            <group key={rack._id} position={[rack.position?.x || 0, rack.position?.y || 0, rack.position?.z || 0]}>
              {/* Каркас стеллажа */}
              <mesh>
                <boxGeometry args={[RACK_WIDTH, RACK_HEIGHT, RACK_DEPTH]} />
                <meshBasicMaterial color="#333" wireframe />
              </mesh>
              
              {/* Полки */}
              {[...Array(SHELVES_PER_RACK - 1)].map((_, shelfIdx) => (
                <mesh key={shelfIdx} position={[0, -RACK_HEIGHT/2 + (shelfIdx+1)*(RACK_HEIGHT/SHELVES_PER_RACK), 0]}>
                  <boxGeometry args={[RACK_WIDTH, 0.05, RACK_DEPTH]} />
                  <meshStandardMaterial color="#888" />
                </mesh>
              ))}

              {/* Ячейки */}
              {cells
                .filter(cell => cell && cell.shelf && cell.shelf.rack && cell.shelf.rack._id === rack._id)
                .map(cell => {
                  if (!cell) return null;
                  const position = getCellPosition(cell, rack);
                  return (
                    <group key={cell._id}>
                      <mesh
                        position={[position.x, position.y, position.z]}
                        onClick={() => handleCellClick(cell)}
                        castShadow
                      >
                        <boxGeometry args={[CELL_SIZE, (RACK_HEIGHT/SHELVES_PER_RACK)-CELL_GAP, RACK_DEPTH-0.2]} />
                        <meshStandardMaterial
                          color={getCellColor(cell)}
                          opacity={selectedCell?._id === cell._id ? 1 : 0.8}
                          transparent
                          emissive={selectedCell?._id === cell._id ? getCellColor(cell) : '#000'}
                          emissiveIntensity={selectedCell?._id === cell._id ? 0.5 : 0}
                        />
                      </mesh>
                      {/* Подпись ячейки */}
                      <Text
                        position={[position.x, position.y, position.z + (RACK_DEPTH/2) + 0.13]}
                        fontSize={0.22}
                        color="#222"
                        anchorX="center"
                        anchorY="middle"
                        outlineColor="#fff"
                        outlineWidth={0.02}
                      >
                        {cell.name || 'Без названия'}
                      </Text>
                    </group>
                  );
                })}
            </group>
          );
        })}

        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
      {/* Drawer для информации о ячейке и товаре */}
      <Drawer
        title={selectedCell ? `Ячейка: ${selectedCell.name || 'Без названия'}` : ''}
        placement="right"
        width={400}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedCell && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Полка">
              {selectedCell.shelf?.name || '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Товар">
              {selectedCell.product ? (
                <>
                  <b>{selectedCell.product.name}</b>
                  <br />
                  <Tag color="blue">
                    Категория: {
                      selectedCell.product && (
                        typeof selectedCell.product.category === 'object'
                          ? selectedCell.product.category?.name
                          : (categories.find(cat => cat._id === selectedCell.product?.category)?.name || selectedCell.product.category || '—')
                      )
                    }
                  </Tag>
                </>
              ) : (
                <Tag color="default">Пусто</Tag>
              )}
            </Descriptions.Item>
            {selectedCell.product && (
              <>
                <Descriptions.Item label="Штрихкод">
                  {selectedCell.product.barcode || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="RFID">
                  {selectedCell.product.rfid || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Количество">
                  {selectedCell.product.quantity ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Описание">
                  {selectedCell.product.description || '—'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default Warehouse3D; 