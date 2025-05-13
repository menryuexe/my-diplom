import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';
import ShelvesPage from './ShelvesPage';

interface Section {
  _id: string;
  name: string;
  warehouse: Warehouse | string;
}

interface Rack {
  _id: string;
  name: string;
  section: Section | string;
}

interface Warehouse {
  _id: string;
  name: string;
}

const RacksPage: React.FC = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [form] = Form.useForm();
  const [shelfCount, setShelfCount] = useState(1);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();

  const fetchRacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/racks');
      setRacks(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні стелажів');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get('/api/sections');
      setSections(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні секцій');
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('/api/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні складів');
    }
  };

  useEffect(() => {
    fetchRacks();
    fetchSections();
    fetchWarehouses();
  }, []);

  const filteredSections = selectedWarehouseId
    ? sections.filter(s => (typeof s.warehouse === 'object' ? s.warehouse._id : s.warehouse) === selectedWarehouseId)
    : sections;

  const filteredRacks = racks.filter(rack => {
    const sectionId = typeof rack.section === 'object' ? rack.section._id : rack.section;
    const section = sections.find(s => s._id === sectionId);
    if (selectedWarehouseId && (!section || (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) !== selectedWarehouseId)) {
      return false;
    }
    if (selectedSectionId && sectionId !== selectedSectionId) {
      return false;
    }
    return true;
  });

  const handleCreate = async (values: any) => {
    try {
      const racksRes = await axios.get('/api/racks');
      const rackCount = racksRes.data.length;
      const position = { x: rackCount * 4, y: 0, z: 0 };
      const rackRes = await axios.post('/api/racks', { ...values, position });
      const rack = rackRes.data;
      const shelvesToCreate = Array.from({ length: shelfCount }, (_, i) => ({
        name: `${i + 1} полка - ${values.name}`,
        rack: rack._id,
        level: i
      }));
      await Promise.all(shelvesToCreate.map(shelf => axios.post('/api/shelves', shelf)));
      message.success('Стелаж і полиці створено');
      setModalOpen(false);
      form.resetFields();
      setShelfCount(1);
      fetchRacks();
    } catch (err) {
      message.error('Помилка при створенні стелажа або полиць');
    }
  };

  const handleEdit = (rack: Rack) => {
    setEditMode(true);
    setSelectedRack(rack);
    form.setFieldsValue({
      ...rack,
      section: typeof rack.section === 'object' ? (rack.section as Section)._id : rack.section,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedRack) return;
    try {
      await axios.put(`/api/racks/${selectedRack._id}`, values);
      message.success('Стелаж оновлено');
      setModalOpen(false);
      setEditMode(false);
      setSelectedRack(null);
      form.resetFields();
      fetchRacks();
    } catch (err) {
      message.error('Помилка при оновленні стелажа');
    }
  };

  const handleDelete = async (rack: Rack) => {
    try {
      await axios.delete(`/api/racks/${rack._id}`);
      message.success('Стелаж видалено');
      fetchRacks();
    } catch (err) {
      message.error('Помилка при видаленні стелажа');
    }
  };

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    
    {
      title: 'Склад',
      key: 'warehouse',
      align: 'center' as const,
      render: (_: any, record: Rack) => {
        const section = typeof record.section === 'object' ? record.section : sections.find(s => s._id === record.section);
        if (!section) return '—';
        const warehouseId = typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse;
        const warehouse = warehouses.find(w => w._id === warehouseId);
        return warehouse ? warehouse.name : '—';
      }
    },
    { title: 'Секція', dataIndex: ['section', 'name'], key: 'section', render: (_: any, record: Rack) => typeof record.section === 'object' ? (record.section as Section).name : '' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Rack) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редагувати</Button>
          <Popconfirm
            title="Видалити стелаж?"
            description="Увага! При видаленні стелажа будуть видалені всі його полиці. Товари, що знаходяться у комірках, видалені не будуть. Ви впевнені, що хочете видалити цей стелаж?"
            onConfirm={() => handleDelete(record)}
            okText="Так"
            cancelText="Ні"
          >
            <Button type="link" danger>Видалити</Button>
          </Popconfirm>
        </>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Стелажі</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedRack(null); setShelfCount(1); }}>
          Створити стелаж
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Фільтр за складом"
          value={selectedWarehouseId}
          onChange={value => {
            setSelectedWarehouseId(value);
            setSelectedSectionId(undefined);
          }}
          style={{ width: 200 }}
        >
          {warehouses.map(w => (
            <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за секцією"
          value={selectedSectionId}
          onChange={value => setSelectedSectionId(value)}
          style={{ width: 200 }}
          disabled={!selectedWarehouseId && !sections.length}
        >
          {filteredSections.map(s => (
            <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        loading={loading}
        dataSource={filteredRacks}
        columns={columns}
        rowKey="_id"
        size="middle"
        style={{ fontSize: 16 }}
        rowClassName={() => 'custom-table-row'}
      />
      <Modal
        title={editMode ? 'Редагувати стелаж' : 'Створити стелаж'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedRack(null); form.resetFields(); setShelfCount(1); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Зберегти' : 'Створити'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Назва стелажа" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="section" label="Секція" rules={[{ required: true, message: 'Оберіть секцію' }]}> 
            <Select placeholder="Оберіть секцію">
              {sections.map(s => (
                <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Кількість полиць (1-5)" required>
            <Select value={shelfCount} onChange={setShelfCount}>
              {[1,2,3,4,5].map(n => (
                <Select.Option key={n} value={n}>{n}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <style>
        {`
        .custom-table-row td {
          padding-top: 14px !important;
          padding-bottom: 14px !important;
        }
        .ant-table-thead > tr > th {
          font-size: 17px;
          background: #fafbfc;
        }
        `}
      </style>
    </div>
  );
};

export default RacksPage; 