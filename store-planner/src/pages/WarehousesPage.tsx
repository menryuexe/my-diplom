import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, List, message, Card } from 'antd';
import axios from 'axios';

interface Warehouse {
  _id: string;
  name: string;
  description?: string;
}

interface Section {
  _id: string;
  warehouse: Warehouse | string;
}

interface Rack {
  _id: string;
  section: Section | string;
}

interface Shelf {
  _id: string;
  rack: Rack | string;
}

const WarehousesPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [wh, sec, rack, shelf] = await Promise.all([
        axios.get('/api/warehouses'),
        axios.get('/api/sections'),
        axios.get('/api/racks'),
        axios.get('/api/shelves'),
      ]);
      setWarehouses(wh.data);
      setSections(sec.data);
      setRacks(rack.data);
      setShelves(shelf.data);
    } catch (err) {
      message.error('Помилка при завантаженні складів або структури');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/warehouses', { ...values });
      message.success('Склад створено');
      setModalOpen(false);
      form.resetFields();
      fetchAll();
    } catch (err) {
      message.error('Помилка при створенні складу');
    }
  };

  // Подсчёт количества полок (комірок) для склада
  const getShelfCountForWarehouse = (warehouseId: string) => {
    // 1. Найти секции этого склада
    const whSections = sections.filter(s => (typeof s.warehouse === 'object' ? s.warehouse._id : s.warehouse) === warehouseId);
    const whSectionIds = whSections.map(s => s._id);
    // 2. Найти стеллажи этих секций
    const whRacks = racks.filter(r => (typeof r.section === 'object' ? r.section._id : r.section) && whSectionIds.includes(typeof r.section === 'object' ? r.section._id : r.section));
    const whRackIds = whRacks.map(r => r._id);
    // 3. Найти полки этих стеллажей
    const whShelves = shelves.filter(shelf => (typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack) && whRackIds.includes(typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack));
    return whShelves.length;
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Склади</h2>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Створити склад
        </Button>
      </div>
      <List
        loading={loading}
        dataSource={warehouses}
        renderItem={warehouse => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => setSelectedWarehouse(warehouse)}>
                Переглянути
              </Button>,
              <a
                href={`/warehouse-3d?warehouseId=${warehouse._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Переглянути на мапі
              </a>
            ]}
          >
            <Card style={{ width: '100%', fontSize: 16, padding: 20 }}>
              <b style={{ fontSize: 18 }}>{warehouse.name}</b>
              <div style={{ color: '#888', fontSize: 15 }}>{warehouse.description}</div>
              <div style={{ marginTop: 8, color: '#555', fontSize: 15 }}>
                <b>Кількість комірок:</b> {getShelfCountForWarehouse(warehouse._id)}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Створити склад"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Створити"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Назва складу" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Опис складу">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedWarehouse?.name}
        open={!!selectedWarehouse}
        onCancel={() => setSelectedWarehouse(null)}
        footer={null}
      >
        <p><b>Опис:</b> {selectedWarehouse?.description}</p>
        {selectedWarehouse && (
          <p><b>Кількість комірок:</b> {getShelfCountForWarehouse(selectedWarehouse._id)}</p>
        )}
        {/* Здесь можно добавить Warehouse3D для выбранного складу */}
      </Modal>
    </div>
  );
};

export default WarehousesPage; 