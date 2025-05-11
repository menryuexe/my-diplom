import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Statistic, Progress, Button, message } from 'antd';
import axios from 'axios';

interface Warehouse {
  _id: string;
  name: string;
  description?: string;
}
interface Section { _id: string; warehouse: string | { _id: string } }
interface Rack { _id: string; section: string | { _id: string } }
interface Cell { _id: string; shelf: { rack: { _id: string } | string }; product: any; }
interface Product { _id: string; }
interface Shelf { _id: string; rack: string | { _id: string } }

const DashboardPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [cells, setCells] = useState<Cell[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [wh, sec, rack, shelf, cell, prod] = await Promise.all([
          axios.get('/api/warehouses'),
          axios.get('/api/sections'),
          axios.get('/api/racks'),
          axios.get('/api/shelves'),
          axios.get('/api/cells'),
          axios.get('/api/products'),
        ]);
        setWarehouses(wh.data);
        setSections(sec.data);
        setRacks(rack.data);
        setShelves(shelf.data);
        setCells(cell.data);
        setProducts(prod.data);
      } catch (e) {
        message.error('Помилка при завантаженні даних');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Общая статистика
  const totalWarehouses = warehouses.length;
  const totalSections = sections.length;
  const totalRacks = racks.length;
  const totalCells = cells.length;
  const totalProducts = products.length;

  // По выбранному складу
  const whSections = sections.filter(s => {
    if (typeof s.warehouse === 'object' && s.warehouse !== null) {
      return s.warehouse._id === selectedWarehouseId;
    }
    return s.warehouse === selectedWarehouseId;
  });
  const whSectionIds = whSections.map(s => s._id);
  const whRacks = racks.filter(r => {
    const sectionId = typeof r.section === 'object' && r.section !== null
      ? r.section._id
      : r.section;
    return whSectionIds.includes(sectionId);
  });
  const whRackIds = whRacks.map(r => r._id);
  const whShelves = shelves.filter(shelf => {
    const rackId = typeof shelf.rack === 'object' && shelf.rack !== null ? shelf.rack._id : shelf.rack;
    return whRackIds.includes(rackId);
  });
  const whShelfIds = whShelves.map(s => s._id);
  const whCells = cells.filter(cell => {
    let shelfId: string | undefined;
    if (cell.shelf && typeof cell.shelf === 'object' && '_id' in cell.shelf) {
      shelfId = (cell.shelf as { _id: string })._id;
    } else if (typeof cell.shelf === 'string') {
      shelfId = cell.shelf;
    }
    return shelfId && whShelfIds.includes(shelfId);
  });
  const totalCellsWh = whShelves.length;
  const busyCellsWh = whCells.filter(cell => cell.product).length;
  const freeCellsWh = totalCellsWh - busyCellsWh;
  const whFill = totalCellsWh ? Math.round((busyCellsWh / totalCellsWh) * 100) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Детальна статистика</h2>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="Всього складів" value={totalWarehouses} /></Card></Col>
        <Col span={6}><Card><Statistic title="Всього секцій" value={totalSections} /></Card></Col>
        <Col span={6}><Card><Statistic title="Всього стелажів" value={totalRacks} /></Card></Col>
        <Col span={6}><Card><Statistic title="Всього товарів" value={totalProducts} /></Card></Col>
      </Row>
      <Card style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16, fontWeight: 500 }}>Оберіть склад для перегляду детальної інформації:</div>
        <Select
          showSearch
          style={{ width: 350 }}
          placeholder="Оберіть склад"
          optionFilterProp="children"
          value={selectedWarehouseId}
          onChange={setSelectedWarehouseId}
          filterOption={(input, option) => (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())}
        >
          {warehouses.map(w => (
            <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
          ))}
        </Select>
        {selectedWarehouseId && (
          <div style={{ marginTop: 32 }}>
            <Row gutter={16}>
              <Col span={4}><Card><Statistic title="Секцій" value={whSections.length} /></Card></Col>
              <Col span={4}><Card><Statistic title="Стелажів" value={whRacks.length} /></Card></Col>
              <Col span={4}><Card><Statistic title="Комірок" value={totalCellsWh} /></Card></Col>
              <Col span={4}><Card><Statistic title="Вільних" value={freeCellsWh} /></Card></Col>
              <Col span={4}><Card><Statistic title="Зайнятих" value={busyCellsWh} /></Card></Col>
            </Row>
            <div style={{ marginTop: 24, maxWidth: 400 }}>
              <div style={{ marginBottom: 8 }}>Заповненість складу: <b>{whFill}%</b> <span style={{ color: '#888', marginLeft: 8 }}>{busyCellsWh} із {totalCellsWh} зайнято</span></div>
              <Progress percent={whFill} status={whFill > 80 ? 'success' : whFill > 50 ? 'active' : 'normal'} />
            </div>
            <Button
              type="primary"
              style={{ marginTop: 24 }}
              href={`/warehouse-3d?warehouseId=${selectedWarehouseId}`}
              target="_blank"
            >
              Переглянути 3D-план складу
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage; 