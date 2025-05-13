import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Select, message, Popconfirm } from 'antd';
import axios from 'axios';

interface Rack {
  _id: string;
  name: string;
  section: string | Section;
}

interface Shelf {
  _id: string;
  name: string;
  rack: Rack | string;
}

interface Product {
  _id: string;
  name: string;
}

interface Cell {
  _id: string;
  name: string;
  shelf: Shelf | string;
  product: Product | string | null;
}

interface Section {
  _id: string;
  name: string;
  warehouse: Warehouse | string;
}

interface Warehouse {
  _id: string;
  name: string;
}

const CellsPage: React.FC = () => {
  const [cells, setCells] = useState<Cell[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
  const [selectedRackId, setSelectedRackId] = useState<string | undefined>();
  const [selectedShelfId, setSelectedShelfId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [form] = Form.useForm();

  const fetchCells = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/cells');
      setCells(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні комірок');
    } finally {
      setLoading(false);
    }
  };

  const fetchShelves = async () => {
    try {
      const res = await axios.get('/api/shelves');
      setShelves(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні полиць');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні товарів');
    }
  };

  const fetchRacks = async () => {
    try {
      const res = await axios.get('/api/racks');
      setRacks(res.data);
    } catch (err) {
      message.error('Помилка при завантаженні стелажів');
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
    fetchCells();
    fetchShelves();
    fetchProducts();
    fetchRacks();
    fetchSections();
    fetchWarehouses();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await axios.post('/api/cells', values);
      message.success('Комірку створено');
      setModalOpen(false);
      form.resetFields();
      setSelectedRackId(undefined);
      setSelectedShelfId(undefined);
      fetchCells();
    } catch (err) {
      message.error('Помилка при створенні комірки');
    }
  };

  const handleEdit = (cell: Cell) => {
    setEditMode(true);
    setSelectedCell(cell);
    let rackId = null;
    if (cell.shelf && typeof cell.shelf === 'object') {
      rackId = (cell.shelf as Shelf).rack;
      if (typeof rackId === 'object') rackId = rackId._id;
    }
    setSelectedRackId(rackId ?? undefined);
    setSelectedShelfId(typeof cell.shelf === 'object' ? (cell.shelf as Shelf)._id : cell.shelf);
    form.setFieldsValue({
      ...cell,
      shelf: typeof cell.shelf === 'object' ? (cell.shelf as Shelf)._id : cell.shelf,
      product: cell.product && typeof cell.product === 'object' ? (cell.product as Product)._id : cell.product,
      rack: rackId,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selectedCell) return;
    try {
      await axios.put(`/api/cells/${selectedCell._id}`, values);
      message.success('Комірку оновлено');
      setModalOpen(false);
      setEditMode(false);
      setSelectedCell(null);
      setSelectedRackId(undefined);
      setSelectedShelfId(undefined);
      form.resetFields();
      fetchCells();
    } catch (err) {
      message.error('Помилка при оновленні комірки');
    }
  };

  const handleDelete = async (cell: Cell) => {
    try {
      await axios.delete(`/api/cells/${cell._id}`);
      message.success('Комірку видалено');
      fetchCells();
    } catch (err) {
      message.error('Помилка при видаленні комірки');
    }
  };

  const filteredSections = selectedWarehouseId
    ? sections.filter(s => (typeof s.warehouse === 'object' ? s.warehouse._id : s.warehouse) === selectedWarehouseId)
    : sections;
  const filteredRacks = selectedSectionId
    ? racks.filter(r => (typeof r.section === 'object' ? r.section._id : r.section) === selectedSectionId)
    : selectedWarehouseId
      ? racks.filter(r => {
          const section = sections.find(s => s._id === (typeof r.section === 'object' ? r.section._id : r.section));
          return section && (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) === selectedWarehouseId;
        })
      : racks;
  const filteredShelves = selectedRackId
    ? shelves.filter(s => (typeof s.rack === 'object' ? s.rack._id : s.rack) === selectedRackId)
    : selectedSectionId
      ? shelves.filter(s => {
          const rack = racks.find(r => r._id === (typeof s.rack === 'object' ? s.rack._id : s.rack));
          return rack && (typeof rack.section === 'object' ? rack.section._id : rack.section) === selectedSectionId;
        })
      : selectedWarehouseId
        ? shelves.filter(s => {
            const rack = racks.find(r => r._id === (typeof s.rack === 'object' ? s.rack._id : s.rack));
            if (!rack) return false;
            const section = sections.find(sec => sec._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
            return section && (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) === selectedWarehouseId;
          })
        : shelves;
  const filteredCells = cells.filter(cell => {
    const shelfId = typeof cell.shelf === 'object' ? cell.shelf._id : cell.shelf;
    const shelf = shelves.find(s => s._id === shelfId);
    if (!shelf) return false;
    const rackId = typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack;
    const rack = racks.find(r => r._id === rackId);
    if (!rack) return false;
    const sectionId = typeof rack.section === 'object' ? rack.section._id : rack.section;
    const section = sections.find(s => s._id === sectionId);
    if (!section) return false;
    if (selectedWarehouseId && (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse) !== selectedWarehouseId) return false;
    if (selectedSectionId && sectionId !== selectedSectionId) return false;
    if (selectedRackId && rackId !== selectedRackId) return false;
    if (selectedShelfId && shelfId !== selectedShelfId) return false;
    return true;
  });

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Товар',
      key: 'product',
      render: (_: any, record: Cell) => record.product && typeof record.product === 'object' ? (record.product as Product).name : ''
    },
    {
      title: 'Склад',
      key: 'warehouse',
      align: 'center' as const,
      render: (_: any, record: Cell) => {
        const shelf = shelves.find(s => s._id === (typeof record.shelf === 'object' ? record.shelf._id : record.shelf));
        if (!shelf) return '—';
        const rack = racks.find(r => r._id === (typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack));
        if (!rack) return '—';
        const section = sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
        if (!section) return '—';
        const warehouse = warehouses.find(w => w._id === (typeof section.warehouse === 'object' ? section.warehouse._id : section.warehouse));
        return warehouse ? warehouse.name : '—';
      }
    },
    {
      title: 'Секція',
      key: 'section',
      align: 'center' as const,
      render: (_: any, record: Cell) => {
        const shelf = shelves.find(s => s._id === (typeof record.shelf === 'object' ? record.shelf._id : record.shelf));
        if (!shelf) return '—';
        const rack = racks.find(r => r._id === (typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack));
        if (!rack) return '—';
        const section = sections.find(s => s._id === (typeof rack.section === 'object' ? rack.section._id : rack.section));
        return section ? section.name : '—';
      }
    },
    {
      title: 'Стелаж',
      key: 'rack',
      align: 'center' as const,
      render: (_: any, record: Cell) => {
        const shelf = shelves.find(s => s._id === (typeof record.shelf === 'object' ? record.shelf._id : record.shelf));
        if (!shelf) return '—';
        const rack = racks.find(r => r._id === (typeof shelf.rack === 'object' ? shelf.rack._id : shelf.rack));
        return rack ? rack.name : '—';
      }
    },
    {
      title: 'Полиця',
      key: 'shelf',
      align: 'center' as const,
      render: (_: any, record: Cell) => {
        const shelf = shelves.find(s => s._id === (typeof record.shelf === 'object' ? record.shelf._id : record.shelf));
        return shelf ? shelf.name : '—';
      }
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Cell) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ paddingLeft: 0 }}>Редагувати</Button>
          <Popconfirm
            title="Видалити комірку?"
            description="Ви впевнені, що хочете видалити цю комірку?"
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
        <h2>Комірки</h2>
        <Button type="primary" onClick={() => { setModalOpen(true); setEditMode(false); form.resetFields(); setSelectedCell(null); setSelectedRackId(undefined); setSelectedShelfId(undefined); }}>
          Створити комірку
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
            setSelectedRackId(undefined);
            setSelectedShelfId(undefined);
          }}
          style={{ width: 180 }}
        >
          {warehouses.map(w => (
            <Select.Option key={w._id} value={w._id}>{w.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за секцією"
          value={selectedSectionId}
          onChange={value => {
            setSelectedSectionId(value);
            setSelectedRackId(undefined);
            setSelectedShelfId(undefined);
          }}
          style={{ width: 180 }}
          disabled={!selectedWarehouseId && !sections.length}
        >
          {filteredSections.map(s => (
            <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за стелажем"
          value={selectedRackId}
          onChange={value => {
            setSelectedRackId(value);
            setSelectedShelfId(undefined);
          }}
          style={{ width: 180 }}
          disabled={!selectedSectionId && !racks.length}
        >
          {filteredRacks.map(r => (
            <Select.Option key={r._id} value={r._id}>{r.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Фільтр за полицею"
          value={selectedShelfId}
          onChange={value => setSelectedShelfId(value)}
          style={{ width: 180 }}
          disabled={!selectedRackId && !shelves.length}
        >
          {filteredShelves.map(s => (
            <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
      </div>
      <Table
        loading={loading}
        dataSource={filteredCells}
        columns={columns}
        rowKey="_id"
        size="middle"
        style={{ fontSize: 16 }}
        rowClassName={() => 'custom-table-row'}
      />
      <Modal
        title={editMode ? 'Редагувати комірку' : 'Створити комірку'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditMode(false); setSelectedCell(null); form.resetFields(); setSelectedRackId(undefined); setSelectedShelfId(undefined); }}
        onOk={() => form.submit()}
        okText={editMode ? 'Зберегти' : 'Створити'}
      >
        <Form form={form} layout="vertical" onFinish={editMode ? handleUpdate : handleCreate}>
          <Form.Item name="name" label="Назва комірки" rules={[{ required: true, message: 'Введіть назву' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="rack" label="Стелаж" rules={[{ required: true, message: 'Оберіть стелаж' }]}> 
            <Select
              placeholder="Оберіть стелаж"
              onChange={rackId => {
                setSelectedRackId(rackId ?? undefined);
                form.setFieldsValue({ shelf: undefined });
              }}
              value={selectedRackId || undefined}
            >
              {racks.map(r => (
                <Select.Option key={r._id} value={r._id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="shelf" label="Полиця" rules={[{ required: true, message: 'Оберіть полицю' }]}> 
            <Select placeholder="Оберіть полицю" disabled={!selectedRackId}>
              {shelves.filter(s => {
                const rackId = typeof s.rack === 'object' ? s.rack._id : s.rack;
                return rackId === selectedRackId;
              }).map(s => (
                <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="product" label="Товар">
            <Select placeholder="Оберіть товар (необов'язково)" allowClear>
              {products.map(p => (
                <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
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

export default CellsPage; 