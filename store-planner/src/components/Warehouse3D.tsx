import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { Drawer, Descriptions, Tag, Button, Space, Modal, Form, Input, InputNumber, message, Select } from 'antd';

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
  highlightCellIds?: string[];
  categories?: Category[];
  warehouseId?: string | null;
}

const RACK_WIDTH = 2;
const RACK_HEIGHT = 4;
const RACK_DEPTH = 1.2;
const CELL_SIZE = 0.8;
const CELL_GAP = 0.2;
const ROW_GAP = 3;
const RACK_GAP = 1.2;
const MAX_CELL_HEIGHT = 0.7;

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

const Warehouse3D: React.FC<Warehouse3DProps> = ({ onCellClick, highlightCellId, highlightCellIds, categories = [], warehouseId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cameraRef = useRef<any>(null);
  const [targetCameraPos, setTargetCameraPos] = useState<[number, number, number] | null>(null);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number] | null>(null);
  const [lastHighlightId, setLastHighlightId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sectionDrawerOpen, setSectionDrawerOpen] = useState(false);
  const [addRackModalOpen, setAddRackModalOpen] = useState(false);
  const [editSectionModalOpen, setEditSectionModalOpen] = useState(false);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState(false);
  const [rackForm] = Form.useForm();
  const [sectionForm] = Form.useForm();
  const selectedSection = selectedSectionId ? sections.find(s => s._id === selectedSectionId) : null;

  // Функция для обновления данных (перемещена внутрь компонента)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionsRes, racksRes, shelvesRes, cellsRes] = await Promise.all([
        axios.get('/api/sections'),
        axios.get('/api/racks'),
        axios.get('/api/shelves'),
        axios.get('/api/cells')
      ]);
      setSections(sectionsRes.data);
      setRacks(racksRes.data);
      setShelves(shelvesRes.data);
      setCells(cellsRes.data.filter((cell: Cell) => cell && cell.shelf && cell.shelf.rack));
    } catch (err) {
      setError('Помилка при завантаженні даних');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Поддержка массива id для подсветки и фокуса
    const ids = highlightCellIds && highlightCellIds.length ? highlightCellIds : (highlightCellId ? [highlightCellId] : []);
    if (ids.length && cells.length) {
      // Подсветить все ячейки
      const highlightCells = cells.filter(c => ids.includes(c._id));
      if (highlightCells.length) {
        setSelectedCell(highlightCells[0]); // Открыть Drawer по первой
        setDrawerOpen(true);
        setLastHighlightId(ids.join(','));
        // Фокусировка камеры: bounding box всех ячеек
        const positions = highlightCells.map(cell => {
          const rack = racks.find(r => r._id === (typeof cell.shelf.rack === 'object' ? cell.shelf.rack._id : cell.shelf.rack));
          return rack ? getCellPosition(cell, rack) : { x: 0, y: 0, z: 0 };
        });
        if (positions.length) {
          // Центр bounding box
          const min = positions.reduce((acc, p) => ({ x: Math.min(acc.x, p.x), y: Math.min(acc.y, p.y), z: Math.min(acc.z, p.z) }), positions[0]);
          const max = positions.reduce((acc, p) => ({ x: Math.max(acc.x, p.x), y: Math.max(acc.y, p.y), z: Math.max(acc.z, p.z) }), positions[0]);
          const center = { x: (min.x + max.x) / 2, y: (min.y + max.y) / 2, z: (min.z + max.z) / 2 };
          // Динамическое смещение: чем больше bounding box, тем дальше камера
          const dx = max.x - min.x;
          const dy = max.y - min.y;
          const dz = max.z - min.z;
          const maxSize = Math.max(dx, dy, dz, 1);
          const distance = 6 + maxSize * 1.5; // базовое + масштаб
          setTargetCameraPos([center.x + distance, center.y + distance, center.z + distance * 1.5]);
          setTargetLookAt([center.x, center.y, center.z]);
          // Через 1 сек сбрасываем автофокус, чтобы OrbitControls перехватил управление
          setTimeout(() => {
            setTargetCameraPos(null);
            setTargetLookAt(null);
          }, 1000);
        }
      }
    }
    if ((highlightCellIds && highlightCellIds.join(',')) !== lastHighlightId) {
      setDrawerOpen(true);
      setLastHighlightId(highlightCellIds ? highlightCellIds.join(',') : null);
    } else if (highlightCellId !== lastHighlightId) {
      setDrawerOpen(true);
      setLastHighlightId(highlightCellId ?? null);
    }
  }, [highlightCellId, highlightCellIds, cells, racks]);

  const getCellColor = (cell: Cell) => {
    if (!cell) return '#ffd600';
    if (selectedCell?._id === cell._id) return '#ff0000';
    if (highlightCellIds && highlightCellIds.includes(cell._id)) return '#ff0000';
    if (highlightCellId && cell._id === highlightCellId) return '#ff0000';
    if (cell.product) return '#66bb6a';
    return '#ffd600';
  };

  const getCellPosition = (cell: Cell, rack: Rack) => {
    if (!cell || !rack) return { x: 0, y: 0, z: 0 };
    const rackPosition = rack.position || { x: 0, y: 0, z: 0 };
    // Уровень полки (0 — самая нижняя)
    const shelfLevel = cell.shelf?.level ?? 0;
    // Высота одной полки
    const shelfHeight = RACK_HEIGHT / (shelves.length ? shelves.length : 1);
    // Центр полки
    const y = -RACK_HEIGHT / 2 + shelfHeight * shelfLevel + shelfHeight / 2;
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

  // Фильтрация по складу
  const filteredSections = warehouseId ? sections.filter(s => {
    // s.warehouse может быть строкой (id) или объектом
    if (typeof s.warehouse === 'object' && s.warehouse !== null && '_id' in s.warehouse) {
      return (s.warehouse as { _id: string })._id === warehouseId;
    }
    return s.warehouse === warehouseId;
  }) : sections;
  const filteredRacks = racks.filter(r => {
    if (!warehouseId) return true;
    const sectionId = typeof r.section === 'object' ? r.section._id : r.section;
    return filteredSections.some(s => s._id === sectionId);
  });
  const filteredShelves = shelves.filter(shelf => {
    if (!warehouseId) return true;
    const rackId = typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack;
    return filteredRacks.some(r => r._id === rackId);
  });
  const filteredCells = cells.filter(cell => {
    if (!warehouseId) return true;
    const shelfId = typeof cell.shelf === 'object' ? cell.shelf._id : cell.shelf;
    return filteredShelves.some(s => s._id === shelfId);
  });

  // Функция для клика по секции
  const handleSectionClick = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setSectionDrawerOpen(true);
  };
  // Функция для клика вне секции
  const handleCanvasPointerMissed = () => {
    setSelectedSectionId(null);
    setSectionDrawerOpen(false);
  };

  // Добавить стеллаж
  const handleAddRack = async (values: { name: string; shelfCount: number }) => {
    if (!selectedSection) return;
    try {
      // 1. Вычисляем позицию для нового стеллажа (рядом с другими в секции)
      const sectionRacks = racks.filter(r => {
        const sectionId = typeof r.section === 'object' ? r.section._id : r.section;
        return sectionId === selectedSection._id;
      });
      // Найти максимальный X среди стеллажей секции
      const rackXs = sectionRacks.map(r => r.position?.x ?? 0);
      const newX = rackXs.length ? Math.max(...rackXs) + RACK_WIDTH + RACK_GAP : 0;
      const newPosition = { x: newX, y: 0, z: 0 };
      // 2. Создаём стеллаж с позицией
      const rackRes = await axios.post('/api/racks', {
        name: values.name,
        section: selectedSection._id,
        position: newPosition
      });
      const newRack = rackRes.data;
      // 3. Создаём нужное количество полок для этого стеллажа
      for (let i = 0; i < values.shelfCount; i++) {
        await axios.post('/api/shelves', {
          name: `${i + 1} полка - ${values.name}`,
          rack: newRack._id,
          level: i
        });
      }
      message.success('Стеллаж и полки добавлены');
      setAddRackModalOpen(false);
      rackForm.resetFields();
      fetchData();
    } catch (e) {
      message.error('Помилка при додаванні стеллажа');
    }
  };

  // Редактировать секцию
  const handleEditSection = async (values: { name: string }) => {
    if (!selectedSection) return;
    try {
      await axios.patch(`/api/sections/${selectedSection._id}`, { name: values.name });
      message.success('Секция обновлена');
      setEditSectionModalOpen(false);
      sectionForm.resetFields();
      fetchData();
    } catch (e) {
      message.error('Помилка при оновленні секції');
    }
  };

  // Удалить секцию
  const handleDeleteSection = async () => {
    if (!selectedSection) return;
    setDeleteSectionLoading(true);
    try {
      await axios.delete(`/api/sections/${selectedSection._id}`);
      message.success('Секция удалена');
      setSectionDrawerOpen(false);
      setSelectedSectionId(null);
      fetchData();
    } catch (e) {
      message.error('Помилка при видаленні секції');
    } finally {
      setDeleteSectionLoading(false);
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  // Проверяем наличие данных перед рендерингом
  if (!filteredRacks.length) {
    return <div>Немає даних для відображення</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [8, 8, 12], fov: 50 }} shadows style={{ background: '#fff' }} onPointerMissed={handleCanvasPointerMissed}>
        <CameraController target={targetCameraPos} lookAt={targetLookAt} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={0.7} castShadow />

        {/* Белый пол склада */}
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Сетка под полом */}
        <Grid args={[40, 30]} cellSize={1} cellThickness={1} sectionSize={5} sectionThickness={2} sectionColor={'#bbb'} cellColor={'#ddd'} fadeDistance={30} fadeStrength={1} infiniteGrid position={[0, -0.07, 0]} />

        {/* Секции */}
        {(() => {
          // Для размещения секций по 3 в ряд (grid)
          let currentX = 0;
          let currentZ = 0;
          const sectionGap = 2.5;
          const sectionsPerRow = 3;
          let rowHeights: number[] = [];
          return filteredSections.map((section, sectionIdx) => {
            // Стеллажи этой секции
            const sectionRacks = filteredRacks.filter(rack => {
              const sectionId = typeof rack.section === 'object' ? rack.section._id : rack.section;
              return sectionId === section._id;
            });
            if (!sectionRacks.length) return null;
            // --- Новый расчёт размеров секции по сетке ---
            const racksInRow = 3;
            const rackCount = sectionRacks.length;
            const rowCount = Math.ceil(rackCount / racksInRow);
            const colCount = Math.min(rackCount, racksInRow);
            const minX = 0;
            const maxX = (colCount - 1) * (RACK_WIDTH + RACK_GAP);
            const minZ = 0;
            const maxZ = (rowCount - 1) * (RACK_DEPTH + RACK_GAP);
            const margin = 1.2;
            const plateWidth = racksInRow * (RACK_WIDTH + RACK_GAP) + margin * 2;
            const plateDepth = rowCount * (RACK_DEPTH + ROW_GAP) + margin * 2;
            const plateY = -0.025;
            // Глобальная позиция секции на плане
            if (sectionIdx % sectionsPerRow === 0 && sectionIdx !== 0) {
              currentX = 0;
              currentZ -= Math.max(...rowHeights) + sectionGap;
              rowHeights = [];
            }
            rowHeights.push(plateDepth);
            const plateCenterX = currentX + plateWidth / 2;
            const plateCenterZ = currentZ;
            currentX += plateWidth + sectionGap;
            // Цвет секции
            const sectionColors = ['#1976d2', '#43a047', '#fbc02d', '#d32f2f', '#8e24aa', '#00838f'];
            const color = sectionColors[sectionIdx % sectionColors.length];
            return (
              <group key={section._id} position={[plateCenterX, 0, plateCenterZ]}>
                {/* Цветная заливка секции */}
                <mesh
                  position={[0, plateY, 0]}
                  receiveShadow
                  onClick={e => {
                    e.stopPropagation();
                    handleSectionClick(section._id);
                  }}
                >
                  <boxGeometry args={[plateWidth, 0.05, plateDepth]} />
                  <meshStandardMaterial
                    color={color}
                    opacity={selectedSectionId === section._id ? 0.38 : 0.22}
                    transparent
                  />
                  {/* Белая рамка при выделении */}
                  {selectedSectionId === section._id && (
                    <mesh>
                      <boxGeometry args={[plateWidth + 0.1, 0.055, plateDepth + 0.1]} />
                      <meshBasicMaterial color="#fff" wireframe opacity={0.7} transparent />
                    </mesh>
                  )}
                </mesh>
                {/* Подпись секции */}
                <Text
                  position={[-plateWidth / 2 + margin + 0.5, 0.25, plateDepth / 2 + 0.3]}
                  fontSize={0.7}
                  color={color}
                  anchorX="center"
                  anchorY="middle"
                  outlineColor="#fff"
                  outlineWidth={0.06}
                >
                  {section.name}
                </Text>
                {/* Стеллажи секции */}
                {sectionRacks.map((rack, rackIdx) => {
                  if (!rack) return null;
                  // Сетка: максимум 3 в ряд
                  const row = Math.floor(rackIdx / racksInRow);
                  const col = rackIdx % racksInRow;
                  // Локальные координаты относительно центра секции
                  const rackX = col * (RACK_WIDTH + RACK_GAP) - (plateWidth - margin * 2 - RACK_WIDTH) / 2;
                  const rackZ = -row * (RACK_DEPTH + ROW_GAP) + (plateDepth - margin * 2 - RACK_DEPTH) / 2;
                  const rackShelves = filteredShelves.filter(shelf => {
                    if (!shelf) return false;
                    if (typeof shelf.rack === 'object') return shelf.rack._id === rack._id;
                    return shelf.rack === rack._id;
                  });
                  rackShelves.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
                  const shelfCount = rackShelves.length || 1;
                  const BASE_HEIGHT = 1.2;
                  const SHELF_STEP = 0.7;
                  const rackHeight = BASE_HEIGHT + (shelfCount - 1) * SHELF_STEP;
                  const rackY = rackHeight / 2;
                  const getShelfY = (idx: number) => {
                    if (shelfCount === 1) return -rackHeight/2;
                    return -rackHeight/2 + idx * (rackHeight - 0.05) / (shelfCount - 1);
                  };
                  return (
                    <group key={rack._id} position={[rackX, rackY, rackZ]}>
                      {/* Подпись стеллажа */}
                      <Text
                        position={[0, rackHeight / 2 + 1.0, RACK_DEPTH / 2 + 0.18]}
                        fontSize={0.48}
                        color="#1976d2"
                        anchorX="center"
                        anchorY="bottom"
                        outlineColor="#fff"
                        outlineWidth={0.045}
                      >
                        {rack.name || '—'}
                      </Text>
                      {/* Каркас стеллажа */}
                      <mesh>
                        <boxGeometry args={[RACK_WIDTH, rackHeight, RACK_DEPTH]} />
                        <meshStandardMaterial color="#333" opacity={0.25} transparent wireframe />
                      </mesh>
                      {/* Полки */}
                      {rackShelves.map((shelf, shelfIdx) => {
                        const shelfCells = filteredCells.filter(cell => {
                          if (!cell || !cell.shelf) return false;
                          const shelfId = typeof cell.shelf === 'object' ? cell.shelf._id : cell.shelf;
                          return shelfId === shelf._id;
                        });
                        const cellCount = shelfCells.length;
                        const shelfY = getShelfY(shelfIdx);
                        return (
                          <group key={shelf._id}>
                            <mesh position={[0, shelfY, 0]}>
                              <boxGeometry args={[RACK_WIDTH, 0.05, RACK_DEPTH]} />
                              <meshStandardMaterial color="#888" opacity={0.35} transparent />
                            </mesh>
                            <Text
                              position={[0, shelfY + 0.08, RACK_DEPTH/2 + 0.12]}
                              fontSize={0.16}
                              color="#333"
                              anchorX="center"
                              anchorY="bottom"
                              outlineColor="#fff"
                              outlineWidth={0.01}
                            >
                              {shelf.name || `${shelfIdx + 1} полка`}
                            </Text>
                            {shelfCells.map((cell, cellIdx) => {
                              const x = cellCount > 1
                                ? -RACK_WIDTH/2 + (cellIdx + 0.5) * (RACK_WIDTH / cellCount)
                                : 0;
                              const nextShelfY = getShelfY(shelfIdx + 1);
                              let cellHeight;
                              if (cellCount === 1) {
                                cellHeight = (shelfIdx < shelfCount - 1 ? nextShelfY - shelfY : rackHeight / shelfCount) - 0.08;
                                cellHeight = Math.min(cellHeight, 0.9);
                              } else {
                                cellHeight = Math.min((shelfIdx < shelfCount - 1 ? nextShelfY - shelfY : rackHeight / shelfCount) - 0.08, MAX_CELL_HEIGHT);
                              }
                              const y = shelfY + (cellHeight / 2) + 0.025;
                              const z = 0;
                              return (
                                <group key={cell._id}>
                                  <mesh
                                    position={[x, y, z]}
                                    onClick={() => handleCellClick(cell)}
                                    castShadow
                                  >
                                    <boxGeometry args={[CELL_SIZE, cellHeight, RACK_DEPTH-0.2]} />
                                    <meshStandardMaterial
                                      color={getCellColor(cell)}
                                      opacity={selectedCell?._id === cell._id ? 1 : 0.8}
                                      transparent
                                      emissive={selectedCell?._id === cell._id ? getCellColor(cell) : '#000'}
                                      emissiveIntensity={selectedCell?._id === cell._id ? 0.5 : 0}
                                    />
                                  </mesh>
                                  <Text
                                    position={[x, y, z + (RACK_DEPTH/2) + 0.18]}
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
                    </group>
                  );
                })}
              </group>
            );
          });
        })()}

        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
      {/* Drawer для информации о ячейке и товаре */}
      <Drawer
        title={selectedCell ? `Комірка: ${selectedCell.name || 'Без назви'}` : ''}
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
                    Категорія: {
                      selectedCell.product && (
                        typeof selectedCell.product.category === 'object'
                          ? selectedCell.product.category?.name
                          : (categories.find(cat => cat._id === selectedCell.product?.category)?.name || selectedCell.product.category || '—')
                      )
                    }
                  </Tag>
                </>
              ) : (
                <Tag color="default">Порожньо</Tag>
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
                <Descriptions.Item label="Кількість">
                  {selectedCell.product.quantity ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Опис">
                  {selectedCell.product.description || '—'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Drawer>
      {/* Drawer для информации о секции */}
      <Drawer
        title={selectedSection ? `Секція: ${selectedSection.name}` : ''}
        placement="right"
        width={380}
        onClose={() => setSectionDrawerOpen(false)}
        open={sectionDrawerOpen}
      >
        {selectedSection && (() => {
          // Все стеллажи секции
          const sectionRacks = racks.filter(r => {
            const sectionId = typeof r.section === 'object' ? r.section._id : r.section;
            return sectionId === selectedSection._id;
          });
          // Все полки секции
          const sectionRackIds = sectionRacks.map((r: Rack) => (typeof r._id === 'string' ? r._id : (r._id as any)?._id));
          const sectionShelves = shelves.filter(shelf => {
            const rackId = typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack;
            return sectionRackIds.includes(rackId);
          });
          // Все ячейки секции: ищем все ячейки, у которых cell.shelf.rack совпадает с одним из sectionRackIds
          const sectionCells: Cell[] = cells.filter(cell => {
            if (!cell.shelf || !cell.shelf.rack) return false;
            const rackId = typeof cell.shelf.rack === 'object' ? cell.shelf.rack._id : cell.shelf.rack;
            return sectionRackIds.includes(rackId);
          });
          const busyCells = sectionCells.filter(cell => cell.product);
          const freeCells = sectionShelves.length - busyCells.length;
          const totalCells = sectionShelves.length;
          // Для отладки:
          console.log('sectionRacks:', sectionRacks);
          console.log('sectionShelves:', sectionShelves);
          console.log('sectionCells:', sectionCells);
          return (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Назва">{selectedSection.name}</Descriptions.Item>
              <Descriptions.Item label="Стелажів">{sectionRacks.length}</Descriptions.Item>
              <Descriptions.Item label="Комірок">{totalCells}</Descriptions.Item>
              <Descriptions.Item label="Вільно">{freeCells}</Descriptions.Item>
              <Descriptions.Item label="Зайнято">{busyCells.length}</Descriptions.Item>
            </Descriptions>
          );
        })()}
        <Space style={{ marginTop: 16, flexWrap: 'wrap' }}>
          <Button type="primary" size="small" onClick={() => setAddRackModalOpen(true)}>Додати стелаж</Button>
          <Button size="small" onClick={() => {
            sectionForm.setFieldsValue({ name: selectedSection?.name });
            setEditSectionModalOpen(true);
          }}>Редагувати</Button>
          <Button danger size="small" loading={deleteSectionLoading} onClick={() => {
            Modal.confirm({
              title: 'Видалити секцію?',
              content: 'Всі стелажі та комірки всередині секції також будуть видалені. Продовжити?',
              okText: 'Видалити',
              okType: 'danger',
              cancelText: 'Скасувати',
              onOk: handleDeleteSection
            });
          }}>Видалити</Button>
        </Space>
      </Drawer>
      {/* Модалка добавления стеллажа */}
      <Modal
        title="Додати стелаж"
        open={addRackModalOpen}
        onCancel={() => setAddRackModalOpen(false)}
        onOk={() => rackForm.submit()}
        okText="Додати"
        cancelText="Скасувати"
      >
        <Form form={rackForm} layout="vertical" onFinish={handleAddRack}>
          <Form.Item name="name" label="Назва стелажа" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="shelfCount" label="Кількість полиць" rules={[{ required: true, message: 'Оберіть кількість полиць' }]}> 
            <Select>
              {[1,2,3,4,5].map(i => (
                <Select.Option key={i} value={i}>{i}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Модалка редактирования секции */}
      <Modal
        title="Редагувати секцію"
        open={editSectionModalOpen}
        onCancel={() => setEditSectionModalOpen(false)}
        onOk={() => sectionForm.submit()}
        okText="Зберегти"
        cancelText="Скасувати"
      >
        <Form form={sectionForm} layout="vertical" onFinish={handleEditSection}>
          <Form.Item name="name" label="Назва секції" rules={[{ required: true, message: 'Введіть назву' }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Warehouse3D;